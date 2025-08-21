import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ScenarioIntro.css';

const ScenarioIntro = ({ markdownContent, onStart, onBack }) => {
    return (
        <div className="intro-container">
            <ReactMarkdown >{markdownContent}</ReactMarkdown>
            <div className="intro-actions">
                <button onClick={onStart} className="scenario-btn">Comenzar Juego</button>
                <button onClick={onBack} className="scenario-btn back-btn">Volver al Menú</button>
            </div>
        </div>
    );
};

export default ScenarioIntro;
