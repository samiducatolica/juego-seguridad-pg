import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, actions }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {title && <h2>{title}</h2>}
                <div className="modal-body">
                    {children}
                </div>
                {actions && <div className="modal-actions">{actions}</div>}
            </div>
        </div>
    );
};

export default Modal;