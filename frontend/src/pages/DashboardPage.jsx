import { useEffect, useState } from "react";
import api from "../api";

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
  const [data, setData] = useState({ pregnancy_week: "-", daily_tips: [] });
  const [user, setUser] = useState(null);

  useEffect(() => {
    Promise.all([api.get("/dashboard"), api.get("/users/me")]).then(([dash, profile]) => {
      setData(dash.data);
      setUser(profile.data);
    });
  }, []);

  return (
    <section>
      <div className="page-hero">
        <img src="https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&w=1200&q=80" alt="Mother care" />
        <div>
          <h1>Welcome {user?.name || "Mother"}</h1>
          <p>Week {data.pregnancy_week} of your journey. You are doing great.</p>
        </div>
      </div>
      <div className="content-grid">
        <article className="card-soft">
          <h3>Daily Health Tips</h3>
          <ul>{data.daily_tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
        </article>
        <article className="card-soft">
          <h3>Quick Priorities</h3>
          <ul>
            <li>Hydration goal: 8-10 glasses/day</li>
            <li>Sleep target: 7-9 hours/day</li>
            <li>Gentle movement: 20-30 mins/day</li>
            <li>Monitor weight, BP, sugar weekly</li>
          </ul>
        </article>
        <article className="card-soft">
          <h3>Trimester Milestones</h3>
          <ul>{milestoneByTrimester.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="card-soft">
          <h3>Important Warning Signs</h3>
          <ul>{warningSigns.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="muted">If any sign appears, contact your doctor immediately.</p>
        </article>
      </div>
      <div className="dashboard-images">
        <img
          src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80"
          alt="Pregnancy wellness check"
        />
        <img
          src="https://images.unsplash.com/photo-1517120026326-d8b3c7a7b2f1?auto=format&fit=crop&w=1200&q=80"
          alt="Healthy pregnancy nutrition"
        />
        <img
          src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&q=80"
          alt="Prenatal consultation"
        />
      </div>
      <div className="content-grid">
        <article className="card-soft">
          <h3>Daily Wellness Checklist</h3>
          <ul>
            <li>Take prenatal supplements on time</li>
            <li>Eat protein in every major meal</li>
            <li>Take a short post-meal walk</li>
            <li>Track mood, stress, and sleep quality</li>
            <li>Prepare tomorrow's medicines and reminders</li>
          </ul>
        </article>
        <article className="card-soft">
          <h3>Delivery Preparation</h3>
          <ul>
            <li>Keep emergency contact numbers saved</li>
            <li>Pre-pack hospital bag by week 34</li>
            <li>Finalize transport plan to hospital</li>
            <li>Discuss birth plan and pain management options</li>
            <li>Attend antenatal class with partner/family</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export default DashboardPage;
