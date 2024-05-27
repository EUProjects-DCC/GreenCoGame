import {
  IonPage,
  IonLabel,
  IonItem,
  IonInput,
  IonCheckbox,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  useIonToast,
  IonSelect,
  IonSelectOption,
  IonRadioGroup,
  IonRadio,
  IonText,
  IonContent,
} from '@ionic/react';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'react-router-dom';
import { alreadyUsedAlias, alreadyUsedEmail, checkSignup, guestSignup } from './scripts/fetch';
import { errorHandler, getAge, showErrorMessage, validateData } from './scripts/utils';
import { getScreenText } from '../Story/scripts/fetch';
import LoadingPage from '../../components/LoadingPage';

import './AuthTab.css';
import '../GreenCo.css';

const SignUpTab: React.FC = () => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  
  const [age, setAge] = useState<number>(-1);
  const [country, setCountry] = useState<any>();
  const [gender, setGender] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [text, setText] = useState<any>({});
  const [presentToast] = useIonToast();

  const history = useHistory();
  const email = useRef<any>();
  const password = useRef<any>();
  const password2 = useRef<any>();
  const alias = useRef<any>();
  const [birthDate, setBirthDate] = useState<any>();
  const screen_id = '3'

  
  useEffect(() => {
    
    if(showError[0])
      {
        var focusError = document.getElementById("errorAlias");
        focusError?.focus();      
      }else if(showError[1])
      {
        var focusError = document.getElementById("errorEmail");
        focusError?.focus();      
      }else if(showError[2])
      {
        var focusError = document.getElementById("errorPassword");
        focusError?.focus();      
      }else if(showError[4])
      {
        var focusError = document.getElementById("errorCountry");
        focusError?.focus();      
      }else if(showError[5])
      {
        var focusError = document.getElementById("errorGender");
        focusError?.focus();      
      }else if(showError[7])
      {
        var focusError = document.getElementById("errorSamePassword");
        focusError?.focus();      
      }
  });

  useEffect(() => {
    console.log("---SIGNUP--")
    //Get the text of the screen in the language
    getScreenText(screen_id, language).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setText(data);
          setIsLoading(false);
        });
      }
      else {
        history.push(`/error/${res.status}`);
      }
    })
  }, [age, history, language])

  //show or hide password
  const showPassword = () => {
    if (show === false) {
      setShow(true);
    }
    else {
      setShow(false);
    }
  }

  const handleGenderChange = (event: CustomEvent) => {
    setGender(event.detail.value);
  };

  //Register user in database after check that all the information is correct and are not stored previously in the database
  const signUp = () => {
    const user = {
      alias: alias.current.value,
      email: email.current.value,
      password: password.current.value,
      birth_date: birthDate,
      country: country,
      gender: gender,
    }

    const validData = validateData(user, password2.current.value);

    errorHandler(validData, setShowError);
    
    if (password.current.value === password2.current.value) {
      if (validData.every((value) => !value === true)) {
        //Check if the email is in use
        alreadyUsedEmail(email.current.value).then((res) => {
          if (res.status === 200) {
            //Check if the alias is in use
            alreadyUsedAlias(alias.current.value).then((res) => {
              if (res.status === 200) {
                //Start the registry of the user
                checkSignup(user).then((res) => {
                  //If everything is ok, start to login
                  if (res.status === 200) {
                    //Store user's information in sessionStorage to be used in following screens
                    sessionStorage.setItem('login', JSON.stringify({ alias: user.alias, password: user.password }));
                    //Redirect to the login screen
                    history.push('/auth/login');
                  }
                  else { // If you have not registered successfully, an error message is displayed
                    let error = showErrorMessage(text.invalid_signup, 'toastAuthTab', { text: 'Ok', role: 'cancel' });
                    presentToast(error);
                    return false;
                  }
                })
              }
              else { // If the alias is already in use, an error message is displayed
                if (res.status === 409) {
                  let error = showErrorMessage(text.alias_used, 'toastAuthTab', { text: 'Ok', role: 'cancel' });
                  presentToast(error);
                  return false;
                }
                else { // If there is an error on the server, an error message is displayed
                  let error = showErrorMessage(text.invalid_signup, 'toastAuthTab', { text: 'Ok', role: 'cancel' });
                  presentToast(error);
                  return false;
                }
              }
            })
          }
          else {
            if (res.status === 409) { // If the email is already in use, an error message is displayed
              let error = showErrorMessage(text.email_used, 'toastAuthTab', { text: 'Ok', role: 'cancel' });
              presentToast(error);
              return false;
            }
            else { // If there is an error on the server, an error message is displayed
              let error = showErrorMessage(text.invalid_signup, 'toastAuthTab', { text: 'Ok', role: 'cancel' });
              presentToast(error);
              return false;
            }
          }
        })
      }
    } else {
      let error = showErrorMessage(text.differentpasswords, 'toastAuthTab', { text: 'Ok', role: 'cancel' });
      presentToast(error);
      var focusError = document.getElementById("errorSamePassword");
      focusError?.focus();      
      return false;
    }
  }

  if (isLoading) {
    return <LoadingPage></LoadingPage>
  }
  else {
    if (age < 16) {
      return (
        <IonPage style={{ background: "url('/assets/background.png')" }}>
          <IonContent className='FormTemplate ion-padding-top'>
            <IonGrid>
              <IonRow class="ion-justify-content-center ">
                <h1>
                  <img className="logoGreenCo" src="/assets/icon/logoFooter.png" alt="GreenCo project log co-funded by the European Union"></img>
                </h1>
                <IonCol tabIndex={1}>
                  <IonItem className='roundTop roundBottom' >
                    <h2>
                      <ReactMarkdown>{text.guest_signup}</ReactMarkdown>
                    </h2>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem className='roundTop roundBottom'>
                    <IonLabel position="stacked">{text.label_birth_date}</IonLabel>
                    <IonInput 
                      tabIndex={2}
                      ref={birthDate} 
                      type="text" 
                      clearInput={true} 
                      placeholder={text.placeholder_birth_date} 
                      onIonInput={(e) => { getAge(e.target.value, setAge, setBirthDate) }}>                      
                    </IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonButton tabIndex={3} className='optionButtons' color="greenlight" disabled={age !== -1 && age < 16 ? false : true} expand='block' onClick={() => {
                    guestSignup().then((res) => {
                      if (res.status === 200) {
                        res.json().then((data) => {
                          sessionStorage.setItem('data', JSON.stringify({ alias: data.alias, points: data.points }));
                          sessionStorage.setItem('API', JSON.stringify({ id: data.id, token: data.token }));
                          history.push('/story/start');
                        });
                      }
                      else {
                        let error = showErrorMessage(text.invalid_signup, 'toastAuthTab', { text: 'Ok', role: 'cancel' });
                        presentToast(error);
                        return false;
                      }
                    })
                  }}>
                    {text.guest_signup_button}
                  </IonButton>
                  <IonButton tabIndex={0} id='btnVolver' className='optionButtons' color="greenlight" expand="block" href="/auth/login">{text.back_button}</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonPage>
      )
    }
    else {
      return (
        <IonPage style={{ background: "url('/assets/background.png')" }}>
          <IonContent className='FormTemplate ion-padding-top'>
            <IonGrid>
              <IonRow class="ion-justify-content-center ">
                <img className="logoGreenCo" src="/assets/icon/logoFooter.png" alt="GreenCo project"></img>
                <IonCol size='12' >
                  <IonItem  tabIndex={0}>
                    <IonLabel position="stacked" >{text.label_alias}</IonLabel>
                    <IonInput ref={alias} type="text" placeholder={text.placeholder_alias} clearInput={true} maxlength={16} aria-label={text.label_alias}></IonInput>
                      <IonText id="errorAlias" color="danger" tabIndex={0} style={{ display: (showError[0] ? 'block' : 'none') }}>
                        {text.invalid_alias}
                      </IonText>
                      {}
                  </IonItem>
                  <IonItem  tabIndex={0}>
                    <IonLabel position="stacked" >{text.label_email}</IonLabel>
                    <IonInput aria-describedby="errorEmail" ref={email} type="email" clearInput={true} placeholder={text.placeholder_email} maxlength={100} aria-label={text.label_email}></IonInput>
                      <IonText id="errorEmail" color="danger" tabIndex={0} style={{ display: (showError[1] ? 'block' : 'none') }}>
                        {text.invalid_email}
                      </IonText>                   
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked" >{text.label_password}</IonLabel>
                    <IonInput aria-describedby="errorPassword" ref={password} type={show ? "text" : "password"} placeholder={text.label_password} clearInput={true} maxlength={30} aria-label={text.label_password}></IonInput>
                      <IonText id="errorPassword" color="danger" tabIndex={0} style={{ display: (showError[2] ? 'block' : 'none') }}>
                        {text.invalid_password}
                      </IonText> 
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">{text.label_password}</IonLabel>
                    <IonInput aria-describedby="errorSamePassword" ref={password2} type={show ? "text" : "password"} aria-label={text.label_password} placeholder={text.label_password2} clearInput={true} maxlength={30}></IonInput>
                      <IonText id="errorSamePassword" color="danger" tabIndex={0} style={{ display: (showError[7] ? 'block' : 'none') }}>
                        {text.differentpasswords}
                      </IonText> 
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">{text.label_country}</IonLabel>
                    <IonSelect
                      aria-describedby="errorCountry" 
                      aria-label={text.label_country}
                      placeholder={text.placeholder_country}
                      interfaceOptions={{
                        header: `${text.placeholder_country}`,
                        subHeader: `${text.subheader_country}`,
                        cssClass: 'selectCountry'
                      }}
                      onIonChange={(e) => { setCountry(e.detail.value) }}>
                      <IonSelectOption value="es">{text.label_country_1}</IonSelectOption>
                      <IonSelectOption value="fr">{text.label_country_2}</IonSelectOption>
                      <IonSelectOption value="it">{text.label_country_3}</IonSelectOption>
                      <IonSelectOption value="bg">{text.label_country_4}</IonSelectOption>
                      <IonSelectOption value="ot">{text.label_country_6}</IonSelectOption>
                    </IonSelect>
                      <IonText id="errorCountry" color="danger" tabIndex={0} style={{ display: (showError[4] ? 'block' : 'none') }}>
                        {text.invalid_country}
                      </IonText> 
                  </IonItem>
                  <IonItem>
                    <IonRadioGroup className="genderRadioButtons ionic-content-center" onIonChange={handleGenderChange} aria-describedby="errorGender" >
                      <IonRadio value={"Man"} aria-label={text.label_gender_1}></IonRadio>
                      <IonLabel style={{ color: "black" }}>{text.label_gender_1}</IonLabel>
                      <IonRadio value={"Woman"} aria-label={text.label_gender_2}></IonRadio>
                      <IonLabel style={{ color: "black" }}>{text.label_gender_2}</IonLabel>
                      <IonRadio value={"Other"} aria-label={text.label_gender_3}></IonRadio>
                      <IonLabel style={{ color: "black" }}>{text.label_gender_3}</IonLabel>
                    </IonRadioGroup>  
                      <IonItem lines="none">
                        <IonText color="danger" id="errorGender" tabIndex={0} style={{ display: (showError[5] ? 'block' : 'none') }}>
                          {text.invalid_gender}
                        </IonText>
                      </IonItem>        
                  </IonItem>
                  <IonItem className='roundBottom' lines="none">
                    <IonCheckbox aria-label={text.show_password_button} slot='start' onClick={() => { showPassword() }}></IonCheckbox>
                    <IonLabel> {text.show_password_button} </IonLabel>
                  </IonItem>
                  <IonButton id='btnRegister' className='optionButtons' color="greenlight" expand="block" onClick={() => { signUp() }}>{text.signup_button}</IonButton>
                  <IonButton id='btnVolver' className='optionButtons' color="greenlight" expand="block" href="/auth/login">{text.back_button}</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonPage>
      );
    }
  }
}
export default SignUpTab;