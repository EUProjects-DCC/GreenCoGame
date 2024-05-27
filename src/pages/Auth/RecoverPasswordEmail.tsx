import React, { useEffect, useRef, useState } from 'react'
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
  IonText,
  IonContent,
}
from '@ionic/react'
import { useHistory } from 'react-router'
import { sendEmailReset, alreadyUsedEmail } from './scripts/fetch'
import { showErrorMessage, validateEmail } from './scripts/utils'
import { getScreenText } from '../Story/scripts/fetch'
import LoadingPage from '../../components/LoadingPage'

import '../GreenCo.css';

const RecoverPasswordEmail = () => {
  
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user

    const [text, setText] = useState<any>({})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [presentToast] = useIonToast();
    const history = useHistory();

    const email = useRef<any>({ value: "" });
    const screen_id = '4';

    useEffect(() => {
      console.log("---RECOVERPASSWORDEMAIL--")      
      getScreenText(screen_id,language).then((res) => {
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
    }, [history]);

    //Check if the inserted email is valid and exists in the database to send the email to recover password
    const handleSubmit = () => {
      if(validateEmail(email.current.value)){ //If the email is valid, check if exists in the database
        alreadyUsedEmail(email.current.value).then((res)=>{ // Check if the email exists in the database 
          if(res.status === 409){
            sendEmailReset(email.current.value) //Send the email to recover password
            .then((res)=>{
                if(res.status === 200){
                  res.json().then((data)=>{
                    let error = showErrorMessage(text.email_sent, 'toastAuthTab', { text: 'Ok', role: 'cancel' }) // Show an success massage
                    presentToast(error);
                    history.push('/auth/login'); // Redirect to login page
                  })
                }
                else{ // If there are a server error, show an error message
                  res.json().then((data)=>{
                    let error = showErrorMessage(text.error_sending_mail, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
                    presentToast(error);
                  })
            }})
          }
          else if(res.status === 200){ //If the email doesn't exists in database, show an error message
            let error = showErrorMessage(text.email_not_found, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
            presentToast(error);
          }
          else{ //If there are a server error, show an error message
            let error = showErrorMessage(text.server_error, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
            presentToast(error);
          }
        })
      }
      else{ //If the email is not valir, show an error messaje
        let error = showErrorMessage(text.invalid_email, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
        presentToast(error);
      }
    }

    if (isLoading) {
      return <LoadingPage/>
    }
    else{
      return (
        <IonPage style={{ background: "url('/assets/background.png')" }}>
          <img className='imgInvis' alt='' src="/assets/icon/logo1.png"></img>
          <IonContent className='FormTemplate ion-padding-top'>
            <IonGrid>
            <IonRow class="ion-justify-content-center">
              <img className="logoGreenCo" src="/assets/icon/logoFooter.png" alt="GreenCo Project"></img>
                <IonCol size='12' style={{color:"black"}}>
                  <IonItem lines="none">
                    <IonText>{<h3>{text.header}</h3>}</IonText>
                  </IonItem>
                  <IonItem lines="none">
                    <IonText>{<p>{text.description}</p>}</IonText>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow class="ion-justify-content-center">
                <IonCol size='12'>
                  <IonItem className='roundTop roundBottom'>
                    <IonLabel position="stacked">{text.label_email}</IonLabel>
                    <IonInput ref={email} type="email" clearInput={true} placeholder={text.placeholder_email}></IonInput>
                    <IonText color="danger">{validateEmail(email.current.value) ? text.invalid_email : ""}</IonText>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow class="ion-justify-content-center">
                <IonCol size='12'>
                  <IonButton expand="block" className='optionButtons' color="greenlight" onClick = {()=>{handleSubmit()}}> {text.send_button}</IonButton>
                  <IonButton id='btnVolver' className='optionButtons' color="greenlight"  expand="block" href="/auth/login">{text.back_button}</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
        </IonContent>
        </IonPage>
      )
    }
}

export default RecoverPasswordEmail