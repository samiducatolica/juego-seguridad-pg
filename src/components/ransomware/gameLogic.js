
export const initialState = {
  sectors: [
    { id: 'biblioteca', name: 'Biblioteca Digital', icon: '📚', infectionLevel: 1, hasBackup: true, hasFirewall: false, connections: ['laboratorio', 'calificaciones'], isSelected: false },
    { id: 'laboratorio', name: 'Laboratorio de PC', icon: '💻', infectionLevel: 0, hasBackup: true, hasFirewall: false, connections: ['biblioteca', 'servidor-principal'], isSelected: false },
    { id: 'calificaciones', name: 'Sistema de Calificaciones', icon: '📝', infectionLevel: 0, hasBackup: true, hasFirewall: false, connections: ['biblioteca', 'servidor-principal'], isSelected: false },
    { id: 'servidor-principal', name: 'Servidor Principal', icon: '🗄️', infectionLevel: 0, hasBackup: true, hasFirewall: false, connections: ['laboratorio', 'calificaciones'], isSelected: false }
  ],
  ransomwareProgress: 0,
  threatLevel: 1,
  playerResources: {
    tools: { antivirus: 3, firewall: 3, scanner: 2 },
    cluesFound: 0,
    hasDecryptionKey: false
  },
  currentTurn: 1,
  gamePhase: 'playerAction', // 'playerAction' | 'infection' | 'propagation'
  gameStatus: 'playing', // 'playing' | 'victory' | 'defeat'
  selectedSector: null,
  difficulty: 'escolar',
  timeElapsed: 0,
  turnsSinceRansomwareAdvance: 0, // New state variable
  eventLog: [],
  hintModal: { isOpen: false, message: '' }
};

const rollDice = () => Math.floor(Math.random() * 6) + 1;

const logEvent = (state, message, type = 'info') => {
  const newLog = [{ message, type, turn: state.currentTurn }, ...state.eventLog].slice(0, 10);
  return { ...state, eventLog: newLog };
};

const containSector = (state, sectorId) => {
  const sector = state.sectors.find(s => s.id === sectorId);
  const difficulty = state.difficulty;
  
  if (difficulty === 'escolar') {
    if (Math.random() <= 0.65) { // 65% success rate
      const newSectors = state.sectors.map(s => s.id === sectorId ? { ...s, hasFirewall: true } : s);
      let newState = { ...state, sectors: newSectors };
      return logEvent(newState, `✅ Firewall colocado en ${sector.name}`, 'success');
    } else {
      return logEvent(state, `❌ Fallo al contener ${sector.name}`, 'failure');
    }
  }

  // Original logic for other difficulties
  const successThreshold = 5;
  const diceRoll = rollDice();
  
  if (diceRoll >= successThreshold) {
    const newSectors = state.sectors.map(s => s.id === sectorId ? { ...s, hasFirewall: true } : s);
    let newState = { ...state, sectors: newSectors };
    return logEvent(newState, `✅ Firewall colocado en ${sector.name}`, 'success');
  } else {
    return logEvent(state, `❌ Fallo al contener ${sector.name}`, 'failure');
  }
};

const analyzeSector = (state, sectorId) => {
  const sector = state.sectors.find(s => s.id === sectorId);

  if (sector.infectionLevel !== 1) {
    return logEvent(state, `El análisis requiere que el sector esté infectado.`, 'warning');
  }

  if (state.difficulty === 'escolar') {
    if (Math.random() <= 0.65) { // 65% success rate
      // Clean the sector
      const newSectors = state.sectors.map(s => s.id === sectorId ? { ...s, infectionLevel: 0 } : s);
      let newState = { ...state, sectors: newSectors };
      newState = logEvent(newState, `💻 Sector ${sector.name} ha sido limpiado.`, 'success');
      
      // Also find a clue
      const newClues = newState.playerResources.cluesFound + 1;
      newState = { ...newState, playerResources: { ...newState.playerResources, cluesFound: newClues } };
      
      const cluesNeeded = newState.difficulty === 'escolar' ? 2 : 3;
      if (newClues >= cluesNeeded) {
        newState = { ...newState, playerResources: { ...newState.playerResources, hasDecryptionKey: true } };
        newState = logEvent(newState, '🗝️ ¡Clave de descifrado obtenida!', 'key');
      }
      
      return logEvent(newState, `🔍 Pista encontrada en ${sector.name}`, 'clue');
    } else {
      return logEvent(state, `No se encontraron pistas en ${sector.name}.`, 'info');
    }
  }

  // Original logic for other difficulties
  const diceRoll = rollDice();

  if (diceRoll >= 5) {
    const newClues = state.playerResources.cluesFound + 1;
    let newState = { ...state, playerResources: { ...state.playerResources, cluesFound: newClues } };
    
    const cluesNeeded = state.difficulty === 'escolar' ? 2 : 3; // 2 clues for escolar, 3 for other
    if (newClues >= cluesNeeded) {
      newState = { ...newState, playerResources: { ...newState.playerResources, hasDecryptionKey: true } };
      newState = logEvent(newState, '🗝️ ¡Clave de descifrado obtenida!', 'key');
    }

    return logEvent(newState, `🔍 Pista encontrada en ${sector.name}`, 'clue');
  } else {
    return logEvent(state, `No se encontraron pistas en ${sector.name}.`, 'info');
  }
};

const restoreSector = (state, sectorId) => {
  const sector = state.sectors.find(s => s.id === sectorId);

  if (sector.infectionLevel !== 2) {
    return logEvent(state, `La restauración requiere que el sector esté cifrado.`, 'warning');
  }

  if (!sector.hasBackup) {
    return logEvent(state, `❌ ${sector.name} no tiene backup disponible`, 'error');
  }

  if (state.difficulty === 'escolar') {
    if (Math.random() <= 0.65) { // 65% success rate
      const newSectors = state.sectors.map(s => 
        s.id === sectorId 
          ? { ...s, infectionLevel: 0, hasBackup: (s.id === 'servidor-principal' ? true : false) } 
          : s
      );
      let newState = { ...state, sectors: newSectors };
      return logEvent(newState, `💾 ${sector.name} restaurado exitosamente`, 'restore');
    } else { // Restoration failed for escolar difficulty
      const newSectors = state.sectors.map(s => 
        s.id === sectorId 
          ? { ...s, hasBackup: (s.id === 'servidor-principal' ? true : false) } 
          : s
      );
      let newState = { ...state, sectors: newSectors };
      return logEvent(newState, `❌ Falló la restauración de ${sector.name}`, 'failure');
    }
  }

  // Original logic for other difficulties
  const successThreshold = 5;
  const diceRoll = rollDice();

  if (diceRoll >= successThreshold) {
    const newSectors = state.sectors.map(s => 
      s.id === sectorId 
        ? { ...s, infectionLevel: 0, hasBackup: (s.id === 'servidor-principal' ? true : false) } 
        : s
    );
    let newState = { ...state, sectors: newSectors };
    return logEvent(newState, `💾 ${sector.name} restaurado exitosamente`, 'restore');
  } else {
    const newSectors = state.sectors.map(s => 
      s.id === sectorId 
        ? { ...s, hasBackup: (s.id === 'servidor-principal' ? true : false) } 
        : s
    );
    let newState = { ...state, sectors: newSectors };
    return logEvent(newState, `❌ Falló la restauración de ${sector.name}`, 'failure');
  }
};

const advanceTurn = (state) => {
  const newState = { ...state, currentTurn: state.currentTurn + 1 };
  return infectionPhase(newState);
};

const ransomwareEvents = [
  {
    id: 'email_malicioso',
    name: 'Correo Malicioso',
    probability: 0.3,
    effect: (state) => {
      const randomSector = state.sectors[Math.floor(Math.random() * state.sectors.length)];
      const newSectors = state.sectors.map(s => s.id === randomSector.id ? { ...s, infectionLevel: Math.min(s.infectionLevel + 1, 3) } : s);
      return { ...state, sectors: newSectors };
    },
    message: 'Un estudiante abrió un archivo adjunto sospechoso'
  },
  {
    id: 'usb_infectada',
    name: 'USB Maliciosa',
    probability: 0.25,
    effect: (state) => ({ ...state, ransomwareProgress: Math.min(state.ransomwareProgress + 10, 100) }),
    message: 'Se conectó una USB infectada al sistema'
  },
  {
    id: 'propagacion_rapida',
    name: 'Propagación Acelerada',
    probability: 0.2,
    effect: (state) => ({ ...state, threatLevel: Math.min(state.threatLevel + 1, 5) }),
    message: 'El malware encontró una vulnerabilidad de red'
  }
];

const selectRandomEvent = (events) => {
  const rand = Math.random();
  let cumulativeProbability = 0;
  for (const event of events) {
    cumulativeProbability += event.probability;
    if (rand <= cumulativeProbability) {
      return event;
    }
  }
  return events[events.length - 1]; // Fallback
};

const advanceRansomwareTracker = (state) => {
  if (state.difficulty === 'escolar') {
    const newTurnsSinceAdvance = state.turnsSinceRansomwareAdvance + 1;
    if (newTurnsSinceAdvance >= 2) { // Advance every 2 turns for escolar
      return {
        ...state,
        ransomwareProgress: Math.min(state.ransomwareProgress + 3, 100),
        turnsSinceRansomwareAdvance: 0 // Reset counter
      };
    } else {
      return { ...state, turnsSinceRansomwareAdvance: newTurnsSinceAdvance };
    }
  }
  // Default behavior for other difficulties (e.g., experto)
  return { ...state, ransomwareProgress: Math.min(state.ransomwareProgress + 3, 100) };
};

const triggerGameOver = (state, message) => {
  let newState = logEvent(state, message, 'failure');
  return { ...newState, gameStatus: 'defeat' };
};

const checkDefeatConditions = (state) => {
  if (state.ransomwareProgress >= 100) {
    return triggerGameOver(state, 'El ransomware cifró toda la red.');
  }

    const destroyedCount = state.sectors.filter(s => s.infectionLevel === 3).length;

    if (destroyedCount >= 2) { // Changed from 3 to 2

      return triggerGameOver(state, 'Demasiados sistemas destruidos.');

    }

  

    const criticalSectors = ['calificaciones', 'servidor-principal']; // 'administrativo' removed

    const criticalDestroyed = criticalSectors.filter(id => 

      state.sectors.find(s => s.id === id).infectionLevel === 3);
  if (criticalDestroyed.length >= 2) {
    return triggerGameOver(state, 'Sistemas críticos comprometidos.');
  }

  return state;
};

const infectionPhase = (state) => {
  const eventHints = {
    email_malicioso: 'Un sector ha sido infectado. Analízalo para buscar pistas o aíslalo con un firewall para evitar que la infección se propague.',
    usb_infectada: 'El progreso del ransomware ha aumentado. Concéntrate en restaurar sectores cifrados o analizar los infectados para obtener la clave de descifrado.',
    propagacion_rapida: '¡El nivel de amenaza ha subido! El ransomware es ahora más peligroso. Es crucial contener los sectores infectados para frenarlo.'
  };

  const selectedEvent = selectRandomEvent(ransomwareEvents);
  
  let newState = selectedEvent.effect(state);
  newState = logEvent(newState, `🦠 ${selectedEvent.message}`, 'infection');
  newState = advanceRansomwareTracker(newState);

  // Set hint modal
  const hintMessage = eventHints[selectedEvent.id];
  if (hintMessage) {
    newState = { ...newState, hintModal: { isOpen: true, message: hintMessage } };
  }
  
  newState = checkDefeatConditions(newState);

  if (newState.gameStatus === 'defeat') {
    return newState;
  }

  return propagationPhase(newState);
};

const propagationPhase = (state) => {
  let newState = { ...state };
  const infectedSectors = newState.sectors.filter(s => s.infectionLevel === 1);

  infectedSectors.forEach(sector => {
    const diceRoll = rollDice();
    
    if (diceRoll >= 6) { // Propagación exitosa
      const connectedSectors = sector.connections;
      const targetableSectors = newState.sectors.filter(s => connectedSectors.includes(s.id) && !s.hasFirewall && s.infectionLevel === 0);

      if (targetableSectors.length > 0) {
        const targetSector = targetableSectors[Math.floor(Math.random() * targetableSectors.length)];
        const newSectors = newState.sectors.map(s => s.id === targetSector.id ? { ...s, infectionLevel: 1 } : s);
        newState = { ...newState, sectors: newSectors };
        newState = logEvent(newState, `📡 Propagación: ${sector.name} → ${targetSector.name}`, 'propagation');
      }
    }
  });

  // Firewalls will be reset at the start of the player's next turn
  newState = { ...newState, gamePhase: 'playerAction' };

  return newState;
};

const triggerVictory = (state) => {
  let newState = logEvent(state, '🏆 ¡Has salvado la red del colegio!', 'victory');
  return { ...newState, gameStatus: 'victory' };
};

const checkVictoryConditions = (state) => {
  const allSectorsClean = state.sectors.every(s => s.infectionLevel === 0);
  const hasKey = state.playerResources.hasDecryptionKey;

  if (allSectorsClean && hasKey) {
    return triggerVictory(state);
  }

  return state;
};

export const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_SECTOR':
      return {
        ...state,
        sectors: state.sectors.map(s => 
          s.id === action.sectorId 
            ? { ...s, isSelected: !s.isSelected } 
            : { ...s, isSelected: false }
        ),
        selectedSector: state.selectedSector === action.sectorId ? null : action.sectorId
      };
    case 'PERFORM_ACTION': {
      // Reset firewalls from the previous turn at the beginning of the player's action
      const sectorsWithResetFirewalls = state.sectors.map(s => ({ ...s, hasFirewall: false }));
      const stateAfterFirewallReset = { ...state, sectors: sectorsWithResetFirewalls };

      if (!stateAfterFirewallReset.selectedSector || stateAfterFirewallReset.gamePhase !== 'playerAction') return stateAfterFirewallReset;

      let newState;
      switch (action.actionType) {
        case 'contain':
          newState = containSector(stateAfterFirewallReset, stateAfterFirewallReset.selectedSector);
          break;
        case 'analyze':
          newState = analyzeSector(stateAfterFirewallReset, stateAfterFirewallReset.selectedSector);
          break;
        case 'restore':
          newState = restoreSector(stateAfterFirewallReset, stateAfterFirewallReset.selectedSector);
          break;
        default:
          return stateAfterFirewallReset;
      }

      newState = checkVictoryConditions(newState);
      if (newState.gameStatus === 'victory') {
        return newState;
      }

      return advanceTurn({ ...newState, gamePhase: 'infection' });
    }
    case 'ADVANCE_TURN': {
      if (state.gamePhase !== 'playerAction') return state;
      return advanceTurn({ ...state, gamePhase: 'infection' });
    }
    case 'CLOSE_HINT_MODAL':
      return { ...state, hintModal: { isOpen: false, message: '' } };
    default:
      return state;
  }
};
