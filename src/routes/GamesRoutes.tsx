import { Route, Switch, useRouteMatch } from "react-router";
import { IonRouterOutlet } from "@ionic/react";
import ErrorPage from "../pages/Error/ErrorPage";
import Playground from "../pages/Story/pages/Playground";

const GameRoutes: React.FC = () => {
    const { path } = useRouteMatch(); //Current url

    return (
      <IonRouterOutlet>
        <Switch>
          <Route path={`${path}/test`} render={() => <Playground/>} /> 
          <Route path="/*" render={() => <ErrorPage error="404"/>}/> 
        </Switch>
      </IonRouterOutlet>
    );
  };

  export default GameRoutes;