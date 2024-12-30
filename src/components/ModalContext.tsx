import { createContext, useState, ReactNode, useContext } from 'react';

type ModalContextType = {
  isSignUpModalOpen: boolean;
  setIsSignUpModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  openSignUpModal: () => void;
  closeSignUpModal: () => void;
  isLogInModalOpen: boolean;
  setIsLogInModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  openLogInModal: () => void;
  closeLogInModal: () => void;
  isTicketConfirmationModalOpen: boolean
  setIsTicketConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  openTicketConfirmationModal: () => void;
  closeTicketConfirmationModal: () => void;
}

type ModalProviderProps = {
  children: ReactNode;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children } : ModalProviderProps) => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);
  const [isLogInModalOpen, setIsLogInModalOpen] = useState<boolean>(false);
  const [isTicketConfirmationModalOpen, setIsTicketConfirmationModalOpen] = useState<boolean>(false);

    
  const openSignUpModal = () => setIsSignUpModalOpen(true);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);
  const openLogInModal = () => setIsLogInModalOpen(true);
  const closeLogInModal = () => setIsLogInModalOpen(false);
  const openTicketConfirmationModal = () => setIsTicketConfirmationModalOpen(true)
  const closeTicketConfirmationModal = () => setIsTicketConfirmationModalOpen(false)

  return (
    <ModalContext.Provider value={{ isSignUpModalOpen, setIsSignUpModalOpen, openSignUpModal, closeSignUpModal, isLogInModalOpen, setIsLogInModalOpen, openLogInModal, closeLogInModal, isTicketConfirmationModalOpen, setIsTicketConfirmationModalOpen, openTicketConfirmationModal, closeTicketConfirmationModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};