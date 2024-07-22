import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import HomePage from './components/Home';
// import Rickymain from "./components/Rickymain"
import Main from "./components/structure/Main"
import AllRoute from './components/Allroute';
import Navbar from './components/Navbar';


const App = () => {
  const [showMain, setShowMain] = useState(true);

  return (
   
      <div>
        {/* {showMain ? <Main /> : <HomePage />}
        <Button 
          colorScheme="teal" 
          onClick={() => setShowMain(!showMain)}
          mt={4}
        >
          {showMain ? 'Go to HomePage' : 'Go to Main'}
        </Button>
      <Rickymain /> */}
      <AllRoute/>
      </div>
  );
}


export default App;
