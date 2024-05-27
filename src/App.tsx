import { Redirect, Route, Switch } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import WelcomeTab from './pages/WelcomeTab';
import AuthRoutes from './routes/AuthRoutes';
import ErrorPage from './pages/Error/ErrorPage';
import ProtectedRoutes from './routes/ProtectedRoutes';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            <Route path="/" component={WelcomeTab} exact={true} /> 
            <Route path="/welcome" component={WelcomeTab} exact={true} /> 
            <Route path="/auth" component={AuthRoutes}/> 
            <Route path="/games" component={ProtectedRoutes} /> 
            <Route path="/story" component={ProtectedRoutes} /> 
            <Route path="/user" component={ProtectedRoutes} /> 
            <Route path="/error/:error" render={(props) => <ErrorPage error={props.match.params.error} />} /> 
            <Route path="/*" render={() => <ErrorPage error="404"/>}/> 
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;