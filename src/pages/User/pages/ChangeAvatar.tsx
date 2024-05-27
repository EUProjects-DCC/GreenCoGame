import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonIcon,
  useIonToast,
  IonButton
}
  from '@ionic/react';
import { checkmark, chevronBack } from 'ionicons/icons';
import LoadingPage from '../../../components/LoadingPage';
import { useHistory } from 'react-router';
import { getAvatars, updateAvatar } from '../scripts/fetch';
import { showErrorMessage } from '../../Auth/scripts/utils';
import { getScreenText } from '../../Story/scripts/fetch';
import './ChangeAvatar.css';
import '../../GreenCo.css';
import '../../Story/Story.css'

interface Avatar {
  path: string;
}

const ChangeAvatar: React.FC = () => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  const [avatar, setAvatar] = useState(JSON.parse(sessionStorage.getItem('data')!).avatar)
  const [avatarList, setAvatarList] = useState<Array<Avatar>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [presentToast] = useIonToast();
  const history = useHistory();
  const [text, setText] = useState<any>(null);
  const screen_id = 8;

  const changeAvatar = () => {
    const user = JSON.parse(localStorage.getItem('API') || sessionStorage.getItem('API') || 'null');
    if (user) {
      updateAvatar(avatar, user.token).then(
        (response) => {
          if (response.status === 200) {
            sessionStorage.setItem('data', JSON.stringify({ ...JSON.parse(sessionStorage.getItem('data')!), avatar: avatar }));
            history.push('/user/profile');
          }
          else {
            let error = showErrorMessage(text.avatarErrorUpdate, 'toastAuthTab', { text: 'Ok', role: 'cancel' });
            presentToast(error);
          }
        }
      )
    }
  }

  useEffect(() => {
    console.log("---CHANGE AVATAR--")
    getScreenText(screen_id, language).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setText(data);
          setIsLoading(false);
        });
      }
      else {
        history.push('/auth/login');
      }
    })

    const user = JSON.parse(localStorage.getItem('API') || sessionStorage.getItem('API') || 'null');
    if (user) {
      getAvatars(user.token).then(
        (response) => {
          if (response.status === 200) {
            response.json().then(
              (data) => {
                setAvatarList(data.rows);
                setIsLoading(false);
              }
            )
          }
          else {
            let error = showErrorMessage(text.avatarErrorget, 'toastAuthTab', { text: 'Ok', role: 'cancel' });
            presentToast(error);
          }
        }
      )
    }
    else {
      history.push(`/auth/login`);
    }
  }, [language]);

  if (isLoading) {
    return (
      <LoadingPage></LoadingPage>
    )
  }
  else {
    return (
      <IonPage className='StoryContainer'>
        <IonContent>
          <IonCard>
            <IonGrid>
              <IonRow class="ion-justify-content-center">
                <IonCol size='auto'>
                  <div>
                    <h1>{text.userprofile}</h1>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonCardContent className='user-avatar-container'>
              <IonImg className="user-avatar-image" src={
                avatar ? avatar : 'assets/User/default_profile_picture.png'
              } />
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardContent className='avatar_list-container'>
              <IonGrid>
                <IonRow class='ion-justify-content-around'>
                  {
                    avatarList.length > 0 ? avatarList.map((avatar, index) => (
                      <IonCol key={index} size="3">
                        <IonImg src={avatar.path} className='avatar_list-item' onClick={() => setAvatar(avatar.path)} />
                      </IonCol>
                    ))
                      :
                      <IonCol>
                        <p>{text.noAvatars}</p>
                      </IonCol>
                  }
                </IonRow>
                <IonRow class="ion-justify-content-center">
                  <IonCol>
                    <IonButton className='optionButtons' color="greenlight" expand="block" onClick={() => changeAvatar()}>{text.Update}</IonButton>
                    <IonButton className='optionButtons' color="greenlight" expand="block" href="/user/profile/modify">{text.back_button}</IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }
};

export default ChangeAvatar;