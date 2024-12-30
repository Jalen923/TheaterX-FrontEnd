import { useEffect, useRef, useState } from 'react';
import { useModal } from './ModalContext';
import '../stylesheets/modals.css'

const LogInModal = () => {
  //states/hooks
  const { isLogInModalOpen, setIsLogInModalOpen, closeLogInModal } = useModal();
  const [validEmail, setValidEmail] = useState(true)
  const [validPassword, setValidPassword] = useState(true)
  
  //refs
  const loginEmailRef = useRef<HTMLInputElement>(null)
  const loginPasswordRef = useRef<HTMLInputElement>(null)

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    let validLogin = true
    setValidEmail(true)
    setValidPassword(true)

    if (loginEmailRef.current?.value === "") {
      validLogin = false
      setValidEmail(false)
    }
    if (loginPasswordRef.current?.value === "") {
      validLogin = false
      setValidPassword(false)
    }

    if (validLogin) {
      setIsLogInModalOpen(false)
      loginEmailRef.current!.value = ""
      loginPasswordRef.current!.value = ""
  }
  }

  useEffect(() => {
    const loginValidationTimer = setTimeout(() => {
      setValidEmail(true)
      setValidPassword(true)
    }, 1500)
  
    return () => clearInterval(loginValidationTimer)
  }, [validEmail, validPassword])

  useEffect(() => {
    loginEmailRef.current!.value = ""
    loginPasswordRef.current!.value = ""
  }, [isLogInModalOpen])

  return (
    <div className={`modal-overlay ${isLogInModalOpen ? 'open' : ''}`}>
      <div className="modal">
        <button className='modal-close-btn' onClick={closeLogInModal}>X</button>
            <form className='modal-form'>
                <h1 className='modal-title'>Login</h1>
                <input style={validEmail ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}} type="email" id='email' className='checkout-text-input' placeholder='Email' ref={loginEmailRef}/>
                <input style={validPassword ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}} type="password" id='email' className='checkout-text-input' placeholder='Password' ref={loginPasswordRef}/>
                <button className='nav-item nav-btn nav-btn-login modal-btn' onClick={(e) => handleLogin(e)}>Login</button>
            </form>
      </div>
    </div>
  );
}

export default LogInModal