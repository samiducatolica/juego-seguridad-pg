import React from 'react';
import './Header.css';

const Header = ({ inScenario }) => {
    console.log(inScenario);
  return (
    <header className="game-header">
        <div className="header-content">
            <div className="logo-title">
                <div className="logo">🛡️</div>
                <div className="title-text">
                    <h1>CyberSafe Kids</h1>
                    <p className="subtitle">Aprende Ciberseguridad Jugando</p>
                </div>
            </div>
            <div className="user-info">
                <div className="difficulty-selector">
                    🎯 Nivel Escolar (9-16 años)
                </div>
                <div className="user-avatar">👨‍🎓</div>
            </div>

        </div>

    </header>
  );
};

export default Header;
