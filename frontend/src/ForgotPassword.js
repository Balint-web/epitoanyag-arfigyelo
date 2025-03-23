import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Itt lehetne elküldeni a kérést, pl. API hívás a jelszó visszaállításához
        setMessage('A jelszó visszaállítása kérelem elküldve!');
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <h1>Jelszó visszaállítása</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label>Email cím</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Írd be az email címed"
                            required
                        />
                    </div>
                    <button type="submit" className="reset-button">Új jelszó kérése</button>
                </form>
                {message && <p className="confirmation-message">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
