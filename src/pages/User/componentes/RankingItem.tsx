import React, { useEffect, useState } from 'react'
import './Ranking.css'
import '../../GreenCo.css'

interface Item {
  rank: number;
  avatar: string;
  alias: string;
  points: string;
  glow?: boolean;
}

// Each of the users of the ranking
const RankingItem:React.FC<Item> = ({rank, avatar, alias, points,glow}) => {
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user

  useEffect(() => {
    console.log("---RANKING ITEM--")
    
  }, [])
  return (
    <div className={glow ? "Ranking-Item glow" : "Ranking-Item"}>
      <p className='Ranking-Item-Rank'tabIndex={0}>{rank}</p>
      <div className='Ranking-Item-Data'>
        <img alt=""
          src={avatar===null ? '/assets/User/default_profile_picture.png' : avatar}
          >
        </img> 
        <p tabIndex={0}>{alias}</p>
      </div>
      <p className='Ranking-Item-Points' tabIndex={0}>{points}</p>
    </div>
  )
}

export default RankingItem