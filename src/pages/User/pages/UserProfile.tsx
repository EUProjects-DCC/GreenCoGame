import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonPage, IonRow } from '@ionic/react'
import { chevronBack } from 'ionicons/icons';
import { Link, useHistory } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { getUserAward, getUserProfile } from '../../Story/scripts/fetch';
import Badge from '../componentes/Badge'
import LoadingPage from '../../../components/LoadingPage';
import UserContext from '../../Story/components/UserContext';
import { getScreenText } from '../../Story/scripts/fetch';
import { getUserTop } from '../scripts/fetch';
import LanguageSelector from '../../Auth/components/LanguageSelector';

import './UserProfile.css'
import '../../GreenCo.css';
import '../../Auth/components/LanguageSelector.css'

interface LanguageSelectorProps {
  language: string; //Current langauge
  updateLanguage: (language: number) => void; // Function to update the language
}
const UserProfile = () => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Initial language (English if therer is no selected language) 
  const [text, setText] = useState<any>(); // screen text
  const [language, setLanguage] = useState<any>(initialLanguage) // current language
  const { state, dispatch } = useContext(UserContext); //Get global user's state
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const history = useHistory();
  const screen_id = 6;
  const alias = JSON.parse(sessionStorage.getItem('data')!).alias;
  const [worldTop, setWorldTop] = useState<number>(0);
  const [localTop, setLocalTop] = useState<number>(0);
  const [awards, setAwards] = useState<Array<any>>([]) // award list
  const [earthAwards, setEarthAwards] = useState<Array<any>>([]) // award list
  const [marsAwards, setMarsAwards] = useState<Array<any>>([]) // award list

  //Close Session and clear the session storage with the user info
  const closeSession = () => {
    sessionStorage.clear()
    history.push(``);
  }

  //Update the language
  const updateLanguage = (newLanguage: number) => {
    setLanguage(newLanguage);
    sessionStorage.setItem('language', String(newLanguage)); // Store language in sessionStorage
    setEarthAwards([])
    setMarsAwards([])
  };

  useEffect(() => {
    console.log("---USER PROFILE--")
    const user = JSON.parse(sessionStorage.getItem('API') || 'null'); // Get user's token from sessionStorage
    if (user) {
      getUserProfile(user.token) // Get user profile
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              setUser(data);
              getScreenText(screen_id, language).then((res) => {  //Get list of screen text
                if (res.status === 200) {
                  res.json().then((data) => {
                    setText(data);

                    getUserAward(user.token, language).then((res_awards) => { // Get list of awards
                      if (res_awards.status === 200) {
                        res_awards.json().then((awards) => {
                          setAwards(awards)
                          for (let i in awards) {
                            if (awards[i].planet_id==1) {
                                earthAwards.push(awards[i])
                            }else{
                              marsAwards.push(awards[i])
                            }
                          }
                        })
                      }
                    })

                    if (!alias.includes("guest")) {
                      getUserTop("world", user.token).then((res) => { // get world ranking
                        if (res.status === 200) {
                          res.json().then((data) => {
                            setWorldTop(data.position); // update workd rank
                          })
                        }
                      })
                      getUserTop("local", user.token).then((res) => { // get world ranking
                        if (res.status === 200) {
                          res.json().then((data) => {
                            setLocalTop(data.position); // update workd rank
                          })
                        }
                      })
                    }
                    setIsLoading(false);
                  });
                }
              })
            });
          }
        })
    }
    else {
      history.push('/auth/login');
    }
  }, [language]);

  if (isLoading) {
    return <LoadingPage />
  }
  else {
    return (
      <IonPage className='StoryContainer' style={{ padding: "0" }}>
        <IonContent>
          <IonCard>
            <IonGrid>
              <IonCardHeader>
                <IonCardContent>
                  <IonRow>
                    <LanguageSelector language={language} updateLanguage={updateLanguage} />
                  </IonRow>
                  <IonRow class="ion-justify-content-center">
                    <IonCol size='auto'>
                      <div>
                        <h1>{text.userprofile}</h1>
                      </div>
                    </IonCol>
                  </IonRow>
                  <IonRow class="ion-justify-content-center">
                    <IonCol size='auto'>
                      <div>
                        <img className='ProfilePicture' src={user.avatar ? user.avatar : "/assets/User/default_profile_picture.png"} alt=""></img>
                        <p style={{ color: "black" }}>{user.alias}</p>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCardHeader>
              <IonCardContent>
                <IonRow >
                  <div className='StatisticField'>
                    <p style={{ color: "black" }} className='StatisticName'><b>{text.points}: </b></p>
                    <p style={{ color: "black" }}>{user.points}</p>
                  </div>
                </IonRow>
                {
                  !user.alias.includes("guest") //If the user is not a guest a button to edit profile is shown
                    ?
                    <><IonRow >
                        <div className='StatisticField'>
                          <p style={{ color: "black" }} className='StatisticName'><b>{text.NationalRank}: </b></p>
                          <p style={{ color: "black" }}>{localTop}</p>
                        </div>
                      </IonRow>
                      <IonRow >
                        <div className='StatisticField'>
                          <p style={{ color: "black" }} className='StatisticName'><b>{text.InterationalRank}: </b></p>
                          <p style={{ color: "black" }}>{worldTop}</p>
                        </div>
                      </IonRow></>
                    :
                    <></>
                }
              </IonCardContent>
              <IonCardContent>
                <IonRow class="ion-justify-content-center">
                  <IonCol size='auto'>
                    <h2 style={{ color: "black" }}><b>{text.Awards}</b></h2>
                  </IonCol>
                </IonRow>
                <IonRow class="ion-justify-content-center">
                  <IonCol size='auto'>
                    <h2 style={{ color: "black" }}><b>{text.planet1}</b></h2>
                  </IonCol>
                  <div id='BadgesContainer' className='BadgesContainer'>
                    <>
                      {
                        earthAwards.map((element: any) => (
                          <Badge name={element.text} image={"/assets/Awards/medal_level" + element.difficulty + "_" + element.planet_id + "_" + element.level_id + ".png"} difficulty={element.difficulty} planet={element.planet}></Badge>
                        ))
                      }
                    </>
                  </div>
                </IonRow>
                <IonRow class="ion-justify-content-center">
                  <IonCol size='auto'>
                    <h2 style={{ color: "black" }}><b>{text.planet2}</b></h2>
                  </IonCol>
                  <div id='BadgesContainer' className='BadgesContainer'>
                    <>
                      {
                        marsAwards.map((element: any) => (
                          <Badge name={element.text} image={"/assets/Awards/medal_level" + element.difficulty + "_" + element.planet_id + "_" + element.level_id + ".png"} difficulty={element.difficulty} planet={element.planet}></Badge>
                        ))
                      }
                    </>
                  </div>
                </IonRow>
              </IonCardContent>
              <IonCol class="ion-justify-content-center">
                {
                  !user.alias.includes("guest") //If the user is not a guest a button to edit profile is shown
                    ?
                    <IonButton id='btnEditProfile' className='optionButtons' color="greenlight" expand="block" href="/user/profile/modify">{text.EditInfo}</IonButton>
                    :
                    <></>
                }
                <IonButton id='btnVolver' className='optionButtons' color="greenlight" expand="block" href="/story/start">{text.back_button}</IonButton>
                <IonButton id='btnCloseSession' className='optionButtons' color="greenlight" expand="block" onClick={() => { closeSession() }}>{text.closeSession}</IonButton>
              </IonCol>
            </IonGrid>
          </IonCard>
        </IonContent>
      </IonPage>
    )
  }
}

export default UserProfile