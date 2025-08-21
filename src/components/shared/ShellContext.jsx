import { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import ReactMarkdown from 'react-markdown';
import Modal from './Modal.jsx';
import './ScenarioIntro.css'; // Re-using styles

const ShellContext = ({ markdownContent, onStart, onBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [userData, setUserData] = useState(null);
    const [processedContent, setProcessedContent] = useState('');

    const handleUserSubmit = (name, lastName) => {
        const fullName = `${name} ${lastName}`;
        const email = `${name.toLowerCase()}.${lastName.toLowerCase()}`;
        setUserData({ fullName, email });
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (userData) {
            const personalizedContent = markdownContent
                .replace(/\{\{NOMBRE_APELLIDO\}\}/g, userData.fullName)
                .replace(/\{\{CORREO_USUARIO\}\}/g, userData.email);
            setProcessedContent(personalizedContent);
        }
    }, [userData, markdownContent]);

    if (isModalOpen) {
        return <Modal isOpen={isModalOpen} onClose={() => onBack()} onSubmit={handleUserSubmit} />;
    }

    return (
        <div className="intro-container">
            <TypeAnimation
                sequence={[
                    processedContent,
                    1000, 
                ]}
                wrapper="div"
                cursor={true}
                repeat={0}
                speed={90}
            />
            <div className="intro-actions">
                <button onClick={onStart} className="scenario-btn">Comenzar Juego</button>
                <button onClick={onBack} className="scenario-btn back-btn">Volver al Menú</button>
            </div>
        </div>
    );
};

export default ShellContext;
