import {  IonImg } from '@ionic/react'
import { ComponentProps } from '../scripts/Interfaces'
import { useContext, useEffect, useState } from 'react'
import { getComponentOptions, loadNextScreen, updateDifficulty, updatePlanet } from '../scripts/fetch'
import { useHistory } from 'react-router'
import LoadingPage from '../../../components/LoadingPage'
import UserContext from './UserContext'


import './ChooseOption.css'
import '../../GreenCo.css'
import GameContext from './GameContext'


const ChooseOption:React.FC<ComponentProps> = ({component_id}) => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  const {state:UserState, dispatch:UserAction} = useContext(UserContext) //User's context
  const {state:GameState, dispatch:GameAction} = useContext(GameContext) //Game's context
  const [options, setOptions] = useState<any>([]) //Component options, like planets and the difficulties to choose
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const history = useHistory()
  const location = history.location.pathname.includes("story") ? "dynamic" : "static" //If the path includes story, is dinamic, if not is static (has its own url)
  let focusindex = 5;

  useEffect(() => {
    console.log("---CHOOSE OPTION--")    
    getComponentOptions(component_id,language).then((res) => {
      if(res.status === 200){
        res.json().then((data) => {
          setOptions(data)
          setIsLoading(false)
        })
      }
      else{
        history.push(`/error/${res.status}`)
      }
    })
  }, [])

  const keypressed = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      console.log("Enter")
    }
  }

  //Manage the click of the option and makes the request (aUpdate the selected planet or the difficulty)
  const handleClick = async (option:any) => {
    try {
      let res;
      switch(option.method) { //Method of the request (update planet or difficulty)
        case 'update_difficulty':
          res = await updateDifficulty(option.value, UserState.token);
          if (res.status === 200) {
            UserAction({ type: 'SET_DIFFICULTY', payload: option.value }); //Update the difficulty on the context
            sessionStorage.setItem("difficulty", option.value)
            GameAction({type: "SET_SCREEN", payload: 17})
          }
          else {
            history.push(`/error/${res.status}`); //If there is an error, redirect to error page
          }
          break;
        case 'update_planet':
          res = await updatePlanet(option.value, UserState.token); //Update the planet of the user in the context
          if (res.status === 200) {
            UserAction({ type: 'SET_PLANET', payload: option.value });
            sessionStorage.setItem("planet", option.value)
            UserState.planet_id = option.value
            history.push(`/story/planetroom`)
          }
          else {
            history.push(`/error/${res.status}`); //If there is an error, redirect to the error page
          }
          break;
      }
    }
    catch (error) {
      console.error("Error in handleClick:", error);
    }
  };

 const handleTransition = (planet_id:number|null) => { //Manage the transition between screens
    if(location === "static"){ //If the screen is static, back to the previous screen
      history.goBack()
    }
    else{ //If the screen is dynamic, load the next screen
      loadNextScreen(GameState.screen_id, UserState.difficulty_id, UserState.planet_id, UserState.token)
        .then((res) => {
          if(res){
            res.is_static ? history.push(`${res.url}`) : GameAction({type: "SET_SCREEN", payload: res.screen_id}) //If the screen is scatic redirect to the corresponding url, if not, update the current screen
          }
          else{
            history.push(`/error/${res.status}`);
          }
        });
    }
  }

  const renderOptions = () => { //Render the component option (planets' image or levels))
    return options.map((option:any, index:number) => {
      return (
        <div>
          <IonImg className='scale-hover' alt={option.text} key = {index} src = {option.src} onClick={()=>{handleClick(option)}}  
                  tabIndex={focusindex + index} aria-label={option.text} onKeyDown={(e) => {
                    if (e.key === "Enter")
                      handleClick(option);
                  }}/>
          <p className='optiontext'>{option.text}</p>
        </div>
      )
    })
  }

  if(isLoading){
    return <LoadingPage />
  }
  else{
    return (
      <div className = "choose-option">
        {renderOptions()}
      </div>
    )
  }
}

export default ChooseOption