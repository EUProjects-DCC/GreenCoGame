import React, { useEffect, useState } from 'react'
import '../pages/UserProfile.css'
import '../../GreenCo.css'

interface ContainerProps { 
  text: string;
  picture: string,
}

const AvatarBar:React.FC<ContainerProps> = ({text,picture}) => {
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user

  useEffect(() => {
    console.log("---AVATAR BAR--")
    
  }, [])
  return (
    <div>
      <img className='ProfilePicture' src={picture} alt=""></img>
      <p style={{color:"black"}}>{text}</p>
    </div>
  )
}

export default AvatarBar