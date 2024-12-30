import { Routes, Route, Navigate } from "react-router-dom";
import Home from './components/Home'
import MovieShowtime from "./components/MovieShowtime";
import Movies from "./components/Movies";
import Dining from "./components/Dining";
import Locations from "./components/Locations";
import Events from "./components/Events";
import Luxury from "./components/Luxury";
import { ModalProvider } from './components/ModalContext';

const App = () => {
  return (
    <Routes>
      <Route path='*' element={<Navigate to="/home"/>} />
      <Route path='/home' element={<ModalProvider><Home /></ModalProvider>} />
      <Route path='/movieshowtime' element={<ModalProvider><MovieShowtime /></ModalProvider>} />
      <Route path='/movies' element={<ModalProvider><Movies /></ModalProvider>} />
      <Route path='/dining' element={<ModalProvider><Dining /></ModalProvider>} />
      <Route path='/venues' element={<ModalProvider><Locations /></ModalProvider>} />
      <Route path='/events' element={<ModalProvider><Events /></ModalProvider>} />
      <Route path='/luxury' element={<ModalProvider><Luxury /></ModalProvider>} />
    </Routes>
  )
}

export default App







