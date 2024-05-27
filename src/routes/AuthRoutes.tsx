import { Route, Switch, useRouteMatch } from "react-router";
import { IonRouterOutlet } from "@ionic/react";
import AuthTab from "../pages/Auth/AuthTab";
import SignUpTab from "../pages/Auth/SignUpTab";
import RecoverPassword from "../pages/Auth/RecoverPassword";
import ErrorPage from "../pages/Error/ErrorPage";
import RecoverPasswordEmail from "../pages/Auth/RecoverPasswordEmail";

const AuthRoutes: React.FC = () => {
  const { path } = useRouteMatch(); //Current url
    return (
      <IonRouterOutlet>
        <Switch>
          <Route path={`${path}/login`} component={AuthTab} /> 
          <Route path={`${path}/signup`} component={SignUpTab} /> 
          <Route path={`${path}/reset-password/:token`} component={RecoverPassword} /> 
          <Route path={`${path}/reset-password`} component={RecoverPasswordEmail} /> 
          <Route path="/*" render={() => <ErrorPage error="404"/>}/> 
        </Switch>
      </IonRouterOutlet>
    );
  };

  export default AuthRoutes;