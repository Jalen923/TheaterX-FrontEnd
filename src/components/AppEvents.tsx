import { useState, useEffect } from "react"
import Swipe from "react-easy-swipe"
import { Link } from "react-router-dom"

const AppEvents = () => {

    type AppFeature = {
        text: string
    }

    type TheaterEvent = {
        title: string
        subtitle: string
        background: string
        date: string
        description: string
        location: string
        bookingPhrase: string
        specialEvent: boolean
    }

    //states
    const [appFeatures, setAppFeatures] = useState<AppFeature[]>([])
    const [eventsCarouselIndex, setEventsCarouselIndex] = useState(0)
    const [events, setEvents] = useState<TheaterEvent[]>([])


    //effects
    useEffect(() => {
        (async() => {
            setAppFeatures(await getAppFeatures())
            setEvents(await getTheaterEvents())
        })()
    }, [])


    useEffect(() => {
        const activeIndexInterval = setInterval(() => {
            if (eventsCarouselIndex === events.length - 1) {
            setEventsCarouselIndex(0)
            } else {
            setEventsCarouselIndex((prevIndex) => prevIndex + 1)
            }
        }, 80000000)

        return () => clearInterval(activeIndexInterval)
    }, [eventsCarouselIndex])

    
    //functions
    const getAppFeatures = async() => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query {
                        appFeatures {
                            text
                        }
                    }
                `
            })
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}`, options)
        const results = await response.json()
        return results.data.appFeatures
    }

    const getTheaterEvents = async() => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query {
                        theaterEvents {
                            title
                            subtitle
                            description
                            location
                            date
                            bookingPhrase
                            specialEvent
                            background
                        }
                    }
                `
              })
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}`, options)
        const results = await response.json()
        return results.data.theaterEvents
    }

    const handleEventsCarouselBtnClickTop = () => {
        if (eventsCarouselIndex >= 1) {
            setEventsCarouselIndex((prev) => prev - 1)
        } else if (eventsCarouselIndex === 0) {
            setEventsCarouselIndex(3)
        }
    }

    const handleEventsCarouselBtnClickBottom = () => {
        if (eventsCarouselIndex !== events.filter((event) => !event.specialEvent).length - 1) {
            setEventsCarouselIndex((prev) => prev + 1)
        } else if (eventsCarouselIndex === events.filter((event) => !event.specialEvent).length - 1) {
            setEventsCarouselIndex(0)
        }
    }

    return (
        <div>
            <div className='app-container-mobile'>
                <div className='app-image-container-mobile'>
                  <img className='android-img-mobile' src='https://theaterx.s3.us-east-2.amazonaws.com/img/android.png'></img>
                  <div className='app-icon-mobile'><h1>TX</h1></div>
                  <img className='apple-img-mobile' src='https://theaterx.s3.us-east-2.amazonaws.com/img/apple.png'></img>
                </div>
            </div>
            <div className='app-events-container'>
                <div className='app-container'>
                  <h1 className='app-title'>Download The TheaterX App</h1>
                   <div className='app-info-container'>
                      <img className='android-img' src='https://theaterx.s3.us-east-2.amazonaws.com/img/apple.png'></img>
                      <div className='app-perks-container'>
                        {
                         appFeatures.map((app, index) => 
                             <h2 key={index} className="app-perk">{app.text}</h2>
                         )
                        }
                       <img className='iphone' src="https://theaterx.s3.us-east-2.amazonaws.com/img/iphone.png" alt="" />
                       <div className='app-icon'><h1>TX</h1></div>
                      </div>
                      <img className='android-img' src='https://theaterx.s3.us-east-2.amazonaws.com/img/android.png'></img>
                   </div>
                </div>
                <div className='events-container'>
                  <h1 className='app-title'>Special Screenings And Events</h1>
                  <Swipe style={{display: "flex", justifyContent: "center", alignItems: "center"}} tolerance={5}>
                  <div className='events-carousel-container'>

                    <ul className='events-carousel-items' style={{top: `-${eventsCarouselIndex}00%`, height: `${events.filter((event) => !event.specialEvent).length}00%`}}>
                      {
                        events.filter((event) => !event.specialEvent).map((item, index) => 
                        <li key={index} className='events-carousel-item' 
                          style={{
                            backgroundImage: `url(${item.background})`
                          }}>
                          <div className='events-content-container' >
                            <div className='event-content-container'>
                              <h2 className='event-subtitle'>{item.subtitle}</h2>
                              <h1 className='event-title'>{item.title}</h1>
                            </div>
                            <div className='event-content-container'>
                              <h2 className='event-subtitle2'>{item.date}</h2>
                              <div className='event-content-learn-container'>
                                <h2 className='event-subtitle2'>{item.location}</h2>
                                <Link to='/events'><h2 className='event-subtitle2 event-subtitle-learn'>Learn More</h2></Link>
                              </div>
                            </div>
                          </div>
                        </li>
                        )
                      }
                    </ul>
                    <div className='event-carousel-navigation-container'>
                      <button className='event-carousel-navigation-btn' onClick={handleEventsCarouselBtnClickTop}>{'^'}</button>
                      {
                          events.filter((event) => !event.specialEvent).map((_, index) => 
                            <button
                          key={index}
                          className={`event-carousel-navigation-item ${index === eventsCarouselIndex && 'event-carousel-navigation-item-active'}`} 
                          onClick={() => setEventsCarouselIndex(index)}
                          >
                          </button>
                        )
                    }
                      <button className='event-carousel-navigation-btn bottom-btn' onClick={handleEventsCarouselBtnClickBottom}>{'^'}</button>
                    </div>
                  </div>
                    </Swipe>
                </div>
            </div>
        </div>
    )
}

export default AppEvents;