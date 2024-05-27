import React, { useEffect, useState } from 'react'
import '../pages/UserProfile.css'
import '../../GreenCo.css'

const Badge = (props: any) => {
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user

  useEffect(() => {
    console.log("---BADGE--")    
  }, [])
  
  return (
    <div id='Badge' className='Badge'>
        <img src={props.image} className={'Badge' + props.difficulty} alt=""></img>
        <p>{props.name}</p>
    </div>
  )
}

export default Badge