import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import UserContext from './UserContext';
import GameContext from './GameContext';
import LoadingPage from '../../../components/LoadingPage';
import { getAwardData, getScreenText, checkAwardsLevel } from '../scripts/fetch';

import './Award.css';
import '../../GreenCo.css'
import { IonButton } from '@ionic/react';

const Award = () => {
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user

  const { state: UserState } = useContext(UserContext)
  const { state: GameState } = useContext(GameContext)
  const [text, setText] = useState<any>(null)
  const [textAward, setTextAward] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const history = useHistory();
  const screenId = 31
  var pathImage = "/assets/Awards/medal_level" + UserState.difficulty_id + "_" + UserState.planet_id + "_" + GameState.level_id + ".png"
  var background = "/assets/Story/Backgrounds/b1_0.jpg"
  const [allPlanet, setAllPlanet] = useState<boolean>(false) //used to hide a component
  const [allGame, setAllGame] = useState<boolean>(false) //used to hide a component
  const level = UserState.difficulty_id ? UserState.difficulty_id : 1;

  useEffect(() => {
    console.log("---AWARD--")
    if (UserState.token) {
      getScreenText(screenId, UserState.language_id).then((res) => {
        if (res.status === 200) {
          res.json().then((award_text) => {
            setText(award_text)
            //Get info of an award
            const award_description = award_text.text
            getAwardData(UserState.token, UserState.difficulty_id, GameState.level_id, UserState.planet_id, UserState.language_id).then((res) => {
              if (res.status === 200) {
                res.json().then((data) => {
                  data["award_text"] = award_description
                  setTextAward(data)
                  setIsLoading(false)
                });
              }
              else {
                history.push(`/error/${res.status}`); //If there is an error in server side redirect to error page
              }
            })
            
            checkAwardsLevel(UserState.token, UserState.difficulty_id).then((res) => {
              if (res.status === 200) {
                res.json().then((data) => {
                  //Check if there are all the awards = 8
                  if(data.length >= 8)
                  {
                    setAllGame(true)
                  }else{
                    setAllGame(false)
                    //Check if there are all the awards of the planet
                    let planetawards = 0;
                    data.map((award: any) => { 
                      if(award.planet_id == UserState.planet_id)
                      {
                        planetawards++;
                      }
                    })
                    if(planetawards >= 4)
                    {
                      setAllPlanet(true)
                    }else{
                      setAllPlanet(false)
                    }
                  }
                });
              }
            })
          });
        }
        else {
          history.push(`/error/${res.status}`); //If there is an error in server side redirect to error page
        }
      })
    }
    else {
    }
  }, [UserState]);

  const parseAwardText = (award_text: string) => {
    award_text = award_text.replace("[planet]", textAward.planet_name); //Planet of the award
    award_text = award_text.replace("[level]", textAward.level_name); //Level of the award
    award_text = award_text.replace("[difficulty]", textAward.difficulty_name); //Difficulty of the award
    return award_text;
  }

  if (isLoading) {
    return <LoadingPage />
  }
  else {
    return (
      <div className="award-container">
        <h1><img className="award-image" src={pathImage} alt=""/></h1>
        <h2 className="award-name" tabIndex={0}>{textAward.level_name} {textAward.difficulty_name}</h2>
          {
            !allGame && !allPlanet ? 
            <div>
              <p id="gameawards" className="award-description" tabIndex={0}> {parseAwardText(textAward.award_text)} </p> 
              <IonButton id='btnGameroom' className='optionButtons' color="greenlight"  expand="block" href="/story/planetroom" tabIndex={0}>{text.gameroom}</IonButton>
            </div> :null
          }
          {
            allPlanet ? 
              <div>
                <p id="gameawards" className="award-description" tabIndex={0}> {parseAwardText(textAward.award_text)} </p> 
                <p id="planetawards" className="award-description" tabIndex={0}> {text.planetawards} </p>                
                <IonButton id='btnchangeplanet' className='optionButtons' color="greenlight"  expand="block" href="/user/select-planet" tabIndex={0}>{text.changeplanet}</IonButton>                
                <IonButton id='btnGameroom' className='optionButtons' color="greenlight"  expand="block" href="/story/planetroom" tabIndex={0}>{text.gameroom}</IonButton>
              </div> :null
          }   
          {
            allGame ? 
            <div>              
              <p id="gameawards" className="award-description" tabIndex={0}> {parseAwardText(textAward.award_text)} </p> 
              <p id="gameawards" className="award-description" tabIndex={0}> {text.gameawards} </p> 
              {
                allGame && (level<3) ? <IonButton id='btnchangedifficulty' className='optionButtons' color="greenlight"  expand="block" href="/user/select-difficulty" tabIndex={0}>{text.changelevel}</IonButton> :null
              }
            <IonButton id='btnendGame' className='optionButtons' color="greenlight"  expand="block" href="/story/end" tabIndex={0}>{text.endgame}</IonButton>
            <IonButton id='btnGameroom' className='optionButtons' color="greenlight"  expand="block" href="/story/planetroom" tabIndex={0}>{text.gameroom}</IonButton>
            </div> :null
          } 
      </div>
    )
  }
}
export default Award;