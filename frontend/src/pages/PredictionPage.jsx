const ADVANCED_GDM_URL = "http://127.0.0.1:5000";

function PredictionPage() {
  return (
    <section>
      <h1>Gestational Diabetes Prediction</h1>
      <p className="muted">This page uses only the saved model app from `test-model`.</p>

      <div className="card-soft prediction-switch">
        <button>Model Viewer</button>
        <button className="btn-secondary" onClick={() => window.open(ADVANCED_GDM_URL, "_blank")}>Open Model in New Tab</button>
      </div>

      <div className="card-soft">
        <h3>Advanced GDM Model</h3>
        <p className="muted">
          This loads your external predictor app. If blank, start `test-model` on port `5000`.
        </p>
        <iframe title="Advanced GDM Predictor" src={ADVANCED_GDM_URL} className="prediction-frame" />
      </div>

    </section>
  );
}

export default PredictionPage;
