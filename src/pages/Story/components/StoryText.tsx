import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { getComponentStoryDialogue, getScreenText, loadNextScreen } from '../scripts/fetch';
import { ComponentProps, Text } from '../scripts/Interfaces';
import LoadingPage from '../../../components/LoadingPage';
import UserContext from './UserContext';
import GameContext from './GameContext';

import './StoryText.css'
import '../../GreenCo.css'

const StoryText: React.FC<ComponentProps> = ({ component_id, isSelect }: ComponentProps, ref) => {
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  
  const { state: UserState, dispatch: UserAction } = React.useContext(UserContext);
  const { state: GameState, dispatch: GameAction } = React.useContext(GameContext);
  const [position, setPosition] = React.useState(0); //Position of the current text
  const [text, setText] = React.useState<Array<Text>>([]);
  const [textNull, setTextNull] = React.useState<any>(); // Text to be shown in the screen
  const [isLoading, setIsLoading] = React.useState(true);
  const history = useHistory();

  useEffect(() => {
    console.log("---STORY TEXT--")
    getComponentStoryDialogue(component_id, UserState.language_id)
      .then((res) => {
        res.json().then((data) => {
          setText(data);
          setPosition(0); //Position of the current text, starts on 0
          //Load the text of the Screen in the selected language
          getScreenText(0, UserState.language_id).then((res) => 
          {
            if (res.status === 200) {
              res.json().then((data) => 
              {
                setTextNull(data);
                setIsLoading(false);
              });
            }
            else 
            {
              //In case of server error, send to the previous page
              history.push(`/error/${res.status}`); 
            }
          })
        }
        )
      })
  }, [])

  const next = () => { //Go to the next text
    if (position < text.length - 1) { //If it is not the last text, move on
      setPosition(position + 1);
    }
    else if (position === text.length - 1) { //If it is the last text, it loads the following screen
      loadNextScreen(GameState.screen_id, UserState.difficulty_id, UserState.planet_id, UserState.token)
        .then((res) => {
          if (res) {
            res.is_static ? history.push(`${res.url}`) : GameAction({ type: "SET_SCREEN", payload: res.screen_id })
          }
          else {
            history.push(`/error/${res.status}`);
          }
        });
    }
  }
  
  const keypressed = (e: React.KeyboardEvent<HTMLDivElement>) => {    
    if(e.key === "Enter"){
      next();
      if(text[position].name)
      {
        var newfocus = document.getElementById("characterName");
        newfocus?.focus();
      } else
      {
        var newfocus = document.getElementById("textStory");
        newfocus?.focus();
      }     
    }
  } 

  const previous = () => { //Back to previous text
    if (position > 0) { //If it is not the first text, back up
      setPosition(position - 1)
    }
  }

  if (isLoading) {
    return (
      <LoadingPage />
    )
  }
  else {
    return (
      <div id="textHeaderStory" className="textHeaderStory" >
        {
          text[position].name ? //If the text has a character associated with it, it displays the character's name
            <p id="characterName" tabIndex={4}>{text[position].name}</p>
            :
            <></>
        }
        <p tabIndex={5} id="textStory">{text[position].text.replaceAll("[player name]", UserState.alias ? UserState.alias : "Player")}</p>
        {
          text.length > 0 && !isSelect ? <img className='buttonStory' id="nextTextButton" aria-label={textNull.nextscreen} src='assets/icon/nextText.png' onClick={() => next()}  onKeyDown={(e) => keypressed(e)} tabIndex={6}></img> : <></>
        }
      </div>
    )
  }
}

export default StoryText