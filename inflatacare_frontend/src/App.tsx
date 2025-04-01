import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import your components
import HomePage from './tabs/Home';
import ControlPage from './tabs/Control';
import Navbar from './components/NavBar';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/control" element={<ControlPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;