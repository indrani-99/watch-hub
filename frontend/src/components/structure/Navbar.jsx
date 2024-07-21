import React, { useState } from 'react';
import { Flex, Input, Button, Box, IconButton, useDisclosure, Image } from '@chakra-ui/react';
import { SearchIcon, InfoIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
// impot {logo} from "/public/logo2.png"
const Navbar = ({ setVideoUrl, toggleLiveStreaming }) => {
  const [inputValue, setInputValue] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    setVideoUrl(inputValue);
  };

  return (
    <Flex 
      as="nav" 
      direction="column"
      width="100%" 
      padding="1rem" 
      bg="gray.800" 
      color="white"
      position="fixed"
      top="0"
      left="0"
      zIndex="999"
    >
      <Flex 
        align="center" 
        justify="space-between" 
        wrap="wrap"
      >
        <Flex align="center">
          <IconButton 
            aria-label="Menu" 
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />} 
            variant="outline" 
            colorScheme="whiteAlpha" 
            onClick={isOpen ? onClose : onOpen}
            display={{ base: 'block', md: 'none' }}
          />
          <Box ml={{ base: 0, md: 4 }}>
            <Image 
              src="" // Replace with your image URL
              alt="MyApp Logo"
              boxSize={{ base: '40px', md: '50px' }} // Adjust size as needed
              objectFit="contain"
            />
          </Box>
        </Flex>
        
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          align="center"
          display={{ base: isOpen ? 'flex' : 'none', md: 'flex' }}
          width={{ base: '100%', md: 'auto' }}
          mt={{ base: 4, md: 0 }}
        >
          <Box width={{ base: '100%', md: 'auto' }} mb={{ base: 2, md: 0 }}>
            <Input 
              placeholder="Enter YouTube video URL" 
              variant="filled" 
              bg="gray.700" 
              color="white"
              value={inputValue}
              onChange={handleInputChange}
              _placeholder={{ color: 'gray.400' }}
              _hover={{ bg: 'gray.600' }}
              _focus={{ bg: 'gray.600' }}
              width="100%"
            />
          </Box>
          <Button 
            onClick={handleSearchClick} 
            leftIcon={<SearchIcon />} 
            colorScheme="teal"
            variant="solid"
            mx={{ base: 0, md: 2 }}
            mb={{ base: 2, md: 0 }}
          >
            Search
          </Button>
          <Button 
            onClick={toggleLiveStreaming} 
            leftIcon={<InfoIcon />} 
            colorScheme="teal"
            variant="solid"
            mx={{ base: 0, md: 2 }}
          >
            Live Streaming
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Navbar;
