import { IonSpinner } from '@ionic/react'
import './LoadingPage.css'

const LoadingPage = () => {
  return (
    <div>
      <IonSpinner id="loadingIcon" name="crescent"></IonSpinner>
    </div>
  )
}

export default LoadingPage