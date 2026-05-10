import joblib
import os
import numpy as np
from .features import FEATURE_COLUMNS, get_risk_category

class GDMModel:
    def __init__(self, model_path=None, scaler_path=None):
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), 'gdm_model.pkl')
        if scaler_path is None:
            scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.pkl')
        
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        self.feature_columns = FEATURE_COLUMNS
    
    def prepare_input(self, data):
        ethnicity_map = {
            'asian': ('ethnicity_asian', 1, 'ethnicity_hispanic', 0, 'ethnicity_african', 0),
            'hispanic': ('ethnicity_asian', 0, 'ethnicity_hispanic', 1, 'ethnicity_african', 0),
            'african': ('ethnicity_asian', 0, 'ethnicity_hispanic', 0, 'ethnicity_african', 1),
            'caucasian': ('ethnicity_asian', 0, 'ethnicity_hispanic', 0, 'ethnicity_african', 0)
        }
        
        ethnicity_key = data.get('ethnicity', 'caucasian').lower()
        eth_values = ethnicity_map.get(ethnicity_key, ethnicity_map['caucasian'])
        eth_asian, eth_hispanic, eth_african = eth_values[0] == 1, eth_values[1] == 1, eth_values[2] == 1
        eth_asian = 1 if 'asian' in ethnicity_key else 0
        eth_hispanic = 1 if 'hispanic' in ethnicity_key else 0
        eth_african = 1 if 'african' in ethnicity_key else 0
        
        features = {
            'age': float(data.get('age', 28)),
            'bmi': float(data.get('bmi', 25)),
            'family_history_diabetes': int(data.get('family_history_diabetes', 0)),
            'previous_gdm': int(data.get('previous_gdm', 0)),
            'previous_macrosomia': int(data.get('previous_macrosomia', 0)),
            'pcos': int(data.get('pcos', 0)),
            'ethnicity_asian': eth_asian,
            'ethnicity_hispanic': eth_hispanic,
            'ethnicity_african': eth_african,
            'fasting_glucose': float(data.get('fasting_glucose', 90)),
            'hba1c': float(data.get('hba1c', 5.3)),
            'systolic_bp': float(data.get('systolic_bp', 115)),
            'diastolic_bp': float(data.get('diastolic_bp', 75)),
            'triglycerides': float(data.get('triglycerides', 150)),
            'parity': int(data.get('parity', 0)),
            'gestational_age_weeks': float(data.get('gestational_age_weeks', 12)),
            'weight_gain_pregnancy': float(data.get('weight_gain_pregnancy', 10)),
            'insulin_resistance': float(data.get('insulin_resistance', 2.5))
        }
        
        input_array = np.array([[features[col] for col in self.feature_columns]])
        return input_array, features
    
    def predict(self, data):
        input_array, features = self.prepare_input(data)
        input_scaled = self.scaler.transform(input_array)
        
        probability = self.model.predict_proba(input_scaled)[0, 1]
        risk_info = get_risk_category(probability)
        
        feature_contributions = {}
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
            for i, col in enumerate(self.feature_columns):
                feature_contributions[col] = {
                    'value': features[col],
                    'importance': float(importances[i]),
                    'contribution': float(importances[i] * features[col])
                }
        
        top_risk_factors = sorted(
            feature_contributions.items(),
            key=lambda x: x[1]['importance'],
            reverse=True
        )[:5]
        
        return {
            'probability': float(probability),
            'percentage': f"{probability * 100:.1f}%",
            'risk_category': risk_info['category'],
            'risk_color': risk_info['color'],
            'risk_icon': risk_info['icon'],
            'risk_message': risk_info['message'],
            'risk_level': (
                'low' if probability < 0.2 else
                'moderate' if probability < 0.4 else
                'high' if probability < 0.6 else
                'very_high'
            ),
            'top_risk_factors': [
                {
                    'name': col,
                    'value': data[col],
                    'importance': info['importance']
                }
                for col, info in top_risk_factors
            ],
            'recommendations': self._get_recommendations(probability, features)
        }
    
    def _get_recommendations(self, probability, features):
        recommendations = []
        
        if features['bmi'] > 25:
            recommendations.append({
                'priority': 'high',
                'title': 'Weight Management',
                'description': 'Consider dietary modifications and regular exercise to achieve healthy weight.'
            })
        
        if features['fasting_glucose'] > 100:
            recommendations.append({
                'priority': 'high',
                'title': 'Blood Glucose Monitoring',
                'description': 'Monitor blood glucose levels regularly and consider dietary changes.'
            })
        
        if features['hba1c'] > 5.6:
            recommendations.append({
                'priority': 'high',
                'title': 'HbA1c Optimization',
                'description': 'Work with healthcare provider to lower HbA1c through diet and exercise.'
            })
        
        if features['family_history_diabetes'] == 1:
            recommendations.append({
                'priority': 'medium',
                'title': 'Family History Consideration',
                'description': 'Due to family history, more frequent monitoring may be beneficial.'
            })
        
        if features['previous_gdm'] == 1:
            recommendations.append({
                'priority': 'high',
                'title': 'Previous GDM History',
                'description': 'Previous GDM increases risk. Early screening and intervention recommended.'
            })
        
        if features['insulin_resistance'] > 2.5:
            recommendations.append({
                'priority': 'high',
                'title': 'Insulin Resistance',
                'description': 'Consider insulin-sensitizing dietary approaches and medication if prescribed.'
            })
        
        recommendations.append({
            'priority': 'general',
            'title': 'Lifestyle Modifications',
            'description': 'Maintain balanced diet, regular physical activity, and adequate sleep.'
        })
        
        return recommendations


_model_instance = None

def get_model():
    global _model_instance
    if _model_instance is None:
        try:
            _model_instance = GDMModel()
        except FileNotFoundError:
            return None
    return _model_instance
