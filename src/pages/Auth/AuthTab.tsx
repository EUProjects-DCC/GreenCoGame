import {
IonPage,
IonCheckbox,
IonLabel,
IonItem,
IonInput,
IonButton,
IonCol,
IonGrid,
IonRow,
useIonToast,
IonText,
IonContent,
IonHeader,
} from '@ionic/react';

import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { checkLogin } from './scripts/fetch';
import { errorHandler, showErrorMessage, validateData } from './scripts/utils';
import { getScreenText } from '../Story/scripts/fetch';
import LanguageSelector from './components/LanguageSelector';
import LoadingPage from '../../components/LoadingPage';

import './AuthTab.css';
import '../GreenCo.css';

const AuthTab: React.FC = () => {
  //Values to store and control options
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const login_credentials = JSON.parse(localStorage.getItem('login') || sessionStorage.getItem('login') || '{}'); // User's login credentials

  const [isLoading, setIsLoading] = useState<boolean>(true); // Load state
  const [text, setText] = useState<any>(); // Text to be shown in the screen
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  const [showError, setShowError] = useState<boolean[]>([false, false]); // Error status
  const [presentToast] = useIonToast(); // Error toast 
  const history = useHistory(); // Navigation history

  const alias = useRef<any>({ type: "alias", value: "" }); // Alias value
  const password = useRef<any>({ type: "password", value: "" }); // Password value
  const show = useRef<any>({ checked: false }); // checkbox to show password
  const remember = useRef<any>(login_credentials ? { checked: true } : { checked: false }); // Checkbox to remember user
  const screen_id = '1'; // Screen ID

  useEffect(() => {
    console.log("---LOGIN--")
    //Load the text of the Screen in the selected language
    getScreenText(screen_id, language).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setText(data);
          setIsLoading(false);
        });
      }
      else {
        //In case of server error, send to the previous page
        history.push(`/error/${res.status}`);
      }
    })
  }, [language, history]); // Is executed when the language is updated

  //Show or hide the password
  const showPassword = () => {
    if (show.current.checked) {
      password.current.type = "password";
      show.current.checked = false;
    }
    else {
      password.current.type = "text";
      show.current.checked = true;
    }
  };

  //Check if the option Remember user is selected
  const checkRemember = () => {
    if (remember.current.checked) {
      remember.current.checked = false;
    }
    else {
      remember.current.checked = true;
    }
  };

  //Try to start session
  const login = () => {
    //Get values of the form
    const user =
    {
      alias: alias.current.value,
      password: password.current.value
    }
    //Validate the data
    const validData = validateData(user, password.current.value);
    //Check if thre are errors
    errorHandler(validData, setShowError);
    //In case of no errors, start session
    if (validData.every((value) => !value === true)) {
      checkLogin(alias.current.value, password.current.value).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            //If the option Remember user is selected, it is stored in localStorage
            if (remember.current.checked) {
              localStorage.setItem('login', JSON.stringify({ alias: data.alias, password: data.password }));
            }
            else {
              // In case of no select the option Remember user, it is deleted of the localStorage (if exists)
              localStorage.removeItem('login');
            }
            // Store information of the user in the sessionStorage
            sessionStorage.setItem('data', JSON.stringify({ alias: alias.current.value, avatar: data.avatar, points: data.points }));
            sessionStorage.setItem('API', JSON.stringify({ token: data.token }));
            sessionStorage.setItem('difficulty', data.difficulty_id)
            sessionStorage.setItem('planet', data.planet_id)
            sessionStorage.setItem('language', language)
            //Redirect to the start page
            history.push('/story/start');
          })
        }
        else {
          //If the credentials are incorrect, show an error message to inform the user
          if (res.status === 401) {
            let error = showErrorMessage(text.invalid_credentials, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
            presentToast(error);
          }
          else {
            // If there are an error in the server, shown an error messange and redirect to the previous pagesi hay un error en el servidor, se muestra un mensaje de error y se redirige a la página de error
            let error = showErrorMessage(text.server_error, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
            presentToast(error);
            history.push(`/error/${res.status}`);
          }
        }
      })
    }
  };

  //Update language
  const updateLanguage = (newLanguage: number) => {
    setLanguage(newLanguage);
    sessionStorage.setItem('language', String(newLanguage)); // se guarda el idioma en sessionStorage
  };

  //If is loading, show the loading page
  if (isLoading) {
    return <LoadingPage></LoadingPage>
  }
  else {
    //If the load is complete, show the login page
    return (
      <IonPage>
        <IonHeader>
        </IonHeader>
        <IonContent className='FormTemplate ion-padding-top'>
          <IonItem>
            <LanguageSelector language={language} updateLanguage={updateLanguage} />
          </IonItem>
          <h1><img className="logoGreenCo" src="/assets/icon/logo1.png" alt="GreenCo project logo" /></h1>
          <IonGrid>
              <IonRow class="ion-justify-content-center">
                <IonCol size='12'>
                  <IonItem className='roundTop'>
                    <IonLabel position="stacked" className="labelgreenco">{text.label_alias}</IonLabel>
                    <IonInput
                      aria-label={text.label_alias}
                      ref={alias}
                      type="text"
                      clearInput={true}
                      placeholder={text.placeholder_alias}
                      value={login_credentials ? login_credentials.alias : alias.current.value} >
                    </IonInput>
                    <IonText color="danger">{showError[0] ? text.invalid_alias : ""}</IonText>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">{text.label_password}</IonLabel>
                    <IonInput
                      aria-label={text.label_password}
                      ref={password}
                      type={password.current.type}
                      placeholder={text.label_password}
                      value={login_credentials ? login_credentials.password : password.current.value}>
                    </IonInput>
                    <IonText color="danger">{showError[1] ? text.invalid_password : ""}</IonText>
                  </IonItem>
                  <IonItem>
                    <IonCheckbox slot='start' onClick={() => { showPassword() }} aria-label={text.show_password_button}></IonCheckbox>
                    <IonText >{text.show_password_button}</IonText>
                  </IonItem>
                  <IonItem className='roundBottom'>
                    <IonCheckbox slot='start' onClick={() => { checkRemember() }} checked={remember.current.checked} aria-label={text.remember_button}></IonCheckbox>
                    <IonText>{text.remember_button}</IonText>
                  </IonItem>
                  <IonButton className='optionButtons' color="greenlight" expand="block" onClick={() => login()}>{text.login_button}</IonButton>
                  <IonButton className='optionButtons' color="greenlight" expand="block" href="/auth/reset-password">{text.forgot_password_button}</IonButton>
                  <IonButton className='optionButtons' color="greenlight" expand="block" href="/auth/signup">{text.register_button}</IonButton>
                </IonCol>
              </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }
}

export default AuthTab;