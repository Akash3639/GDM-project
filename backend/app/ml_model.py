import joblib
import numpy as np

from pathlib import Path

# =====================================================
# LOAD MODEL
# =====================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "gdm_random_forest.pkl"

model = joblib.load(MODEL_PATH)

print("Random Forest GDM model loaded successfully!")

# =====================================================
# PREDICT FUNCTION
# =====================================================

def predict_gdm(data):

    input_data = np.array([
        [
            data.age,
            data.no_of_pregnancy,
            data.gestation_in_previous_pregnancy,
            data.bmi,
            data.hdl,
            data.family_history,
            data.pcos,
            data.sys_bp,
            data.dia_bp,
            data.ogtt,
            data.hemoglobin
        ]
    ])

    prediction = model.predict(input_data)[0]

    probability = model.predict_proba(input_data)[0][1]

    return {
        "prediction": int(prediction),
        "risk_probability": round(float(probability) * 100, 2)
    }