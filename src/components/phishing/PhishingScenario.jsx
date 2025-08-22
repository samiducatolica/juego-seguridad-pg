import {useState} from 'react';
import './PhishingScenario.css';
import emailData from '../../scenarios/scenario1/phishing_emails_dataset.json';
import ShellContext from '../shared/ShellContext.jsx';
import introContent from '../../scenarios/scenario1/phishing_game_intro.md?raw';
import Modal from '../shared/Modal.jsx';

const PhishingScenario = ({onBack}) => {
    const [gameState, setGameState] = useState('intro'); // intro, playing, finished
    const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState({message: '', type: ''}); // type: correct, incorrect
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const currentEmail = emailData.emails[currentEmailIndex];

    const handleStartGame = () => {
        setGameState('playing');
    };

    const handleAnswer = (answer) => {
        const isCorrect = answer === currentEmail.tipo;
        if (isCorrect) {
            setScore(score + 1);
            setFeedback({message: '¡Correcto! Buen trabajo, detective.', type: 'correct'});
        } else {
            setFeedback({message: '¡Cuidado! Este correo era ' + currentEmail.tipo + '.', type: 'incorrect'});
        }

        setTimeout(() => {
            if (currentEmailIndex < emailData.emails.length - 1) {
                setCurrentEmailIndex(currentEmailIndex + 1);
                setFeedback({message: '', type: ''});
            } else {
                setGameState('finished');
            }
        }, 8000);
    };

    const handleConfirmBack = () => {
        onBack();
        setIsConfirmModalOpen(false);
    };

    const confirmationModal = (
        <Modal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            title="¿Estás seguro?"
        >
            <div className="menu-buttons-back">
                <button onClick={handleConfirmBack} className="scenario-btn phishy-btn">Sí, Salir</button>
                <button onClick={() => setIsConfirmModalOpen(false)} className="scenario-btn safe-btn">No, Quedarse</button>
            </div>
            <p>Si sales ahora, perderás tu progreso en este escenario.</p>
        </Modal>
    )

    if (gameState === 'intro') {
        return (
            <ShellContext
                markdownContent={introContent}
                onStart={handleStartGame}
                onBack={onBack}
            />
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="phishing-container">
                {confirmationModal}
                <h2>¡Juego Terminado!</h2>
                <p>Tu puntuación final es: {score} de {emailData.emails.length}</p>
                <button onClick={() => setIsConfirmModalOpen(true)} className="scenario-btn back-btn">Volver al Menú
                </button>
            </div>
        );
    }

    return (
        <div className="phishing-container">
            {confirmationModal}
            <h2>Correo {currentEmailIndex + 1} de {emailData.emails.length}</h2>
            <div className="email-container">
                <div className="email-header">
                    <p><strong>De:</strong> {currentEmail.nombre_remitente} &lt;{currentEmail.remitente}&gt;</p>
                    <p><strong>Asunto:</strong> {currentEmail.asunto}</p>
                </div>
                <div className="email-body">
                    <p>{currentEmail.contenido.replace(/\n/g, '<br />')}</p>
                </div>
            </div>

            <div className="email-actions">
                <button onClick={() => handleAnswer('falso')} className="action-btn phishy-btn">Es Falso (Phishing)
                </button>
                <button onClick={() => handleAnswer('real')} className="action-btn safe-btn">Es Real</button>
            </div>

            {feedback.message && (
                <div className={`feedback ${feedback.type}`}>
                    {feedback.message}
                </div>
            )}
            <button onClick={() => setIsConfirmModalOpen(true)} className="scenario-btn back-btn">Volver al Menú
            </button>
        </div>
    );
};

export default PhishingScenario;
