import { TransitionEvent, useEffect, useRef, useState } from 'react'
import Navbar from './Navbar';
import Footer from './Footer';
import '../stylesheets/home.css'
import NowPlayingMovie from './NowPlayingMovie';
import Swipe from 'react-easy-swipe';
import useThrottle from '../hooks/useThrottle';

const Movies = () => {
  //types
  type Movie = {
    id: string
    title: string
    runtime: string
    rating: string
    releaseDate: string
    poster: string
    trailer: string
    nowPlaying: boolean
  }
  
  //States
  const [areMovieImagesLoaded, setAreMovieImagesLoaded] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true); // Flag to track first render
  const [destination, setDestination] = useState("")
  const NOW_PLAYING_ITEM_WIDTH = 400
  
  const [nowPlayingTransformValue, setNowPlayingTransformValue] = useState<Number>(0)
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([])
  const [nowPlayingCarouselIndex, setNowPlayingCarouselIndex] = useState(0)
  const [activeNowPlayingIndex, setActiveNowPlayingIndex] = useState(0)
  const NOW_PLAYING_RESET_INDEX = nowPlayingMovies.length - 2 //do reset when we get to this index
  const NOW_PLAYING_DESTINATION_RESET_INDEX_LEFT = -nowPlayingMovies.length + NOW_PLAYING_RESET_INDEX //go to this index if going left and time for reset
  const NOW_PLAYING_DESTINATION_RESET_INDEX_RIGHT = nowPlayingMovies.length - NOW_PLAYING_RESET_INDEX  //go to this index if going right and time for reset
  
  const [comingSoonTransformValue, setComingSoonTransformValue] = useState<Number>(0)
  const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([])
  const [comingSoonCarouselIndex, setComingSoonCarouselIndex] = useState(0)
  const [activeComingSoonIndex, setActiveComingSoonIndex] = useState(0)
  const COMING_SOON_RESET_INDEX = comingSoonMovies.length - 2 //do reset when we get to this index
  const COMING_SOON_DESTINATION_RESET_INDEX_LEFT = -comingSoonMovies.length + COMING_SOON_RESET_INDEX //go to this index if going left and time for reset
  const COMING_SOON_DESTINATION_RESET_INDEX_RIGHT = comingSoonMovies.length - COMING_SOON_RESET_INDEX  //go to this index if going right and time for reset
  
  const [limitedScreeningTransformValue, setLimitedScreeningTransformValue] = useState<Number>(0)
  const [limitedScreeningMovies, setLimitedScreeningMovies] = useState<Movie[]>([])
  const [limitedScreeningCarouselIndex, setLimitedScreeningCarouselIndex] = useState(0)
  const [activeLimitedScreeningIndex, setActiveLimitedScreeningIndex] = useState(0)
  const LIMITED_SCREENING_RESET_INDEX = limitedScreeningMovies.length - 2 //do reset when we get to this index
  const LIMITED_SCREENING_DESTINATION_RESET_INDEX_LEFT = -limitedScreeningMovies.length + LIMITED_SCREENING_RESET_INDEX //go to this index if going left and time for reset
  const LIMITED_SCREENING_DESTINATION_RESET_INDEX_RIGHT = limitedScreeningMovies.length - LIMITED_SCREENING_RESET_INDEX  //go to this index if going right and time for reset
  
  //refs
  const nowPlayingCarouselRef = useRef<HTMLDivElement>(null)
  const comingSoonCarouselRef = useRef<HTMLDivElement>(null)
  const limitedScreeningCarouselRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    (async () => {
      const nowPlayingMovies = await getNowPlayingMovies()
      const comingSoonMovies = await getComingSoonMovies()
      const limitedReleaseMovies = await getLimitedReleaseMovies()
      setNowPlayingMovies(nowPlayingMovies)
      setComingSoonMovies(comingSoonMovies)
      setLimitedScreeningMovies(limitedReleaseMovies)
      setActiveNowPlayingIndex(nowPlayingMovies.length - 1)
      setActiveComingSoonIndex(comingSoonMovies.length - 1)
      setActiveLimitedScreeningIndex(limitedReleaseMovies.length - 1)
    })();
  }, [])

  useEffect(() => {
    let loadedCount = 0;

    // Preload each movie poster
    nowPlayingMovies.concat(comingSoonMovies).concat(limitedScreeningMovies).forEach((item) => {
      const img = new Image();
      img.src = item.poster;
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === limitedScreeningMovies.length + nowPlayingMovies.length + comingSoonMovies.length) {
          setAreMovieImagesLoaded(true); // Set true only after all images are loaded
        }
      };
    });
  }, [nowPlayingMovies, comingSoonMovies, limitedScreeningMovies]);

  useEffect(() => {
    if (isInitialRender) {
      setNowPlayingTransformValue(NOW_PLAYING_ITEM_WIDTH / 2)
      setIsInitialRender(false)
    } else {
      setNowPlayingTransformValue((nowPlayingCarouselIndex * NOW_PLAYING_ITEM_WIDTH) + (NOW_PLAYING_ITEM_WIDTH / 2))
    }

    if (destination === 'right') {
      if (nowPlayingCarouselIndex !== NOW_PLAYING_DESTINATION_RESET_INDEX_RIGHT) {
        nowPlayingCarouselRef.current!.style.transitionDuration = '0.3s'
      }
    } else if (destination === 'left') {
      if (nowPlayingCarouselIndex !== NOW_PLAYING_DESTINATION_RESET_INDEX_LEFT) {
        nowPlayingCarouselRef.current!.style.transitionDuration = '0.3s'
      }
    }
  }, [nowPlayingCarouselIndex])

  useEffect(() => {
    if (isInitialRender) {
      setComingSoonTransformValue(NOW_PLAYING_ITEM_WIDTH / 2)
      setIsInitialRender(false)
    } else {
      setComingSoonTransformValue((comingSoonCarouselIndex * NOW_PLAYING_ITEM_WIDTH) + (NOW_PLAYING_ITEM_WIDTH / 2))
    }

    if (destination === 'right') {
      if (comingSoonCarouselIndex !== COMING_SOON_DESTINATION_RESET_INDEX_RIGHT) {
        comingSoonCarouselRef.current!.style.transitionDuration = '0.3s'
      }
    } else if (destination === 'left') {
      if (comingSoonCarouselIndex !== COMING_SOON_DESTINATION_RESET_INDEX_LEFT) {
        comingSoonCarouselRef.current!.style.transitionDuration = '0.3s'
      }
    }
  }, [comingSoonCarouselIndex])

  useEffect(() => {
    if (isInitialRender) {
      setLimitedScreeningTransformValue(NOW_PLAYING_ITEM_WIDTH / 2)
      setIsInitialRender(false)
    } else {
      setLimitedScreeningTransformValue((limitedScreeningCarouselIndex * NOW_PLAYING_ITEM_WIDTH) + (NOW_PLAYING_ITEM_WIDTH/ 2))
    }

    if (destination === 'right') {
      if (limitedScreeningCarouselIndex !== LIMITED_SCREENING_DESTINATION_RESET_INDEX_RIGHT) {
        limitedScreeningCarouselRef.current!.style.transitionDuration = '0.3s'
      }
    } else if (destination === 'left') {
      if (limitedScreeningCarouselIndex !== LIMITED_SCREENING_DESTINATION_RESET_INDEX_LEFT) {
        limitedScreeningCarouselRef.current!.style.transitionDuration = '0.3s'
      }
    }
  }, [limitedScreeningCarouselIndex])

  const handleNowPlayingBtnClickLeft = useThrottle(() => { 
    setDestination('left')
    setNowPlayingCarouselIndex((prev) => prev + 1)
    if (activeNowPlayingIndex === 0 ) {
      setActiveNowPlayingIndex(nowPlayingMovies.length - 1)
    } else {
      setActiveNowPlayingIndex((prev) => prev - 1)
    }
  }, 500)

  const handleComingSoonBtnClickLeft = useThrottle(() => { 
    setDestination('left')
    setComingSoonCarouselIndex((prev) => prev + 1)
    if (activeComingSoonIndex === 0 ) {
      setActiveComingSoonIndex(comingSoonMovies.length - 1)
    } else {
      setActiveComingSoonIndex((prev) => prev - 1)
    }
  }, 500)

  const handleLimitedScreeningBtnClickLeft = useThrottle(() => {
    setDestination('left')
    setLimitedScreeningCarouselIndex((prev) => prev + 1)
    if (activeLimitedScreeningIndex === 0 ) {
      setActiveLimitedScreeningIndex(limitedScreeningMovies.length - 1)
    } else {
      setActiveLimitedScreeningIndex((prev) => prev - 1)
    }
  }, 500)

  const handleNowPlayingBtnClickRight = useThrottle(() => { 
    setDestination('right')
    setNowPlayingCarouselIndex((prev) => prev - 1)
    if (activeNowPlayingIndex === nowPlayingMovies.length - 1) {
      setActiveNowPlayingIndex(0)
    } else {
      setActiveNowPlayingIndex((prev) => prev + 1)
    }
  }, 500)

  const handleComingSoonBtnClickRight = useThrottle(() => { 
    setDestination('right')
    setComingSoonCarouselIndex((prev) => prev - 1)
    if (activeComingSoonIndex === comingSoonMovies.length - 1) {
      setActiveComingSoonIndex(0)
    } else {
      setActiveComingSoonIndex((prev) => prev + 1)
    }
  }, 500)

  const handleLimitedScreeningBtnClickRight = useThrottle(() => { 
    setDestination('right')
    setLimitedScreeningCarouselIndex((prev) => prev - 1)
    if (activeLimitedScreeningIndex === limitedScreeningMovies.length - 1) {
      setActiveLimitedScreeningIndex(0)
    } else {
      setActiveLimitedScreeningIndex((prev) => prev + 1)
    }
  }, 500)

  const resetNowPlayingCarousel = (e: TransitionEvent<HTMLDivElement>) => {
    if (destination === 'right') {
      if (nowPlayingCarouselIndex === -NOW_PLAYING_RESET_INDEX) {
        const target = e.target as HTMLDivElement
        target.style.transitionDuration = '0s'
        setNowPlayingCarouselIndex(NOW_PLAYING_DESTINATION_RESET_INDEX_RIGHT)
      }
    } else if (destination === 'left') {
      if (nowPlayingCarouselIndex === NOW_PLAYING_RESET_INDEX) {
        const target = e.target as HTMLDivElement
        target.style.transitionDuration = '0s'
        setNowPlayingCarouselIndex(NOW_PLAYING_DESTINATION_RESET_INDEX_LEFT)
      }
    }
  }

  const resetComingSoonCarousel = (e: TransitionEvent<HTMLDivElement>) => {
    if (destination === 'right') {
      if (comingSoonCarouselIndex === -COMING_SOON_RESET_INDEX) {
        const target = e.target as HTMLDivElement
        target.style.transitionDuration = '0s'
        setComingSoonCarouselIndex(COMING_SOON_DESTINATION_RESET_INDEX_RIGHT)
      }
    } else if (destination === 'left') {
      if (comingSoonCarouselIndex === COMING_SOON_RESET_INDEX) {
        const target = e.target as HTMLDivElement
        target.style.transitionDuration = '0s'
        setComingSoonCarouselIndex(COMING_SOON_DESTINATION_RESET_INDEX_LEFT)
      }
    }
  }

  const resetLimitedScreeningCarousel = (e: TransitionEvent<HTMLDivElement>) => {
    if (destination === 'right') {
      if (limitedScreeningCarouselIndex === -LIMITED_SCREENING_RESET_INDEX) {
        const target = e.target as HTMLDivElement
        target.style.transitionDuration = '0s'
        setLimitedScreeningCarouselIndex(LIMITED_SCREENING_DESTINATION_RESET_INDEX_RIGHT)
      }
    } else if (destination === 'left') {
      if (limitedScreeningCarouselIndex === LIMITED_SCREENING_RESET_INDEX) {
        const target = e.target as HTMLDivElement
        target.style.transitionDuration = '0s'
        setLimitedScreeningCarouselIndex(LIMITED_SCREENING_DESTINATION_RESET_INDEX_LEFT)
      }
    }
  }

  const getNowPlayingMovies = async () => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              nowPlayingMovies {
                id
                title
                trailer
                runtime
                releaseDate
                rating
                description
                poster
                nowPlaying
              }
            }
          `,
        }),
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}`, options)
      const result = await response.json()
      return result.data.nowPlayingMovies;
    } catch (error) {
      console.log(error)
    }
  }

  const getComingSoonMovies = async () => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              comingSoonMovies {
                id
                title
                trailer
                runtime
                releaseDate
                rating
                description
                poster
                nowPlaying
              }
            }
          `,
        }),
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}`, options)
      const result = await response.json()
      return result.data.comingSoonMovies;
    } catch (error) {
      console.log(error)
    }
  }

  const getLimitedReleaseMovies = async () => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              limitedReleaseMovies {
                id
                title
                trailer
                runtime
                releaseDate
                rating
                description
                poster
                nowPlaying
              }
            }
          `,
        }),
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}`, options)
      const result = await response.json()
      return result.data.limitedReleaseMovies;
    } catch (error) {
      console.log(error)
    }
  }

  if (!areMovieImagesLoaded) {
    return (
      <div className='loading-screen'>
        <p className='loading-screen-title'>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{height: "100vh"}}>
        <Navbar></Navbar>
        <main>
          <Swipe onSwipeLeft={handleNowPlayingBtnClickRight} onSwipeRight={handleNowPlayingBtnClickLeft}>
            <div className='now-playing-container now-playing-container-showtimes' style={{backgroundImage: `url(${nowPlayingMovies.length > 0 ? nowPlayingMovies[activeNowPlayingIndex].poster : ""})`}}>
              <div className='now-playing-header-container'>
                <h1 className='now-playing-title'>Now Playing</h1>
              </div>
              <div className='now-playing-carousel-container'>
                <div className='now-playing-items' ref={nowPlayingCarouselRef} onTransitionEnd={(e) => resetNowPlayingCarousel(e)} style={{transform: `translateX(${nowPlayingTransformValue}px)`}}>
                {
                  nowPlayingMovies.map((item, index) => 
                    <NowPlayingMovie key={index} nowPlayingItem={item} index={index} activeNowPlayingIndex={activeNowPlayingIndex} nowPlayingItemWidth={NOW_PLAYING_ITEM_WIDTH} setActiveNowPlayingIndex={setActiveNowPlayingIndex} setNowPlayingCarouselIndex2={setNowPlayingCarouselIndex} nowPlayingCarouselIndex={nowPlayingCarouselIndex}></NowPlayingMovie>
                  )
                }
                {
                  nowPlayingMovies.map((item, index) => 
                    <NowPlayingMovie key={index} nowPlayingItem={item} index={index} activeNowPlayingIndex={activeNowPlayingIndex} nowPlayingItemWidth={NOW_PLAYING_ITEM_WIDTH} setActiveNowPlayingIndex={setActiveNowPlayingIndex} setNowPlayingCarouselIndex2={setNowPlayingCarouselIndex} nowPlayingCarouselIndex={nowPlayingCarouselIndex}></NowPlayingMovie>
                  )
                }
                </div>
              </div>
              <button className='now-playing-nav-btn' id='now-playing-nav-btn-left' onClick={handleNowPlayingBtnClickLeft}>{'<'}</button>
              <button className='now-playing-nav-btn' id='now-playing-nav-btn-right' onClick={handleNowPlayingBtnClickRight}>{'>'}</button>
            </div>
          </Swipe>
          <Swipe onSwipeLeft={handleComingSoonBtnClickRight} onSwipeRight={handleComingSoonBtnClickLeft}>
            <div className='now-playing-container now-playing-container-showtimes' style={{backgroundImage: `url(${comingSoonMovies.length > 0 ? comingSoonMovies[activeComingSoonIndex].poster : ""})`}}>
              <div className='now-playing-header-container'>
                <h1 className='now-playing-title'>Coming Soon</h1>
              </div>
              <div className='now-playing-carousel-container'>
                <div className='now-playing-items' ref={comingSoonCarouselRef} onTransitionEnd={(e) => resetComingSoonCarousel(e)} style={{transform: `translateX(${comingSoonTransformValue}px)`}}>
                  {
                    comingSoonMovies.map((item, index) => 
                      <NowPlayingMovie key={index} nowPlayingItem={item} index={index} activeNowPlayingIndex={activeComingSoonIndex} nowPlayingItemWidth={NOW_PLAYING_ITEM_WIDTH} setActiveNowPlayingIndex={setActiveComingSoonIndex} setNowPlayingCarouselIndex2={setComingSoonCarouselIndex} nowPlayingCarouselIndex={comingSoonCarouselIndex}></NowPlayingMovie>
                    )
                  }
                  {
                    comingSoonMovies.map((item, index) => 
                      <NowPlayingMovie key={index} nowPlayingItem={item} index={index} activeNowPlayingIndex={activeComingSoonIndex} nowPlayingItemWidth={NOW_PLAYING_ITEM_WIDTH} setActiveNowPlayingIndex={setActiveComingSoonIndex} setNowPlayingCarouselIndex2={setComingSoonCarouselIndex} nowPlayingCarouselIndex={comingSoonCarouselIndex}></NowPlayingMovie>
                    )
                  }
                </div>
              </div>
              <button className='now-playing-nav-btn' id='now-playing-nav-btn-left' onClick={handleComingSoonBtnClickLeft}>{'<'}</button>
              <button className='now-playing-nav-btn' id='now-playing-nav-btn-right' onClick={handleComingSoonBtnClickRight}>{'>'}</button>
            </div>
          </Swipe>
          <Swipe onSwipeLeft={handleLimitedScreeningBtnClickRight} onSwipeRight={handleLimitedScreeningBtnClickLeft}>
            <div className='now-playing-container now-playing-container-showtimes' style={{backgroundImage: `url(${limitedScreeningMovies.length > 0 ? limitedScreeningMovies[activeLimitedScreeningIndex].poster : ""})`}}>
              <div className='now-playing-header-container'>
                <h1 className='now-playing-title'>Limited Screenings</h1>
              </div>
              <div className='now-playing-carousel-container'>
                <div className='now-playing-items' ref={limitedScreeningCarouselRef} onTransitionEnd={(e) => resetLimitedScreeningCarousel(e)} style={{transform: `translateX(${limitedScreeningTransformValue}px)`}}>
                  {
                    limitedScreeningMovies.map((item, index) => 
                      <NowPlayingMovie key={index} nowPlayingItem={item} index={index} activeNowPlayingIndex={activeLimitedScreeningIndex} nowPlayingItemWidth={NOW_PLAYING_ITEM_WIDTH} setActiveNowPlayingIndex={setActiveLimitedScreeningIndex} setNowPlayingCarouselIndex2={setLimitedScreeningCarouselIndex} nowPlayingCarouselIndex={limitedScreeningCarouselIndex}></NowPlayingMovie>
                    )
                  }
                  {
                    limitedScreeningMovies.map((item, index) => 
                      <NowPlayingMovie key={index} nowPlayingItem={item} index={index} activeNowPlayingIndex={activeLimitedScreeningIndex} nowPlayingItemWidth={NOW_PLAYING_ITEM_WIDTH} setActiveNowPlayingIndex={setActiveLimitedScreeningIndex} setNowPlayingCarouselIndex2={setLimitedScreeningCarouselIndex} nowPlayingCarouselIndex={limitedScreeningCarouselIndex}></NowPlayingMovie>
                    )
                  }
                </div>
              </div>
              <button className='now-playing-nav-btn' id='now-playing-nav-btn-left' onClick={handleLimitedScreeningBtnClickLeft}>{'<'}</button>
              <button className='now-playing-nav-btn' id='now-playing-nav-btn-right' onClick={handleLimitedScreeningBtnClickRight}>{'>'}</button>
            </div>
          </Swipe>
        </main>
        <Footer></Footer>
    </div>
    
  )
}

export default Movies