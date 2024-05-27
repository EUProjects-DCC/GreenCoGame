import React from 'react';
import { GameContextType } from '../scripts/Interfaces';

const GameContext = React.createContext<GameContextType>({} as GameContextType); //Context with the information of the game

export default GameContext;
