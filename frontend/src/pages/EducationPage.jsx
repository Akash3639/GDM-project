import "./pregnancyInfo.css";

import heroImg from "../assets/pregnancy/hero.png";
import nutritionImg from "../assets/pregnancy/nutrition.png";
import doctorImg from "../assets/pregnancy/doctor-checkup.png";
import consultationImg from "../assets/pregnancy/consultation.png";
import motherCareImg from "../assets/pregnancy/mother-care.png";

function EducationPage() {

  return (

    <div className="pregnancy-page">

      {/* HERO SECTION */}

      <section className="pregnancy-hero">

        <div className="hero-content">

          <h1>
            Healthy Mom,
            <span> Healthy Baby ❤</span>
          </h1>

          <p>

            Your journey to motherhood is unique.
            Stay informed, stay healthy, and let’s
            make it a beautiful experience together.

          </p>

          <div className="hero-tags">

            <span>AI Pregnancy Care</span>
            <span>GDM Awareness</span>
            <span>Maternal Wellness</span>

          </div>

        </div>

        <img
          src={heroImg}
          alt="Healthy Pregnancy"
        />

      </section>

      {/* ABOUT SECTION */}

      <section className="info-grid">

        <div className="info-card large-card">

          <div>

            <h2>About Pregnancy Care</h2>

            <p>

              Pregnancy is a beautiful journey that
              requires proper care, healthy nutrition,
              emotional wellbeing, and regular medical
              monitoring to ensure the safety of both
              mother and baby.

            </p>

            <ul>

              <li>Monitor baby growth and development</li>
              <li>Maintain maternal health</li>
              <li>Reduce pregnancy complications</li>
              <li>Support healthy delivery</li>

            </ul>

          </div>

          <img
            src={consultationImg}
            alt="Pregnancy Consultation"
          />

        </div>

      </section>

      {/* GDM SECTION */}

      <section className="info-grid two-column">

        <div className="info-card">

          <h2>What is Gestational Diabetes (GDM)?</h2>

          <p>

            Gestational Diabetes Mellitus (GDM)
            occurs when blood sugar levels increase
            during pregnancy. Proper monitoring,
            healthy diet, and physical activity are
            essential for managing GDM effectively.

          </p>

          <div className="risk-tags">

            <span>Family History</span>
            <span>PCOS</span>
            <span>Obesity</span>
            <span>Age 25+</span>

          </div>

        </div>

        <div className="info-card">

          <h2>Common Symptoms</h2>

          <ul>

            <li>Increased thirst</li>
            <li>Frequent urination</li>
            <li>Fatigue</li>
            <li>Blurred vision</li>
            <li>Increased hunger</li>

          </ul>

        </div>

      </section>

      {/* NUTRITION SECTION */}

      <section className="nutrition-section">

        <div className="nutrition-image">

          <img
            src={nutritionImg}
            alt="Healthy Nutrition"
          />

        </div>

        <div className="nutrition-content">

          <h2>Healthy Nutrition During Pregnancy</h2>

          <p>

            A balanced diet supports healthy fetal
            development and helps maintain stable
            blood sugar levels during pregnancy.

          </p>

          <div className="food-grid">

            <div>

              <h3>Recommended Foods</h3>

              <ul>

                <li>Fruits & Vegetables</li>
                <li>Whole Grains</li>
                <li>Protein-rich Foods</li>
                <li>Healthy Dairy Products</li>
                <li>Nuts & Seeds</li>

              </ul>

            </div>

            <div>

              <h3>Foods to Limit</h3>

              <ul>

                <li>Sugary drinks</li>
                <li>Processed foods</li>
                <li>Fast food</li>
                <li>Excess sweets</li>
                <li>High-salt snacks</li>

              </ul>

            </div>

          </div>

        </div>

      </section>

      {/* MONITORING SECTION */}

      <section className="info-grid two-column">

        <div className="info-card">

          <h2>Blood Sugar Monitoring</h2>

          <p>

            Regular glucose monitoring helps detect
            abnormal blood sugar levels early and
            supports safer pregnancy outcomes.

          </p>

          <ul>
            <h3>Target Blood Glucose Ranges</h3>
            <li>Fasting:95 mg/dL</li>
            <li>1 Hour After Meals:  140 mg/dL</li>
            <li>2 Hours After Meals:  120 mg/dL</li>
            <h3>How to Monitor at Home</h3>
            <li>Self-Monitoring (SMBG): Use a glucometer to test blood from a fingertip prick 4+ times daily (fasting and after meals).</li>
            <li>Continuous Glucose Monitoring (CGM): A device that offers real-time monitoring and can help achieve A1C targets, especially if on insulin.</li>
            <li>Keep a Log: Maintain a record of all blood glucose values and times to share with your healthcare provider.</li>
            <h3>When and How to Test</h3>
            <li>Frequency: Usually, 4+ times a day: upon waking (fasting), and one hour after breakfast, lunch, and dinner.</li>
            <li>Tips for Accuracy: Warm your hands, use the sides of fingertips, and rotate fingers to avoid soreness.</li>
            

            <h3>After Delivery</h3>
            <li>If diagnosed with gestational diabetes, it is highly recommended to get re-tested for diabetes 4 to 12 weeks after the baby is born.</li>
            <li>Continue checking blood sugar for 1–2 days postpartum.</li>
            <h3>Disclaimer: These are general guidelines based on typical recommendations; always follow your healthcare provider's tailored plan.</h3>
          </ul>

        </div>

        <div className="info-card image-card">

          <img
            src={doctorImg}
            alt="Doctor Checkup"
          />

        </div>

      </section>

      {/* TRIMESTER GUIDE */}

      <section className="trimester-section">

        <h2>Pregnancy Trimester Guide</h2>

        <div className="trimester-grid">

          <div className="trimester-card">

            <h3>First Trimester</h3>

            <p>Weeks 1 – 12</p>

            <ul>

              <li>Morning sickness</li>
              <li>Fatigue</li>
              <li>Hormonal changes</li>
              <li>Start prenatal vitamins</li>

            </ul>

          </div>

          <div className="trimester-card">

            <h3>Second Trimester</h3>

            <p>Weeks 13 – 26</p>

            <ul>

              <li>Baby movement begins</li>
              <li>Weight gain</li>
              <li>Improved energy</li>
              <li>Regular checkups</li>

            </ul>

          </div>

          <div className="trimester-card">

            <h3>Third Trimester</h3>

            <p>Weeks 27 – 40</p>

            <ul>

              <li>Back pain</li>
              <li>Swelling</li>
              <li>Sleep difficulties</li>
              <li>Prepare for delivery</li>

            </ul>

          </div>

        </div>

      </section>

      {/* EMOTIONAL WELLNESS */}

      <section className="wellness-section">

        <img
          src={motherCareImg}
          alt="Mother Care"
        />

        <div>

          <h2>Mental & Emotional Wellbeing</h2>

          <p>

            Emotional wellness plays a vital role
            during pregnancy. A calm and positive
            environment supports both mother and baby.

          </p>

          <ul>

            <li>Get proper rest and sleep</li>
            <li>Practice relaxation techniques</li>
            <li>Stay connected with loved ones</li>
            <li>Attend prenatal checkups regularly</li>

          </ul>

        </div>

      </section>

      {/* AI ASSISTANT */}

      <section className="ai-assistant-card">

        <h2>AI Pregnancy Health Assistant</h2>

        <p>

          Our AI assistant helps pregnant women by
          answering pregnancy-related questions,
          providing GDM awareness, suggesting healthy
          diet plans, and offering smart healthcare
          guidance.

        </p>

        <div className="ai-message">

          “Remember to stay hydrated, monitor your
          blood sugar regularly, and maintain a
          balanced diet for a healthy pregnancy.”

        </div>

      </section>

      {/* WARNING SECTION */}

      <section className="warning-section">

        <h2>Emergency Warning Signs</h2>

        <div className="warning-grid">

          <span>Severe headache</span>
          <span>Heavy bleeding</span>
          <span>High fever</span>
          <span>Difficulty breathing</span>
          <span>Reduced baby movement</span>
          <span>Sudden swelling</span>

        </div>

      </section>

      {/* FINAL SECTION */}

      <section className="final-message">

        <h2>
          Every Mother Deserves Safe &
          Smart Pregnancy Care
        </h2>

        <p>

          Healthy habits, regular monitoring,
          balanced nutrition, and emotional support
          can make pregnancy safer and healthier.

        </p>

        <blockquote>

          “Small healthy steps today create a
          healthier tomorrow for both mother
          and baby.”

        </blockquote>

      </section>

    </div>
  );
}

export default EducationPage;