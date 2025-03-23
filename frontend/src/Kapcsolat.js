

import React, { useState } from 'react';
import './Kapcsolat.css'; // A CSS fájl importálása

function Kapcsolat() {
  const [formData, setFormData] = useState({
    nev: "",
    email: "",
    targy: "",
    uzenet: ""
  });

  const [faqOpen, setFaqOpen] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Üzenet elküldve!"); // Itt lehet backendhez csatlakozni
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqList = [
    { question: "Hogyan vehetem fel Önökkel a kapcsolatot?", answer: "Az űrlap kitöltésével vagy az email címünkön keresztül." },
    { question: "Milyen termékeket figyelhetek meg?", answer: "Villanyszerelési anyagokat, szerszámokat és sok mást." },
    { question: "Van személyes ügyfélszolgálat?", answer: "Jelenleg online ügyfélszolgálatunk érhető el." }
  ];

  return (
    <div className="contact-container">
      <h2>Kapcsolat</h2>
      <p>Email: info@example.com</p>
      <p>Telefon: +36 30 123 4567</p>
      <p>Cím: Példa utca 1, Budapest</p>
      
      <h3>Kapcsolatfelvételi űrlap</h3>
      <form onSubmit={handleSubmit} className="contact-form">
        <input type="text" name="nev" placeholder="Név" value={formData.nev} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="targy" placeholder="Tárgy" value={formData.targy} onChange={handleChange} required />
        <input type="text" name="uzenet" placeholder="Üzenet" value={formData.uzenet} onChange={handleChange} required />
        <button type="submit">Küldés</button>
      </form>
      
      <h3>Gyakran Ismételt Kérdések</h3>
      <div className="faq-section">
        {faqList.map((faq, index) => (
          <div key={index} className="faq-item">
            <button className="faq-question" onClick={() => toggleFaq(index)}>
              {faq.question}
            </button>
            {/* Az .active osztály hozzáadása a válasz megjelenítéséhez */}
            <p className={`faq-answer ${faqOpen === index ? 'active' : ''}`}>
              {faq.answer}
	    </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kapcsolat;
