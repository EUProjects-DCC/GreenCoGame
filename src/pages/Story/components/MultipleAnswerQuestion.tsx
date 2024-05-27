import { IonCheckbox, IonItem, IonLabel, IonText } from '@ionic/react'
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { ComponentProps } from '../scripts/Interfaces';
import { getComponentQuestions } from '../scripts/fetch';
import LoadingPage from '../../../components/LoadingPage';
import UserContext from './UserContext';

import './MultipleAnswerQuestion.css'
import '../../GreenCo.css'

const MultipleAnswerQuestion = React.forwardRef(({ component_id }: ComponentProps, ref) => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  const { state, dispatch } = React.useContext(UserContext);
  const [props, setProps] = useState<any>('');
  const [options, setOptions] = useState<Array<any>>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedOptions, setSelectedOptions] = useState<Array<boolean>>([]);
  const [questionNumber, setQuestionNumber] = useState<any>(null);
  let focusindex = 6;

  useEffect(() => {
    console.log("---MULTIPLE ANSWER QUESTION--")

    getComponentQuestions(component_id, state.token, state.difficulty_id, state.language_id).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setProps(data);
          setOptions(data.component_text.answer_text.replaceAll("; ", ";").split(";"));
          setQuestionNumber(data.description.split(".")[1])
          setIsLoading(false);
        });
      }
    })
  }, [])

  const handleCheckboxChange = (index: number) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = !newSelectedOptions[index];
    setSelectedOptions(newSelectedOptions);
  };

  //concatenates all selected options into a single string and returns an object with the answer, the id of the question and the id of the answer
  const handleAnswer = () => {
    let answerArray: string[] = []
    let answerAsString = "";
    for (let i = 0; i < selectedOptions.length; i++) {
      if (selectedOptions[i] === true) {
        answerArray.push(options[i].replaceAll(" ", ""))
      }
    }
    if (answerArray.length === 0) {
      return
    }
    answerAsString = answerArray.join(';').toLowerCase().replaceAll(' ', '');
    return {
      question_id: props.question_id,
      answer_id: props.answer_id,
      answer: answerAsString
    }
  };

  useImperativeHandle(ref, () => ({
    handleAnswer
  }));

  if (isLoading) {
    return <LoadingPage />
  }
  else {
    return (
      <div className="MultipleChoice-Container">
      <div id="Hangman-HiddenWord" className='Question-Info'>
        <img src="assets/icon/info_icon.png" className='Info-Image' alt="" />
        <IonText tabIndex={4}>
          {props.component_text.info}
        </IonText>
        <br/>
      </div>
        <div id='question' className="question-Container-Question">
          <IonText id='questionText' tabIndex={5}>{questionNumber}. {props.component_text.question_text}</IonText>    
        </div>
        <div className="MultipleChoice-Container-Options">
          {options.map((option: any, i: number) => {
            return (
              <IonItem tabIndex={focusindex + i}>
                <IonCheckbox color="greendark"
                  labelPlacement='end'
                  checked={selectedOptions[i]}                  
                  aria-label={option}
                  slot="start"
                  onIonChange={() => handleCheckboxChange(i)} 
                />
                <IonLabel>{option}</IonLabel>
              </IonItem>
            )
          })}
        </div>
      </div>
    )
  }
})

export default MultipleAnswerQuestion