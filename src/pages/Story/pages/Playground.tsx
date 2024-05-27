import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react'
import Award from '../components/Award'

//Screen to check component
const Playground = () => {
  return (
    <IonPage className="StoryContainer" style={{
      backgroundImage: `url(/assets/Story/Planet_Room/be_0.jpg)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "100%",
      width: "100%",
      padding: "0px"
    }}>
        <IonContent>
          <IonGrid
            style={{
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100%",
              height: "100%",
            }}
          >
            <IonRow className="ion-justify-content-between">
              <IonCol size="12" className="ion-text-center">
                <Award />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
  )
}

export default Playground