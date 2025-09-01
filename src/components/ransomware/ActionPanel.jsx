import React from 'react';
import './ActionPanel.css';

const ActionPanel = ({ selectedSector, dispatch, disabled, gameState }) => {
  const handleAction = (actionType) => {
    if (disabled) return;
    dispatch({ type: 'PERFORM_ACTION', actionType });
  };

  const sectorsOK = gameState.sectors.filter(s => s.infectionLevel === 0).length;

  return (
    <>
        <div className="current-turn">
            🎯 Sector Seleccionado: <span style={{color: '#ffaa00'}}>{selectedSector ? selectedSector.name : 'Ninguno'}</span>
        </div>

        <div className="actions-container">
            <button onClick={() => handleAction('contain')} className="action-btn" disabled={disabled || !selectedSector}>🛡️ Contener</button>
            <button onClick={() => handleAction('analyze')} className="action-btn" disabled={disabled || !selectedSector}>🔍 Analizar</button>
            <button onClick={() => handleAction('restore')} className="action-btn" disabled={disabled || !selectedSector}>💾 Restaurar</button>
            <button onClick={() => dispatch({ type: 'ADVANCE_TURN' })} className="action-btn danger" disabled={disabled}>⏭️ Finalizar Turno</button>
        </div>

        <div className="game-stats">
            <div className="stat-item">
                <div className="stat-value">{gameState.currentTurn}</div>
                <div className="stat-label">Turnos</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">{sectorsOK}/{gameState.sectors.length}</div>
                <div className="stat-label">Sectores OK</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">{gameState.playerResources.cluesFound}</div>
                <div className="stat-label">Pistas</div>
            </div>
        </div>
    </>
  );
};

export default ActionPanel;