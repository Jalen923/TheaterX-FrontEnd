import { ChangeEvent, useEffect, useState } from "react"
import '../stylesheets/locations.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import useDebounce from "../hooks/useDebounce"
import AccordionContent from "./AccordianContent"
import Navbar from "./Navbar"
import Footer from "./Footer"

const Locations = () => {
    //types
    type theater = {
      name: string 
      address: string
      city: string
      state: string
      zipCode: string 
      phoneNumber: string
      openTime: string
      closeTime: string
      standard: boolean
      imax: boolean
      screenX: boolean
      dolby: boolean
  }

    //useStates
    const [theaters, setTheaters] = useState<theater[]>([])
    const [filteredTheaters, setFilteredTheaters] = useState<theater[]>([])
    const [theaterStates, setTheaterStates] = useState<string[]>([])
    const [filteredTheaterStates, setFilteredTheaterStates] = useState<string[]>([])
    const [expandedStates, setExpandedStates] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearchQuery = useDebounce(searchQuery, 500)

    //effects
    useEffect(() => {
      (async () => {
        const theaters = await getTheaters()
        setTheaters(theaters)
        setFilteredTheaters(theaters)
        setTheaterStates(Array.from(new Set(theaters.map(theater => theater.state))).sort())
        setFilteredTheaterStates(Array.from(new Set(theaters.map(theater => theater.state))).sort())
      })()
    }, [])

    useEffect(() => {
        if (debouncedSearchQuery) {
          const foundTheaters = theaters.filter(th =>
            th.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) 
            ||
            th.state.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) 
            ||
            th.city.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) 
          )
          if (foundTheaters.length > 0) {
            setFilteredTheaterStates(Array.from(new Set(foundTheaters.map(theater => theater.state))).sort())
            setFilteredTheaters(foundTheaters)
            foundTheaters.forEach((th) => setExpandedStates((prevState) => [...prevState, th.state]))
          } else {
            setExpandedStates([])
            setFilteredTheaterStates(Array.from(new Set(theaters.map(theater => theater.state))).sort())
            setFilteredTheaters(theaters)
          }
        } else {
          setExpandedStates([])
          setFilteredTheaterStates(Array.from(new Set(theaters.map(theater => theater.state))).sort())
          setFilteredTheaters(theaters)
        }
    }, [debouncedSearchQuery]);
    
    //functions
    const getTheaters = async(): Promise<theater[]> => {
      const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
                query {
                    theaters {
                        name
                        address
                        city
                        state
                        zipCode
                        phoneNumber
                        openTime
                        closeTime
                        standard
                        imax
                        screenX
                        dolby
                    }
                }
            `
          })
      }

      const response = await fetch("http://localhost:4000/graphql", options)
      const results = await response.json()
      return results.data.theaters
    }

    const getTheatersByState = (state: string) => {
      return filteredTheaters.filter((th) => th.state === state)
    }

    const handleToggle = (state: string) => {
      setExpandedStates((prevStates) => {
        if (prevStates.includes(state)) {
          return prevStates.filter((prevState) => prevState !== state)
        } else {
          return [...prevStates, state]
        }
      })
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    }

    return (
        <div style={{height: '100vh', backgroundColor: "rgb(20,20,20)"}}>
            <Navbar></Navbar>
            <div className="locations-hero" style={{backgroundImage: `url(https://theaterx.s3.us-east-2.amazonaws.com/img/venues.jpeg)`}}>
                <h1 className="locations-hero-header">Limitless Locations</h1>
                <h2 className="locations-hero-subheader">Find Us Wherever Your Journey Takes You</h2>
                <button className='locations-hero-btn'>Get Tickets Now</button>
            </div>
            <div className="locations-features-container">
              <ul className="locations-features-list">
                <li className="locations-features-list-item">
                  <h1>0</h1>
                  <p>International Locations</p>
                </li>
                <li className="locations-features-list-item">
                  <h1>{theaters.length}</h1>
                  <p>Nationwide Locations</p>
                </li>
                <li className="locations-features-list-item">
                  <h1>0</h1>
                  <p>Flagship Locations</p>
                </li>
              </ul>
            </div>
            <div className="locations-search-container">
              <input  
                type="text" 
                className="locations-search-input" 
                placeholder="Find Your Nearest TheaterX Experience"
                onChange={handleSearch}
                value={searchQuery}
                autoFocus
              />
            </div>
            <div style={{paddingBottom: "1rem"}}>
              {
                filteredTheaterStates.map((state) => 
                  <div className="locations-list-container" onClick={() => handleToggle(state)}>
                    <div className="accordian-title">
                      <h1 className="state-title">{state}</h1>
                      <h1 className={`${expandedStates.includes(state) ? 'chevron-expanded' : 'chevron'}`}>
                        {
                          expandedStates.includes(state) 
                          ?
                          <FontAwesomeIcon icon={faChevronUp} />
                          : 
                          <FontAwesomeIcon icon={faChevronDown} />
                        }
                        </h1>
                    </div>
                      <AccordionContent isExpanded={expandedStates.includes(state)}>
                        <ul className="location-cards-container">
                        {
                          getTheatersByState(state).map((theater) => 
                            <li className="location-card">
                              <h1 className="location-card-title">{theater.name}</h1>
                              <h2 className="location-card-address">{theater.address}, {theater.city}, {theater.state} {theater.zipCode}</h2>
                              <div className="location-card-address-phone">
                                <h3 className="location-card-phone">{theater.phoneNumber}</h3>
                                <h3 className="location-card-hours">{theater.openTime} - {theater.closeTime}</h3>
                              </div>
                              <div className='theater-formats'>
                                {
                                  theater.standard &&
                                  <div className={`theater-format-box standard-active`}>Standard</div>
                                }
                                {
                                  theater.imax &&
                                  <div className={`theater-format-box imax-active`}>IMAX</div>
                                }
                                {
                                  theater.screenX &&
                                  <div className={`theater-format-box screenx-active`}>ScreenX</div>
                                }
                                {
                                  theater.dolby &&
                                  <div className={`theater-format-box dolby-active`}>Dolby</div>
                                }
                              </div>
                            </li>
                          )
                         }
                        </ul>
                      </AccordionContent>
                  </div>
                )
              }
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Locations
