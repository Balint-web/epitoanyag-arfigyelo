import React, { useState, useEffect } from 'react';
import './Regisztracio.css';

const Regisztracio = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [emailValid, setEmailValid] = useState(false); // ÚJ: e-mail állapot

    // E-mail ellenőrző függvény (pontosítva)
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    // Ellenőrizzük minden változásnál az e-mailt
    useEffect(() => {
        setEmailValid(validateEmail(email));
    }, [email]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // 📌 Megakadályozzuk a hibás e-mail továbbjutását
        if (!emailValid) {
            setMessage("Hibás e-mail formátum! Példa: valami@domain.com");
            return;
        }

        if (password !== confirmPassword) {
            setMessage('A jelszavak nem egyeznek!');
            return;
        }

        setMessage('Sikeres regisztráció!');
    };

    return (
        <div className="regisztracio-container">
            <div className="regisztracio-form">
                <h1>Regisztráció</h1>
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
                        {!emailValid && email.length > 0 && (
                            <p style={{ color: "red", fontSize: "12px" }}>
                                Érvénytelen e-mail cím formátum! Példa: valami@domain.com
                            </p>
                        )}
                    </div>
                    <div className="input-container">
                        <label>Jelszó</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Írd be a jelszavad"
                            required
                        />
                    </div>
                    <div className="input-container">
                        <label>Jelszó megerősítése</label>
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Erősítsd meg a jelszavad"
                            required
                        />
                    </div>
                    <button type="submit" disabled={!emailValid}>Regisztráció</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Regisztracio;
