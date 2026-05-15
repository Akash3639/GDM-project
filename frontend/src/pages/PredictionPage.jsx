import { useState } from "react";
import api from "../api";

import "./prediction.css";


const fieldInfo = {

  age: "Normal pregnancy age: 20 - 35 years",
  no_of_pregnancy: "Typical range: 0 - 5",
  gestation_in_previous_pregnancy:
    "0 = No previous gestation issue",
  bmi: "Healthy BMI: 18.5 - 24.9",
  hdl: "Healthy HDL: 40 - 60 mg/dL",
  family_history: "0 = No, 1 = Yes",
  pcos: "0 = No, 1 = Yes",
  sys_bp: "Normal Systolic BP: 120",
  dia_bp: "Normal Diastolic BP: 80",
  ogtt: "Normal OGTT: <140 mg/dL",
  hemoglobin: "Normal: 12 - 15 g/dL",
};


export default function PredictionPage() {

  const [formData, setFormData] = useState({

  age: "",
  no_of_pregnancy: "",
  gestation_in_previous_pregnancy: "",
  bmi: "",
  hdl: "",
  family_history: "",
  pcos: "",
  sys_bp: "",
  dia_bp: "",
  ogtt: "",
  hemoglobin: "",
});

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await api.post(
        "/predict",
        formData
      );

      setResult(response.data);

    } catch (error) {

      alert("Prediction failed");
    }

    setLoading(false);
  };

  return (
    <div className="prediction-page">

      <div className="prediction-card">

        <h1>AI Gestational Diabetes Prediction</h1>

        <p>
          Predict Gestational Diabetes risk using AI-powered
          Random Forest Machine Learning model.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="grid">

            {Object.keys(formData).map((field) => (

              <div className="input-group" key={field}>

               <label>{field.replaceAll("_", " ").toUpperCase()}</label>

                <p className="field-info">
                    {fieldInfo[field]}
                </p>

                <input
                  type="number"
                  step="any"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <button type="submit">

            {loading ? "Predicting..." : "Predict GDM Risk"}

          </button>
        </form>

        {result && (

  <div className="result-container">

    {/* RESULT HEADER */}

    <div className="result-top">

      <div className="risk-icon">

        {result.prediction === 1 ? "⚠️" : "✅"}

      </div>

      <div>

        <h2>

          {result.prediction === 1
            ? "High Risk of GDM"
            : "Low Risk of GDM"}

        </h2>

        <p className="risk-subtitle">

          AI-powered Random Forest prediction completed successfully.

        </p>
      </div>
    </div>

    {/* PROBABILITY BAR */}

    <div className="probability-section">

      <div className="probability-header">

        <span>Risk Probability</span>

        <span>{result.risk_probability}%</span>

      </div>

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width: `${result.risk_probability}%`
          }}
        ></div>

      </div>
    </div>

    {/* ACCURACY */}

    <div className="accuracy-card">

      <h3>Model Accuracy</h3>

      <p>96.03%</p>

      <span>
        Pregnancy-related healthcare .
      </span>

    </div>

    {/* MEDICAL GUIDANCE */}

    <div className="guidance-box">

      <h3>Medical Guidance</h3>

      <p>

        This prediction is based on AI model analysis
        trained using gestational diabetes medical data.

        For accurate medical diagnosis, laboratory testing,
        and personalized treatment recommendations,
        please consult a qualified healthcare professional
        or gynecologist.

      </p>

    </div>

    {/* RISK FACTORS */}

    <div className="risk-factors">

      <h3>Major Risk Factors Considered</h3>

      <div className="risk-tags">

        <span>OGTT</span>
        <span>BMI</span>
        <span>PCOS</span>
        <span>Blood Pressure</span>
        <span>Family History</span>
        <span>Hemoglobin</span>

      </div>

    </div>

  </div>
)}
      </div>
    </div>
  );
}