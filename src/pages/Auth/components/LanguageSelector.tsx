import { IonSelect, IonSelectOption } from '@ionic/react';
import { useEffect, useState } from 'react';
import { getScreenText } from '../../Story/scripts/fetch';

import './LanguageSelector.css'

interface LanguageSelectorProps {
  language: string; // current language
  updateLanguage: (language: number) => void; // function to update the language
}

//Language Selector
const  LanguageSelector:React.FC<LanguageSelectorProps> = ({language, updateLanguage}) => {

  const [text, setText] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const screen_id = '2'; // screen id

  useEffect(() => {
    console.log("---LANGUAGE SELECTOR--")
    switch (language.toString()) {
      case '1':
        document.documentElement.lang = 'bg';
      break;
      case '2':
        document.documentElement.lang = 'en';
      break;
      case '3':
        document.documentElement.lang = 'es';
      break;
      case '4':
        document.documentElement.lang = 'fr';
      break;
      case '5':
        document.documentElement.lang = 'it';
      break;
      default:
        document.documentElement.lang = 'en';
      break;
    }
    getScreenText(screen_id,language).then((res) => { //Get the text of the screen
      if (res.status === 200) {
        res.json().then((data) => {
          setText(data); //Update the text of the screen
          setIsLoading(false); //Update the state of the load
        });
      }
    })
  }, [language]) //Executed when the language is updated

  if(isLoading) return (<div></div>) // If is loading show nothing

  else{ //If is load, show the language selector
    return (
      <IonSelect placeholder={text.placeholder} 
        id='languageSelector' 
        onIonChange={(e: CustomEvent) => updateLanguage(e.detail.value)}
        aria-label={text.placeholder}
        value={parseInt(language)}
        interfaceOptions={{
          header: `${text.placeholder}`,
          cssClass: 'selectCountry'
        }}
      >
        <IonSelectOption value={2} aria-label={text.label_english}>{text.label_english}</IonSelectOption>  
        <IonSelectOption value={3} aria-label={text.label_spanish}>{text.label_spanish}</IonSelectOption> 
        <IonSelectOption value={4} aria-label={text.label_french}>{text.label_french}</IonSelectOption> 
        <IonSelectOption value={5} aria-label={text.label_italian}>{text.label_italian}</IonSelectOption> 
        <IonSelectOption value={1} aria-label={text.label_bulgarian}>{text.label_bulgarian}</IonSelectOption>
      </IonSelect>
    )
  }
}

export default LanguageSelector