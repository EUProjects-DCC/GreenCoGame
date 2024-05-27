import { IonItem, IonLabel, IonRadio, IonRadioGroup, IonText} from '@ionic/react'
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { ComponentProps } from '../scripts/Interfaces';
import { getComponentQuestions } from '../scripts/fetch';
import LoadingPage from '../../../components/LoadingPage';
import UserContext from './UserContext';

import './MultipleAnswerQuestion.css'
import '../../GreenCo.css'

const SingleAnswerQuestion = React.forwardRef(({component_id}:ComponentProps, ref) => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  
  const {state, dispatch} = React.useContext(UserContext);
  const [props, setProps] = useState<any>('');
  const [options, setOptions] = useState<Array<any>>([])
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [questionNumber, setQuestionNumber] = useState<any>(null)
  let focusindex = 6;

  useEffect(() => {
    console.log("---SINGLE ANSWER QUESTION--")
    getComponentQuestions(component_id, state.token, state.difficulty_id, state.language_id).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setProps(data);
          setOptions(data.component_text.answer_text.replaceAll('; ',";").split(";"));
          setQuestionNumber(data.description.split(".")[1])
          setIsLoading(false);
        });
      }
    })
  }, [])

  const handleAnswer = () => {
    if(answer === "") return
    return {
      question_id: props.question_id,
      answer_id: props.answer_id,
      answer: answer.replaceAll(" ", "").toLowerCase()
    }
  };

  useImperativeHandle(ref, () => ({
    handleAnswer
  }));

  if (isLoading) {
    return <LoadingPage/>
  }
  else{
    return (
      <div className="MultipleChoice-Container">
      <div id="Hangman-HiddenWord" className='Question-Info'>
        <img src="assets/icon/info_icon.png" className='Info-Image' alt="" />
        <IonText tabIndex={4}>
          {props.component_text.info}
        </IonText>
        <br/>
      </div>
        <div id='question' className="MultipleChoice-Container-Question" >
          { component_id<187 ? <IonText tabIndex={5} id='questionText'>{questionNumber}. {props.component_text.question_text}</IonText> 
          : <IonText id='questionText' tabIndex={5}>{props.component_text.question_text}</IonText>
          }
        </div>
        <div className="MultipleChoice-Container-Options">
          <IonRadioGroup onIonChange={(e)=>setAnswer(e.target.value)} style={{ display: 'block', flexDirection:"row", flexWrap:"wrap", justifyContent:"space-between", width:"100%"}}>
            {options.map((option, index) => {
              return (                
                <IonItem tabIndex={focusindex + index}>
                  <IonRadio 
                    className='radiobutton'
                    slot="start"
                    value={option}
                    aria-label={option}
                  />
                  <IonLabel>{option}</IonLabel>
                </IonItem>
              );
            })}
          </IonRadioGroup>
        </div>
      </div>
    )
  }
})

export default SingleAnswerQuestion   // Path: src/pages/Story/components/SingleAnswerQuestion.tsx