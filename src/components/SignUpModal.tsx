import { useEffect, useRef, useState } from 'react';
import { useModal } from './ModalContext';
import '../stylesheets/modals.css'

const SignUpModal = () => {
//states/hooks
  const { isSignUpModalOpen, setIsSignUpModalOpen, closeSignUpModal } = useModal();
  const [validEmail, setValidEmail] = useState(true)
  const [validPassword, setValidPassword] = useState(true)
  const [validTel, setValidTel] = useState(true)
  
  //refs
  const signUpEmailRef = useRef<HTMLInputElement>(null)
  const signUpPasswordRef = useRef<HTMLInputElement>(null)
  const signUpTelRef = useRef<HTMLInputElement>(null)
  const commsRef = useRef<HTMLInputElement>(null)

  const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    let validSignUp = true
    setValidEmail(true)
    setValidPassword(true)
    setValidTel(true)

    if (signUpEmailRef.current?.value === "") {
      validSignUp = false
      setValidEmail(false)
    }
    if (signUpPasswordRef.current?.value === "") {
      validSignUp = false
      setValidPassword(false)
    }

    if (!isValidPhoneNumber(signUpTelRef.current!.value)) {
      validSignUp = false
      setValidTel(false)
    }

    if (validSignUp) {
        setIsSignUpModalOpen(false)
        signUpEmailRef.current!.value = ""
        signUpPasswordRef.current!.value = ""
        signUpTelRef.current!.value = ""
    }
  }

  const isValidPhoneNumber = (phoneNum: string) => {
    const phonePattern1 = /^(?:\(\d{3}\)|\d{3}[.-]?)\d{3}[.-]?\d{4}$/;
    const phonePattern2 = /^\+?[1-9]\d{1,14}$/;

    const isValidPhone = phonePattern1.test(phoneNum) || phonePattern2.test(phoneNum);  
    return isValidPhone;

  }

  useEffect(() => {
    const signUpValidationTimer = setTimeout(() => {
      setValidEmail(true)
      setValidPassword(true)
      setValidTel(true)
    }, 1500)
  
    return () => clearInterval(signUpValidationTimer)
  }, [validEmail, validPassword, validTel])

  useEffect(() => {
    signUpEmailRef.current!.value = ""
    signUpPasswordRef.current!.value = ""
    signUpTelRef.current!.value = ""
    commsRef.current!.checked = false
  }, [isSignUpModalOpen])



  return (
    <div className={`modal-overlay ${isSignUpModalOpen ? 'open' : ''}`}>
      <div className="modal">
        <button className='modal-close-btn' onClick={closeSignUpModal}>X</button>
            <form action="" className='modal-form'>
                <h1 className='modal-title'>Sign Up</h1>
                <input style={validEmail ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}} type="email" id='signupemail' className='checkout-text-input' placeholder='Email' ref={signUpEmailRef}/>
                <input style={validPassword ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}} type="signuppassword" id='password' className='checkout-text-input' placeholder='Password' ref={signUpPasswordRef}/>
                <input style={validTel ? {borderBottom: "1px solid rgba(255, 255, 255, 0.2)"} : {borderBottom: "1px solid red"}} type="tel" id='tel' className='checkout-text-input' placeholder='Phone Number (XXX-XXX-XXXX)' ref={signUpTelRef}/>
                {/* <div className='signup-comms-container'>
                    <input type="checkbox" id='checkbox' ref={commsRef}/>
                    <label htmlFor="checkbox">I agree to the terms and conditions</label>
                </div> */}
                <div className='signup-comms-container'>
                    <input type="checkbox" id='checkbox' ref={commsRef}/>
                    <label htmlFor="checkbox">I want to recieve communication through email and SMS.</label>
                </div>
                <button className='nav-btn nav-btn-signup modal-btn' onClick={(e) => handleSignUp(e)}>Sign Up</button>
            </form>
      </div>
    </div>
  );
}

export default SignUpModal