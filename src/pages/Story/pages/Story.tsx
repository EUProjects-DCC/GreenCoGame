import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, useIonToast } from '@ionic/react'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { checkQuestionAnswer, getScreenComponents, loadNextScreen, getScreenText, getUserPoints } from '../scripts/fetch'

import LoadingPage from '../../../components/LoadingPage'
import StoryText from '../components/StoryText'
import RangedQuestion from '../components/RangedQuestion'
import BinaryQuestion from '../components/BinaryQuestion'
import FillGaps from '../components/FillGaps'
import Hangman from '../../Games/Hangman/pages/Hangman'
import MultipleAnswerQuestion from '../components/MultipleAnswerQuestion'
import LearningPill from '../components/LearningPill'
import SortQuestion from '../components/SortQuestion'
import UserContext from '../components/UserContext'
import ChooseOption from '../components/ChooseOption'
import SingleAnswerQuestion from '../components/SingleAnswerQuestion'
import GameContext from '../components/GameContext'

import '../Story.css'
import '../../GreenCo.css';
import Award from '../components/Award'
import LivesBar from '../components/LivesBar'

const Story = () => {
  const [isGameVisible, setIsGameVisible] = React.useState(false);
  const [text, setText] = useState<any>({});
  const [GameOver, setGameOver] = React.useState(false);
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user

  const componentTypes: Record<string, React.FC<any>> = {
    "StoryText": StoryText,
    "ConversationText": StoryText,
    "RangedQuestion": RangedQuestion,
    "BinaryQuestion": BinaryQuestion,
    "FillGapsQuestion": FillGaps,
    "HangmanQuestion": Hangman,
    "MultipleAnswerQuestion": MultipleAnswerQuestion,
    "SortQuestion": SortQuestion,
    "LearningPillText": LearningPill,
    "ChooseOption": ChooseOption,
    "SingleAnswerQuestion": SingleAnswerQuestion,
    "Award": Award
  }
  const { state: UserState, dispatch: UserAction } = React.useContext(UserContext)
  const { state: GameState, dispatch: GameAction } = React.useContext(GameContext)
  const [components, setComponents] = useState<any>([])
  const [background, setBackground] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSelect, setIsSelect] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false) //used to hide a component (learning pill)
  const [presentToast] = useIonToast();
  const childRefs = useRef<React.RefObject<any>[]>([]);
  const history = useHistory();
  const auxScreen_id = 19;

  useEffect(() => {
    console.log("---STORY--")
    window.location.hash = "no-back-button";

    // Again because Google Chrome doesn't insert the first hash into the history
    window.location.hash = "Again-No-back-button";

    window.onhashchange = function () {
      window.location.hash = "no-back-button";
    }

    setIsGameVisible(false)
    setGameOver(false)

    //Timeout to show the question
    setTimeout(function () {
      setIsGameVisible(true)
    }, 2000);
    //Get text of the screen. As this is not a static screen we use an aux_id to select the texts
    getScreenText(auxScreen_id, language).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setText(data);
        });
      }
    })

    //Get screen components
    getScreenComponents(GameState.screen_id, UserState.planet_id).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setComponents(data.slice(0, data.length - 1))
          setBackground(data[data.length - 1])
          showBackground()
          setIsLoading(false)
          setIsVisible(false)
        })
      }
      else {
        history.push(`/error/${res.status}`)
      }
    })
  }, [GameState.screen_id]);

  //Check if it is neccesary to show the arrow to pass to the next screen
  const checkLastArrow = () => {
    for (let i = 0; i < components.length; i++) {
      if (components[i].type.includes("Choose Option")) {
        return true;
      }
    }
    return false;
  }

  //Check if there are any question or award in the screen
  const showSubmitButton = () => {
    for (let i = 0; i < components.length; i++) {
      if (components[i].type.includes("Hangman") || components[i].type === "Award") {
        return false;
      }
      if (components[i].type.includes("Question")) {
        return true;
      }
    }
    return false;
  }

  //Check the type of question to hide or show the back button
  const showBackground = () => {
    for (let i = 0; i < components.length; i++) {
      //Sort of elements without back button
      if (components[i].type.includes("Award")) {
        if (UserState.planet_id == 1) {
          setBackground("assets/Story/Backgrounds/be_award.jpg")
        } else {
          setBackground("assets/Story/Backgrounds/bm_award.jpg")
        }
      }
    }
    return true;
  }

  //Check the type of question to hide or show the back button
  const showBackButton = () => {
    for (let i = 0; i < components.length; i++) {
      //Sort of elements without back button
      if (components[i].type.includes("Conversation Text")
        || components[i].type.includes("Award")
        || components[i].type.includes("Ranged Question")
        || components[i].type.includes("Story Text")
        || components[i].type.includes("Choose Option")) {
        return false;
      }
    }
    return true;
  }

  //Collect all the answers
  const retrieveAnswers = () => {
    let answers = [];
    //If there are questions
    if (childRefs.current) {
      //Go through the questions to collect the answers
      for (let i = 0; i < childRefs.current.length; i++) {
        //If the question exists
        if (childRefs.current[i]) {
          //Collect the answer
          const answer = childRefs.current[i].current.handleAnswer();
          //If there are answers
          if (answer && answer.question_id !== -1) {
            answers.push(answer);
          }
          else {
            //There are no answers
            return [];
          }
        }
      }
    }
    return answers;
  };

  //Close Session and clear the session storage with the user info
  const closeSession = () => {
    sessionStorage.clear()
    history.push(``);
  }

  //Check the answers of the user
  const submitAnswers = async () => {
    //Collect the answers
    const answers = retrieveAnswers();
    if (answers.length === childRefs.current.length) {
      // If there are anwers and are the same number than the questions, check the answers
      const answerPromises = answers.map((answer) =>
        checkQuestionAnswer(answer.question_id, answer.answer + "", UserState.difficulty_id, UserState.language_id, UserState.token)
          .then((res) => {
            if (res.status === 200) {
              return res.json().then((data) => {
                return data
              });
            }
            else {
              history.push(`/error/${res.status}`);
            }
          }));
      const results = await Promise.all(answerPromises);

      //If there are some answers that not require checking (initial and final questionaries)
      if (results.includes(null)) {
        if (GameState.screen_id == 200) {
          closeSession();
        } else {
          //Load the next screen
          loadNextScreen(GameState.screen_id, UserState.difficulty_id, UserState.planet_id, UserState.token)
            .then((res) => {
              if (res) {
                res.is_static ? history.push(`${res.url}`) : GameAction({ type: "SET_SCREEN", payload: res.screen_id })
              }
              else {
                history.push(`/error/${res.status}`);
              }
            });
          return;
        }
      }

      //Check if the answers are correct
      const isCorrect = results.every((result) => result === true);
      if (!isCorrect) { // If nay of the answers is incorrect
        //If there is the last live restart the game
        if (GameState.lives_left === 1) {
          sessionStorage.setItem('answertxt', text.gameover)
          GameAction({ type: "SET_LIVES", payload: (GameState.lives_left - 1) });
        } else {
          //Show a message informing about the error of the answer
          sessionStorage.setItem('answertxt', text.incorrectanswer)
          //Loose 1 live
          GameAction({ type: "SET_LIVES", payload: (GameState.lives_left - 1) });
        }
      }
      else {
        //Show a message informing about the correct answer
        sessionStorage.setItem('answertxt', text.correctanswer)
        getUserPoints(UserState.token).then((res: { status: number; json: () => Promise<any> }) => {
          if (res.status === 200) {
            res.json().then((data) => {
              UserState.points = data.points
            });
          }
        });
      }
      //If there are only 1 answer/question
      if (answers.length === 1) {
        //Store the answer to load the corresponding learning pill
        GameAction({ type: "SET_ANSWER", payload: answers[0].answer_id });
        //Show the learning pill
        setIsVisible(true);
      }
    }
    else {
      //If there are no answers to submit show a message
      presentToast({ message: text.noanswer, duration: 1000, color: "danger", });
    }
  };

  //Render information regarding of the sort of element
  const selectComponent = (component: any, row: number) => {
    //Get the sort of component
    const componentType = component.type.replaceAll(" ", "");
    //Get the component
    const ComponentLabel = componentTypes[componentType];
    //If is a question
    if (componentType.includes("Question")) {
      //If the reference to the question doesn't exists create the reference
      if (!childRefs.current[row]) {
        childRefs.current[row] = React.createRef();
      }
      //Return the question with its reference
      return (
        <ComponentLabel
          key={`Row${row}_${componentType}_${component.id}}`}
          component_id={component.id}
          submitAnswers={submitAnswers}
          ref={childRefs.current[row]}
          isSelect={checkLastArrow()}
        />
      );
    }
    else if (componentType === "LearningPillText") { // If is a Learningn Pill      
      return;
    }
    else { // If is any other component
      return (
        <ComponentLabel
          key={`Row${row}_${componentType}_${component.id}}`}
          component_id={component.id}
          isSelect={checkLastArrow()}
        />
      );
    }
  }

  //Rendering the component
  const renderComponents = (components: any) => {
    //Go through teh components
    return components.map((component: any, row: number) => {
      //Return a row with the component
      return (
        <IonRow key={`Row_${row}`} className="ion-justify-content-center">
          <IonCol size="12">
            {
              selectComponent(component, row)
            }
          </IonCol>
        </IonRow>
      )
    })
  };

  if (isLoading) {
    return <LoadingPage />
  }
  else {
    return (
      <IonPage className="StoryContainer" style={{
        backgroundImage: `url(${background.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100%",
        width: "100%",
        padding: "0px"
      }}>
        <LivesBar lives={GameState.lives_left} />
        <IonContent className='storyContent'>
          <IonGrid
            style={{
              width: "100%",
              visibility: !isGameVisible ? "hidden" : "visible",
              height: "100%",
              opacity: !isGameVisible ? "0" : "1",
              transition: "all .2s",
            }}
          >
            {
              renderComponents(components)
            }
            {
              isVisible ?
                <IonRow className="ion-justify-content-center">
                  <IonCol size="12">
                    <LearningPill component_id={components[components.length - 1].id} gameVisible={setIsGameVisible} gameover={setGameOver} />
                  </IonCol>
                </IonRow>
                : null //Shows the learningn Pill
            }
            {
              (showSubmitButton() && !isVisible) ? <IonButton aria-live="polite" className="optionButtons" color="greenlight" expand="block" // Muestra el botón de submit si es necesario y no se está mostrando la learning pill
                onClick={() => {
                  components[components.length - 1].type === "Award" ? history.push("/story/planetroom") : submitAnswers()
                }}>{text.submit}</IonButton> : null
            }
            {
              (showBackButton()) ? <IonButton id='btnVolver' aria-live="polite" className='optionButtons' color="greenlight" expand="block" href="/story/planetroom">{text.back_button}</IonButton> : null
            }
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }
};

export default Story;