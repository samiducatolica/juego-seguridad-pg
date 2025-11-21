import React, { useReducer } from 'react';
import { initialState, gameReducer } from './gameLogic';
import GameBoard from './GameBoard';
import ActionPanel from './ActionPanel';
import EventLog from './EventLog';
import SidePanel from './SidePanel';
import './RansomwareScenario.css';

const RansomwareScenario = ({ onBack }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  return (
    <div className="gamer-container">
        <header className="gamer-header">
            <button onClick={onBack} className="back-to-menu-btn">← Menú Principal</button>
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