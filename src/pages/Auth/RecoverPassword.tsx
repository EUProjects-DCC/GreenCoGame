import {
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonButton,
  useIonToast,
  IonGrid,
  IonRow,
  IonCol,
  IonHeader,
  IonText,
  IonContent,
} from '@ionic/react'

import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router';
import { changePassword } from './scripts/fetch';
import { showErrorMessage, validateData, validatePassword } from './scripts/utils';
import { getScreenText } from '../Story/scripts/fetch';
import LoadingPage from '../../components/LoadingPage';
import LanguageSelector from './components/LanguageSelector';

import './AuthTab.css';
import '../GreenCo.css';

const RecoverPassword = () => {

  const [text, setText] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [presentToast] = useIonToast();
  const [showError, setShowError] = useState<boolean[]>([false, false]);
  const [language, setLanguage] = useState<any>(sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2)
  const history = useHistory();
  const [user, setUser] = useState<any>(); // Text to be shown in the screen

  const password = useRef<any>({ value: "" });
  const repeatPassword = useRef<any>({ value: "" });
  const screen_id = '5';

  useEffect(() => {
    console.log("---RECOVERPASSWORD--")
    getScreenText(screen_id, language).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setText(data);
          const path = window.location.pathname.split('/'); //get token from URL
          const token = path[path.length - 1];
          setUser(path[path.length - 2]);
          setIsLoading(false);
        });
      }
      else {
        history.push(`/error/${res.status}`);
      }
    })
  }, [language, history]);

  const updateLanguage = (language: number) => {
    setLanguage(language);
    sessionStorage.setItem('language', String(language));
  }
  const handleSubmit = () => {
    let user = { "password": password.current.value, "confirm_password": repeatPassword.current.value } // the user's data (password and password confirmation) are obtained
    if (password.current.value === repeatPassword.current.value) {
      if (!validatePassword(repeatPassword.current.value)) {
        setShowError([true, false])
        //If the password is not valid show an error message
        let error = showErrorMessage(text.invalid_password, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
        presentToast(error);
      } else {
        const path = window.location.pathname.split('/'); //get token from URL
        const token = path[path.length - 1];

        changePassword(password.current.value, token).then((res) => {
          if (res.status === 200) {
            res.json().then(() => {
              let success = showErrorMessage(text.password_changed, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
              presentToast(success);
              history.push('/auth/login'); //Redirect to login page
            })
          }
          else { //If something went wrong, inform to the user
            res.json().then(() => {
              let error = showErrorMessage(text.error_change_password, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
              presentToast(error);
            })
          }
        })
      }
    } else {
      setShowError([false, true])
      let error = showErrorMessage(text.differentpasswords, 'toastAuthTab', { text: 'Ok', role: 'cancel' });
      presentToast(error);
      return false;
    }
  }

  const replaceUserText = (description_text: string) => {
    description_text = description_text.replace("[player name]", user); //Player name
    return description_text;
  }

  if (isLoading) {
    return <LoadingPage></LoadingPage>
  }

  else {
    return (
      <IonPage style={{ background: "url('/assets/background.png')" }}>
        <IonHeader>
          <LanguageSelector language={language} updateLanguage={updateLanguage} />
        </IonHeader>
        <img className='imgInvis' alt='' src="/assets/icon/logo1.png"></img>
        <IonContent className='FormTemplate ion-padding-top ion-padding-lg'>
          <IonGrid>
            <IonRow class="ion-justify-content-center">
              <img className="logoGreenCo" src="/assets/icon/logoFooter.png" alt="GreenCo project"></img>
              <IonCol size='12'>
                <IonItem lines="none">
                  <IonText>{<h3>{text.header}</h3>}</IonText>
                </IonItem>
                <IonItem lines="none">
                  <IonText>{<p>{replaceUserText(text.description)}</p>}</IonText>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow class="ion-justify-content-center">
              <IonCol size='12'>
                <IonItem className='roundTop roundBottom'>
                  <IonLabel position="stacked">{text.label_new_password}</IonLabel>
                  <IonInput ref={password} type="password" clearInput={true} placeholder={text.label_password}></IonInput>
                  <IonText color="danger">{showError[0] ? text.invalid_password : ""}</IonText>
                </IonItem>
              </IonCol>
              <IonCol size='12'>
                <IonItem className='roundTop roundBottom'>
                  <IonLabel position="stacked">{text.label_confirm_password}</IonLabel>
                  <IonInput ref={repeatPassword} type="password" clearInput={true} placeholder={text.label_password}></IonInput>
                  <IonText color="danger">{showError[1] ? text.differentpasswords : ""}</IonText>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow class="ion-justify-content-center">
              <IonCol size='12'>
                <IonButton expand="block" className='optionButtons' color="greenlight" onClick={() => { handleSubmit() }}> {text.header}</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    )
  }
}

export default RecoverPassword