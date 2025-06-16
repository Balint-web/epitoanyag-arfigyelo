import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ A jelszavak nem egyeznek!");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/password/reset/confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          token,
          new_password1: newPassword,
          new_password2: confirmPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Jelszó sikeresen frissítve!");
      } else {
        setMessage("❌ Hiba történt: " + JSON.stringify(data));
      }
    } catch (error) {
      setMessage("❌ Hálózati hiba: " + error.message);
    }
  };

  return (
    <div>
      <h2>Új jelszó megadása</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Új jelszó"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Jelszó megerősítése"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Jelszó visszaállítása</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
