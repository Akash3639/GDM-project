const sections = [
  {
    title: "Trimester-wise Development",
    points: [
      "1st Trimester (Week 1-12): organ formation, nausea management, folic acid focus.",
      "2nd Trimester (Week 13-27): visible baby growth, anomaly scan, active movement.",
      "3rd Trimester (Week 28-40): weight gain, brain-lung maturity, delivery preparation.",
    ],
  },
  {
    title: "Mother Body Changes",
    points: [
      "Increased blood volume and heart rate are common and normal.",
      "Posture and back discomfort may increase due to center-of-gravity shift.",
      "Mild swelling can occur; severe swelling needs medical review.",
    ],
  },
  {
    title: "Do's and Don'ts",
    points: [
      "Do: eat balanced meals rich in protein, iron, calcium, and fiber.",
      "Do: attend regular antenatal checkups and follow prescriptions.",
      "Don't: smoke, consume alcohol, skip supplements, or self-medicate.",
    ],
  },
  {
    title: "Common Problems & Solutions",
    points: [
      "Nausea: small frequent meals, ginger tea, avoid long gaps between meals.",
      "Constipation: more water, fruits, vegetables, and light walking.",
      "Heartburn: avoid oily/spicy foods at night, smaller meals, upright posture.",
    ],
  },
];

function EducationPage() {
  return (
    <section>
      <h1>Pregnancy Knowledge Center</h1>
      <p className="muted">Detailed and practical guidance from week 1 to delivery.</p>
      <div className="image-row">
        <img src="https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=900&q=80" alt="Pregnancy checkup" />
        <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80" alt="Maternal care" />
      </div>
      <div className="content-grid">
        {sections.map((s) => (
          <article className="card-soft" key={s.title}>
            <h3>{s.title}</h3>
            <ul>{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default EducationPage;
