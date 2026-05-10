from pathlib import Path
import joblib
import numpy as np

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "gdm_rf_model.pkl"


def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError("Model not found. Run train_model.py first.")
    return joblib.load(MODEL_PATH)


def predict_gdm(features: list[float]):
    model = load_model()
    sample = np.array([features])
    pred = model.predict(sample)[0]
    probability = float(model.predict_proba(sample)[0][1])
    return int(pred), probability
