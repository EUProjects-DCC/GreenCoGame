import React, { useEffect, useState } from 'react'
import { IonButton, IonCardHeader, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { useHistory } from 'react-router';
import { arrowBack, arrowForward } from 'ionicons/icons';
import RankingItem from './RankingItem';
import { getRanking } from '../scripts/fetch';
import LoadingPage from '../../../components/LoadingPage';
import '../../GreenCo.css'

interface RankingProps {
  type: string, // Sort of Ranking (local or world)
  position: number // User position in the ranking
  text: any
  ranking: string
}

interface Item { // Each of the users of the ranking
  position: number;
  avatar: string;
  alias: string;
  points: number;
}

const Ranking: React.FC<RankingProps> = ({ type, position, text, ranking }) => {
  const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
  const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user

  const [items, setItems] = useState<Array<Item>>([]);
  const [page, setPage] = useState<number>(1); // Current page
  const [hasMore, setHasMore] = useState<boolean>(true); // if there are more pages
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const history = useHistory();

  // Load the previous page
  const prevPage = () => {
    setPage(prevPage => prevPage - 1);
    setHasMore(hasMore => hasMore = true) // If there are more pages
  };

  // Load the next page
  const nextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const fetchItems = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('API') || 'null'); // Get Token of the user from the sessionStorage
      if (user) {
        getRanking(type, page, user.token).then((res) => { //Get the ranking
          if (res.status === 200) {
            res.json().then((data) => {
              if (data.length > 0) {
                setItems(data); // Update the users of the ranking
                setIsLoading(false);
              }
            });
          }
          else {
            if (res.status === 404) { // If there are no more pages update the status
              setHasMore(false); //There are no more pages
              setIsLoading(false);
              setPage(prevPage => prevPage - 1); // Go to previous page
            }
            else {
              res.json().then((data) => {
                history.push(`/error/${res.status}/${data.error}`);
              });
            }
          }
        });
      }
      else {
        history.push(`/error/401/Invalid credentials`);
      }
    }
    catch (error) {
      history.push(`/error/500/${error}`);
    }
  };

  useEffect(() => {
    console.log("---RANKING--")
    fetchItems(); // Get users of the ranking
  }, [page]); // execute when the page updates

  const renderItems = () => {
    return items.map((item, index) => {
      return <RankingItem
        key={index}
        rank={item.position}
        avatar={item.avatar}
        alias={item.alias}
        points={item.points.toString()}
        glow={item.position == position ? true : false} /> // the ranking element is emphasized if it matches the user's position
    });
  };

  if (isLoading) {
    return <LoadingPage />
  }
  else {
    return (
      <div>
        <IonCardHeader>
          <h1>{ranking}</h1>
        </IonCardHeader>
        <IonRow>
          <div className='Ranking-Column'>
            <p className='Ranking-Column-Rank'>{text.ranking_icon}</p>
            <p className='Ranking-Column-Data'>{text.player}</p>
            <p className='Ranking-Column-Points'>{text.points}</p>
          </div>
        </IonRow>
        <div className='Ranking-Scroll'>
          {renderItems()}
        </div>
        <div className='Ranking-Page-Handler'>
          <IonButton color="greendark"
            onClick={() => { prevPage(); }}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                prevPage();
            }}
            disabled={page === 0}>
            <IonIcon icon={arrowBack} aria-label={text.nextbutton} />
          </IonButton>
          <IonButton color="greendark"
            onClick={() => { nextPage(); }}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                nextPage();
            }}
            disabled={!hasMore}>
            <IonIcon icon={arrowForward} aria-label={text.nextbutton} />
          </IonButton>
        </div>
      </div>
    );
  }
};

export default Ranking