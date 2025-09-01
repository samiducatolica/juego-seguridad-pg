
import React from 'react';
import './EventLog.css';

const EventLog = ({ log }) => {
  return (
    <div className="event-log-container">
      <h3>Registro de Eventos</h3>
      <ul className="event-log-list">
        {Array.isArray(log) && log.map((entry, index) => (
          <li key={index} className={`log-entry log-${entry.type}`}>
            <span className="log-turn">Turno {entry.turn}:</span> {entry.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventLog;
