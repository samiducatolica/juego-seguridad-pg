import { useState } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && lastName) {
            onSubmit(name, lastName);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>¡Bienvenido, Detective!</h2>
                <p>Para comenzar, por favor ingresa tu nombre y apellido.</p>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Nombre" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Apellido" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <button type="submit">Comenzar Misión</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
