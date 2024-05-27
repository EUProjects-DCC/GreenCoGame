import { IonButton, IonCheckbox, IonItem, IonRadio, IonText } from '@ionic/react'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import { getComponentQuestions } from '../scripts/fetch'
import { ComponentProps } from '../scripts/Interfaces'
import LoadingPage from '../../../components/LoadingPage'
import UserContext from './UserContext'

import './BinaryQuestion.css'
import '../../GreenCo.css'

const BinaryQuestion = React.forwardRef(({component_id}:ComponentProps, ref) => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  
  const {state, dispatch} = React.useContext(UserContext);
  const [props, setProps] = useState<any>('');
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [answer, setAnswer] = useState<string>('')

  useEffect(() => {
    console.log("---BINARYQUESTION--")
    getComponentQuestions(component_id, state.token, state.difficulty_id, state.language_id).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setProps(data);
          setIsLoading(false);
        });
      }
    })
  }, [])

  //function of each child component to be called from the father and validate answer
  const handleAnswer = () => {
    if (answer === '') return
    return {
      question_id:  props.question_id,
      answer_id: props.answer_id,
      answer: answer
    }
  }

  useImperativeHandle(ref, () => ({
    handleAnswer
  }));

  if(isLoading){
    return <LoadingPage />
  }
  else{
    return (
      <div className="binary-question-container">
        <IonItem id='question' lines="none" className="binary-question-item">
        <div className="questionText">{props.component_text.question_text}</div>
        </IonItem>
        <div className="MultipleChoice-Container-Options">
          {
            props.component_text.answer_text.split(';').map((option: string, index: number) => {
              return(
                <div key={index} className="MultipleChoice-Container-Options-Item" >
                  <IonRadio className='radiobutton'
                    slot="start"
                    value={option}
                    onClick={() => setAnswer(option)}
                  />
                  <IonText class='ion-text-wrap'>{option}</IonText>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
})
export default BinaryQuestion