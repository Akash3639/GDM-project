 import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

np.random.seed(42)

n_samples = 1000

data = {
    'age': np.random.randint(18, 45, n_samples),
    'bmi': np.random.uniform(18, 40, n_samples),
    'prev_gdm': np.random.randint(0, 2, n_samples),
    'family_diabetes': np.random.randint(0, 2, n_samples),
    'prev_macrosomia': np.random.randint(0, 2, n_samples),
    'prev_stillbirth': np.random.randint(0, 2, n_samples),
    'ethnicity': np.random.randint(0, 5, n_samples),
    'fasting_glucose': np.random.uniform(70, 160, n_samples),
    'hba1c': np.random.uniform(4.5, 7.5, n_samples),
    'parity': np.random.randint(0, 6, n_samples),
}

df = pd.DataFrame(data)

def calculate_gdm_risk(row):
    risk = 0
    if row['age'] >= 35:
        risk += 2
    if row['age'] >= 40:
        risk += 2
    if row['bmi'] >= 25:
        risk += 1
    if row['bmi'] >= 30:
        risk += 2
    if row['bmi'] >= 35:
        risk += 2
    if row['prev_gdm'] == 1:
        risk += 4
    if row['family_diabetes'] == 1:
        risk += 3
    if row['prev_macrosomia'] == 1:
        risk += 3
    if row['prev_stillbirth'] == 1:
        risk += 2
    if row['fasting_glucose'] >= 100:
        risk += 2
    if row['fasting_glucose'] >= 126:
        risk += 3
    if row['hba1c'] >= 5.7:
        risk += 1
    if row['hba1c'] >= 6.5:
        risk += 3
    if row['parity'] >= 3:
        risk += 1
    if row['ethnicity'] in [1, 2]:
        risk += 1
    
    return risk

df['risk_score'] = df.apply(calculate_gdm_risk, axis=1)

threshold = 12
df['gdm'] = (df['risk_score'] >= threshold).astype(int)

print(f"Dataset created: {len(df)} samples")
print(f"GDM Positive: {df['gdm'].sum()}, GDM Negative: {(df['gdm'] == 0).sum()}")

features = ['age', 'bmi', 'prev_gdm', 'family_diabetes', 'prev_macrosomia', 
           'prev_stillbirth', 'ethnicity', 'fasting_glucose', 'hba1c', 'parity']

X = df[features]
y = df['gdm']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\nModel Accuracy: {accuracy:.2%}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['No GDM', 'GDM']))

print("\nFeature Importances:")
importance = pd.DataFrame(features, columns=['feature'])
importance['importance'] = model.feature_importances_
importance = importance.sort_values('importance', ascending=False)
print(importance.to_string(index=False))

os.makedirs('model', exist_ok=True)
joblib.dump(model, 'model/gdm_model.pkl')
joblib.dump(features, 'model/features.pkl')

print("\nModel saved to model/gdm_model.pkl")