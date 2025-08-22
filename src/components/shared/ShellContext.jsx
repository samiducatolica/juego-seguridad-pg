import { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import Modal from './Modal.jsx';
import './ScenarioIntro.css'; // Re-using styles
import dukeMeditation from '../../assets/images/character/Dujke_meditando.png';

const ShellContext = ({ markdownContent, onStart, onBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [userData, setUserData] = useState(null);
    const [processedContent, setProcessedContent] = useState([]); // Will be an array of pages
    const [currentPage, setCurrentPage] = useState(0);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleUserSubmit = (name, lastName) => {
        const fullName = `${name} ${lastName}`;
        const email = `${name.toLowerCase()}.${lastName.toLowerCase()}`;
        setUserData({ fullName, email });
        setIsModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && lastName) {
            handleUserSubmit(name, lastName);
        }
    };

    useEffect(() => {
        if (userData) {
            const personalizedContent = markdownContent
                .replace(/\{\{NOMBRE_APELLIDO\}\}/g, userData.fullName)
                .replace(/\{\{CORREO_USUARIO\}\}/g, userData.email);
            
            const pages = personalizedContent.split('## ').filter(page => page.trim() !== '');
            console.log('Processed Pages:', pages); // Debugging output
            setProcessedContent(pages);
        }
    }, [userData, markdownContent]);

    if (isModalOpen) {
        return (
            <Modal
                isOpen={isModalOpen}
                onClose={() => onBack()}
                title="¡Bienvenido, Detective!"
            >
                <p>Para comenzar, por favor ingresa tu nombre y apellido.</p>
                <form onSubmit={handleSubmit} className="modal-form">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Apellido"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <div className="modal-actions">
                         <button type="submit" className="scenario-btn">Comenzar Misión</button>
                    </div>
                </form>
            </Modal>
        );
    }

    // Render the container only when the content has been processed
    if (processedContent.length === 0) {
        return null; // Or a loading spinner
    }

    return (
        <div className="intro-container">
            <img src={dukeMeditation} alt="Duke meditando" className="character-intro"/>
            <TypeAnimation
                key={currentPage} // Force re-animation on page change
                sequence={[
                    `## ${processedContent[currentPage]}`,
                    () => {
                        setIsAnimationFinished(true);
                    }
                ]}
                wrapper="div"
                className="intro-text"
                cursor={true}
                repeat={0}
                speed={80}
            />
            {isAnimationFinished && (
                <div className="intro-actions">
                    {currentPage < processedContent.length - 1 && (
                        <button 
                            onClick={() => {
                                setCurrentPage(currentPage + 1);
                                setIsAnimationFinished(false); // Reset for next animation
                            }} 
                            className="scenario-btn"
                        >
                            Siguiente
                        </button>
                    )}
                    {currentPage === processedContent.length - 1 && (
                        <>
                            <button onClick={onStart} className="scenario-btn">Comenzar Juego</button>
                            <button onClick={onBack} className="scenario-btn back-btn">Volver al Menú</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShellContext;