import { IonButton, IonText } from '@ionic/react'
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { ComponentProps } from '../scripts/Interfaces';
import { getComponentQuestions } from '../scripts/fetch';
import Select from 'react-select';
import LoadingPage from '../../../components/LoadingPage';
import UserContext from './UserContext';

import './SortQuestion.css';
import '../../GreenCo.css'

const SortQuestion = React.forwardRef(({ component_id }: ComponentProps, ref) => {
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user

  const { state, dispatch } = React.useContext(UserContext);
  const [props, setProps] = useState<any>('');
  const [answers, setAnswers] = useState<string[]>([]) //Possible answers
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selected, setSelected] = useState<(string | null)[]>([]);
  const [questionNumber, setQuestionNumber] = useState<any>(null)
  let focusindex = 7;

  useEffect(() => {
    console.log("---SORT QUESTION--")
    getComponentQuestions(component_id, state.token, state.difficulty_id, state.language_id).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setProps(data);
          setAnswers(data.component_text.answer_text.split(';').sort(() => .5 - Math.random())); //Possible answers, randomly ordered
          setSelected(data.component_text.answer_text.split(';').map(() => null)); //Array of selected responses, initially empty
          setQuestionNumber(data.description.split(".")[1])
          setIsLoading(false);
        });
      }
    })
  }, [])

  const handleSelect = (option: { label: string; value: string } | null, index: number) => { //Manages the selection of a response
    const newSelected = [...selected]; //Copy of the array of selected answers
    newSelected[index] = option ? option.value : null; //Updates the selected answer
    setSelected(newSelected); //Updates the array of selected answers
  };

  const handleAnswer = () => {
    for (let i = 0; i < selected.length; i++) { //Check that all answers have been selected
      if (selected[i] === null) { //If not, returns false
        return false;
      }
    }
    const answerAsString = selected.join(';').toLowerCase().replaceAll(' ', ''); //Returns the selected answers in a string, separated by ';'.
    return {
      question_id: props.question_id,
      answer_id: props.answer_id,
      answer: answerAsString
    };
  };

  useImperativeHandle(ref, () => ({
    handleAnswer
  }));

  if (isLoading) {
    return <LoadingPage />
  }
  else {
    return (
      <div id="SortQuestion" className='SortQuestion-Container'>
        <div id="Hangman-HiddenWord" className='Question-Info'>
          <img src="assets/icon/info_icon.png" className='Info-Image' alt="" />
          <IonText tabIndex={4}>
            {props.component_text.info}
          </IonText>
          <br />
        </div>
        <div className='question-Container-Question'>
          <IonText className='SortQuestion-Container-Text-Question'>
            <p tabIndex={5}>{questionNumber}. {props.component_text.question_text}
            </p>
          </IonText>
        </div>
        <div className='SortQuestion-Container-Selector'>
          {selected.map((value, index) => { //Displays a selector for each answer
            const availableOptions = answers;
            return (
              <Select
                key={index}
                aria-label={"option " + index}
                options={availableOptions.map((option) => ({ value: option, label: option }))}
                onChange={(option) => handleSelect(option, index)}
                value={value ? { label: value, value } : null}
                placeholder={`${index + 1}.`}
                tabIndex={0}
              />
            );
          })}
        </div>
      </div>
    )
  }
})

export default SortQuestion;