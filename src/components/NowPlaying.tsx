import { useState, useEffect, useRef, TransitionEvent } from 'react'
import NowPlayingMovie from "./NowPlayingMovie"
import Swipe from 'react-easy-swipe';
import useThrottle from '../hooks/useThrottle';

//types
type Movie = {
  id: string
  title: string
  runtime: string
  rating: string
  releaseDate: string
  poster?: string
  trailer: string
  nowPlaying: boolean
}

type NowPlayingProps = {
  nowPlayingMovies: Movie[]
}

const NowPlaying = ({ nowPlayingMovies }: NowPlayingProps) => {
  //States
  const [isInitialRender, setIsInitialRender] = useState(true); // Flag to track first render
  const [nowPlayingCarouselIndex, setNowPlayingCarouselIndex] = useState(0)
  const [activeNowPlayingIndex, setActiveNowPlayingIndex] = useState(nowPlayingMovies.length - 1)
  const [destination, setDestination] = useState("")
  const [transformValue, setTransformValue] = useState<Number>(0)

  //constants
  const NOW_PLAYING_ITEM_WIDTH = 385
  const NOW_PLAYING_RESET_INDEX = nowPlayingMovies.length - 2 //do reset when we get to this index
  const NOW_PLAYING_DESTINATION_RESET_INDEX_LEFT = -nowPlayingMovies.length + NOW_PLAYING_RESET_INDEX //go to this index if going left and time for reset
  const NOW_PLAYING_DESTINATION_RESET_INDEX_RIGHT = nowPlayingMovies.length - NOW_PLAYING_RESET_INDEX  //go to this index if going right and time for reset
   
  //refs
  const nowPlayingCarouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isInitialRender) {
      setTransformValue(NOW_PLAYING_ITEM_WIDTH / 2)
      setIsInitialRender(false)
    } else {
      setTransformValue((nowPlayingCarouselIndex * NOW_PLAYING_ITEM_WIDTH) + (NOW_PLAYING_ITEM_WIDTH / 2))
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

  const handleNowPlayingBtnClickLeft = () => { //throttle
    setDestination('left')
    setNowPlayingCarouselIndex((prev) => prev + 1)
    if (activeNowPlayingIndex === 0 ) {
      setActiveNowPlayingIndex(nowPlayingMovies.length - 1)
    } else {
      setActiveNowPlayingIndex((prev) => prev - 1)
    }

  }

  const handleNowPlayingBtnClickRight = () => { //throttle
    setDestination('right')
    setNowPlayingCarouselIndex((prev) => prev - 1)
    if (activeNowPlayingIndex === nowPlayingMovies.length - 1) {
      setActiveNowPlayingIndex(0)
    } else {
      setActiveNowPlayingIndex((prev) => prev + 1)
    }

  }

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

  return (
      <div className='now-playing-container' style={{backgroundImage: `url(${nowPlayingMovies.length > 0 ? nowPlayingMovies[activeNowPlayingIndex].poster : ""})`}}>
        <div className='now-playing-header-container'>
          <h1 className='now-playing-title'>Now Playing</h1>
        </div>
        <Swipe onSwipeRight={handleNowPlayingBtnClickLeft} onSwipeLeft={handleNowPlayingBtnClickRight} tolerance={25}>
          <div className='now-playing-carousel-container'>
            <div className='now-playing-items' ref={nowPlayingCarouselRef} onTransitionEnd={(e) => resetNowPlayingCarousel(e)} style={{transform: `translateX(${transformValue}px)`}}>
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
        </Swipe>
        <button className='now-playing-nav-btn' id='now-playing-nav-btn-left' onClick={useThrottle(handleNowPlayingBtnClickLeft, 500)}>{'<'}</button>
        <button className='now-playing-nav-btn' id='now-playing-nav-btn-right' onClick={useThrottle(handleNowPlayingBtnClickRight, 500)}>{'>'}</button>
      </div>
  )
}

export default NowPlaying


//[0,1,2,3,4,5,6,7,8,9,10,11,12,0,1,2,3,4,5,6,7,8,9,10,11,12]

  //how infinite caroseul works
  // [1, 2, 3, 4, 5, 6, 7] [0] [1, 2, 3, 4, 5, 6, 7]
  //       r1    n2        m0        n1    r2

  // [1, 2, 3, 4, 5, 6] [0] [1, 2, 3, 4, 5, 6]
  //    r1    n2        m0     n1    r2

  // [1, 2, 3, 4, 5, 6, 7, 8] [0] [1, 2, 3, 4, 5, 6, 7, 8]
  //          r1    n2        m0           n1    r2

  //