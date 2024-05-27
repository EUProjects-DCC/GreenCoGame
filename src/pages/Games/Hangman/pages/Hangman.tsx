import { IonText, IonButton } from '@ionic/react';
import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ComponentProps } from '../../../Story/scripts/Interfaces';
import LoadingPage from '../../../../components/LoadingPage';
import UserContext from '../../../Story/components/UserContext';
import { getComponentQuestions, getScreenText } from '../../../Story/scripts/fetch';

import './Hangman.css';
import '../../../Story/Story.css'
import '../../../GreenCo.css'

const Hangman = React.forwardRef(({ component_id, submitAnswers }: ComponentProps, ref) => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { state, dispatch } = useContext(UserContext);
  const [props, setProps] = useState<any>('');
  const [word, setWord] = useState<string>("");
  const [hangmanImage, setHangmanImage] = useState<string>("");
  const [hiddenWord, setHiddenWord] = useState<string[]>([]);
  const [lives, setLives] = useState<number>(5);
  const [ended, setEnded] = useState<boolean>(false);
  const letter = useRef<HTMLInputElement>(null);
  const [textComponent, setTextComponent] = useState<any>({});
  const [questionNumber, setQuestionNumber] = useState<any>(null)
  let audioCorrect = new Audio("/assets/sounds/correct.wav")
  let audioWrong = new Audio("/assets/sounds/wrong.mp3")

  //Load initial information
  useEffect(() => {
    console.log("---HANGMAN--")
    if (ended) {
      setHiddenWord(word.split(""));
      return;
    } else {
      //Get texts regarding the language selected by the user
      getScreenText(0, language).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setTextComponent(data);
          });
        }
      })
      //Get information about the question
      getComponentQuestions(component_id, state.token, state.difficulty_id, state.language_id).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setProps(data);
            setWord(data.component_text.answer_text.toUpperCase());
            const newHiddenWord = data.component_text.answer_text.toUpperCase().split("").map(() => "-");
            for (let i = 0; i < data.component_text.answer_text.length; i++) {
              if (data.component_text.answer_text[i] === " " || data.component_text.answer_text[i] === ";") {
                newHiddenWord[i] = " ";
              }
            }
            setHiddenWord(newHiddenWord);
            setQuestionNumber(data.description.split(".")[1])
            setIsLoading(false);
          });
        }
      })
    }
  }, [ended])

  //In case of changing lives' value change the path of the image
  useEffect(() => {
    setHangmanImage("assets/Hangman/hangman" + (lives + 1) + ".png");
  }, [lives])

  //Check if the answer is correct to win the game
  const checkWin = (hiddenWord: string[]) => {
    if (hiddenWord.join("") === word) {
      //Correct answer
      setEnded(true);
      setHiddenWord(word.split(""));
      sessionStorage.setItem('userAnswer', "correct");
      submitAnswers()
    }
    else if (lives === 0) {
      //Wrong answer
      setEnded(true);
      setHiddenWord(word.split(""));
      sessionStorage.setItem('userAnswer', "wrong");
      submitAnswers()
    }
  }

  //Handle answer from parent
  const handleAnswer = () => {
    if (sessionStorage.getItem('userAnswer')?.includes("correct")) {
      return {
        question_id: props.question_id,
        answer_id: props.answer_id,
        answer: word
      }
    }
    else {
      return {
        question_id: props.question_id,
        answer_id: props.answer_id,
        answer: ""
      }
    }
  };

  useImperativeHandle(ref, () => ({
    handleAnswer
  }));

  //Check if the letter is in the answer
  const checkLetter = () => {
    if (ended) return;
    const letterValue = letter.current?.value.toUpperCase();
    if (letterValue) {
      const newHiddenWord = [...hiddenWord];
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letterValue) {
          newHiddenWord[i] = letterValue;
        }
      }
      if (newHiddenWord.join("") === hiddenWord.join("")) {
        setLives(lives - 1);
        var focusLives = document.getElementById("numberlives");
        focusLives?.focus()
        audioWrong.play()
      }else{
        audioCorrect.play()
      }
      checkWin(newHiddenWord);
      setHiddenWord(newHiddenWord);
      letter.current!.value = "";
    }
  }

  //Validate the input. Check if it's a letter
  const validateInput = () => {
    const regex = /^[a-zA-Z]+$/;
    const regexcyrillic = /^[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$/;
    const valid = regex.test(letter.current!.value);
    const validcyrillic = regexcyrillic.test(letter.current!.value);
    if (!valid && !validcyrillic) {
      alert(textComponent.onlyletters);
    }
    else {
      checkLetter();
    }
  }

  //Validate the input. Check if it's a letter
  const keypressed = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      validateInput();
    }
  }

  if (isLoading) {
    return <LoadingPage />
  }
  else {
    return (
      <div id="Hangman" className='question-Container'>

        <div id="Hangman-HiddenWord" className='Question-Info'>
          <img src="assets/icon/info_icon.png" className='Info-Image' alt=""/>
          <IonText tabIndex={4}>
            {props.component_text.info}
          </IonText>
          <br/>
        </div>
        <div className='question-Container-Question'>
          <IonText className='Hangman-Container-Text-Question' tabIndex={5}>
            {questionNumber}. {props.component_text.question_text}
          </IonText>
        </div>
        <div id="Hangman-HiddenWord" className='Hangman-HiddenWord'>
          <img src={hangmanImage} className='hangmanImage' alt="" />
        </div>
        <div id="hangmanlives" className='Hangman-HiddenWord'>
          <p className='numberlives' id="numberlives" tabIndex={6}>{textComponent.numattemps} {lives + 1} </p>
        </div>
        <div id="Hangman-HiddenWord" className='Hangman-HiddenWord'>
          {
            hiddenWord.map((letter, index) => {
              return (
                <IonText key={index} tabIndex={7}>
                  {letter}
                </IonText>
              )
            })
          }
        </div>
        <div id="Hangman-UserInput" className='Hangman-UserInput'>
          <p>{textComponent.insertletter}</p>
          <input type='text' id="answerhangman" aria-label="answer hangman" ref={letter} maxLength={1} onKeyDown={(e) => keypressed(e)}></input>
          <IonButton color="greenlight" onClick={() => validateInput()} disabled={ended ? true : false}>{textComponent.checkbutton}</IonButton>
        </div>
      </div>
    );
  }
})
export default Hangman;