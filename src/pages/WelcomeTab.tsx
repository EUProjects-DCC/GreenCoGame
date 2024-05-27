import { IonPage } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import './GreenCo.css';

interface KeyPressed {
  pressed: boolean;
}

const WelcomeTab: React.FC = () => {
  //Store the sessionStorage information to be used in the following screens
  sessionStorage.setItem('language', (2).toString());
  sessionStorage.setItem('difficulty', (1).toString());
  sessionStorage.setItem('planet', (1).toString());

  const [ keyPressed, setKeyPressed ] = useState<KeyPressed>({
    pressed: false,
  });

  useEffect(() => {
    const keyDownHandler = (event: { key: string; preventDefault: () => void; }) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        setKeyPressed({pressed:true});
        document.removeEventListener('keydown', keyDownHandler);
      }
    };

    const touchHandler = (event:Event) => {
      event.preventDefault();
      setKeyPressed({pressed:true});
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('touchstart', touchHandler);

    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('touchstart', touchHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('touchstart', touchHandler);
    };
  }, []);

  //After 4 seconds it redirects to the login page
  setTimeout(() => {
    setKeyPressed({pressed:true});
  }, 4000);

  if(keyPressed.pressed){ // If a key has been pressed or the screen has been touched, you will be redirected to the login page.
    return(
    <Route>
      <Redirect from="/*" to="/auth/login"></Redirect>
    </Route>
    )

  }
  else{ // If a key has not been pressed or the screen has not been touched, the welcome screen is displayed.
    return (
      <IonPage style={{background: "url('/assets/background.png')"}}>
        <div id = "header">
          <br/>
          <img id='welcomeGreenCo' src="/assets/icon/logo1.png" alt="GreenCo project logo"></img>
          <p id="ptitle">TEST YOUR KNOWLEDGE OF DIGITAL POLLUTION AND RESPONSIBLE USE OF TECHNOLOGY</p>
          <p id="prights">&copy; 2024 | GreenCo Project Consortium</p>
          <p id="prights">All rights reserved</p>
          <img id='welcomeEU' src="/assets/icon/EuropeaCoFund.png" alt="project Co-funded by the European Union logo"></img>
        </div>
      </IonPage>
    );
  }

}

  export default WelcomeTab;
