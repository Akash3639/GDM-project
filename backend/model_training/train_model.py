import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# =====================================================
# LOAD DATASET
# =====================================================

df = pd.read_excel("gdm_dataset.xlsx")

print(df.head())

# =====================================================
# REMOVE EXTRA SPACES
# =====================================================

df.columns = df.columns.str.strip()

# =====================================================
# HANDLE MISSING VALUES
# =====================================================

df = df.fillna(df.mode().iloc[0])

# =====================================================
# ENCODE CATEGORICAL COLUMNS
# =====================================================

label_encoders = {}

for column in df.columns:

    if df[column].dtype == "object":

        le = LabelEncoder()

        df[column] = le.fit_transform(df[column].astype(str))

        label_encoders[column] = le

# =====================================================
# TARGET COLUMN
# =====================================================

TARGET_COLUMN = "Class Label(GDM /Non GDM)"

# =====================================================
# FEATURES + TARGET
# =====================================================

selected_features = [

    "Age",
    "No of Pregnancy",
    "Gestation in previous Pregnancy",
    "BMI",
    "HDL",
    "Family History",
    "PCOS",
    "Sys BP",
    "Dia BP",
    "OGTT",
    "Hemoglobin"
]

X = df[selected_features]
print(X.columns)

y = df[TARGET_COLUMN]

# =====================================================
# TRAIN TEST SPLIT
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =====================================================
# RANDOM FOREST MODEL
# =====================================================

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42
)

# =====================================================
# TRAIN MODEL
# =====================================================

model.fit(X_train, y_train)

# =====================================================
# PREDICTIONS
# =====================================================

y_pred = model.predict(X_test)

# =====================================================
# ACCURACY
# =====================================================

accuracy = accuracy_score(y_test, y_pred)

print(f"\\nAccuracy: {accuracy * 100:.2f}%")

print("\\nClassification Report:\\n")

print(classification_report(y_test, y_pred))

print("\\nConfusion Matrix:\\n")

print(confusion_matrix(y_test, y_pred))

# =====================================================
# SAVE MODEL
# =====================================================

joblib.dump(model, "gdm_random_forest.pkl")

joblib.dump(label_encoders, "label_encoders.pkl")

print("\\nModel saved successfully!")