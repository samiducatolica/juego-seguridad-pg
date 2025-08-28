import {useState} from 'react';
import './App.css';
import PhishingScenario from './components/phishing/PhishingScenario.jsx';
import Menu from './components/menu/Menu.tsx'

// Componente provisional para el Escenario de Ransomware
const RansomwareScenario = ({onBack}) => (
    <div>
        <h2>Ransomware Scenario</h2>
        <p>This is where the ransomware game will be.</p>
        <button onClick={onBack} className="scenario-btn back-btn">Go Back</button>
    </div>
);

// Componente provisional para el Escenario de Contraseñas Seguras
const SecurePasswordsScenario = ({onBack}) => (
    <div>
        <h2>Secure Passwords Scenario</h2>
        <p>This is where the secure passwords game will be.</p>
        <button onClick={onBack} className="scenario-btn back-btn">Go Back</button>
    </div>
);

// Componente provisional para el cuarto escenario
const ComingSoonScenario = ({onBack}) => (
    <div>
        <h2>Coming Soon!</h2>
        <p>This scenario is under construction.</p>
        <button onClick={onBack} className="scenario-btn back-btn">Go Back</button>
    </div>
);



import Header from './components/header/Header.jsx';
import Footer from "./components/footer/Footer.tsx";

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
                return <PhishingScenario onBack={handleBackToMenu}/>;
            case 'ransomware':
                return <RansomwareScenario onBack={handleBackToMenu}/>;
            case 'passwords':
                return <SecurePasswordsScenario onBack={handleBackToMenu}/>;
            case 'coming_soon':
                return <ComingSoonScenario onBack={handleBackToMenu}/>;
            default:
                return <Menu onSelectScenario={handleScenarioSelect}/>;
        }
    };

    return (
        <div className="main-container">
            <Header inScenario={currentScenario !== null}/>
            {renderScenario()}
            <Footer inScenario={currentScenario !== null}/>
        </div>
    );
}

export default App;
