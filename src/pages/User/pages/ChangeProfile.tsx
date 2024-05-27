import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow, useIonToast } from '@ionic/react'
import { useHistory } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react'
import { validateEmail } from '../../Auth/scripts/utils';
import { showErrorMessage } from '../../Auth/scripts/utils';
import { alreadyUsedEmail } from '../../Auth/scripts/fetch';
import { validatePassword } from '../../Auth/scripts/utils';
import { updateProfile } from '../scripts/fetch';
import { getScreenText } from '../../Story/scripts/fetch';
import LoadingPage from '../../../components/LoadingPage';
import LanguageSelector from '../../Auth/components/LanguageSelector';

import './UserProfile.css'
import '../../GreenCo.css';
import '../../Auth/components/LanguageSelector.css'

const ChangeProfile = () => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const email = useRef<HTMLIonInputElement>(null);
  const password = useRef<HTMLIonInputElement>(null);
  const avatar = JSON.parse(sessionStorage.getItem('data')!).avatar
  const [language, setLanguage] = useState<any>(initialLanguage) //Langugage selected by the user
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [text, setText] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const screen_id = 7;

  useEffect(() => {
    console.log("---CHAGE PROFILE--")
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
  }, [language]);


  // Update language
  const updateLanguage = (newLanguage: number) => {
    setLanguage(newLanguage);
    sessionStorage.setItem('language', String(newLanguage)); // Store the language in the sessionStorage
  };

  const validateForm = () => {
    if (validateEmail(email.current?.value!)) {
      alreadyUsedEmail(email.current?.value!)
        .then((res) => {
          if (res.status === 409) {
            let error = showErrorMessage(text.email_used, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
            presentToast(error);
          }
          else {
            if (res.status === 200) {
              if (validatePassword(password.current?.value!)) {
                const user = JSON.parse(localStorage.getItem('API') || sessionStorage.getItem('API') || 'null');
                if (user) {
                  updateProfile(email.current?.value!, password.current?.value!, user.token)
                    .then((res) => {
                      if (res.status === 200) {
                        let message = showErrorMessage(text.updateProfileOk, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
                        presentToast(message);
                      }
                      else {
                        let error = showErrorMessage(text.updateProfileOError, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
                        presentToast(error);
                      }
                    })
                }
                else {
                  history.push("/auth/login");
                }
              }
              else {
                let error = showErrorMessage(text.fillPassword, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
                presentToast(error);
              }
            }
            else {
              let error = showErrorMessage(text.emailError, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
              presentToast(error);
            }
          }
        })
    }
    else {
      let error = showErrorMessage(text.fillEmail, 'toastAuthTab', { text: 'Ok', role: 'cancel' })
      presentToast(error);
    }
  }
  if (isLoading) {
    return <LoadingPage></LoadingPage>
  }
  else {
    return (
      <IonPage className='StoryContainer'>
        <IonContent>
          <IonCard>
            <IonCardContent>
              <IonRow>
                <LanguageSelector language={language} updateLanguage={updateLanguage} />
              </IonRow>
              <IonGrid>
                <IonRow class="ion-justify-content-center">
                  <IonCol size='auto'>
                    <div>
                      <h1>{text.userprofile}</h1>
                    </div>
                  </IonCol>
                </IonRow>
                <IonRow class="ion-justify-content-center">
                  <IonCol size="auto" >
                    <div>
                      <img className='ProfilePicture overlap' src="/assets/icon/edit1.png" alt=""
                        style={{ position: "absolute" }} onClick={() => history.push("/user/profile/modify/change-avatar")}></img>
                      <img className='ProfilePicture' src={avatar ? avatar : "/assets/User/default_profile_picture.png"} alt=""></img>
                      <p style={{ color: "black" }}>{text.tapPicture}</p>
                    </div>
                  </IonCol>
                </IonRow>
                <IonRow class="ion-justify-content-center">
                  <IonCol size="auto">
                    <IonItem>
                      <IonLabel position="stacked">{text.newEmail}</IonLabel>
                      <IonInput ref={email} type="text" clearInput={true} placeholder={"user@gmail.com"}></IonInput>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow class="ion-justify-content-center">
                  <IonCol size="auto">
                    <IonItem>
                      <IonLabel position="stacked">{text.label_new_password}</IonLabel>
                      <IonInput ref={password} type="password" clearInput={true} placeholder={"password"}></IonInput>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow class="ion-justify-content-center">
                </IonRow>
                <IonRow class="ion-justify-content-center">
                  <IonCol class="ion-justify-content-center">
                    <IonButton className='optionButtons' color="greenlight" expand="block" onClick={() => { validateForm() }}>{text.Update}</IonButton>
                    <IonButton id='btnVolver' className='optionButtons' color="greenlight" expand="block" href="/user/profile">{text.back_button}</IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    )
  }
}
export default ChangeProfile