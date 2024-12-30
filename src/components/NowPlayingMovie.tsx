import { Link } from 'react-router-dom'
import '../stylesheets/home.css'

type NowPlayingProps = {
    nowPlayingItem: {
        id: string
        title: string
        runtime: string
        rating: string
        releaseDate: string
        poster?: string
        trailer: string
        nowPlaying: boolean
    }
    index: number
    activeNowPlayingIndex: number
    nowPlayingItemWidth: number
    setActiveNowPlayingIndex: React.Dispatch<React.SetStateAction<number>>
    setNowPlayingCarouselIndex2: React.Dispatch<React.SetStateAction<number>>
    nowPlayingCarouselIndex: number
}


const NowPlayingMovie = ({nowPlayingItem, index, activeNowPlayingIndex, nowPlayingItemWidth }: NowPlayingProps) => {
  console.log(nowPlayingItem)
  return (
    <div style={{width: nowPlayingItemWidth}} className={`now-playing-item ${activeNowPlayingIndex === index ? 'now-playing-item-active' : 'now-playing-item-inactive'}`}>
        <img className='now-playing-poster' src={nowPlayingItem.poster} />
        <div className='now-playing-item-details'>
            <label className='now-playing-name'>{nowPlayingItem.title}</label>
            <label className='now-playing-runtime'>{nowPlayingItem.runtime} | {nowPlayingItem.rating}</label>
            <label className='now-playing-release'>{nowPlayingItem.releaseDate}</label>
            <Link to='/movieshowtime' state={{ currentMovie: nowPlayingItem }}><button className={`now-playing-btn ${!nowPlayingItem.nowPlaying ? "disabled" : ""}`} disabled={!nowPlayingItem.nowPlaying}>Get Tickets</button></Link>
        </div>
    </div>
  )
}

export default NowPlayingMovie