# contexto del proyecto
Este proyecto es un viedo juego secillo para la enseñansa de  consptos de ciberseguridad para niños entre 9 y 16 años, se implementara un menu inicial con cuatro escenarios
mediante botones, los escenarios seran pishing, rasonware, contraseñas seguras pendiente a determinar el ultimo escenario

# Instruccones del proyecto
1. El juego se desarrollara utilizando las mejores practicas de desarrollo web, utilizando HTML, CSS y JavaScript.
2. El juego debe ser responsivo y funcionar en dispositivos móviles y de escritorio.
3. El juego debe ser accesible para personas con discapacidades.
4. El juego debe ser seguro y no recopilar datos personales de los usuarios.
5. El juego debe tener una interfaz amigable y atractiva para el público objetivo.
6. El juego debe incluir un sistema de puntuación y recompensas para motivar a losusuarios.
7. El juego debe incluir un sistema de ayuda o tutorial para guiar a los usuarios
8. El juego debe incluir un sistema de retroalimentación para informar a los usuarios sobre su progreso y desempeño.
9. El juego debe incluir un sistema de niveles o etapas para aumentar la dificultad
   progresivamente.
10. El juego debe incluir un sistema de logros o medallas para reconocer el progreso de los usuarios.
11. El juego debe incluir un sistema de música y efectos de sonido para mejorar la
    experiencia del usuario.
12. El juego debe desarrollarse utilizando la euristica de nielsen de diseño y desarrollo web modernas, como HTML5, CSS3 y JavaScript
13. El juego debe desarrollarse utilizando un enfoque modular y reutilizable.
14. El juego debe usar las mejores practicas de seguirdad y desarrollo web..


## escenario 1
* El escenario de pishing  pesentara al inicio  un texto de contexto el cual se encuentra en src/data/scenario1/phishing_game_intro.md
* Los datos para la emulacion de los correos se encuentra en src/data/scenario1/phishing_emails_dataset.json
## fin escenario 1

## escenario 2
# **Desarrollo del Escenario Ransomware: Arquitectura y Lógica de Juego**

## **1. Arquitectura del Sistema de Juego**

### **1.1 Estado Global del Juego (Game State)**

El estado del juego se estructura como un objeto JavaScript centralizado que controla todos los aspectos de la partida:

```javascript
gameState = {
  // Estado de los sectores del colegio
  sectors: [
    {
      id: 'biblioteca',
      name: 'Biblioteca Digital',
      icon: '📚',
      infectionLevel: 0, // 0=Normal, 1=Infectado, 2=Cifrado, 3=Destruido
      hasBackup: true,
      hasFirewall: false,
      connections: ['laboratorio', 'calificaciones'],
      isSelected: false
    },
    // ... 5 sectores más
  ],
  
  // Progreso del ransomware
  ransomwareProgress: 0, // 0-100%
  threatLevel: 1, // 1-5 niveles de amenaza
  
  // Recursos del jugador
  playerResources: {
    tools: {
      antivirus: 2,
      firewall: 1,
      scanner: 1
    },
    cluesFound: 0, // 0-3 pistas para la clave
    hasDecryptionKey: false
  },
  
  // Estado de la partida
  currentTurn: 1,
  gamePhase: 'playerAction', // 'playerAction' | 'infection' | 'propagation'
  gameStatus: 'playing', // 'playing' | 'victory' | 'defeat'
  selectedSector: null,
  
  // Configuración
  difficulty: 'escolar', // 'escolar' | 'experto'
  timeElapsed: 0
}
```

### **1.2 Sistema de Sectores**

Cada sector del colegio tiene propiedades específicas que determinan su comportamiento:

- **Estados de Infección**: Progresión lineal de Normal → Infectado → Cifrado → Destruido
- **Conexiones**: Red de sectores interconectados por la cual se propaga el malware
- **Recursos**: Backups como elemento crítico para la restauración
- **Firewalls Temporales**: Protección que se resetea cada turno

### **1.3 Motor de Eventos de Ransomware**

Sistema de cartas virtuales que simula los ataques del ransomware:

```javascript
ransomwareEvents = [
  {
    id: 'email_malicioso',
    name: 'Correo Malicioso',
    probability: 0.3,
    effect: (gameState) => infectSector(getRandomSector()),
    message: 'Un estudiante abrió un archivo adjunto sospechoso'
  },
  {
    id: 'usb_infectada',
    name: 'USB Maliciosa',
    probability: 0.25,
    effect: (gameState) => advanceRansomwareTrack(2),
    message: 'Se conectó una USB infectada al sistema'
  },
  {
    id: 'propagacion_rapida',
    name: 'Propagación Acelerada',
    probability: 0.2,
    effect: (gameState) => triggerMassivePropagation(),
    message: 'El malware encontró una vulnerabilidad de red'
  }
]
```

## **2. Flujo de Juego Detallado**

### **2.1 Fase de Acción del Jugador**

El jugador selecciona un sector y puede realizar UNA acción por turno:

#### **Acción: Contener (Colocar Firewall)**
```javascript
function containSector(sectorId) {
  const sector = getSectorById(sectorId);
  const difficulty = gameState.difficulty;
  const successThreshold = difficulty === 'escolar' ? 4 : 5;
  
  const diceRoll = rollDice(); // 1-6
  
  if (diceRoll >= successThreshold) {
    sector.hasFirewall = true;
    logEvent(`✅ Firewall colocado en ${sector.name}`, 'success');
    return true;
  } else {
    logEvent(`❌ Fallo al contener ${sector.name}`, 'failure');
    return false;
  }
}
```

#### **Acción: Analizar (Buscar Pistas)**
```javascript
function analyzeSector(sectorId) {
  const sector = getSectorById(sectorId);
  
  // Solo se puede analizar sectores infectados
  if (sector.infectionLevel !== 1) {
    return false;
  }
  
  const diceRoll = rollDice();
  
  if (diceRoll === 6) { // Éxito solo con 6
    gameState.playerResources.cluesFound++;
    logEvent(`🔍 Pista encontrada en ${sector.name}`, 'clue');
    
    // Al encontrar 3 pistas, obtener clave de descifrado
    if (gameState.playerResources.cluesFound >= 3) {
      gameState.playerResources.hasDecryptionKey = true;
      logEvent('🗝️ ¡Clave de descifrado obtenida!', 'key');
    }
    return true;
  }
  
  return false;
}
```

#### **Acción: Restaurar (Usar Backup)**
```javascript
function restoreSector(sectorId) {
  const sector = getSectorById(sectorId);
  
  // Solo sectores cifrados pueden restaurarse
  if (sector.infectionLevel !== 2) {
    return false;
  }
  
  // Requiere backup obligatoriamente
  if (!sector.hasBackup) {
    logEvent(`❌ ${sector.name} no tiene backup disponible`, 'error');
    return false;
  }
  
  const difficulty = gameState.difficulty;
  const successThreshold = difficulty === 'escolar' ? 4 : 5;
  const diceRoll = rollDice();
  
  if (diceRoll >= successThreshold) {
    sector.infectionLevel = 0; // Restaurar a Normal
    sector.hasBackup = false; // Consumir backup
    logEvent(`💾 ${sector.name} restaurado exitosamente`, 'restore');
    return true;
  } else {
    sector.hasBackup = false; // Backup se consume aunque falle
    logEvent(`❌ Falló la restauración de ${sector.name}`, 'failure');
    return false;
  }
}
```

### **2.2 Fase de Infección**

Después de cada acción del jugador, se ejecuta un evento de ransomware:

```javascript
function infectionPhase() {
  // Seleccionar evento aleatorio basado en probabilidades
  const selectedEvent = selectRandomEvent(ransomwareEvents);
  
  // Aplicar efecto del evento
  selectedEvent.effect(gameState);
  
  // Registrar en el log
  logEvent(`🦠 ${selectedEvent.message}`, 'infection');
  
  // Avanzar tracker de ransomware
  advanceRansomwareTracker();
  
  // Verificar condiciones de derrota
  checkDefeatConditions();
}
```

### **2.3 Fase de Propagación**

La infección se propaga automáticamente desde sectores infectados:

```javascript
function propagationPhase() {
  const infectedSectors = gameState.sectors.filter(s => s.infectionLevel === 1);
  
  infectedSectors.forEach(sector => {
    const diceRoll = rollDice();
    
    if (diceRoll >= 5) { // Propagación exitosa
      // Seleccionar sector conectado sin firewall
      const targetSector = selectPropagationTarget(sector);
      
      if (targetSector && !targetSector.hasFirewall) {
        infectionLevel++;
        logEvent(`📡 Propagación: ${sector.name} → ${targetSector.name}`, 'propagation');
      }
    }
  });
  
  // Resetear firewalls temporales
  gameState.sectors.forEach(sector => {
    sector.hasFirewall = false;
  });
}
```

## **3. Sistema de Dificultad Adaptativa**

### **3.1 Nivel Escolar (9-12 años)**

**Características Simplificadas:**
- 4 sectores en lugar de 6
- Umbrales de éxito más bajos (4+ en dados)
- Ransomware avanza más lento (cada 3 turnos)
- Eventos menos punitivos
- Más herramientas iniciales

```javascript
const escolarConfig = {
  sectors: 4,
  successThreshold: 4,
  initialTools: { antivirus: 3, firewall: 2, scanner: 2 },
  ransomwareSpeed: 0.3,
  maxCluesRequired: 2
}
```

### **3.2 Nivel Experto (13-16 años)**

**Características Avanzadas:**
- 6 sectores completos
- Umbrales más altos (5+ en dados)
- Eventos de "Doble Extorsión"
- Sistema de "Parches de Seguridad"
- Recursos limitados

```javascript
const expertoConfig = {
  sectors: 6,
  successThreshold: 5,
  initialTools: { antivirus: 2, firewall: 1, scanner: 1 },
  ransomwareSpeed: 0.5,
  specialEvents: ['doble_extorsion', 'vulnerabilidad_zero_day'],
  patchSystem: true
}
```

## **4. Condiciones de Victoria y Derrota**

### **4.1 Condiciones de Derrota**

```javascript
function checkDefeatConditions() {
  // Ransomware completó la vuelta
  if (gameState.ransomwareProgress >= 100) {
    triggerGameOver('El ransomware cifró toda la red');
    return true;
  }
  
  // Demasiados sectores destruidos
  const destroyedCount = gameState.sectors.filter(s => s.infectionLevel === 3).length;
  if (destroyedCount >= 3) {
    triggerGameOver('Demasiados sistemas destruidos');
    return true;
  }
  
  // Sistemas críticos destruidos
  const criticalSectors = ['calificaciones', 'servidor-principal'];
  const criticalDestroyed = criticalSectors.filter(id => 
    getSectorById(id).infectionLevel === 3
  );
  
  if (criticalDestroyed.length >= 2) {
    triggerGameOver('Sistemas críticos comprometidos');
    return true;
  }
  
  return false;
}
```

### **4.2 Condiciones de Victoria**

```javascript
function checkVictoryConditions() {
  // Todos los sectores restaurados
  const allSectorsClean = gameState.sectors.every(s => s.infectionLevel === 0);
  
  // Clave de descifrado obtenida
  const hasKey = gameState.playerResources.hasDecryptionKey;
  
  if (allSectorsClean && hasKey) {
    triggerVictory();
    return true;
  }
  
  return false;
}
```

## **5. Sistema de Aprendizaje Integrado**

### **5.1 Lecciones por Mecánica**

**Importancia de Backups:**
- Sin backup = imposible restaurar
- Cada restauración consume el backup
- Enseña planificación de recursos

**No Pagar el Rescate:**
- No existe mecánica de "pago"
- Victoria solo mediante prevención/restauración
- Refuerza la política correcta

**Propagación Realista:**
- Infección se extiende por conexiones de red
- Firewalls bloquean propagación temporalmente
- Simula desconexión de equipos infectados

### **5.2 Feedback Educativo**

```javascript
const educationalMessages = {
  backup_used: "💡 Los backups son tu mejor defensa contra ransomware",
  no_backup: "⚠️ Sin backup, los datos cifrados se pierden para siempre",
  firewall_success: "🛡️ Los firewalls ayudan a contener las amenazas",
  propagation_blocked: "✋ Desconectar equipos infectados evita la propagación",
  clue_found: "🔍 Analizar malware puede revelar vulnerabilidades"
}
```

## **6. Arquitectura Técnica para React**

### **6.1 Componentes Principales**

```javascript
// Componente raíz del juego
<RansomwareGame>
  <GameHeader />
  <GameBoard>
    <SectorGrid>
      <SectorCard />
      <ConnectionLines />
    </SectorGrid>
  </GameBoard>
  <SidePanel>
    <CluesTracker />
    <ToolsInventory />
    <EventLog />
  </SidePanel>
  <ActionPanel />
</RansomwareGame>
```

### **6.2 Gestión de Estado**

**useReducer para estado complejo:**
```javascript
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_SECTOR':
      return { ...state, selectedSector: action.sectorId };
    case 'PERFORM_ACTION':
      return performPlayerAction(state, action);
    case 'INFECTION_PHASE':
      return processInfectionPhase(state);
    case 'PROPAGATION_PHASE':
      return processPropagationPhase(state);
    default:
      return state;
  }
}
```

### **6.3 Hooks Personalizados**

```javascript
// Hook para la lógica del juego
function useRansomwareGame(difficulty) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  
  const selectSector = (sectorId) => {
    dispatch({ type: 'SELECT_SECTOR', sectorId });
  };
  
  const performAction = (actionType) => {
    dispatch({ type: 'PERFORM_ACTION', actionType });
  };
  
  return { gameState, selectSector, performAction };
}
```

## **7. Escalabilidad y Extensiones**

### **7.1 Nuevos Tipos de Malware**
- Cryptojacking miners
- Spyware de datos escolares
- Worms de red

### **7.2 Herramientas Avanzadas**
- Honeypots para detectar atacantes
- Sistemas de respaldo en tiempo real
- Análisis forense automatizado

### **7.3 Métricas y Analytics**
- Tiempo de resolución por dificultad
- Estrategias más efectivas
- Patrones de aprendizaje del jugador

Este diseño crea una experiencia de juego educativa robusta que enseña ciberseguridad a través de mecánicas de juego auténticas, donde cada decisión del jugador tiene consecuencias realistas y cada victoria se logra aplicando principios correctos de seguridad digital.
## fin escenario 2
