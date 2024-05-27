import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './Footer.css';

const Footer = () => {
  return (
    <IonGrid id='footerGrid'>
      <IonRow class="ion-justify-content-center ion-align-items-center">
        <IonCol size="12" size-xl="4">
          <img src="/assets/icon/logoFooter.png" alt=""></img>
        </IonCol>
        <IonCol size="12" size-xl="8">
          <p>GreenCo está cofinanciado por el Programa Erasmus+ de la Unión Europea.</p>
          <p>
            Las opiniones expresadas en los documentos de trabajo, los resultados y los informes son las de los socios
            del consorcio del proyecto. Estas opiniones no han sido adoptadas ni aprobadas por la Comisión y no deben
            considerarse como una declaración de la opinión de la Comisión o de sus servicios. La Comisión Europea
            no garantiza la exactitud de los datos incluidos en los documentos de trabajo e informes,
            ni se hace responsable del uso que se haga de ellos.
          </p>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}

export default Footer