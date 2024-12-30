import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTiktok, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'
import '../stylesheets/home.css'

const Footer = () => {
    return (
        <footer>
            <div className='footer-container'>
              <div className='footer-copyright-container'>
                <h6>TheaterX</h6>
                <h6>eXclusive.eXtravagant.eXemplary</h6>
                <h6>© Copyright 2024 TheaterX</h6>
              </div>
              <div className='footer-contact-container'>
                <FontAwesomeIcon icon={faInstagram} className='footer-icon'/>
                <FontAwesomeIcon icon={faXTwitter} className='footer-icon'/>
                <FontAwesomeIcon icon={faFacebook} className='footer-icon'/>
                <FontAwesomeIcon icon={faTiktok} className='footer-icon'/>
                <FontAwesomeIcon icon={faYoutube} className='footer-icon'/>
              </div>
              <div className='footer-nav-container'>
                <Link to='/home'><h6 className='footer-nav-link'>Home</h6></Link>
                <Link to='/movies'><h6 className='footer-nav-link'>Movies</h6></Link>
                <Link to='/venues'><h6 className='footer-nav-link'>Venues</h6></Link>
                <Link to='/dining'><h6 className='footer-nav-link'>Dining</h6></Link>
                <Link to='/events'><h6 className='footer-nav-link'>Events</h6></Link>
                <Link to='/luxury'><h6 className='footer-nav-link'>Luxury</h6></Link>
              </div>
            </div>
          </footer>
    )
}

export default Footer