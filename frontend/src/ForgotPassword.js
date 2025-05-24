import React, { useState } from 'react';
import './ForgotPassword.css';
import loginImage from './login.png'; // Logó 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Itt történik majd a backend kérés a jelszó visszaállításához
    setMessage('✅ A jelszó visszaállítására vonatkozó email elküldve!');
  };

  return (
    <div className="forgot-password-wrapper">
      <div className="forgot-password-container">
        <img src={loginImage} alt="Jelszó visszaállítás" className="logo" />

        <h2>Jelszó visszaállítása</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Írd be az email címed"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Új jelszó kérése</button>
        </form>

        {message && (
          <p className="message success">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

