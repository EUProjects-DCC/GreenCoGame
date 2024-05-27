import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import { IonRouterOutlet } from "@ionic/react";
import UserProfile from "../pages/User/pages/UserProfile";
import RankingScreen from "../pages/User/pages/RankingScreen";
import ChangeProfile from "../pages/User/pages/ChangeProfile";
import ChangeAvatar from "../pages/User/pages/ChangeAvatar";
import ErrorPage from "../pages/Error/ErrorPage";
import App from "../pages/Story/App";

const UserRoutes: React.FC = () => {
  const { path } = useRouteMatch();
  const user = JSON.parse(sessionStorage.getItem('data') || 'null'); //Getting the user from the session storage

  if (!user || user.alias.includes('guest')) { //If its a guest, redirect to the login page
    return (
      <IonRouterOutlet>
        <Switch>
          <Route path={`${path}/profile`} component={UserProfile} exact={true} />
          <Route path={`${path}/ranking`} component={RankingScreen} exact={true} />
          <Route path={`${path}/select-difficulty`} render={() => (<App screen_id={11} />)} exact={true} />
          <Route path={`${path}/select-planet`} render={() => (<App screen_id={17} />)} exact={true} />
          <Route path="/*">
            <Redirect to="/user/profile" />
          </Route>
        </Switch>
      </IonRouterOutlet>
    );
  }
  else { //If is a registered user, show the protected paths
    return (
      <IonRouterOutlet>
        <Switch>
          <Route path={`${path}/profile`} component={UserProfile} exact={true} />
          <Route path={`${path}/profile/modify`} component={ChangeProfile} exact={true} />
          <Route path={`${path}/profile/modify/change-avatar`} component={ChangeAvatar} exact={true} />
          <Route path={`${path}/ranking`} component={RankingScreen} exact={true} />
          <Route path={`${path}/select-difficulty`} render={() => (<App screen_id={11} />)} exact={true} />
          <Route path={`${path}/select-planet`} render={() => (<App screen_id={17} />)} exact={true} />
          <Route path="/*" render={() => <ErrorPage error="404" />} />
        </Switch>
      </IonRouterOutlet>
    );
  }
};

export default UserRoutes;