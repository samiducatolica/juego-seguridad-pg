
export const initialState = {
  sectors: [
    { id: 'biblioteca', name: 'Biblioteca Digital', icon: '📚', infectionLevel: 0, hasBackup: true, hasFirewall: false, connections: ['laboratorio', 'calificaciones'], isSelected: false },
    { id: 'laboratorio', name: 'Laboratorio de PC', icon: '💻', infectionLevel: 0, hasBackup: true, hasFirewall: false, connections: ['biblioteca', 'servidor-principal'], isSelected: false },
    { id: 'calificaciones', name: 'Sistema de Calificaciones', icon: '📝', infectionLevel: 0, hasBackup: true, hasFirewall: false, connections: ['biblioteca', 'servidor-principal'], isSelected: false },
    { id: 'servidor-principal', name: 'Servidor Principal', icon: '🗄️', infectionLevel: 0, hasBackup: false, hasFirewall: false, connections: ['laboratorio', 'calificaciones', 'administrativo'], isSelected: false },
    { id: 'administrativo', name: 'Oficinas Administrativas', icon: '💼', infectionLevel: 0, hasBackup: true, hasFirewall: false, connections: ['servidor-principal', 'red-invitados'], isSelected: false },
    { id: 'red-invitados', name: 'Red de Invitados', icon: '📶', infectionLevel: 0, hasBackup: false, hasFirewall: false, connections: ['administrativo'], isSelected: false }
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
  eventLog: []
};

const rollDice = () => Math.floor(Math.random() * 6) + 1;

const logEvent = (state, message, type = 'info') => {
  const newLog = [{ message, type, turn: state.currentTurn }, ...state.eventLog].slice(0, 10);
  return { ...state, eventLog: newLog };
};

const containSector = (state, sectorId) => {
  const sector = state.sectors.find(s => s.id === sectorId);
  const difficulty = state.difficulty;
  const successThreshold = difficulty === 'escolar' ? 3 : 5;
  
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

  const diceRoll = rollDice();

  if (diceRoll >= 5) {
    const newClues = state.playerResources.cluesFound + 1;
    let newState = { ...state, playerResources: { ...state.playerResources, cluesFound: newClues } };
    
    if (newClues >= 3) {
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

  const difficulty = state.difficulty;
  const successThreshold = difficulty === 'escolar' ? 3 : 5;
  const diceRoll = rollDice();

  if (diceRoll >= successThreshold) {
    const newSectors = state.sectors.map(s => s.id === sectorId ? { ...s, infectionLevel: 0, hasBackup: false } : s);
    let newState = { ...state, sectors: newSectors };
    return logEvent(newState, `💾 ${sector.name} restaurado exitosamente`, 'restore');
  } else {
    const newSectors = state.sectors.map(s => s.id === sectorId ? { ...s, hasBackup: false } : s);
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
  if (destroyedCount >= 3) {
    return triggerGameOver(state, 'Demasiados sistemas destruidos.');
  }

  const criticalSectors = ['calificaciones', 'servidor-principal'];
  const criticalDestroyed = criticalSectors.filter(id => state.sectors.find(s => s.id === id).infectionLevel === 3);
  if (criticalDestroyed.length >= 2) {
    return triggerGameOver(state, 'Sistemas críticos comprometidos.');
  }

  return state;
};

const infectionPhase = (state) => {
  const selectedEvent = selectRandomEvent(ransomwareEvents);
  
  let newState = selectedEvent.effect(state);
  newState = logEvent(newState, `🦠 ${selectedEvent.message}`, 'infection');
  newState = advanceRansomwareTracker(newState);
  
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

  // Reset firewalls
  const newSectors = newState.sectors.map(s => ({ ...s, hasFirewall: false }));
  newState = { ...newState, sectors: newSectors, gamePhase: 'playerAction' };

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
      if (!state.selectedSector || state.gamePhase !== 'playerAction') return state;

      let newState;
      switch (action.actionType) {
        case 'contain':
          newState = containSector(state, state.selectedSector);
          break;
        case 'analyze':
          newState = analyzeSector(state, state.selectedSector);
          break;
        case 'restore':
          newState = restoreSector(state, state.selectedSector);
          break;
        default:
          return state;
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
    default:
      return state;
  }
};
