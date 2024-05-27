import { IonItem, IonLabel, IonRadio, IonRadioGroup, IonText } from '@ionic/react'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import { checkQuestionAnswer, getComponentQuestions } from '../scripts/fetch';
import { ComponentProps } from '../scripts/Interfaces';
import LoadingPage from '../../../components/LoadingPage';
import UserContext from './UserContext';

import './RangedQuestion.css'
import '../../GreenCo.css'

const RangedQuestion =  React.forwardRef(({component_id}:ComponentProps, ref) => {

    const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
    const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
    const {state, dispatch} = React.useContext(UserContext);
    const [props, setProps] = useState<any>({});
    const [answer, setAnswer] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [questionNumber, setQuestionNumber] = useState<any>(null)
    let focusindex = 6;

    useEffect(() => {
        console.log("---RANGED QUESTION--")
        getComponentQuestions(component_id, state.token, state.difficulty_id || 0, state.language_id).then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              setProps(data);
              setQuestionNumber(data.description.split(".")[1])
              setIsLoading(false);
            });
          }
          else{
            console.log("Error fetching question")
          }
        })
    }, [])

    const handleAnswer = () => {
        if(answer === -1) return //If no response has been selected, nothing is sent
        return {
            question_id: props.question_id,
            answer: answer
        }
    }

    useImperativeHandle(ref, () => ({
        handleAnswer
    }));

    const renderItems = () => {
        return Array.from({ length: props.upper_limit - props.lower_limit + 1 }, (_, i) => i + props.lower_limit).map((value, index) => (
            <IonItem lines="none" className="ranged-question-radio-item" key={`rangedItem_${value}`} tabIndex={focusindex+index}>
                <IonLabel className="ranged-question-item-label" position="stacked" key={`rangedLabel_${value}`}>{value}</IonLabel>
                <IonRadio color="greendark" key={`rangedOption_${value}`} value={value}></IonRadio>
            </IonItem>
        ));
    }

    if(isLoading){
        return <LoadingPage/>
    }
    else{
        return (
            <div className="question-Container">

            <div id="Hangman-HiddenWord" className='Question-Info'>
              <img src="assets/icon/info_icon.png" className='Info-Image' alt="" />
              <IonText tabIndex={4}>
                {props.component_text.info}
              </IonText>
              <br/>
            </div>
                <div className="ranged-question-text" tabIndex={5}>{props.component_text.question_text}</div>
                <div className="ranged-radio-options">
                    <IonRadioGroup value={answer}  onIonChange={(e)=>setAnswer(e.target.value)}>
                    {
                        renderItems()
                    }
                    </IonRadioGroup>
                </div>
            </div>
        );
    }
});

export default RangedQuestion