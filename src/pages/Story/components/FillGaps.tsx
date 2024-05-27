import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { ComponentProps } from '../scripts/Interfaces';
import { getComponentQuestions } from '../scripts/fetch';
import LoadingPage from '../../../components/LoadingPage';
import UserContext from './UserContext';

import './FillGaps.css'
import '../../GreenCo.css'
import { IonText } from '@ionic/react';

const FillGaps = React.forwardRef(({ component_id }: ComponentProps, ref) => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  const { state, dispatch } = React.useContext(UserContext);
  const [props, setProps] = useState<any>('');
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [parts, setParts] = useState<string[]>([]); // Parts of the text that there are no spaces for answers
  const [inputValues, setInputValues] = useState<string[]>([]); // Values for the spaces for user's answers
  const [lives, setLives] = useState<number>(5);
  const [questionNumber, setQuestionNumber] = useState<any>(null)
  let focusindex = 5;

  const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => { // Manage the change of input value
    const newInputValues = [...inputValues]; // Copy of the answer array
    newInputValues[index] = event.target.value; // Update the value of a specific space
    setInputValues(newInputValues); // Update the array with the user's answers
  };

  const handleAnswer = () => {
    for (let i = 0; i < inputValues.length; i++) { // Check that there are no empty answers
      if (inputValues[i] === "") {
        alert("Please fill all the gaps"); // Of there are an empty spaces, show an error message
        return null;
      }
    }
    const answer = inputValues.join(";"); // Join the answer values in a string divided by ; character
    return {
      question_id: props.question_id,
      answer_id: props.answer_id,
      answer: answer
    }
  }

  useImperativeHandle(ref, () => ({
    handleAnswer
  }));

  useEffect(() => {
    console.log("---FILL GAPS--")
    getComponentQuestions(component_id, state.token, state.difficulty_id, state.language_id).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setParts(data.component_text.question_text.split("______"));
          setInputValues(new Array(data.component_text.question_text.split("______").length - 1).fill(""));
          setProps(data);
          setQuestionNumber(data.description.split(".")[1])
          setIsLoading(false);
        });
      }
    })
  }, [])

  if (isLoading) {
    return <LoadingPage />
  }
  else {
    return (
      <div className='FillGaps-Container'>
        <div id="Hangman-HiddenWord" className='Question-Info'>
          <img src="assets/icon/info_icon.png" className='Info-Image' alt="" />
          <IonText>
            {props.component_text.info}
          </IonText>
          <br />
        </div>
        <div className='FillGaps-Container-Text'>
          {parts.map((part, i) => ( // Show the text with the spaces for the answers
            <p key={`FillGaps-Container_part${i}`}>
              {
                i === 0 ?
                  <p tabIndex={0}>{questionNumber}. {part}</p>

                  :
                  <p tabIndex={0}>{part}</p>
              }
              {i < parts.length - 1 && ( // If there isn't the last space, show an input
                <input
                  type="text"
                  aria-label="answer"
                  value={inputValues[i]}
                  onChange={handleInputChange(i)}
                  tabIndex={0}
                />
              )}
            </p>
          ))}
        </div>
      </div>
    );
  }
})

export default FillGaps