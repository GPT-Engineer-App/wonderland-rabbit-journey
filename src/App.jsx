import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Index from './pages/Index.jsx';
import RabbitPOV from './pages/RabbitPOV.jsx';
import SeriesNarrative from './pages/SeriesNarrative.jsx';
import Navbar from './components/Navbar.jsx';
import NextAdventure from './pages/NextAdventure.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route exact path="/rabbit-pov" element={<RabbitPOV />} />
        <Route exact path="/series-narrative" element={<SeriesNarrative />} />
        <Route exact path="/next-adventure" element={<NextAdventure />} />
      </Routes>
    </Router>
  );
}

export default App;