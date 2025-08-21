import { useState } from 'react';
import './App.css';
import dukeInicio from './assets/images/character/Duke_inicio.png';

// Componente provisional para el Escenario de Phishing
const PhishingScenario = ({ onBack }) => (
    <div>
        <h2>Phishing Scenario</h2>
        <p>This is where the phishing game will be.</p>
        <button onClick={onBack} className="scenario-btn back-btn">Go Back</button>
    </div>
);

// Componente provisional para el Escenario de Ransomware
const RansomwareScenario = ({ onBack }) => (
    <div>
        <h2>Ransomware Scenario</h2>
        <p>This is where the ransomware game will be.</p>
        <button onClick={onBack} className="scenario-btn back-btn">Go Back</button>
    </div>
);

// Componente provisional para el Escenario de Contraseñas Seguras
const SecurePasswordsScenario = ({ onBack }) => (
    <div>
        <h2>Secure Passwords Scenario</h2>
        <p>This is where the secure passwords game will be.</p>
        <button onClick={onBack} className="scenario-btn back-btn">Go Back</button>
    </div>
);

// Componente provisional para el cuarto escenario
const ComingSoonScenario = ({ onBack }) => (
    <div>
        <h2>Coming Soon!</h2>
        <p>This scenario is under construction.</p>
        <button onClick={onBack} className="scenario-btn back-btn">Go Back</button>
    </div>
);


const Menu = ({ onSelectScenario }) => {
    return (
        <div className="menu-container">
            <img src={dukeInicio} alt="Duke Character" className="character-image" />
            <h1>CyberSafe Kids</h1>
            <div className="scenario-buttons">
                <button onClick={() => onSelectScenario('phishing')} className="scenario-btn">
                    Phishing
                </button>
                <button onClick={() => onSelectScenario('ransomware')} className="scenario-btn secondary" disabled>
                    Ransomware (Coming Soon)
                </button>
                <button onClick={() => onSelectScenario('passwords')} className="scenario-btn secondary" disabled>
                    Secure Passwords (Coming Soon)
                </button>
                <button onClick={() => onSelectScenario('coming_soon')} className="scenario-btn secondary" disabled>
                    Mystery Scenario (Coming Soon)
                </button>
            </div>
        </div>
    );
};

function App() {
    const [currentScenario, setCurrentScenario] = useState(null);

    const handleScenarioSelect = (scenario) => {
        setCurrentScenario(scenario);
    };

    const handleBackToMenu = () => {
        setCurrentScenario(null);
    };

    const renderScenario = () => {
        switch (currentScenario) {
            case 'phishing':
                return <PhishingScenario onBack={handleBackToMenu} />;
            case 'ransomware':
                return <RansomwareScenario onBack={handleBackToMenu} />;
            case 'passwords':
                return <SecurePasswordsScenario onBack={handleBackToMenu} />;
            case 'coming_soon':
                return <ComingSoonScenario onBack={handleBackToMenu} />;
            default:
                return <Menu onSelectScenario={handleScenarioSelect} />;
        }
    };

    return (
        <main>
            {renderScenario()}
        </main>
    );
}

export default App;