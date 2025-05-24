import React, { useState } from 'react';
import './Kapcsolat.css';

function Kapcsolat() {
  const [formData, setFormData] = useState({
    nev: "",
    email: "",
    targy: "",
    uzenet: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Üzenet elküldve!");
  };

  return (
  <div className="contact-container">
    <h2>Kapcsolat</h2>
    <div className="contact-content">
      <div className="form-section">
        <p>Email: arfigyelo.kapcsolat@gmail.com</p>
        <p>Telefon: +36 30 123 4567</p>
        <p>Cím: 1011. Budapest, Pala utca 4.</p>

        <h3>Kapcsolatfelvételi űrlap</h3>
        <form onSubmit={handleSubmit} className="contact-form">
          <input type="text" name="nev" placeholder="Név" value={formData.nev} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="targy" placeholder="Tárgy" value={formData.targy} onChange={handleChange} required />
          <input type="text" name="uzenet" placeholder="Üzenet" value={formData.uzenet} onChange={handleChange} required />
          <button type="submit">Küldés</button>
        </form>
      </div>

      <div className="map-section">
        <h3>Bolt helye a térképen</h3>
        <iframe
          title="Bolt helye"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10751.112845306506!2d19.0402353!3d47.4979126!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dc1b95a38727%3A0xf3d98bbf2d70d1a4!2sP%C3%A9lda%20utca%201%2C%20Budapest!5e0!3m2!1shu!2shu!4v1618920931566!5m2!1shu!2shu"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  </div>
);

}

export default Kapcsolat;
