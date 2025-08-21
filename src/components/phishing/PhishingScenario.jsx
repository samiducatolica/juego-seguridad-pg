import { useState } from 'react';
import './PhishingScenario.css';
import emailData from '../../scenarios/scenario1/phishing_emails_dataset.json';
import ShellContext from '../shared/ShellContext.jsx';

const introContent = `
# 🛡️ ¡Bienvenido al Detector de Correos Falsos! 🛡️

**¡Hola {{NOMBRE_APELLIDO}}!**

Eres estudiante de 5° grado en el **Colegio Ciber Genios del Futuro** y tienes una misión muy importante: convertirte en un experto detective digital. Tu tarea será identificar qué correos electrónicos son reales y cuáles son intentos de **phishing** (correos fraudulentos que intentan engañarte).

## 📧 **Datos de tu Colegio**
- **Nombre:** Colegio Ciber Genios del Futuro
- **Tu correo:** {{CORREO_USUARIO}}@geniosfuturo.edu.co
- **Dominio oficial:** @geniosfuturo.edu.co

### 👨‍🏫 **Tus Profesores:**
- Juan Pérez: juan.perez@geniosfuturo.edu.co
- María Fernanda Rodríguez: mariaf.rodriguez@geniosfuturo.edu.co
- Esteban Andrés Medina: eandres.medina@geniosfuturo.edu.co
- Samaury Camargo: samaury.camargo@geniosfuturo.edu.co

## 🎯 **¿Cómo Jugar?**

Recibirás diferentes correos electrónicos. Tu misión es decidir si cada correo es **REAL** o **FALSO** (phishing). Para cada correo, tendrás dos opciones:

- ✅ **CORREO REAL** - Es un correo legítimo de tu colegio
- ❌ **CORREO FALSO** - Es un intento de phishing que debes evitar

## 🔍 **Consejos del Detective Digital**

Antes de decidir si un correo es real o falso, revisa estos elementos importantes:

### 1. **Verifica el Remitente**
- ¿El correo viene de un profesor conocido?
- ¿La dirección de correo termina en @geniosfuturo.edu.co?
- ¿El nombre del remitente coincide con los profesores de tu colegio?

### 2. **Analiza el Contenido**
- ¿El mensaje suena como algo que diría tu profesor?
- ¿Te pide información personal como contraseñas o datos privados?
- ¿Hay errores de ortografía o palabras extrañas?

### 3. **Examina los Enlaces**
- ¿Los enlaces van a páginas del colegio?
- ¿Te piden hacer clic urgentemente en algún enlace sospechoso?

### 4. **Detecta la Urgencia Falsa**
- ¿El correo dice que debes actuar "INMEDIATAMENTE"?
- ¿Amenaza con cerrar tu cuenta o castigarte si no respondes rápido?

### 5. **Solicitudes Sospechosas**
- ¿Te piden tu contraseña, número de documento o información de tus padres?
- ¿Te piden dinero o información bancaria?

## ⚠️ **Recuerda:**

- **NUNCA** compartas tus contraseñas por correo
- Los profesores **NUNCA** te pedirán información personal por correo
- Si tienes dudas, pregunta a tus profesores en persona
- Los correos reales del colegio siempre vienen del dominio @geniosfuturo.edu.co

## 🚀 **¡Comencemos la Aventura!**

Ahora que conoces las reglas y consejos, estás listo para convertirte en un experto detector de phishing. ¡Cada correo que identifiques correctamente te ayudará a proteger no solo tus datos, sino también los de tus compañeros!

**¿Estás listo para comenzar tu misión como Detective Digital?**

¡Adelante!
`;

const PhishingScenario = ({ onBack }) => {
    const [gameState, setGameState] = useState('intro'); // intro, playing, finished
    const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState({ message: '', type: '' }); // type: correct, incorrect

    const currentEmail = emailData.emails[currentEmailIndex];

    const handleStartGame = () => {
        setGameState('playing');
    };

    const handleAnswer = (answer) => {
        const isCorrect = answer === currentEmail.tipo;
        if (isCorrect) {
            setScore(score + 1);
            setFeedback({ message: '¡Correcto! Buen trabajo, detective.', type: 'correct' });
        } else {
            setFeedback({ message: '¡Cuidado! Este correo era '+currentEmail.tipo+'.', type: 'incorrect' });
        }

        setTimeout(() => {
            if (currentEmailIndex < emailData.emails.length - 1) {
                setCurrentEmailIndex(currentEmailIndex + 1);
                setFeedback({ message: '', type: '' });
            } else {
                setGameState('finished');
            }
        }, 2000);
    };

    if (gameState === 'intro') {
        return (
            <ShellContext 
                markdownContent={introContent} 
                onStart={handleStartGame} 
                onBack={onBack} 
            />
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="phishing-container">
                <h2>¡Juego Terminado!</h2>
                <p>Tu puntuación final es: {score} de {emailData.emails.length}</p>
                <button onClick={onBack} className="scenario-btn back-btn">Volver al Menú</button>
            </div>
        );
    }

    return (
        <div className="phishing-container">
            <h2>Correo {currentEmailIndex + 1} de {emailData.emails.length}</h2>
            <div className="email-container">
                <div className="email-header">
                    <p><strong>De:</strong> {currentEmail.nombre_remitente} &lt;{currentEmail.remitente}&gt;</p>
                    <p><strong>Asunto:</strong> {currentEmail.asunto}</p>
                </div>
                <div className="email-body">
                    <p>{currentEmail.contenido.replace(/\n/g, '<br />')}</p>
                </div>
            </div>

            <div className="email-actions">
                <button onClick={() => handleAnswer('falso')} className="action-btn phishy-btn">Es Falso (Phishing)</button>
                <button onClick={() => handleAnswer('real')} className="action-btn safe-btn">Es Real</button>
            </div>

            {feedback.message && (
                <div className={`feedback {feedback.type}`}>
                    {feedback.message}
                </div>
            )}
             <button onClick={onBack} className="scenario-btn back-btn">Volver al Menú</button>
        </div>
    );
};

export default PhishingScenario;