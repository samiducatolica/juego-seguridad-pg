import React from 'react';
import SectorCard from './SectorCard';
import './GameBoard.css';

const GameBoard = ({sectors, dispatch}) => {
    return (
        <div className="school-network">
            {/* Connection lines will be added here */}
            {sectors.map(sector => (
                <SectorCard key={sector.id} sector={sector} dispatch={dispatch}/>
            ))}
        </div>

    );
};

export default GameBoard;