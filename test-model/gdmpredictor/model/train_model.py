import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score
import joblib
import os

def generate_synthetic_data(n_samples=5000, random_state=42):
    np.random.seed(random_state)
    
    data = {
        'age': np.random.normal(28, 5, n_samples),
        'bmi': np.random.normal(25, 5, n_samples),
        'family_history_diabetes': np.random.randint(0, 2, n_samples),
        'previous_gdm': np.random.randint(0, 2, n_samples),
        'previous_macrosomia': np.random.randint(0, 2, n_samples),
        'pcos': np.random.randint(0, 2, n_samples),
        'ethnicity_asian': np.random.randint(0, 2, n_samples),
        'ethnicity_hispanic': np.random.randint(0, 2, n_samples),
        'ethnicity_african': np.random.randint(0, 2, n_samples),
        'fasting_glucose': np.random.normal(90, 15, n_samples),
        'hba1c': np.random.normal(5.3, 0.5, n_samples),
        'systolic_bp': np.random.normal(115, 15, n_samples),
        'diastolic_bp': np.random.normal(75, 10, n_samples),
        'triglycerides': np.random.normal(150, 50, n_samples),
        'parity': np.random.randint(0, 5, n_samples),
        'gestational_age_weeks': np.random.uniform(8, 20, n_samples),
        'weight_gain_pregnancy': np.random.normal(10, 5, n_samples),
        'insulin_resistance': np.random.normal(2.5, 1, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    risk_score = (
        (df['age'] - 25) * 0.1 +
        (df['bmi'] - 22) * 0.15 +
        df['family_history_diabetes'] * 2 +
        df['previous_gdm'] * 3 +
        df['previous_macrosomia'] * 1.5 +
        df['pcos'] * 1.5 +
        df['ethnicity_asian'] * 0.5 +
        df['ethnicity_hispanic'] * 0.7 +
        df['ethnicity_african'] * 0.5 +
        (df['fasting_glucose'] - 85) * 0.03 +
        (df['hba1c'] - 5) * 2 +
        (df['triglycerides'] - 130) * 0.01 +
        df['parity'] * 0.2 +
        (20 - df['gestational_age_weeks']) * 0.1 +
        df['insulin_resistance'] * 1.5
    )
    
    probability = 1 / (1 + np.exp(-(risk_score - 8)))
    df['gdm_diagnosis'] = (np.random.random(n_samples) < probability).astype(int)
    
    return df

def train_model():
    print("Generating synthetic GDM dataset...")
    df = generate_synthetic_data(n_samples=5000)
    
    feature_columns = [
        'age', 'bmi', 'family_history_diabetes', 'previous_gdm', 
        'previous_macrosomia', 'pcos', 'ethnicity_asian', 'ethnicity_hispanic',
        'ethnicity_african', 'fasting_glucose', 'hba1c', 'systolic_bp', 
        'diastolic_bp', 'triglycerides', 'parity', 'gestational_age_weeks',
        'weight_gain_pregnancy', 'insulin_resistance'
    ]
    
    X = df[feature_columns]
    y = df['gdm_diagnosis']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    print("\nModel Performance:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(f"ROC-AUC: {roc_auc_score(y_test, y_pred_proba):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    model.fit(X_train_scaled, y_train)
    
    model_dir = os.path.join(os.path.dirname(__file__))
    joblib.dump(model, os.path.join(model_dir, 'gdm_model.pkl'))
    joblib.dump(scaler, os.path.join(model_dir, 'scaler.pkl'))
    joblib.dump(feature_columns, os.path.join(model_dir, 'feature_columns.pkl'))
    
    print("\nModel and scaler saved successfully!")
    
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Most Important Features:")
    print(feature_importance.head(10).to_string(index=False))
    
    return model, scaler, feature_columns

if __name__ == "__main__":
    train_model()
