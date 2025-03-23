import React, { useState } from "react";
import { Link } from 'react-router-dom';  // Link importálása
import "./Bejelentkezes.css";  // Importáld a CSS fájlt

const Bejelentkezes = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Bejelentkezési logika
    };

    return (
        <div className="login-container">
            <div className="logo-container">
                <img src="your-logo.png" alt="Logo" className="logo" />
                <h1>Bejelentkezés</h1>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
                <div className="input-container">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                
                <div className="input-container">
                    <label htmlFor="password">Jelszó:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                
                <div className="forgot-password-container">
                    {/* Link komponens használata */}
                    <Link to="/forgot-password" className="forgot-password-link">
                        Elfelejtetted a jelszót?
                    </Link>
                </div>

                <button type="submit" className="login-button">Bejelentkezés</button>
            </form>
        </div>
    );
};

export default Bejelentkezes;
