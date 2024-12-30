import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import Swipe from 'react-easy-swipe';

type HomeHeroItem = {
  id: string
  title: string
  subtitle: string
  background: string
  buttonText: string
  link: string
  state?: {
    currentMovie: Movie
  }
  movieTitle: string
}

type Movie = {
  id: string
  title: string
  runtime: string
  rating: string
  releaseDate: string
  poster: string
  trailer: string
}

type HomeHeroProps = {
  homeHeroItems: HomeHeroItem[],
  nowPlayingMovies: Movie[]
}

const HomeHero = ({ homeHeroItems, nowPlayingMovies }: HomeHeroProps) => {
    //states
    const [heroCarouselIndex, setHeroCarouselIndex] = useState(0)

    useEffect(() => {
        const activeIndexInterval = setInterval(() => {
          if (heroCarouselIndex === homeHeroItems.length - 1) {
            setHeroCarouselIndex(0)
          } else {
            setHeroCarouselIndex((prevIndex) => prevIndex + 1)
          }
        }, 8000)
      
        return () => clearInterval(activeIndexInterval)
      }, [heroCarouselIndex])

    //functions
    const handleHeroCarouselBtnClickLeft = () => {
        if (heroCarouselIndex >= 1) {
            setHeroCarouselIndex((prev) => prev - 1)
        } else if (heroCarouselIndex === 0) {
            setHeroCarouselIndex(4)
        }
    }

    const handleHeroCarouselBtnClickRight = () => {
        if (heroCarouselIndex !== homeHeroItems.length - 1) {
            setHeroCarouselIndex((prev) => prev + 1)
        } else if (heroCarouselIndex === homeHeroItems.length - 1) {
            setHeroCarouselIndex(0)
        }
    }

    const getHeroMovie = (item: HomeHeroItem) => {
        if (item.movieTitle !== "") {
            let movie = nowPlayingMovies.find((movie) => movie.title === item.movieTitle)
            return movie
        }
    }


    return (
        <Swipe onSwipeRight={handleHeroCarouselBtnClickLeft} onSwipeLeft={handleHeroCarouselBtnClickRight}>
          <div className='hero-carousel-container'>
            <ul className='hero-carousel-items' style={{left: `-${heroCarouselIndex}00%`, width: `${homeHeroItems.length}00%`}}>
              {
                homeHeroItems.map((item, index) => 
                <li className='hero-carousel-item' 
                  key={index}
                  style={item.id === "5" ? {
                    backgroundImage: `url(${item.background})`, 
                    backgroundPosition: "center 40%"
                  } : {
                    backgroundImage: `url(${item.background})`, 
                  }}>
                  <div className='hero-content-container' >
                    <h1 className='hero-text hero-title'>{item.title}</h1>
                    <h2 className='hero-text hero-sub-title'>{item.subtitle}</h2>
                    <Link to={item.link} state={{currentMovie: getHeroMovie(item)}}><button className='hero-carousel-btn'>{item.buttonText}</button></Link>
                  </div>
                </li>
                )
              }
            </ul>
            <div className='hero-carousel-navigation-container'>
              <button className='hero-carousel-navigation-btn' onClick={handleHeroCarouselBtnClickLeft}>{'<'}</button>
              {
                homeHeroItems.map((_, index) => 
                  <button
                    key={index}
                    className={`hero-carousel-navigation-item ${index === heroCarouselIndex && 'hero-carousel-navigation-item-active'}`} 
                    onClick={() => setHeroCarouselIndex(index)}
                  >
                  </button>
                )
              }
              <button className='hero-carousel-navigation-btn' onClick={handleHeroCarouselBtnClickRight}>{'>'}</button>
            </div>
          </div>
        </Swipe>
    )
}

export default HomeHero;