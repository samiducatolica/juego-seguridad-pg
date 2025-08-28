import scenarios from '../../scenarios/menu/escenarios_list.json';
import './Menu.css';

const Menu = ({ onSelectScenario }) => {
    return (
        <div className="main-content">
            <div className="scenarios-panel">
                <h2 className="panel-title">🎮 Selecciona tu Misión de Seguridad</h2>

                <div className="scenarios-grid">
                    {scenarios.escenarios.map(scenario => (
                        <div key={scenario.id} className={`scenario-card ${scenario.nombre}`}>
                            <div className="scenario-header">
                                <div className="scenario-icon">{scenario.icon}</div>
                                <div className={`difficulty-badge difficulty-${scenario.dificultad.toLowerCase()}`}>{scenario.dificultad}</div>
                            </div>
                            <h3 className="scenario-title">{scenario.titulo}</h3>
                            <p className="scenario-description" dangerouslySetInnerHTML={{ __html: scenario.descripcion }}></p>
                            <div className="scenario-stats">
                                {scenario.estadisticas.map((stat, index) => (
                                    <>
                                        <div key={`${index}-tiempo`} className="stat-item">
                                            <span>⏱️</span>
                                            <span>{stat.tiempo}</span>
                                        </div>
                                        <div key={`${index}-tipo`} className="stat-item">
                                            <span>🎯</span>
                                            <span>{stat.tipo}</span>
                                        </div>
                                        <div key={`${index}-objetivo`} className="stat-item">
                                            <span>📚</span>
                                            <span>{stat.objetivo}</span>
                                        </div>
                                    </>
                                ))}
                            </div>
                            <button onClick={() => onSelectScenario(scenario.nombre)} className="scenario-btn">
                                Jugar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Menu;
