import { useContext, useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router";
import { GameReducer } from "./components/GameReducer";
import { GameState } from "./scripts/Interfaces";
import { getLastScreen } from "./scripts/fetch";
import GameContext from "./components/GameContext";
import UserContext from "./components/UserContext";
import Story from "./pages/Story";
import '../GreenCo.css';

interface LevelProps {
  screen_id?: number, // id of the initial screen
  level_id?: number, // id of level
  planet_id?: number, // id of plante
  difficulty_id?: number, // id of difficulty
}
const App:React.FC<LevelProps> = ({screen_id,level_id, planet_id, difficulty_id}) => {
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  const {state:UserState} = useContext(UserContext) // Get user's context
  const initialState :GameState = { // Initial state of the game
    screen_id: screen_id ?? 1 , // id of the current screen (if there are not in pops initialize to 1)
    level_id: level_id ?? 1, // id of current level (if there are not in pops initialize to 1)
    planet_id: sessionStorage.getItem('planet') ? Number(sessionStorage.getItem('planet')) : 1, //id of current planet (if there are not in pops initialize to 1)
    difficulty_id: sessionStorage.getItem('difficulty') ? Number(sessionStorage.getItem('difficulty')) : 1, //id of difficulty (if there are not in pops initialize to 1)
    lives_left: sessionStorage.getItem('difficulty') ? (Number(sessionStorage.getItem('difficulty'))+1) : 2, //number of lives (if there are not in pops initialize to 2)
    answer_id : null, // id of the selected answer
  }
  
  const history = useHistory()
  const [state, dispatch] = useReducer(GameReducer, initialState) // Initialize game dispatcher
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => 
  {
    console.log("---APP--")
  },[]);

  useEffect(() => {
    if(UserState.token){ // If there is loaded user's state
      if(!screen_id){ //If there are no screen in props
        getLastScreen(UserState.token).then((res) => { //Get last screen of user
          if(res.status === 200){
            res.json().then((data) => {
              data.last_screen==10 ? dispatch({type: "SET_SCREEN", payload: 10}) : 
                data.is_static ? history.push(`/story/PlanetRoom`) : 
                  dispatch({type: "SET_SCREEN", payload: 19})
              setIsLoading(false)
            })
          }
          else{
            history.push(`/error/${res.status}`)
          }
        })
      }
      else{
        setIsLoading(false)
      }
    }
  }, [UserState.token]) //Execute when the user's context is loaded

  if(isLoading){
    return (
      null
    )
  }
  else{
    return (
      <GameContext.Provider value={{state, dispatch}}> {/*Send the state and dispatcher of the game */}
        <Story/>
      </GameContext.Provider>
    )
  }
}

export default App;