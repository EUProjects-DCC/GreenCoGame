import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonContent, IonGrid, IonIcon, IonImg, IonItem, IonItemDivider, IonPage, IonRow } from '@ionic/react'
import { useEffect, useState } from 'react';
import Ranking from '../componentes/Ranking'
import { useHistory } from 'react-router';
import { getUserTop } from '../scripts/fetch';
import LoadingPage from '../../../components/LoadingPage';
import { getScreenText } from '../../Story/scripts/fetch';

import '../../GreenCo.css';

const RankingScreen = () => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) //Language selected by user
  const token = JSON.parse(sessionStorage.getItem('API')!).token;
  const alias = JSON.parse(sessionStorage.getItem('data')!).alias;
  const avatar = JSON.parse(sessionStorage.getItem('data')!).avatar;
  const [worldTop, setWorldTop] = useState<number>(-1);
  const [localTop, setLocalTop] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [text, setText] = useState<any>(null);
  const screen_id = 9;
  const history = useHistory();

  useEffect(() => {
    console.log("---RANKING SCREEN--")
    getScreenText(screen_id, language).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setText(data);
          console.log(data)
          setIsLoading(false);
        });
      }
      else {
        history.push(`/error/${res.status}`);
      }
    })
  }, [language]);

  useEffect(() => {
    if(token) {
      getUserTop("world",token).then((res) => { // Get the world ranking
        if(res.status === 200) {
          res.json().then((data) => {
            setWorldTop(data.position); // Update the user position in world ranking
            if(!alias.includes("guest")){
              getUserTop("local",token).then((res) => { //Get local ranking
                if(res.status === 200) {
                  res.json().then((data) => {
                    setLocalTop(data.position); // Update the user position in local ranking
                    setIsLoading(false);
                  });
                }
                else{
                  res.json().then(() => {
                    history.push(`/error/${res.status}`);
                  });
                }
              });
            }
            else{
              setIsLoading(false);
            }
          });
        }
        else{
          res.json().then(() => {
            history.push(`/error/${res.status}/`);
          });
        }
      });
    }
    else{
      history.push("/error/401");
    }
  },[]);

  if(isLoading) {
    return <LoadingPage/>
  }
  else{
    return (
      <IonPage className='StoryContainer' style={{padding:"0"}}>
        <IonContent style={{minHeight:"100%"}}>
          <IonCard>
              <IonCardContent>
                <IonRow class="ion-justify-content-center">
                  <IonCol size='auto'>
                    <div>
                      <h1>{text.ranking_icon}</h1>
                    </div>
                  </IonCol>
                </IonRow>
                <IonCardHeader className='Ranking-user'>
                  <IonImg alt="" src={
                    avatar ? avatar : "/assets/User/default_profile_picture.png"
                  } className='Ranking-user-avatar'/>
                  <div className="ranking-table">
                    <div className="ranking-cell">
                      <p className='ranking-cell-header'>{text.InterationalRank}</p>
                      <p>{worldTop}</p>
                    </div>
                    {
                      alias.includes("guest") // si el usuario es invitado, no se muestra su posición en el ranking local
                      ? <></>
                      : <div className="ranking-cell">
                          <p className='ranking-cell-header'>{text.NationalRank}</p>
                          <p>{localTop}</p>
                        </div>
                    }
                  </div>
                </IonCardHeader>
              </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardContent>
              <Ranking type="world" position={worldTop} text={text} ranking={text.InterationalRank}></Ranking>
            </IonCardContent>
          </IonCard>
              {
                alias.includes("guest") // si el usuario es invitado, no se muestra el ranking local
                ? <></>
                :
                <IonCard>
                  <IonCardContent>
                    <Ranking type="local" position={localTop} text={text} ranking={text.NationalRank}></Ranking>
                  </IonCardContent>
                </IonCard>
              }
              <IonButton id='btnVolver' className='optionButtons' color="greenlight" expand="block" onClick={()=>history.goBack()} aria-label={text.back_button}>{text.back_button}</IonButton>
        </IonContent>
      </IonPage>
    )
  }
}

export default RankingScreen