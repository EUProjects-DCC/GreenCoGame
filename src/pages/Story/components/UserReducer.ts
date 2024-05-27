import { UserAction, UserState } from "../scripts/Interfaces";

//Reduce user's context, allows modify the status of user's context from any component 
export const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case 'SET_TOKEN': //Modify the user's token
            return { ...state, token: action.payload };
        case 'SET_ALIAS': //Modify the user's alias
            return { ...state, alias: action.payload };
        case 'SET_POINTS': //Modify the points of the user
            return { ...state, points: action.payload };
        case 'SET_LANGUAGE': //Modify the user's language
            return { ...state, language_id: action.payload };
        case 'SET_DIFFICULTY': //Modify the difficulty
            return { ...state, difficulty_id: action.payload };
        case 'SET_PLANET': //Modify the planet
            return { ...state, planet_id: action.payload };
        case 'INITIALIZE_STATE': //Initialize the status of the user
            return { ...state, ...action.payload };
        default:
            return state;
    }
};
