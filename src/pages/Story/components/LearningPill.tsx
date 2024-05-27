import { IonButton, IonText } from '@ionic/react'
import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { getComponentStoryDialogue, loadNextScreen, getScreenText } from '../scripts/fetch'
import UserContext from './UserContext'
import LoadingPage from '../../../components/LoadingPage'
import GameContext from './GameContext'

import './LearningPill.css'
import '../../GreenCo.css'

const LearningPill = ({ component_id, gameVisible, gameover }: { component_id: number, gameVisible: any, gameover: any }) => {

    const { state: UserState, dispatch: UserAction } = useContext(UserContext); //Context with user information (token, language, difficulty, planet, etc.)
    const { state: GameState, dispatch: GameAction } = useContext(GameContext); //Context with level information (remaining lives, etc.)
    const [isLoading, setIsLoading] = useState(false)
    const [text, setText] = useState<string>("")
    const history = useHistory();
    const answertxt = sessionStorage.getItem('answertxt')

    const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)

    const [textButton, setTextButton] = useState<string>("")
    const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
    const screen_id = '0'; // Screen ID

    useEffect(() => {
        console.log("---LEARNING PILL--")
        //Load the text of the Screen in the selected language
        getScreenText(screen_id, language).then((resText) => {
            if (resText.status === 200) {
                resText.json().then((dataText) => {
                    setTextButton(dataText.nextquestion);
                });
            }
            else {
                //In case of server error, send to the previous page
                history.push(`/error/${resText.status}`);
            }
        })

        getComponentStoryDialogue(component_id, UserState.language_id, GameState.answer_id)
            .then((res) => {
                res.json().then((data) => {
                    let lp = "";
                    for (let i = 0; i < data.length; i++) {
                        lp = lp + data[i].text + "\n"
                    }
                    setText(lp);
                    setIsLoading(false);                    
                    var learningText = document.getElementById("answertext");
                    learningText?.focus();
                })
            })
    }, []);
    useEffect(() => {
        var answertextquestion = document.getElementById('answertext');
        answertextquestion!.innerText = "" + sessionStorage.getItem('answertxt');
    }, [answertxt]);

    const handleNextScreen = () => {
        if (GameState.lives_left == 0) {
            history.push(`/story/planetroom`);
        } else {
            gameVisible(false)
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

    const parseText = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const url = text.match(urlRegex);
        if (url) {
            const splitText = text.split(urlRegex);
            return (
                <div className=''>
                    <IonText>{splitText[0]}</IonText>
                    <IonText color='#07814c'>
                        <a href={url[0]} target="_blank" rel="noreferrer">{url[0]}</a>
                    </IonText>
                    <IonText className='LearningPill-Container-Text'>{splitText[2]}</IonText>
                </div>
            )
        }
        else {
            return (
                <IonText className='LearningPill-Container-Text' id="learningpillp">{text}</IonText>
            )
        }
    }
    if (isLoading) {
        return (
            <LoadingPage />
        )
    }
    else {
        return (
            <div className="LearningPill-Container">
                <p id="answertext" autoFocus tabIndex={10}></p>
                <img src="assets/icon/idea.png" className='learningPillImage' alt="" />
                <br></br>
                <p  tabIndex={11}>{parseText(text)}</p>
                <div className='LearningPill-Button'>
                    {
                        (GameState.lives_left > 0) ? <IonButton className='optionButtons' color="greenlight" expand="block" onClick={() => handleNextScreen()}>{textButton}</IonButton> : null
                    }
                </div>
            </div>
        )
    }
}

export default LearningPill