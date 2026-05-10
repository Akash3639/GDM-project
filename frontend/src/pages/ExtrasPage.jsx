function ExtrasPage() {
  return (
    <section>
      <h1>Partner Support & Post-Pregnancy Care</h1>
      <p className="muted" style={{marginBottom: '1.5rem'}}>
        For partners, knowing how to provide support and stay engaged can make a significant difference 
        in the experience for both the mother and the newborn.
      </p>

      <div style={{display: 'grid', gap: '1.5rem'}}>
        
        <article className="card-soft">
          <h2 style={{color: '#be185d', marginBottom: '1rem'}}>1. Education and Preparation</h2>
          <p>Understanding what to expect during pregnancy and postpartum is the first step in being a supportive partner.</p>
          <ul style={{marginTop: '0.75rem', lineHeight: '1.8'}}>
            <li><strong>Attend Prenatal Appointments:</strong> Go to as many doctor visits as possible (preferably all). This helps you stay informed and show your commitment.</li>
            <li><strong>Participate in Classes:</strong> Join prenatal classes, childbirth education, and breastfeeding workshops to learn more about the process and how you can assist.</li>
            <li><strong>Read and Research:</strong> Equip yourself with knowledge by reading books and articles about pregnancy, childbirth, and newborn care.</li>
          </ul>
        </article>

        <article className="card-soft">
          <h2 style={{color: '#be185d', marginBottom: '1rem'}}>2. Emotional Support</h2>
          <p>Emotional support is crucial during pregnancy and postpartum. Always believe that the two of you together are pregnant. While the mother carries the baby physically in her body, the bonding as a family unit should be your role.</p>
          <ul style={{marginTop: '0.75rem', lineHeight: '1.8'}}>
            <li><strong>Listen Actively:</strong> Be an empathetic listener. Sometimes, just being there to hear her concerns can provide immense comfort.</li>
            <li><strong>Be Patient and Understanding:</strong> Hormonal changes can cause mood swings and emotional fluctuations. Show patience and understanding.</li>
            <li><strong>Encourage and Reassure:</strong> Offer words of encouragement and reassure her of your love and support.</li>
          </ul>
        </article>

        <article className="card-soft">
          <h2 style={{color: '#be185d', marginBottom: '1rem'}}>3. Practical Support During Pregnancy</h2>
          <p>Taking on practical responsibilities can ease the physical burden on the mother.</p>
          <ul style={{marginTop: '0.75rem', lineHeight: '1.8'}}>
            <li><strong>Household Chores:</strong> Share or take over tasks such as cooking, cleaning, and shopping.</li>
            <li><strong>Prepare for Baby:</strong> Help set up the nursery, purchase baby essentials, and ensure everything is ready for the baby's arrival.</li>
            <li><strong>Health and Well-being:</strong> Encourage a healthy lifestyle by participating in walks, preparing nutritious meals, and reminding her to rest. If you are a smoker then try to quit, at least avoid smoking around your pregnant partner.</li>
            <li><strong>Inform your workplace:</strong> Inform your workplace about your pregnancy and apply for paternity leaves in advance.</li>
          </ul>
        </article>

        <article className="card-soft">
          <h2 style={{color: '#be185d', marginBottom: '1rem'}}>4. Labour and Delivery Support</h2>
          <p>Your role during labour and delivery is to be a source of strength and calm.</p>
          <ul style={{marginTop: '0.75rem', lineHeight: '1.8'}}>
            <li><strong>Create a Birth Plan Together:</strong> Discuss and create a birth plan that includes her preferences for labour and delivery.</li>
            <li><strong>Be Present and Engaged:</strong> Offer physical comfort, such as massages, holding her hand, or helping with breathing techniques.</li>
            <li><strong>Comfort:</strong> Distract her during early labour by sitting with her, talking to her or doing some activities together. Comfort her with words of encouragement and stay positive throughout the labour.</li>
            <li><strong>Advocate:</strong> Be her advocate, communicating her needs and preferences to the medical staff politely and in clear terms.</li>
          </ul>
        </article>

        <article className="card-soft">
          <h2 style={{color: '#be185d', marginBottom: '1rem'}}>5. Postpartum Support</h2>
          <p>The postpartum period is a time of significant adjustment. Your support here is crucial.</p>
          <ul style={{marginTop: '0.75rem', lineHeight: '1.8'}}>
            <li><strong>Assist with Baby Care:</strong> Take turns with diaper changes, feeding (if bottle-feeding) and soothing the baby. Burp, cuddle and rock the baby whenever it's needed. This not only gives her a break but also helps you bond with your child.</li>
            <li><strong>Support Breastfeeding:</strong> At feeding times, help by bringing the baby to her, offering pillows for making the right posture, and ensuring she has snacks and water.</li>
            <li><strong>Monitor Health:</strong> Keep an eye on her physical and emotional well-being. Postpartum depression is a serious condition; if you notice signs, encourage her to seek professional help.</li>
          </ul>
        </article>

        <article className="card-soft">
          <h2 style={{color: '#be185d', marginBottom: '1rem'}}>6. Encouraging Self-Care</h2>
          <p>Encourage her to take time for herself and help make it possible.</p>
          <ul style={{marginTop: '0.75rem', lineHeight: '1.8'}}>
            <li><strong>Ensure Rest:</strong> Make sure she gets enough rest, taking over baby duties when possible.</li>
            <li><strong>Promote Social Connections:</strong> Encourage her to connect with friends, family, or support groups.</li>
            <li><strong>Create "Me Time":</strong> Create opportunities for her to engage in activities she enjoys, whether it's reading, a hobby, or a relaxing bath.</li>
          </ul>
        </article>

        <article className="card-soft" style={{background: 'linear-gradient(135deg, #fdf2f8, #eef2ff)'}}>
          <h2 style={{color: '#7c3aed', marginBottom: '1rem'}}>Additional Resources</h2>
          <div className="content-grid" style={{marginTop: '1rem'}}>
            <div>
              <h3 style={{fontSize: '1rem'}}>Mood Tracker Guidance</h3>
              <ul>
                <li>Track mood daily and share concerns early.</li>
                <li>Practice mindfulness and short breathing breaks.</li>
                <li>Seek counseling support for persistent low mood.</li>
              </ul>
            </div>
            <div>
              <h3 style={{fontSize: '1rem'}}>Post-Pregnancy Baby Care</h3>
              <ul>
                <li>Early breastfeeding initiation and latch support.</li>
                <li>Vaccination schedule and pediatric follow-up.</li>
                <li>Mother recovery: sleep, hydration, nutrition, and emotional care.</li>
              </ul>
            </div>
          </div>
        </article>

      </div>
    </section>
  );
}

export default ExtrasPage;