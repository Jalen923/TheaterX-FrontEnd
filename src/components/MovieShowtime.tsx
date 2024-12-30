import { useLocation } from 'react-router-dom';
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { addDays, eachDayOfInterval, format } from "date-fns";
import { faApplePay, faCcDiscover, faCcMastercard, faCcPaypal, faCcVisa, faGooglePay } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from './Navbar';
import '../stylesheets/home.css'
import { useModal } from './ModalContext';
import TicketConfirmationModal from './TicketConfirmationModal';


const MovieShowtime = () => {
  //types
  type Movie = {
    id: string
    title: string
    runtime: string
    rating: string
    releaseDate: string
    poster: string
    trailer: string
  }
  type Theater = {
    id: string
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
    latitude: string
    longitude: string
    distance: number
    filteredFormats: string[]
  }
  type Showtime = {
    id: string
    theater: Theater
    movie: Movie
    time: Date
    screen: Screen
    seats: Seat[]
    price: number
  }
  type Screen = {
    id: string
    theater: Theater
    showtimes: Showtime[]
    seats: Seat[]
    format: Format
    number: Number
  }
  type Format = {
    id: string
    type: String
    screens: Screen[]
  }
  type Seat = {
    id: string
    screen: Screen
    showtime: Showtime
    name: String
    available: Boolean
    accessability: Boolean
  }

  //refs 
  const cachedShowtimes = useRef<Map<string, Showtime[]>>(new Map());
  const modalRef = useRef<HTMLDivElement | null>(null);

  //showtimes.every((st) => st.screen.format.type === "IMAX")

  //states
  const [selectedShowtimeDay, setSelectedShowtimeDay] = useState<Date>()
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [filteredShowtimes, setFilteredShowtimes] = useState<Showtime[]>([])
  const [theaters, setTheaters] = useState<Theater[]>([])
  const [theatersLoading, setTheatersLoading] = useState(false)
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null)
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<Seat[] | any[]>([])
  const [showCreditCardInput, setShowCreditCardInput] = useState(false)
  const [paymentType, setPaymentType] = useState("apple")
  const [cardExpMonth, setCardExpMonth] = useState("")
  const [cardExpYear, setCardExpYear] = useState("")
  const [validEmail, setValidEmail] = useState(true)
  const [validPaymentType, setValidPaymentType] = useState(true)
  const [validCardNumber, setValidCardNumber] = useState(true)
  const [validCardExpMonth, setValidCardExpMonth] = useState(true)
  const [validCardExpYear, setValidCardExpYear] = useState(true)
  const [validCardCVV, setValidCardCVV] = useState(true)
  const [validCardZip, setValidCardZip] = useState(true)
  const [scrollToSeats, setScrollToSeats] = useState(false)
  const [scrollToCheckout, setScrollToCheckout] = useState(false)
  const [ticketConfirmationNumber, setTicketConfirmationNumber] = useState("")
  const [ticketConfirmationEmail, setTicketConfirmationEmail] = useState("")
  const [modalTheater, setModalTheater] = useState<Theater | null>(null)

  //refs
  const checkoutEmailRef = useRef<HTMLInputElement>(null)
  const checkoutCardNumberlRef = useRef<HTMLInputElement>(null)
  const checkoutCardCVVRef = useRef<HTMLInputElement>(null)
  const checkoutCardZipRef = useRef<HTMLInputElement>(null)
  const pickShowtimeViewRef = useRef<HTMLDivElement>(null)
  const pickSeatsViewRef = useRef<HTMLDivElement>(null)
  const checkoutViewRef = useRef<HTMLDivElement>(null)
  const creditCardViewRef = useRef<HTMLDivElement>(null);
  
  //constants
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const showtimeDays = (eachDayOfInterval({start: new Date(), end: addDays(new Date(), 9)}))
  
  let { state } = useLocation();
  const currentMovie: Movie = state.currentMovie
  
  const { openTicketConfirmationModal } = useModal()

  const mediaQuery = window.matchMedia('(max-width: 604px)')
 
  //effects
  useEffect(() => {
    (async () => {
      setTheatersLoading(true)
      setSelectedShowtimeDay(new Date())

      let todayShowtimes = await getShowtimes(new Date())
      setShowtimes(todayShowtimes) //all showtimes for this movie
      setFilteredShowtimes(todayShowtimes)

      let formats: string[] = Array.from(new Set(todayShowtimes.map((showtime) => showtime.screen.format.type.toString())))

      const uniqueTheaters = [
        ...new Map(
          todayShowtimes.map((showtime) => [showtime.theater.id, showtime.theater])
        ).values(),
      ];
      
      const location = await reverseGeocode()
      let theatersWithFormatFilters: Theater[] = uniqueTheaters.map((theater) => ({...theater, filteredFormats: formats}))
      const nearbyTheaters = (await getNearbyTheaters(location.latitude, location.longitude, 500, theatersWithFormatFilters)).slice(0, 10)
      setTheaters(nearbyTheaters)
      setTheatersLoading(false)
    })()
  }, [])

  // Handle outside clicks
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && (event.target as Node).contains(modalRef.current)) {
        setModalTheater(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (creditCardViewRef.current) {
      creditCardViewRef.current.style.height = showCreditCardInput ? `180px` : '0px';
    }
  }, [paymentType]);


  useEffect(() => {
    setSelectedSeats([])
  }, [selectedShowtime])

  useEffect(() => {
    const checkoutValidationTimer = setTimeout(() => {
      setValidEmail(true)
      setValidPaymentType(true)
      setValidCardNumber(true)
      setValidCardExpMonth(true)
      setValidCardExpYear(true)
      setValidCardCVV(true)
      setValidCardZip(true)
    }, 1500)
  
    return () => clearInterval(checkoutValidationTimer)
  }, [validEmail, validPaymentType, validCardNumber, validCardExpMonth, validCardExpYear, validCardCVV, validCardZip])

  //functions
  const getShowtimes = async(date: Date): Promise<Showtime[]> => {
      const dateKey = date.toISOString().slice(0, 10); // Format date as YYYY-MM-DD

      // Check if showtimes for this date are already cached
      if (cachedShowtimes.current.has(dateKey)) {
        return cachedShowtimes.current.get(dateKey)!;
      }

      // If not cached fetch 
      const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query ($movieId: ID!, $currentDate: String!) {
              showtimesByMovie(movieId: $movieId, currentDate: $currentDate) {
                id
                theater {
                  id
                  name
                  city
                  state
                  zipCode
                  latitude
                  longitude
                  address
                  openTime
                  closeTime
                  phoneNumber
                }
                seats {
                  id
                  name
                  available
                  accessability
                }
                screen {
                  number
                  format {
                    type
                  }
                }
                time
                price
              }
            }
          `,
          variables: {
            movieId: currentMovie.id, // Pass the movie ID
            currentDate: new Date(date).toISOString().slice(0, 10), // Pass the date in ISO format
          },
        }),
      }
  
      const response = await fetch("http://localhost:4000/graphql", options)
      const results = await response.json()
      let newShowtimes = results.data.showtimesByMovie;

      cachedShowtimes.current.set(dateKey, newShowtimes);
      return newShowtimes
    
  }

  const handleShowtimeDateChange = async (date: Date) => {
    setSelectedShowtimeDay(date);
    setSelectedShowtime(null)

    const fetchedShowtimes = await getShowtimes(date);
    
    let formats: string[] = Array.from(new Set(fetchedShowtimes.map((showtime) => showtime.screen.format.type.toString())))
    theaters.forEach((theater) => {
      theater.filteredFormats = formats
    })

    setShowtimes(fetchedShowtimes);
    setFilteredShowtimes(fetchedShowtimes);
  };

  // Function to normalize time to minutes since midnight
  function getMinutesSinceMidnight(timestamp: Date) {
    const date = new Date(timestamp);
    return date.getHours() * 60 + date.getMinutes();
  }

  const getTheaterShowtimes = (theater: string) => {
    let showtimesForThisTheater = filteredShowtimes.filter((showtime) => showtime.theater.name === theater)

    showtimesForThisTheater.sort((a, b) => {
      const timeA = getMinutesSinceMidnight(a.time);
      const timeB = getMinutesSinceMidnight(b.time);
      return timeA - timeB;
    });

    console.log(showtimesForThisTheater)

    return showtimesForThisTheater
  }

  const filterTheaterFormats = (format: string) => {
    theaters.forEach((theater) => getFilteredTheaterShowtimes(theater, format))
  }

  const getFilteredTheaterShowtimes = (theater: Theater, format: string) => {
    if (theater.filteredFormats.includes(format)) {
      console.log("Y")
      let filters = theater.filteredFormats.filter((filteredFormat) => filteredFormat !== format)
      theater.filteredFormats = filters
    } else {
      theater.filteredFormats.push(format)
    }

    if (theater.filteredFormats.length > 0) {
      //mapping through the theater filters and creating an array of showtimes with just those filters. Then we flatten
      let tempItems = theater.filteredFormats.map((selectedFilter) => {
        let temp = showtimes.filter((showtime) => showtime.screen.format.type === selectedFilter)
        return temp
      })
      setFilteredShowtimes(tempItems.flat())
    } else {
      setFilteredShowtimes([])
    }
  }

  const handleShowtimeClick = (theater: Theater, showtime: Showtime) => {
    console.log(showtime)
    const showtimeIsSoldOut = showtime.seats.every((seat) => !seat.available)
    if (!showtimeIsSoldOut) setSelectedShowtime(showtime)
    if (selectedShowtime === showtime) setSelectedShowtime(null)
    setSelectedTheater(theater)
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.available) setSelectedSeats((prev) => [...prev, seat])
    if (selectedSeats.includes(seat)) setSelectedSeats(() => selectedSeats.filter((s) => s.name !== seat.name))
  }

  const sortSelectedSeats = (seats: Seat[]) => {
    seats.sort((a: Seat, b: Seat) => {
      const seatA = a.name.match(/([A-Z]+)(\d+)/);
      const seatB = b.name.match(/([A-Z]+)(\d+)/);
    
      // Check if regex matched
      if (!seatA || !seatB) return 0;
    
      const letterComparison = seatA[1].localeCompare(seatB[1]);
      if (letterComparison !== 0) return letterComparison;
    
      return parseInt(seatA[2], 10) - parseInt(seatB[2], 10);
    });
    
    return seats
  }

  const createSeatRows = () => {
    let seatRowsArr: Seat[][] = []
    
    let chars = Array.from(new Set(selectedShowtime?.seats.map((seat) => seat.name[0])))
    
    chars.forEach((letter) => {
      let seatByRowArr: Seat[] = []
      selectedShowtime?.seats.map((seat) => {
        if (seat.name.startsWith(letter)) {
          seatByRowArr.push(seat)
        }
      })
      seatRowsArr.push(seatByRowArr)
    })

    return seatRowsArr
  }

  const handlePaymentType = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentType(e.target.id)
    if (e.target.id === "card") {
      setShowCreditCardInput(true)
    } else {
      setShowCreditCardInput(false)
      checkoutEmailRef.current!.value = ""
      checkoutCardNumberlRef.current!.value = ""
      setCardExpMonth("")
      setCardExpYear("")
      checkoutCardCVVRef.current!.value = ""
      checkoutCardZipRef.current!.value = ""

    }
  }

  const handlePickSeatsClick = () => {
    setScrollToSeats(true)
    setTimeout(() => {
      pickSeatsViewRef.current?.scrollIntoView({behavior: 'smooth'});
    }, 1)
  }
  
  const handleCheckoutClick = () => {
    setScrollToCheckout(true)
    setTimeout(() => {
      checkoutViewRef.current?.scrollIntoView({behavior: 'smooth'});
    }, 1)
  }
  
  const handlePurchase = () => {
    let validPurchase = true
    setValidPaymentType(true)
    setValidEmail(true)
    setValidCardNumber(true)
    setValidCardExpMonth(true)
    setValidCardExpYear(true)
    setValidCardCVV(true)
    setValidCardZip(true)

    if (paymentType === "") {
      validPurchase = false
      setValidPaymentType(false)
    } else {
      if (paymentType !== "card") {
        if (checkoutEmailRef.current?.value === "") {
          validPurchase = false
          setValidEmail(false)
        }
      } else if (paymentType === "card") {
        if (checkoutEmailRef.current?.value === "") {
          validPurchase = false
          setValidEmail(false)
        }
        if (checkoutCardNumberlRef.current?.value === "") {
          validPurchase = false
          setValidCardNumber(false)
        }
        if (cardExpMonth === "") {
          validPurchase = false
          setValidCardExpMonth(false)
        }
        if (cardExpYear === "") {
          validPurchase = false
          setValidCardExpYear(false)
        }
        if (checkoutCardCVVRef.current?.value === "") {
          validPurchase = false
          setValidCardCVV(false)
        }
        if (checkoutCardZipRef.current?.value === "") {
          validPurchase = false
          setValidCardZip(false)
        }
      }
    }

    if (validPurchase) {
      createTicket(selectedShowtime, selectedSeats)
    }
  }

  const createTicket = async(showtime: Showtime | null, seats: Seat[]) => {
    let showtimeId = showtime?.id
    let price = seats.length * showtime?.price!
    let seatIds = seats.map((seat) => seat.id)
    let email = checkoutEmailRef.current!.value
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CreateTicket($showtimeId: ID!, $price: Int!, $seatIds: [ID!]!, $email: String!) {
            createTicket(showtimeId: $showtimeId, price: $price, seatIds: $seatIds, email: $email) {
              id
              email
            }
          }
        `,
        variables: {
          showtimeId,
          price,
          seatIds,
          email
        },
      }),
    };

    const response = await fetch("http://localhost:4000/graphql", options)
    const results = await response.json()
    setTicketConfirmationNumber(results.data.createTicket.id)
    setTicketConfirmationEmail(results.data.createTicket.email)

    if (ticketConfirmationNumber != null) {
      openTicketConfirmationModal()
      pickSeatsViewRef.current!.style.display = "none"
      checkoutViewRef.current!.style.display = "none"
    }
  }

  const reverseGeocode = async() => {
    const options = {method: 'GET'};

    const response = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=c4b40f2cc5724060937c9244d25aa300`, options)
    const results = await response.json()
    return results
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in miles
    return distance;
  }

  const getNearbyTheaters = async(userLat: number, userLon: number, maxDistanceMiles: number, theaters: Theater[]) => {
    const nearbyTheaters = theaters.filter(theater => {
      const distance = calculateDistance(userLat, userLon, Number(theater.latitude), Number(theater.longitude));
      theater.distance = distance
      return distance <= maxDistanceMiles; 
    });

    nearbyTheaters.sort((a, b) => a.distance - b.distance)
    return nearbyTheaters;
  }

  return (
    <div style={{height: '100vh', backgroundColor: "rgb(20,20,20)"}}>
        <Navbar></Navbar>
        <TicketConfirmationModal ticketConfirmationNumber={ticketConfirmationNumber} ticketConfirmationEmail={ticketConfirmationEmail}></TicketConfirmationModal>
        <main>
          <div className='showtime-container' ref={pickShowtimeViewRef}>
            <div className='current-movie-container' style={{backgroundImage: `url(${currentMovie.poster})`}}>
              <img className='current-movie-poster' src={currentMovie.poster}/>
              <div className='current-movie-item-details'>
                <label className='current-movie-name'>{currentMovie.title}</label>
                <label className='current-movie-runtime'>{currentMovie.runtime} | {currentMovie.rating}</label>
                <label className='current-movie-release'>{currentMovie.releaseDate}</label>
              </div>
              <div className='current-movie-btn-container'>
                <a href={currentMovie.trailer} target='_blank'><button className='current-movie-btn'>Trailer</button></a>
                <button className={`current-movie-btn ${selectedShowtime === null && 'current-movie-btn-disabled'}`} disabled={selectedShowtime == null} onClick={handlePickSeatsClick}>Pick Seats</button>
              </div>
            </div>
            <div className='showtime-select-container'>
              <div className='date-select-container'>
                  {
                    showtimeDays.length > 0 &&
                    showtimeDays.map((date) => 
                      <div className={`${date.toDateString() === selectedShowtimeDay?.toDateString() && `date-select-box-current`} date-select-box`} onClick={() => handleShowtimeDateChange(date)}>
                        <label>{WEEKDAYS[date.getDay()]}</label>
                        <label>{date.getDate()}</label>
                      </div>
                    )
                  }
              </div>
              <div className='theater-formats'>
                    {
                      <div className={`theater-format-box ${theaters.some((theater) => theater.filteredFormats.includes("IMAX")) ? 'imax-active' : 'imax'}`} onClick={() => filterTheaterFormats("IMAX")}>IMAX</div>
                    }
                    {
                      <div className={`theater-format-box ${theaters.some((theater) => theater.filteredFormats.includes("ScreenX")) ? 'screenx-active' : 'screenx'}`} onClick={() => filterTheaterFormats("ScreenX")}>ScreenX</div>
                    }
                    {
                      <div className={`theater-format-box ${theaters.some((theater) => theater.filteredFormats.includes("Dolby")) ? 'dolby-active' : 'dolby'}`} onClick={() => filterTheaterFormats("Dolby")}>Dolby</div>
                    }
                    {
                      <div className={`theater-format-box ${theaters.some((theater) => theater.filteredFormats.includes("Standard")) ? 'standard-active' : 'standard'}`} onClick={() => filterTheaterFormats("Standard")}>Standard</div>
                    }
              </div>
              <div className='theater-list-container'>
                {
                  !theatersLoading ?
                  theaters.map((theater) => 
                    <div className='theater-showtime-container'>
                      <div className='theater-info'>
                          <div className='theater-name'>{theater.name}</div>
                            <label className='theater-distance' onClick={() => setModalTheater(theater)} onMouseEnter={() => setModalTheater(theater)} onMouseLeave={() => setModalTheater(null)}>{theater.distance.toString().slice(0, 5)} mi</label>
                            <div ref={modalRef} className={`theater-info-modal ${theater === modalTheater ? 'active' : 'inactive'}`} onMouseEnter={() => setModalTheater(theater)} onMouseLeave={() => setModalTheater(null)}>
                              <h2 className="theater-info-modal-text">{theater.address}, {theater.city}, {theater.state} {theater.zipCode}</h2>
                              <div className="theater-info-modal-phone">
                                <h3 className="theater-info-modal-text">{theater.phoneNumber}</h3>
                                <h3 className="theater-info-modal-text">{theater.openTime} - {theater.closeTime}</h3>
                              </div>
                            </div>
                      </div>
                      <div className='theater-showtimes-container'>
                        {
                          getTheaterShowtimes(theater.name).length > 0
                          ?
                          <div>
                            {
                              getTheaterShowtimes(theater.name).filter((showtime) => showtime.screen.format.type === "IMAX").length > 0 &&
                              <div className='theater-showtimes-format-container'>
                                <div className='theater-showtimes-format-header'>
                                  <label>IMAX</label>
                                </div>
                                <div className='theater-showtimes'>
                                  {
                                    getTheaterShowtimes(theater.name).filter((showtime) => showtime.screen.format.type === "IMAX").map((showtime) => 
                                      <div className={`theater-showtime ${selectedShowtime === showtime && "theater-showtime-selected"} ${showtime.seats.every((seat) => !seat.available) && "theater-showtime-sold-out"}`} onClick={() => handleShowtimeClick(theater, showtime)}>{format(new Date(showtime.time), 'h:mm a')}</div>
                                    )
                                  }
                                </div>
                              </div>
                            }
                            {
                              getTheaterShowtimes(theater.name).filter((showtime) => showtime.screen.format.type === "ScreenX").length > 0 &&
                              <div className='theater-showtimes-format-container'>
                                <div className='theater-showtimes-format-header'>
                                  <label>ScreenX</label>
                                </div>
                                <div className='theater-showtimes'>
                                  {
                                    getTheaterShowtimes(theater.name).filter((showtime) => showtime.screen.format.type === "ScreenX").map((showtime) => 
                                      <div className={`theater-showtime ${selectedShowtime === showtime && "theater-showtime-selected"} ${showtime.seats.every((seat) => !seat.available) && "theater-showtime-sold-out"}`} onClick={() => handleShowtimeClick(theater, showtime)}>{format(new Date(showtime.time), 'h:mm a')}</div>
                                    )
                                  }
                                </div>
                              </div>
                            }
                            {
                              getTheaterShowtimes(theater.name).filter((showtime) => showtime.screen.format.type === "Dolby").length > 0 &&
                              <div className='theater-showtimes-format-container'>
                                <div className='theater-showtimes-format-header'>
                                  <label>Dolby</label>
                                </div>
                                <div className='theater-showtimes'>
                                  {
                                    getTheaterShowtimes(theater.name).filter((showtime) => showtime.screen.format.type === "Dolby").map((showtime) => 
                                      <div className={`theater-showtime ${selectedShowtime === showtime && "theater-showtime-selected"} ${showtime.seats.every((seat) => !seat.available) && "theater-showtime-sold-out"}`} onClick={() => handleShowtimeClick(theater, showtime)}>{format(new Date(showtime.time), 'h:mm a')}</div>
                                    )
                                  }
                                </div>
                              </div>
                            }
                            {
                              getTheaterShowtimes(theater.name).filter((showtime) => showtime.screen.format.type === "Standard").length > 0 &&
                              <div className='theater-showtimes-format-container'>
                                <div className='theater-showtimes-format-header'>
                                  <label>Standard</label>
                                </div>
                                <div className='theater-showtimes'>
                                  {
                                    getTheaterShowtimes(theater.name).filter((showtime) => showtime.screen.format.type === "Standard").map((showtime) => 
                                      <div className={`theater-showtime ${selectedShowtime === showtime && "theater-showtime-selected"} ${showtime.seats.every((seat) => !seat.available) && "theater-showtime-sold-out"}`} onClick={() => handleShowtimeClick(theater, showtime)}>{format(new Date(showtime.time), 'h:mm a')}</div>
                                    )
                                  }
                                </div>
                              </div>
                            }
                          </div>
                          :
                          <div style={{color: "white"}}>No Showtimes Available</div>
                        }
                      </div>
                    </div>
                  )
                  :
                  <div className='loading-screen showtimes'>
                    <p className='loading-screen-title'>Showtimes Loading...</p>
                  </div>
                }
                {
                  !theatersLoading && theaters.length === 0 &&
                  <div style={{color: "white", textAlign: "center", fontSize: 20, fontWeight: "bold"}}>No Showtimes Available</div>
                }
              </div>
            </div>
          </div>
          {
            scrollToSeats && 
            <div className='showtime-container' ref={pickSeatsViewRef}>
            <div className='current-movie-container' style={{backgroundImage: `url(${currentMovie.poster})`}}>
              <img className='current-movie-poster' src={currentMovie.poster}/>
              <div className='current-movie-item-details'>
                <label className='current-movie-name'>{currentMovie.title}</label>
                <label className='current-movie-runtime'>{}</label>
                <label className='current-movie-release'>{new Date(selectedShowtime!.time).toDateString()} {new Date(selectedShowtime!.time).toLocaleTimeString()}</label>
                <label className='current-movie-release'>{selectedTheater?.name}</label>
              </div>
              <div className='current-movie-btn-container'>
                <div className={`theater-format-box format-box-seats ${selectedShowtime?.screen.format.type.toLowerCase()}-active`}>{selectedShowtime?.screen.format.type}</div>
                <div className='selected-seats'>{sortSelectedSeats(selectedSeats).map((seat) => <label>{seat.name} </label>)}</div>
                <button className={`current-movie-btn ${selectedSeats.length === 0 && 'current-movie-btn-disabled'}`} disabled={selectedSeats.length === 0} onClick={handleCheckoutClick}>Checkout</button>
              </div>
            </div>
            <div className='seat-select-container'>
              <div className='theater-screen'>
                <label>Screen</label>
              </div>
              <div className='seat-select-grid' style={{gridTemplateRows: `repeat(${createSeatRows().length}, ${mediaQuery.matches ? '12px' : '20px'})`}}>
                {
                  createSeatRows().map((row) =>
                      <div style={{padding: `0px 0px 0px 0px`, gridTemplateColumns: `repeat(${row.length}, ${mediaQuery.matches ? '8px' : '14px'})`}} className='seat-select-row-grid'>
                        {
                          row.map((seat) => 
                            <div className={`seat ${selectedSeats.includes(seat) ? "seat-selected" : ''} ${!seat.available ? "seat-sold-out" : ''} ${seat.accessability && !selectedSeats.includes(seat) && seat.available ? "seat-accessability" : ''} ${!seat.available && seat.accessability ? "seat-sold-out" : ''}`} onClick={() => handleSeatClick(seat)}></div>
                          )
                        }
                      </div>
                    ) 
                }
              </div>
            </div>
            </div>
          }
          {
            scrollToCheckout &&
            <div className='showtime-container' ref={checkoutViewRef}>
            <div className='current-movie-container' style={{backgroundImage: `url(${currentMovie.poster})`}}>
              <img className='current-movie-poster' src={currentMovie.poster}/>
              <div className='current-movie-item-details'>
                <label className='current-movie-name'>{currentMovie.title}</label>
                <label className='current-movie-runtime'>{}</label>
                <label className='current-movie-release'>{new Date(selectedShowtime!.time).toDateString()} {new Date(selectedShowtime!.time).toLocaleTimeString()}</label>
                <label className='current-movie-release'>{selectedTheater?.name}</label>
                <label className='current-movie-release'>Screen {selectedShowtime?.screen.number.toString()}</label>
              </div>
              <div className='current-movie-btn-container'>
              <div className={`theater-format-box format-box-seats ${selectedShowtime?.screen.format.type.toLowerCase()}-active`}>{selectedShowtime?.screen.format.type}</div>
                <div className='selected-seats'>{sortSelectedSeats(selectedSeats).map((seat) => <label>{seat.name} </label>)}</div>
                <button className={`current-movie-btn ${selectedShowtime === null || selectedSeats.length === 0 && 'current-movie-btn-disabled'}`} onClick={handlePurchase} disabled={selectedSeats.length === 0 || selectedShowtime === null}>Complete Purchase</button>
              </div>
            </div>
            <div className='checkout-container'>
              <form action="" className='checkout-form'>
                <div className='customer-info-container'>
                  <h1 className='checkout-title'>Customer Info</h1>
                  <div className='email-container'>
                    <input style={validEmail ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}} type="email" id='email' className='checkout-text-input' placeholder='Email' ref={checkoutEmailRef}/>
                  </div>
                </div>
                <div className='payment-info-container'>
                  <h1 className='checkout-title'>Payment</h1>
                  <div className='payment-input-container' style={validPaymentType ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}}>
                    <div className='payment-input'>
                      <input type="radio" name="payment" id="apple" className='checkout-label' onChange={(e) => handlePaymentType(e)} defaultChecked/>
                      <label htmlFor="apple"><FontAwesomeIcon icon={faApplePay} className='apple-pay-icon'/></label>
                    </div>
                    <div className='payment-input'>
                      <input type="radio" name="payment" id="google" className='checkout-label' onChange={(e) => handlePaymentType(e)}/>
                      <label htmlFor="google"><FontAwesomeIcon icon={faGooglePay} className='google-pay-icon'/></label>
                    </div>
                    <div className='payment-input'>
                      <input type="radio" name="payment" id="paypal" className='checkout-label' onChange={(e) => handlePaymentType(e)}/>
                      <label htmlFor="paypal"><FontAwesomeIcon icon={faCcPaypal} className='paypal-icon'/></label>
                    </div>
                    <div className='payment-input'>
                      <input type="radio" name="payment" id="card" className='checkout-label' onChange={(e) => handlePaymentType(e)}/>
                      <label htmlFor="card">
                        <FontAwesomeIcon icon={faCcVisa} className='cards-icon'/> 
                        <FontAwesomeIcon icon={faCcMastercard} className='cards-icon'/> 
                        <FontAwesomeIcon icon={faCcDiscover} className='cards-icon'/>
                      </label>
                    </div>
                  </div>
                  <div className='credit-card-input-container' ref={creditCardViewRef}>
                    <div className='credit-card-input-sub-container'>
                      <input type="text" className='checkout-text-input' style={validCardNumber ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}} placeholder='Card Number' ref={checkoutCardNumberlRef}/>
                    </div>
                    <div className='credit-card-input-sub-container'>
                      <select className='checkout-text-input' value={cardExpMonth} style={validCardExpMonth ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}} onChange={(e) => setCardExpMonth(e.target.value)}>
                        <option value="" selected disabled>Exp. Month</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="04">04</option>
                        <option value="05">05</option>
                        <option value="06">06</option>
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                      <select className='checkout-text-input' value={cardExpYear} style={validCardExpYear ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}} onChange={(e) => setCardExpYear(e.target.value)}>
                      <option value="" selected disabled>Exp. Year</option>
                        <option value="2035">2035</option>
                        <option value="2034">2034</option>
                        <option value="2033">2033</option>
                        <option value="2032">2032</option>
                        <option value="2031">2031</option>
                        <option value="2030">2030</option>
                        <option value="2029">2029</option>
                        <option value="2028">2028</option>
                        <option value="2027">2027</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>
                    <div className='credit-card-input-sub-container'>
                      <input type="text" className='checkout-text-input' style={validCardCVV ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}} placeholder='CVV' ref={checkoutCardCVVRef}/>
                      <input type="text" className='checkout-text-input' style={validCardZip ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}} placeholder='Zip Code' ref={checkoutCardZipRef}/>
                    </div>
                  </div>
                  <div className='total-info-container'>
                    <h1 className='checkout-title'>Total</h1>
                    <h2 className='checkout-text-input'>${selectedSeats.length * selectedShowtime?.price!}.00</h2>
                  </div>
                </div>
              </form>
            </div>
          </div>
          }
        </main>
    </div>
    
  )
}

export default MovieShowtime