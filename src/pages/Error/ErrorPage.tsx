import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getErrorMessage } from "./utils/fetch";

import "./ErrorPage.css";
import { IonPage } from "@ionic/react";

interface ErrorPageProps {
  error: string; // Error code
} 

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {

  const history = useHistory();

  useEffect(() => {
    
    history.push("/story/planetroom") 
  }, []);

  return (
    <IonPage style={{background: "url('/assets/background.png')"}}>
    </IonPage>
   
  );
};

export default ErrorPage;