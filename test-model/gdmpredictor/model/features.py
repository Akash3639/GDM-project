from .train_model import generate_synthetic_data

FEATURE_INFO = {
    'age': {
        'name': 'Age',
        'type': 'number',
        'min': 18,
        'max': 50,
        'unit': 'years',
        'description': 'Maternal age at pregnancy',
        'normal_range': (18, 35)
    },
    'bmi': {
        'name': 'BMI',
        'type': 'number',
        'min': 15,
        'max': 50,
        'unit': 'kg/m²',
        'description': 'Pre-pregnancy Body Mass Index',
        'normal_range': (18.5, 24.9)
    },
    'family_history_diabetes': {
        'name': 'Family History of Diabetes',
        'type': 'binary',
        'description': 'Parent or sibling with diabetes',
        'options': ['No', 'Yes']
    },
    'previous_gdm': {
        'name': 'Previous GDM',
        'type': 'binary',
        'description': 'Previous gestational diabetes diagnosis',
        'options': ['No', 'Yes']
    },
    'previous_macrosomia': {
        'name': 'Previous Macrosomia',
        'type': 'binary',
        'description': 'Previous baby weighing > 4kg',
        'options': ['No', 'Yes']
    },
    'pcos': {
        'name': 'PCOS',
        'type': 'binary',
        'description': 'Polycystic Ovary Syndrome diagnosis',
        'options': ['No', 'Yes']
    },
    'ethnicity': {
        'name': 'Ethnicity',
        'type': 'select',
        'description': 'Ethnic background',
        'options': ['Caucasian', 'Asian', 'Hispanic', 'African']
    },
    'fasting_glucose': {
        'name': 'Fasting Glucose',
        'type': 'number',
        'min': 50,
        'max': 150,
        'unit': 'mg/dL',
        'description': 'Fasting blood glucose level',
        'normal_range': (70, 100)
    },
    'hba1c': {
        'name': 'HbA1c',
        'type': 'number',
        'min': 4.0,
        'max': 8.0,
        'unit': '%',
        'description': 'Glycated hemoglobin',
        'normal_range': (4.0, 5.6)
    },
    'systolic_bp': {
        'name': 'Systolic BP',
        'type': 'number',
        'min': 80,
        'max': 180,
        'unit': 'mmHg',
        'description': 'Systolic blood pressure',
        'normal_range': (90, 120)
    },
    'diastolic_bp': {
        'name': 'Diastolic BP',
        'type': 'number',
        'min': 50,
        'max': 120,
        'unit': 'mmHg',
        'description': 'Diastolic blood pressure',
        'normal_range': (60, 80)
    },
    'triglycerides': {
        'name': 'Triglycerides',
        'type': 'number',
        'min': 50,
        'max': 400,
        'unit': 'mg/dL',
        'description': 'Triglyceride level',
        'normal_range': (50, 150)
    },
    'parity': {
        'name': 'Parity',
        'type': 'number',
        'min': 0,
        'max': 10,
        'description': 'Number of previous pregnancies',
        'normal_range': (0, 3)
    },
    'gestational_age_weeks': {
        'name': 'Gestational Age',
        'type': 'number',
        'min': 4,
        'max': 24,
        'unit': 'weeks',
        'description': 'Current gestational age at screening',
        'normal_range': (8, 20)
    },
    'weight_gain_pregnancy': {
        'name': 'Weight Gain',
        'type': 'number',
        'min': -5,
        'max': 30,
        'unit': 'kg',
        'description': 'Weight gain during pregnancy',
        'normal_range': (8, 12)
    },
    'insulin_resistance': {
        'name': 'Insulin Resistance (HOMA-IR)',
        'type': 'number',
        'min': 0.5,
        'max': 8.0,
        'unit': '',
        'description': 'Homeostatic Model Assessment for Insulin Resistance',
        'normal_range': (1.0, 2.5)
    }
}

FEATURE_COLUMNS = [
    'age', 'bmi', 'family_history_diabetes', 'previous_gdm',
    'previous_macrosomia', 'pcos', 'ethnicity_asian', 'ethnicity_hispanic',
    'ethnicity_african', 'fasting_glucose', 'hba1c', 'systolic_bp',
    'diastolic_bp', 'triglycerides', 'parity', 'gestational_age_weeks',
    'weight_gain_pregnancy', 'insulin_resistance'
]

RISK_THRESHOLDS = {
    'low': 0.2,
    'moderate': 0.4,
    'high': 0.6
}

def get_risk_category(probability):
    if probability < RISK_THRESHOLDS['low']:
        return {
            'category': 'Low Risk',
            'color': '#28a745',
            'icon': '✓',
            'message': 'Low probability of developing GDM. Continue with routine prenatal care.'
        }
    elif probability < RISK_THRESHOLDS['moderate']:
        return {
            'category': 'Moderate Risk',
            'color': '#ffc107',
            'icon': '⚠',
            'message': 'Moderate probability of developing GDM. Consider lifestyle modifications.'
        }
    elif probability < RISK_THRESHOLDS['high']:
        return {
            'category': 'High Risk',
            'color': '#fd7e14',
            'icon': '⚡',
            'message': 'High probability of developing GDM. Recommend early intervention and monitoring.'
        }
    else:
        return {
            'category': 'Very High Risk',
            'color': '#dc3545',
            'icon': '⚠',
            'message': 'Very high probability of developing GDM. Immediate medical consultation recommended.'
        }
