import React, { useReducer, useEffect, useState } from 'react';
import { Route, Switch } from "react-router";
import { IonRouterOutlet } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { userReducer } from '../pages/Story/components/UserReducer';
import { getUserProfileBrief } from '../pages/Story/scripts/fetch';
import { UserState } from '../pages/Story/scripts/Interfaces';
import StoryRoutes from "./StoryRoutes";
import GameRoutes from "./GamesRoutes";
import UserRoutes from "./UserRoutes";
import AuthRoutes from "./AuthRoutes";
import UserContext from '../pages/Story/components/UserContext';

const ProtectedRoutes = () => {
    const validated = sessionStorage.getItem('data') ? true : false; //Si exists information on sessionStorage, the user is correct
    const history = useHistory(); //Browsing history

    //Initial state of the user's context
    const initialState: UserState = {
        token: null,
        alias: null,
        points: 0,
        avatar: null,
        language_id: null || 2, //By default, the language is English
        difficulty_id: null,
        planet_id: null,
    };

    const [state, dispatch] = useReducer(userReducer, initialState); //Reduce the user
    const [isLoading, setIsLoading] = useState(true); //Load status

    useEffect(() => {
        if (validated) { //Si the user is validated, get its profile
            const token = JSON.parse(sessionStorage.getItem('API') || '{}').token;
            getUserProfileBrief(token).then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        data.language_id = sessionStorage.getItem('language') || 2;
                        data.token = token;
                        dispatch({ type: 'INITIALIZE_STATE', payload: data }); //Initialize the user's state
                    });
                }
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [validated, dispatch]); //Execute when the user is login or when the name of the user is initializing

    if (isLoading) {
        return null; //If is loading, don't show
    }

    if (!validated) {
        history.push('/auth/login'); //If the user is not validated, redirect to the login page
        return (
            <IonRouterOutlet>
                <AuthRoutes/>
            </IonRouterOutlet>
        );
    }
    else { //If its validated, show the protected paths
        return (
            <UserContext.Provider value={{ state, dispatch }}> 
                <IonRouterOutlet>
                    <Switch>
                        <Route path="/story" component={StoryRoutes} /> 
                        <Route path="/games" component={GameRoutes} /> 
                        <Route path="/user" component={UserRoutes} /> 
                    </Switch>
                </IonRouterOutlet>
            </UserContext.Provider>
        );
    }
}

export default ProtectedRoutes;