import scenariosJson from "../../scenarios/menu/escenarios_list.json";
import './Menu.css';


const EscenarioStats = ({stadistica, index}) => {
    return (
        <>
            <div key={`${index}-tiempo`} className="stat-item">
                <span>⏱️</span>
                <span>{stadistica.tiempo}</span>
            </div>
            <div key={`${index}-tipo`} className="stat-item">
                <span>🎯</span>
                <span>{stadistica.tipo}</span>
            </div>
            <div key={`${index}-objetivo`} className="stat-item">
                <span>📚</span>
                <span>{stadistica.objetivo}</span>
            </div>
        </>
    )
}

const Escenario = ({escenarioInfo, onSelectScenario}) => {
    // console.log("Datos del escenario: ",escenarioInfo)
    return (
        <div key={escenarioInfo.id}
             className={`scenario-card ${escenarioInfo.nombre}`}
             onClick={
                 () => onSelectScenario(escenarioInfo.nombre)
             }>
            <div className={"scenario-header"}>
                <div className="scenario-icon">{escenarioInfo.icon}</div>
                <div
                    className={`difficulty-badge difficulty-${escenarioInfo.dificultad.toLowerCase()}`}>{escenarioInfo.dificultad}</div>
            </div>
            <h3 className="scenario-title">{escenarioInfo.titulo}</h3>
            <p className="scenario-description" dangerouslySetInnerHTML={{__html: escenarioInfo.descripcion}}></p>
            <div className="scenario-stats">
                {escenarioInfo.estadisticas.map((stat, index) => (
                        <EscenarioStats key={index} stadistica={stat} index={index}/>
                    )
                )}
            </div>
        </div>

    )
}

const Menu = ({onSelectScenario}) => {
    return (
        <div className="main-content">
            <div className="scenarios-panel">
                <h2 className="panel-title">🎮 Selecciona tu Misión de Seguridad</h2>

                <div className="scenarios-grid">
                    {scenariosJson.escenarios.map(juego => (
                        <Escenario key={juego.id}
                                   escenarioInfo={juego}
                                   onSelectScenario={onSelectScenario}
                        />
                    ))}
                </div>
            </div>
            {/*<div className="side-panel"></div>*/}
        </div>
    );
};

export default Menu;
