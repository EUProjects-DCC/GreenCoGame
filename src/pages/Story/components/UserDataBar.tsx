import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { getUserProfile } from '../scripts/fetch';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import LoadingPage from '../../../components/LoadingPage';
import UserContext from './UserContext';
import { getScreenText } from '../scripts/fetch';

import './UserDataBar.css';
import '../../GreenCo.css'
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { batteryFull } from 'ionicons/icons';

const UserDataBar = () => {

  const [text, setText] = useState<any>({});
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
  
  const {state, dispatch} = useContext(UserContext)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const history = useHistory();
  useEffect(() => {
    console.log("---USERDATA BAR--")
    //Get text of the points
    getScreenText(19,language).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {          
          setText(data);
        });
      }
    })
    if(state.token!==null){
      setIsLoading(false)
    }
    
  }, [state]);
  
  //Validate the input. Check if it's a letter
  const keypressed = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      history.push("/user/profile");
    }
  }

  if (isLoading) {
    return <LoadingPage></LoadingPage>
  }
  else{
    return (
      <IonCard style={{margin:"0", borderRadius:"0px"}} >
        <IonCardContent className='user-databar-content' >
          <div style={{display:"flex", flexDirection:"row"}}>
            <img src={state.avatar ? state.avatar : "/assets/User/default_profile_picture.png"} 
                  onKeyDown={(e) => keypressed(e)} onClick={()=>{history.push("/user/profile")}} alt={text.EditInfo} tabIndex={1}/>
            <p>{state.alias}</p>
          </div>
          <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <p tabIndex={2}>{state.points} {text.points}</p>
          </div>
      </IonCardContent>
      </IonCard>
    )
  }
}

export default UserDataBar