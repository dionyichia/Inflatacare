import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Import Context
import { ArduinoApiProvider } from './api';

// Import your components
import HomePage from './tabs/Home';
import ControlPage from './tabs/Control';
import BottomNavBar from './components/Navbar';

function App() {
  return (
    <ArduinoApiProvider>
      <BrowserRouter>
        <BottomNavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/control" element={<ControlPage />} />
        </Routes>
      </BrowserRouter>
    </ArduinoApiProvider>
  );
}

export default App;