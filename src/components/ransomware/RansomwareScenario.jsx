import React, { useReducer, useState } from 'react';
import { initialState, gameReducer } from './gameLogic';
import GameBoard from './GameBoard';
import ActionPanel from './ActionPanel';
import SidePanel from './SidePanel';
import ShellContext from '../shared/ShellContext.jsx'; // Import ShellContext
import Modal from '../shared/Modal.jsx'; // Import Modal
import './RansomwareScenario.css';

const RansomwareScenario = ({ onBack }) => {
  const [internalGameState, setInternalGameState] = useState('intro'); // intro, playing
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State for modal
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const handleStartGame = () => {
    setInternalGameState('playing');
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
            <button onClick={() => setIsConfirmModalOpen(false)} className="scenario-btn safe-btn">No, Quedarse
            </button>
        </div>
        <p>Si sales ahora, perderás tu progreso en este escenario.</p>
    </Modal>
  );

  if (internalGameState === 'intro') {
    return (
      <ShellContext
        gameId={2} // ID for Ransomware scenario
        onStart={handleStartGame}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="gamer-container">
        {confirmationModal}
        <header className="gamer-header">
            <button onClick={() => setIsConfirmModalOpen(true)} className="back-to-menu-btn">← Menú Principal</button>
            <h1 className="gamer-title">🏫 RansomRaiders: Rescata los Datos del Colegio</h1>
            <div className="ransomware-tracker">
                <div className="threat-level">⚠️ AMENAZA NIVEL {gameState.threatLevel}</div>
                <div className="progress-ring">
                    <span className="progress-text">{gameState.ransomwareProgress}%</span>
                </div>
            </div>
        </header>

        <main className="gamer-board">
            <GameBoard sectors={gameState.sectors} dispatch={dispatch} />
        </main>

        <SidePanel clues={gameState.playerResources.cluesFound} tools={gameState.playerResources.tools} log={gameState.eventLog} />

        <footer className="actionr-panel">
            <ActionPanel 
                selectedSector={gameState.sectors.find(s => s.id === gameState.selectedSector)} 
                dispatch={dispatch} 
                disabled={gameState.gameStatus !== 'playing'}
                gameState={gameState}
            />
        </footer>
    </div>
  );
};

export default RansomwareScenario;