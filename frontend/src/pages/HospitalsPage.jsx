function HospitalsPage() {
  const openNearby = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      window.open(`https://www.google.com/maps/search/?api=1&query=hospital&center=${latitude},${longitude}`, "_blank");
    });
  };

  return (
    <section>
      <h1>Hospital Finder & Emergency Navigation</h1>
      <div className="card-soft">
        <p>Find nearby maternity hospitals, clinics, and emergency centers with one tap.</p>
        <button onClick={openNearby}>Find Nearby Hospitals</button>
      </div>
      <div className="card-soft">
        <h3>Emergency Checklist</h3>
        <ul>
          <li>Carry antenatal records and blood group card.</li>
          <li>Keep doctor number and emergency contact accessible.</li>
          <li>If severe bleeding/pain/fainting occurs, seek urgent care immediately.</li>
        </ul>
      </div>
    </section>
  );
}

export default HospitalsPage;
