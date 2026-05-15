import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "./dashboard.css";
import gdmLogo from "../assets/gdm-logo.png";
const milestoneByTrimester = [
  "Week 1-12: Baby organs begin forming. Focus on folic acid, hydration, and rest.",
  "Week 13-27: Baby movement increases. Continue balanced diet and regular checkups.",
  "Week 28-40: Prepare delivery plan, hospital bag, and weekly fetal monitoring.",
];

const warningSigns = [
  "Severe abdominal pain or heavy bleeding",
  "Persistent severe headache or blurred vision",
  "Sudden swelling of face/hands or reduced fetal movement",
  "High fever, fluid leak, or breathing difficulty",
];

function DashboardPage() {

  const [data, setData] = useState({
    pregnancy_week: "-",
    daily_tips: [],
  });

  const [user, setUser] = useState(null);

  useEffect(() => {

    Promise.all([
      api.get("/dashboard"),
      api.get("/users/me"),
    ])

    .then(([dash, profile]) => {

      setData(dash.data);

      setUser(profile.data);
    })

    .catch((err) => {
      console.log(err);
    });

  }, []);

  return (

    <div className="dashboard-page">


      {/* HERO SECTION */}

      <section className="hero-card">

        <div className="hero-left">

          <img
  src={gdmLogo}
  alt="GDM Healthcare"
/>

        </div>

        <div className="hero-right">

          <h1>
            Welcome {user?.name || "Mother"} 👋
          </h1>

          <p>

            Week {data.pregnancy_week} of your pregnancy journey.
            Your health indicators appear stable and healthy.

          </p>

          {/* HERO STATS */}

          <div className="hero-stats">

            <div className="stat-card">

              <h3>Health Score</h3>

              <p>92%</p>

            </div>

            <div className="stat-card">

              <h3>GDM Risk</h3>

              <p>Low</p>

            </div>

            <div className="stat-card">

              <h3>Sleep</h3>

              <p>8 hrs</p>

            </div>

          </div>

        </div>

      </section>

      {/* SUMMARY SECTION */}

      <section className="summary-grid">

        <div className="summary-card">

          <h3>💧 Water Intake</h3>

          <p>7 / 8</p>

          <span>
            Stay hydrated throughout the day.
          </span>

        </div>

        <div className="summary-card">

          <h3>🚶 Daily Activity</h3>

          <p>40 mins</p>

          <span>
            Gentle walking completed successfully.
          </span>

        </div>

        <div className="summary-card">

          <h3>🩺 Blood Pressure</h3>

          <p>120 / 80</p>

          <span>
            Blood pressure appears normal.
          </span>

        </div>

        <div className="summary-card">

          <h3>🤖 AI Insight</h3>

          <p>Healthy</p>

          <span>
            Continue balanced meals and exercise.
          </span>

        </div>

      </section>

      {/* MAIN GRID */}

      <section className="dashboard-grid">

  {/* LEFT SIDE */}

  <div className="dashboard-column">

    <article className="dashboard-card">

      <h2>Daily Health Tips</h2>

      <ul>

        {data.daily_tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}

      </ul>

    </article>

    <article className="dashboard-card">

      <h2>Daily Wellness Checklist</h2>

      <ul>

        <li>✔ Prenatal supplements taken</li>

        <li>✔ Protein-rich meals consumed</li>

        <li>✔ 30 mins walking completed</li>

        <li>✔ Stress and mood monitored</li>

        <li>✔ Sleep quality tracked</li>

      </ul>

    </article>

    <article className="dashboard-card">

      <h2>Trimester Milestones</h2>

      <ul>

        {milestoneByTrimester.map((item) => (
          <li key={item}>{item}</li>
        ))}

      </ul>

    </article>

  </div>

  {/* RIGHT SIDE */}

  <div className="dashboard-sidebar">

    <article className="dashboard-card">

      <h2>AI Health Recommendation</h2>

      <p>

        Your current health indicators appear
        healthy and stable.

        Continue maintaining:
        balanced nutrition,
        proper hydration,
        adequate sleep,
        and regular physical activity.

      </p>

    </article>

    <article className="dashboard-card warning-card">

      <h2>Important Warning Signs</h2>

      <ul>

        {warningSigns.map((item) => (
          <li key={item}>{item}</li>
        ))}

      </ul>

      <p className="warning-text">

        If any symptom appears,
        contact your doctor immediately.

      </p>

    </article>

    <article className="dashboard-card">

      <h2>Delivery Preparation</h2>

      <ul>

        <li>Prepare hospital bag</li>

        <li>Keep emergency contacts ready</li>

        <li>Finalize hospital transport plan</li>

        <li>Attend antenatal classes</li>

        <li>Discuss birth plan with doctor</li>

      </ul>

    </article>

  </div>

</section>
      {/* IMAGES */}

      <section className="dashboard-images">

        <img
          src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80"
          alt="Pregnancy wellness"
        />

        <img
          src="https://images.unsplash.com/photo-1517120026326-d8b3c7a7b2f1?auto=format&fit=crop&w=1200&q=80"
          alt="Healthy nutrition"
        />

        <img
          src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&q=80"
          alt="Prenatal consultation"
        />

      </section>

    </div>
  );
}

export default DashboardPage;