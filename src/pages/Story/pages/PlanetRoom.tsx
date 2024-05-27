import { IonCard, IonContent, IonGrid, IonPage, IonRow, IonIcon, IonButton } from '@ionic/react'
import { Link, useHistory } from 'react-router-dom';
import { planetOutline, text, trophyOutline, } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import { getScreenAssets, getScreenText, checkAwardsLevel} from '../scripts/fetch';
import UserDataBar from '../components/UserDataBar'
import ChapterThumbnail from '../components/ChapterThumbnail';
import UserContext from '../components/UserContext';
import LoadingPage from '../../../components/LoadingPage';

import '../Story.css';
import '../../GreenCo.css';

const PlanetRoom = () => {

  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  const [text, setText] = useState<any>(null);
  const { state: UserState, dispatch: UserDispatch } = useContext(UserContext);
  const [props, setProps] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const screen_id = 19;  

  useEffect(() => 
  {
    console.log("---PLANET ROOM--")
  },[]);

  useEffect(() => {
    getScreenText(screen_id, language).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setText(data);
        });
      }
      else {
        history.push(`/error/${res.status}`);
      }
    })
    if (UserState.planet_id === null) { //Check if the user has select a planet
      switch(sessionStorage.getItem("planet"))
      {
        case "1": UserState.planet_id = 1; break;
        case "2": UserState.planet_id = 2; break;
        default: UserState.planet_id = 1; break;
      }
      
    }
    getScreenAssets(screen_id, UserState.planet_id, UserState.language_id).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setProps(data);
          setIsLoading(false);
        })
      }
      else {
        history.push(`/error/${res.status}`);
      }
    })
    
  }, [UserState.planet_id, UserState.language_id])

  const parseTexts = (changed_text: string) => {
    switch(sessionStorage.getItem("planet"))//Planet name
    {
      case "1":changed_text = changed_text.replace("[planet]", text.planet1); break;
      case "2":changed_text = changed_text.replace("[planet]", text.planet2); break;
      default: changed_text = changed_text.replace("[planet]", text.planet1); break;
    }
    switch(sessionStorage.getItem("difficulty"))//Difficulty name
    {
      case "1":changed_text = changed_text.replace("[difficulty]", text.level1); break;
      case "2":changed_text = changed_text.replace("[difficulty]", text.level2); break;
      case "3":changed_text = changed_text.replace("[difficulty]", text.level3); break;
      default: changed_text = changed_text.replace("[difficulty]", text.level1); break;
    }     
    return changed_text;
  }

  if (isLoading) {
    return <LoadingPage />
  }
  else {
    return (
      <IonPage className='StoryContainer' style={{
        backgroundImage: `url(/assets/Story/Planet_Room/${Number(UserState.planet_id) === 1 ? "be_0.jpg" : "bm_0.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100%",
        width: "100%",
        padding: "0px"
      }}>
        <UserDataBar />
        <IonContent className='storyContent'>
          <IonGrid style={{ height: "100%" }} className='ion-align-items-center ion-justify-content-center'>
            <IonRow class="ion-justify-content-center titleRoom">
                <div>
                  <h1 className='titlePlanetRoom' tabIndex={3}>
                    {parseTexts(text.planetlabel)}
                    <br/>
                    {parseTexts(text.levellabel)}
                  </h1>
                </div>
            </IonRow>
            <IonRow className='ion-justify-content-center'>
              <h2>
                <Link to={`/story/planetroom/energy-consumption`} style={{ textDecoration: "none" }} key={`Link_${props.ec_icon.text}`} tabIndex={5}>
                  <ChapterThumbnail img={props.ec_icon.path} text={props.ec_icon.text} />
                </Link>
              </h2>
              <h2>
                <Link to={`/story/planetroom/e-waste-recycling`} style={{ textDecoration: "none" }} key={`Link_${props.ewr_icon.text}`} tabIndex={6}>
                  <ChapterThumbnail img={props.ewr_icon.path} text={props.ewr_icon.text} />
                </Link>
              </h2>
            </IonRow>
            <IonRow className='ion-justify-content-center'>
              <h2>
                <Link to={`/story/planetroom/initiatives`} style={{ textDecoration: "none" }} key={`Link_${props.initiatives_icon.text}`} tabIndex={7}>
                  <ChapterThumbnail img={props.initiatives_icon.path} text={props.initiatives_icon.text} />
                </Link>
              </h2>
              <h2>
                <Link to={`/story/planetroom/legislation`} style={{ textDecoration: "none" }} key={`Link_${props.legislation_icon.text}`} tabIndex={8}>
                  <ChapterThumbnail img={props.legislation_icon.path} text={props.legislation_icon.text} />
                </Link>
              </h2>              
            </IonRow>
              <IonButton className='optionButtons' color="greenlight" expand="block" href='/user/ranking' tabIndex={9}>{text.ranking_icon}</IonButton>
              <IonButton className='optionButtons' color="greenlight" expand="block" href='/user/select-planet' tabIndex={10}>{text.changeplanet}</IonButton>
              <IonButton className='optionButtons' color="greenlight" expand="block" href="/user/select-difficulty" tabIndex={11}>{text.changelevel}</IonButton>
         
          </IonGrid>
        </IonContent>
      </IonPage >
    )
  }
}
export default PlanetRoom