
from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)

model = joblib.load('model/gdm_model.pkl')
features = joblib.load('model/features.pkl')

ethnicity_map = {
    '0': 'Caucasian',
    '1': 'African American',
    '2': 'Hispanic',
    '3': 'Asian',
    '4': 'Other'
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        input_data = [
            float(data.get('age', 0)),
            float(data.get('bmi', 0)),
            int(data.get('prev_gdm', 0)),
            int(data.get('family_diabetes', 0)),
            int(data.get('prev_macrosomia', 0)),
            int(data.get('prev_stillbirth', 0)),
            int(data.get('ethnicity', 0)),
            float(data.get('fasting_glucose', 0)),
            float(data.get('hba1c', 0)),
            int(data.get('parity', 0))
        ]
        
        input_array = np.array([input_data])
        
        prediction = model.predict(input_array)[0]
        probability = model.predict_proba(input_array)[0]
        
        risk_score = probability[1] * 100
        
        result = {
            'prediction': 'GDM Positive - High Risk' if prediction == 1 else 'GDM Negative - Low Risk',
            'prediction_label': int(prediction),
            'risk_percentage': round(risk_score, 1),
            'risk_level': get_risk_level(risk_score),
            'recommendations': get_recommendations(prediction, data)
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_risk_level(score):
    if score >= 70:
        return 'High'
    elif score >= 40:
        return 'Moderate'
    else:
        return 'Low'

def get_recommendations(prediction, data):
    recs = []
    
    if prediction == 1:
        recs.append('Consult with your healthcare provider for GDM management')
        recs.append('Monitor blood glucose levels regularly')
        recs.append('Follow a balanced gestational diabetes diet')
        recs.append('Engage in moderate physical activity as recommended')
        recs.append('Consider meeting with a diabetes educator')
    else:
        recs.append('Maintain a healthy lifestyle and diet')
        recs.append('Continue prenatal check-ups as scheduled')
        recs.append('Stay physically active with prenatal exercises')
    
    bmi = float(data.get('bmi', 0))
    if bmi >= 25:
        recs.append('Consider dietary modifications to manage weight')
    
    age = int(data.get('age', 0))
    if age >= 35:
        recs.append('Due to maternal age, additional monitoring may be recommended')
    
    return recs

@app.route('/risk-factors-info')
def risk_factors_info():
    return jsonify({
        'risk_factors': {
            'age': 'Maternal age >= 35 years increases risk',
            'bmi': 'Pre-pregnancy BMI >= 25 (overweight) or >= 30 (obese) increases risk',
            'prev_gdm': 'Previous GDM history significantly increases recurrence risk',
            'family_diabetes': 'Family history of diabetes increases genetic risk',
            'prev_macrosomia': 'Previous baby with birth weight > 4kg indicates risk',
            'prev_stillbirth': 'History of stillbirth increases risk',
            'ethnicity': 'Certain ethnic backgrounds have higher prevalence',
            'fasting_glucose': 'Elevated fasting glucose in early pregnancy',
            'hba1c': 'Elevated HbA1c indicates pre-existing glucose intolerance',
            'parity': 'Higher number of previous pregnancies can increase risk'
        }
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)