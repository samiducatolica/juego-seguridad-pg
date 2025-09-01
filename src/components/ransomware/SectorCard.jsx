import React from 'react';
import './SectorCard.css';

const SectorCard = ({ sector, dispatch }) => {
  const getInfectionStatus = () => {
    switch (sector.infectionLevel) {
      case 1: return { text: 'Infectado', color: '#ffaa00' };
      case 2: return { text: 'Cifrado', color: '#ff4444' };
      case 3: return { text: 'Destruido', color: '#b2bec3' };
      default: return { text: 'Normal', color: '#00ff88' };
    }
  };

  const handleSectorClick = () => {
    dispatch({ type: 'SELECT_SECTOR', sectorId: sector.id });
  };

  const status = getInfectionStatus();

  return (
    <div 
      className={`sector-card infection-level-${sector.infectionLevel} ${sector.isSelected ? 'selected' : ''}`}
      onClick={handleSectorClick}
      data-sector={sector.id}
    >
        <div className="sector-title">{sector.name}</div>
        <div className="sector-icon">{sector.icon}</div>
        <div className="sector-status">
            <div className="status-indicator">
                <span style={{color: status.color}}>●</span> {status.text}
            </div>
            {sector.hasBackup && <div className="backup-indicator">💾</div>}
            {sector.hasFirewall && <div className="firewall-indicator">🛡️</div>}
        </div>
    </div>
  );
};

export default SectorCard;