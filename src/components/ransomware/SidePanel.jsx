
import React from 'react';
import EventLog from './EventLog';
import './SidePanel.css';

const SidePanel = ({ clues, tools, log }) => {
  return (
    <aside className="sider-panel">
        <div className="clues-section">
            <div className="clues-title">🔍 Pistas Encontradas</div>
            <div className="clues-progress">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={`clue-dot ${i < clues ? 'found' : ''}`}></div>
                ))}
            </div>
            <div style={{marginTop: '8px', fontSize: '12px'}}>{clues}/3 para la Clave de Descifrado</div>
        </div>

        <div className="tools-section">
            <div className="tools-title">🛠️ Herramientas Disponibles</div>
            <div className="tool-item">
                <span>🦠 Antivirus</span>
                <span>x{tools.antivirus}</span>
            </div>
            <div className="tool-item">
                <span>🛡️ Firewall</span>
                <span>x{tools.firewall}</span>
            </div>
            <div className="tool-item">
                <span>🔍 Scanner</span>
                <span>x{tools.scanner}</span>
            </div>
        </div>

        <EventLog log={log} />
    </aside>
  );
};

export default SidePanel;
