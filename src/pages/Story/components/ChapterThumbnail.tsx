import React, { useEffect, useState } from 'react'
import { IonCol, IonGrid, IonRow } from '@ionic/react'

import './ChapterThumbnail.css'

export interface ChapterThumbnail {
  img: string;
  text: string;
}

//Icons of planetroom, to represent levels
const ChapterThumbnail:React.FC<ChapterThumbnail> = ({img,text}) => {
  return (
    <div className='ChapterThumbnail'>
        <img src={img} alt=""></img>
        <p>{text}</p>
    </div>
  )
}

export default ChapterThumbnail