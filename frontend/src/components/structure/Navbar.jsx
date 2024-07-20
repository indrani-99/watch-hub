// import React from 'react'
import { Flex, Input, Button, Box } from '@chakra-ui/react';

const Navbar = () => {
  return (
    <Flex 
      as="nav" 
      align="center" 
      justify="space-between" 
      padding="1rem" 
      bg="gray.900" 
      color="white"
    >
      
      <Box width="40%">
        <Input 
          placeholder="Search" 
          variant="filled" 
          bg="gray.700" 
          color="white"
          _placeholder={{ color: 'gray.400' }}
          _hover={{ bg: 'gray.600' }}
          _focus={{ bg: 'gray.600' }}
        />
      </Box>
      <Button bg="white" 
          color="black">Search</Button>
    </Flex>
  );
}

export default Navbar;
