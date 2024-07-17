
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import './App.css';
import RightNavbar from './components/structure/RightNavbar';
import LeftNavBar from './components/structure/LeftNavBar';
import MainContent from './components/structure/MainContent';

const App = () => {
  return (
   
      <div className="container">
        <div className="left-section">
          <LeftNavBar/>
        </div>
        <div className="middle-section">
          <Routes>
            {/* <Route path="/" element={<Middle />} /> */}
            <Route path="/middle" element={<MainContent />} />
          </Routes>
        </div>
        <div className="right-section">
          <RightNavbar />
        </div>
      </div>
    
  );
};

export default App;
