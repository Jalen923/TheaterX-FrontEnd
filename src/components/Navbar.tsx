import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useModal } from './ModalContext';
import LogInModal from './LogInModal';
import '../stylesheets/modals.css';
import '../stylesheets/navbar.css';
import SignUpModal from './SignUpModal';

const Navbar = () => {
    //constants
    const { openSignUpModal, openLogInModal  } = useModal();

    //states
    const [showMobileNav, setShowMobileNav] = useState(false)

    //functions
    const handleHamburger = () => {
        if (showMobileNav) {
          setShowMobileNav(false)
        } else if (!showMobileNav) {
          setShowMobileNav(true)
        }
    }

    return (
        <header className='header'>
        <SignUpModal />
        <LogInModal />
          <nav className='nav'>
            <div className='hamburger' onClick={handleHamburger}>
              <span className='hamburger-line1' style={showMobileNav ? {transform: "rotate(45deg) translateX(11px)"} : {}}></span>
              <span style={showMobileNav ? {display: "none"} : {}}></span>
              <span className='hamburger-line2' style={showMobileNav ? {transform: "rotate(-45deg) translateX(11px) translateY(-1px)"} : {}}></span>
            </div>
            <div className='nav-list-mobile-container' style={showMobileNav ? {top: 50} : {top: "calc(-100vh - 50px)"}}>
              <ul className='nav-list-mobile'>
                <Link className='nav-link' to='/movies' ><li><a className='nav-item' href='#'>Movies</a></li></Link>
                <Link className='nav-link' to='/venues'><li><a className='nav-item' href='#'>Venues</a></li></Link>
                <Link className='nav-link' to='/dining'><li><a className='nav-item' href='#'>Dining</a></li></Link>
                <Link className='nav-link' to='/events'><li><a className='nav-item' href='#'>Events</a></li></Link>
                <Link className='nav-link' to='/luxury'><li><a className='nav-item' href='#'>Luxury</a></li></Link>
              </ul>
            </div>
            <Link to='/home'><a className='nav-title nav-title' href='#'>TheaterX</a></Link>
            <ul className='nav-list nav-list-desktop'>
              <Link to='/movies' ><li><a className='nav-item' href='#'>Movies</a></li></Link>
              <Link to='/venues'><li><a className='nav-item' href='#'>Venues</a></li></Link>
              <Link to='/dining'><li><a className='nav-item' href='#'>Dining</a></li></Link>
              <Link to='/events'><li><a className='nav-item' href='#'>Events</a></li></Link>
              <Link to='/luxury'><li><a className='nav-item' href='#'>Luxury</a></li></Link>
            </ul>
            <ul className='nav-list nav-list-btns-desktop'>
              <button className='nav-item nav-btn nav-btn-signup' onClick={openSignUpModal}>Sign Up</button>
              <button className='nav-item nav-btn nav-btn-login' onClick={openLogInModal}>Log In</button>
            </ul>
            <ul className='nav-list nav-list-btns-mobile'>
              <button className='nav-item nav-btn nav-btn-login' onClick={openLogInModal}>Log In</button>
            </ul>
          </nav>
        </header>
    )

}

export default Navbar