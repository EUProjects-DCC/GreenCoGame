import { Dispatch } from "react";

//Interface for components
export interface ComponentProps {
    component_id: number
    screen_id?: number;
    change_screen?: React.Dispatch<React.SetStateAction<number>>;
    visible?: boolean;
    submitAnswers: Function;
    isSelect?: boolean;
}

//Interface for questions
export type Answer = {
    question_id: number;
    answer: string;
};

export interface Text {
    name: string,
    text: string
}

//Interface for user's information
export interface UserState {
    token: string | null;
    alias: string | null;
    avatar: string | null;
    points: number;
    language_id: number;
    difficulty_id: number | null;
    planet_id: number | null;
}

//Interface to reduce the user's context
export type UserAction =
    | { type: 'SET_TOKEN'; payload: string }
    | { type: 'SET_ALIAS'; payload: string }
    | { type: 'SET_AVATAR'; payload: string }
    | { type: 'SET_POINTS'; payload: number }
    | { type: 'SET_LANGUAGE'; payload: number }
    | { type: 'SET_DIFFICULTY'; payload: number }
    | { type: 'SET_PLANET'; payload: number }
    | { type: 'INITIALIZE_STATE'; payload: UserState };

//Interface for user's context
export interface UserContextType {
    state: UserState;
    dispatch: Dispatch<UserAction>;
}

//Interface for game state
export interface GameState {
    screen_id: number | null;
    level_id: number | null;
    lives_left: number;
    answer_id: number | null;
    difficulty_id: number | null;
    planet_id: number | null;
}

//Interface to reduce game's context
export type GameAction =
    | { type: 'SET_SCREEN'; payload: number }
    | { type: 'SET_LIVES'; payload: number }
    | { type: 'SET_ANSWER'; payload: number }
    | { type: 'INITIALIZE_STATE'; payload: GameState };

//Interface for game context
export interface GameContextType {
    state: GameState;
    dispatch: Dispatch<GameAction>;
}

//Interface to manage levels
export interface LevelState {
    wrong_answers: number;
    addWrongAnswer: () => void;
}