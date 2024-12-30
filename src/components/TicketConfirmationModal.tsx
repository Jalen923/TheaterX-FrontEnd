import { useModal } from './ModalContext';
import '../stylesheets/modals.css'

type TicketConfirmationModalProps = {
  ticketConfirmationNumber: string
  ticketConfirmationEmail: string
}
const TicketConfirmationModal = ( {ticketConfirmationNumber, ticketConfirmationEmail}: TicketConfirmationModalProps) => {
  //states/hooks
  const { isTicketConfirmationModalOpen, closeTicketConfirmationModal } = useModal();
  
  return (
    <div className={`modal-overlay ${isTicketConfirmationModalOpen ? 'open' : ''}`}>
      <div className="modal">
        <button className='modal-close-btn' onClick={closeTicketConfirmationModal}>X</button>
        <div className='modal-form'>
          <h1 className='modal-title ticket-title'>You Got Tickets!!!</h1>
          <p className='ticket-text'>Confirmation Number: {ticketConfirmationNumber}</p>
          <p className='ticket-text'>A confirmation email has been sent to {ticketConfirmationEmail}.</p>
        </div>
      </div>
    </div>
  );
}

export default TicketConfirmationModal