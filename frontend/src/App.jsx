import 
 { useState } from 'react';
import { ChakraProvider, Button } from '@chakra-ui/react';
import HomePage from './components/Home';
import Main from './components/structure/Main';

const App = () => {
  const [showMain, setShowMain] = useState(false);

  return (
    <ChakraProvider>
      <div>
        {showMain ? <Main /> : <HomePage />}
        <Button 
          colorScheme="teal" 
          onClick={() => setShowMain(!showMain)}
          mt={4}
        >
          {showMain ? 'Go to HomePage' : 'Go to Main'}
        </Button>
      </div>
    </ChakraProvider>
  );
};

export default App;
