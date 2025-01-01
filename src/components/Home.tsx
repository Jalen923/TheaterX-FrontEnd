import Navbar from './Navbar'
import '../stylesheets/home.css'
import Footer from './Footer'
import HomeHero from './HomeHero'
import NowPlaying from './NowPlaying'
import Testimonial from './Testimonial'
import Features from './Features'
import Membership from './Membership'
import AppEvents from './AppEvents'
import { useState, useEffect } from 'react'

const Home = () => {
    //types
    type HeroHomeItem = {
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
      nowPlaying: boolean
    }

     //states
     const [areHeroImagesLoaded, setAreHeroImagesLoaded] = useState(false);
     const [areMovieImagesLoaded, setAreMovieImagesLoaded] = useState(false);
     const [heroHomeItems, setHeroHomeItems] = useState<HeroHomeItem[]>([])
     const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([])

    //effects
    useEffect(() => {
      (async() => {
          setHeroHomeItems(await getHeroHomeItems())
          setNowPlayingMovies(await getNowPlayingMovies())
      })()
    }, [])

    useEffect(() => {
      let loadedCount = 0;
  
      // Preload each hero poster
      heroHomeItems.forEach((item) => {
        const img = new Image();
        img.src = item.background;
        img.onload = () => {
          loadedCount += 1;
          if (loadedCount === heroHomeItems.length) {
            setAreHeroImagesLoaded(true); // Set true only after all images are loaded
          }
        };
      });
    }, [heroHomeItems]);

    useEffect(() => {
      let loadedCount = 0;
  
      // Preload each movie poster
      nowPlayingMovies.forEach((item) => {
        const img = new Image();
        img.src = item.poster;
        img.onload = () => {
          loadedCount += 1;
          if (loadedCount === nowPlayingMovies.length) {
            setAreMovieImagesLoaded(true); // Set true only after all images are loaded
          }
        };
      });
    }, [nowPlayingMovies]);

    const getHeroHomeItems = async() => {
      const options = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              query: `
                  query {
                      homeHeroItems {
                          id
                          title
                          subtitle
                          buttonText
                          background
                          link
                          movieTitle
                      }
                  }
              `
          })
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}`, options)
      const results = await response.json()
      return results.data.homeHeroItems
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

    if (!areHeroImagesLoaded || !areMovieImagesLoaded) {
      return (
        <div className='loading-screen'>
          <p className='loading-screen-title'>TheaterX Loading...</p>
        </div>
      );
    }

    return (
      <div className={`home-container`}>
        <Navbar />
        <HomeHero homeHeroItems={heroHomeItems} nowPlayingMovies={nowPlayingMovies}></HomeHero>
        <NowPlaying nowPlayingMovies={nowPlayingMovies}></NowPlaying>
        <Testimonial></Testimonial>
        <Features></Features>
        <Membership></Membership>
        <AppEvents></AppEvents>
        <Footer></Footer>
      </div>
    )
}

export default Home;