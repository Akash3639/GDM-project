const lowGITips = [
  "Choose oats porridge, muesli, oat/bran cereals.",
  "Prefer wholegrain breads: rye, granary, sourdough, wholemeal chapati/pita.",
  "Choose basmati rice, pasta, skin-on new/sweet potatoes and yam.",
  "Include beans and lentils regularly.",
  "Use fruits, nuts, and seeds as snacks; limit fruit juice to 150ml/day.",
];

const foodSafety = [
  "Thoroughly cook meat, fish, and eggs.",
  "Wash vegetables and fruits well before eating.",
  "Avoid unpasteurized milk, soft blue cheeses, and raw shellfish.",
  "Avoid liver/liver pate and vitamin A supplements.",
  "Avoid shark, swordfish, marlin; limit tuna intake.",
];

const exerciseCautions = [
  "Do not exercise to exhaustion.",
  "Avoid exercise when unwell or in very hot conditions.",
  "Stop and seek medical advice for pelvic pain, bleeding, or repeated tightenings.",
  "Continue activity only if your doctor/midwife has not advised stopping.",
];

function LifestylePage() {
  return (
    <section>
      <h1>Diet, Nutrition & Exercise</h1>
      <div className="card-soft featured-diet-image-card">
        <img className="featured-diet-image" src="/diet-pregnancy-guide.png" alt="What to eat and avoid during pregnancy" />
      </div>
      <div className="image-row">
        <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80" alt="Healthy diet" />
        <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80" alt="Pregnancy yoga" />
      </div>
      <div className="content-grid">
        <article className="card-soft">
          <img
            src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80"
            alt="Balanced pregnancy plate"
          />
          <h3>Balanced Plate Visual</h3>
          <p className="muted">Matches PDF guidance: carbs + protein + vegetables + healthy fats in each meal.</p>
        </article>
        <article className="card-soft">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
            alt="Healthy grocery shopping and labels"
          />
          <h3>Food Label Reading</h3>
          <p className="muted">Use low sugar/low fat choices most often, based on per-100g label values.</p>
        </article>
        <article className="card-soft">
          <img
            src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80"
            alt="Safe pregnancy exercise routine"
          />
          <h3>Safe Pregnancy Activity</h3>
          <p className="muted">Regular moderate activity, breathing and pelvic floor work are strongly recommended.</p>
        </article>
      </div>
      <div className="content-grid">
        <article className="card-soft">
          <h3>Balanced Pregnancy Plate (from PINE booklet)</h3>
          <ul>
            <li>Add carbohydrates to every meal, preferably wholegrain/high-fibre options.</li>
            <li>Eat at least 5 portions of fruit and vegetables daily.</li>
            <li>Aim for 2 portions of protein per day (beans, pulses, fish, eggs, lean meat).</li>
            <li>Aim for 3 portions of lower-fat dairy daily.</li>
            <li>Hydration goal: about 6-8 drinks/day (around 1.5-2L fluids).</li>
          </ul>
        </article>
        <article className="card-soft">
          <h3>Low GI Food Tips</h3>
          <ul>{lowGITips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
        </article>
        <article className="card-soft">
          <h3>Foods to Limit / Avoid</h3>
          <ul>
            <li>Alcohol: avoid completely during pregnancy.</li>
            <li>Caffeine: keep below 200mg/day.</li>
            <li>High sugar products (over 22.5g sugar per 100g): occasional only.</li>
            <li>High fat products (over 17.5g fat per 100g): occasional only.</li>
            <li>Processed/junk foods should be limited.</li>
          </ul>
        </article>
        <article className="card-soft">
          <h3>Food Safety Checklist</h3>
          <ul>{foodSafety.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="card-soft">
          <h3>Safe Activity & Exercise</h3>
          <ul>
            <li>Aim for at least 30 minutes of moderate activity on 5+ days/week.</li>
            <li>Start gradually if you were not active before pregnancy.</li>
            <li>Walking, prenatal yoga, breathing exercises, and pelvic floor training are useful.</li>
            <li>Continue as comfortable through pregnancy with medical guidance.</li>
          </ul>
        </article>
        <article className="card-soft">
          <h3>When to Stop Exercise & Get Advice</h3>
          <ul>{exerciseCautions.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="card-soft">
          <h3>Supplements & Key Nutrients</h3>
          <ul>
            <li>Folic acid: 400mcg daily up to at least 12 weeks.</li>
            <li>Vitamin D: 10mcg daily throughout pregnancy.</li>
            <li>Important nutrients: iron, calcium, iodine, omega-3 fatty acids.</li>
            <li>Do not use vitamin A supplements unless prescribed.</li>
          </ul>
          <p className="muted">Content adapted from your PINE pregnancy nutrition and activity booklet.</p>
        </article>
      </div>
    </section>
  );
}

export default LifestylePage;
