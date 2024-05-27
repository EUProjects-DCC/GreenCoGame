import { Route, Switch, useRouteMatch } from "react-router";
import { IonRouterOutlet } from "@ionic/react";
import ErrorPage from "../pages/Error/ErrorPage";
import PlanetRoom from "../pages/Story/pages/PlanetRoom";
import App from "../pages/Story/App";
import { useContext } from "react";
import UserContext from "../pages/Story/components/UserContext";

const StoryRoutes: React.FC = () => {

  const { path } = useRouteMatch();
  
  const {state:UserState, dispatch:UserDispatch} = useContext(UserContext);
  return (
    <IonRouterOutlet>
      <Switch>
          <Route path={`${path}/start`} render={() => <App/>} /> 
          <Route path={`${path}/end`}   render={() => <App screen_id={200}/>} /> 
          <Route path={`${path}/planetsaved`}   render={() => <App screen_id={ Number(UserState.planet_id)===1? 201 : 202}/>} /> 
          <Route path={`${path}/universesaved`}   render={() => <App screen_id={203}/>} /> 
          <Route path={`${path}/planetroom`} component={PlanetRoom} exact={true} />  
          <Route path={`${path}/planetroom/energy-consumption`} render={() => <App screen_id={ Number(UserState.planet_id)===1? 20 : 120} level_id={1}/>} exact={true} />  
          <Route path={`${path}/planetroom/e-waste-recycling`} render={() => <App screen_id={ Number(UserState.planet_id)===1? 40 : 140} level_id={2}/>} exact={true} /> 
          <Route path={`${path}/planetroom/initiatives`} render={() => <App screen_id={ Number(UserState.planet_id)===1? 60 : 160}  level_id={3}/>} exact={true} /> 
          <Route path={`${path}/planetroom/legislation`} render={() => <App screen_id={ Number(UserState.planet_id)===1? 80 : 180} level_id={4}/>} exact={true} /> 
          <Route path="/*" render={() => <ErrorPage error="404"/>}/>
      </Switch>
    </IonRouterOutlet>
  );
};

export default StoryRoutes;