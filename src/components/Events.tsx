import Navbar from "./Navbar"
import '../stylesheets/events.css'
import Footer from "./Footer"
import { useEffect, useState } from "react"

const Events = () => {
    //types
    type EventFeature = {
        title: string
        description: string
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
    const [eventFeatures, setEventFeatures] = useState<EventFeature[]>([])
    const [events, setEvents] = useState<TheaterEvent[]>([])
    const [specialEvents, setSpecialEvents] = useState<TheaterEvent[]>([])


    //effects
    useEffect(() => {
        (async () => {
            setEventFeatures(await getEventFeatures())
            let theaterEvents = await getTheaterEvents()
            setEvents(theaterEvents)
            setSpecialEvents(theaterEvents.filter((event: TheaterEvent) => event.specialEvent))
        })()
    }, [])

    //functions
    const getEventFeatures = async() => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query {
                        eventFeatures {
                            title
                            description
                        }
                    }
                `
              })
        }

        const response = await fetch("http://localhost:4000/graphql", options)
        const results = await response.json()
        return results.data.eventFeatures
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

        const response = await fetch("http://localhost:4000/graphql", options)
        const results = await response.json()
        return results.data.theaterEvents
    }

    console.log(specialEvents)

    return (
        <div style={{height: '100vh', backgroundColor: "rgb(20,20,20)"}}>
            <Navbar></Navbar>
            <div className="events-hero" style={{backgroundImage: `url(https://theaterx.s3.us-east-2.amazonaws.com/img/cinematiccelebrations.jpeg)`}}>
                <h1 className="events-hero-header">Cinematic Celebrations</h1>
                <h2 className="events-hero-subheader">Your Special Moments, Starred and Screened</h2>
                <button className='events-hero-btn'>Book Now</button>
            </div>
            <div className="event-features-container">
                <ul className="event-features-list">
                    {
                        eventFeatures.map((feature) => 
                            <li className="event-features-list-item">
                                <h1>{feature.title}</h1>
                                <p>{feature.description}</p>
                            </li>
                        )
                    }
                </ul>
            </div>
            <div className="upcoming-events-container">
                <ul className='upcoming-events-items'>
                    {
                        events.slice(0,2).map((item, index) => 
                        <li key={index} className='upcoming-events-item' 
                            style={{
                                backgroundImage: `url(${item.background})`
                            }}>
                            <div className='events-content-container' >
                                <div className='event-content-container'>
                                    <h2 className='event-subtitle'>{item.subtitle}</h2>
                                    <h1 className='event-title'>{item.title}</h1>
                                </div>
                                <div className="event-subtitle event-description">
                                    <p>{item.description}</p>
                                </div>
                                <div className='event-content-container'>
                                    <h2 className='event-subtitle2'>{item.date}</h2>
                                    <div className='event-content-learn-container'>
                                        <h2 className='event-subtitle2'>{item.location}</h2>
                                        <h2 className='event-subtitle2 event-subtitle-learn'>{item.bookingPhrase}</h2>
                                    </div>
                                </div>
                            </div>
                        </li>
                        )
                    }
                </ul>
            </div>
            {
                specialEvents.slice(0,1).map((event, index) => 
                    <div key={index} className="special-event-hero ss-special-event" style={{backgroundImage: `url(${event.background})`}}>
                        <div className='special-event-hero-content-container' >
                            <div className='event-content-container'>
                                <h2 className='event-subtitle'>{event.subtitle}</h2>
                                <h1 className='event-title'>{event.title}</h1>
                            </div>
                            <div>
                                <p className="event-subtitle event-description">{event.description}</p>
                            </div>
                            <div className='event-content-container'>
                                <h2 className='event-subtitle2'></h2>
                                <div className='event-content-learn-container'>
                                    <h2 className='event-subtitle2'>{event.date}</h2>
                                    <h2 className='event-subtitle2 event-subtitle-learn'>{event.bookingPhrase}</h2>
                                </div>
                            </div>
                        </div>
                     </div>
                )
            }
            <div className="upcoming-events-container">
                <ul className='upcoming-events-items'>
                    {
                        events.slice(3, 5).map((item, index) => 
                        <li key={index} className='upcoming-events-item' 
                            style={{
                                backgroundImage: `url(${item.background})`
                            }}>
                            <div className='events-content-container' >
                                <div className='event-content-container'>
                                    <h2 className='event-subtitle'>{item.subtitle}</h2>
                                    <h1 className='event-title'>{item.title}</h1>
                                </div>
                                <div className="event-subtitle event-description">
                                    <p>{item.description}</p>
                                </div>
                                <div className='event-content-container'>
                                    <h2 className='event-subtitle2'>{item.date}</h2>
                                    <div className='event-content-learn-container'>
                                        <h2 className='event-subtitle2'>{item.location}</h2>
                                        <h2 className='event-subtitle2 event-subtitle-learn'>{item.bookingPhrase}</h2>
                                    </div>
                                </div>
                            </div>
                        </li>
                        )
                    }
                </ul>
            </div>
            {
                specialEvents.slice(1,2).map((event, index) => 
                    <div key={index} className="special-event-hero ss-special-event spider" style={{backgroundImage: `url(${event.background})`}}>
                        <div className='special-event-hero-content-container' >
                            <div className='event-content-container'>
                                <h2 className='event-subtitle'>{event.subtitle}</h2>
                                <h1 className='event-title'>{event.title}</h1>
                            </div>
                            <div>
                                <p className="event-subtitle event-description">{event.description}</p>
                            </div>
                            <div className='event-content-container'>
                                <h2 className='event-subtitle2'></h2>
                                <div className='event-content-learn-container'>
                                    <h2 className='event-subtitle2'>{event.date}</h2>
                                    <h2 className='event-subtitle2 event-subtitle-learn'>{event.bookingPhrase}</h2>
                                </div>
                            </div>
                        </div>
                     </div>
                )
            }
            <Footer></Footer>
        </div>
    )
}

export default Events