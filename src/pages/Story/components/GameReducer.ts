import { GameAction, GameState } from "../scripts/Interfaces";

//Reduce the game context, allows to modify the status of the context of the game from any component
export const GameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'SET_SCREEN': //Modify the current screen
            return { ...state, screen_id: action.payload };
        case 'SET_LIVES': //Modify the lives
            return { ...state, lives_left: action.payload };
        case 'SET_ANSWER': //Modify the id of the last answer, needed to show the learning pill
            return { ...state, answer_id: action.payload };
        case 'INITIALIZE_STATE':  //Initialize the status of the game at the begining 
            return { ...state, ...action.payload };
    }
};
