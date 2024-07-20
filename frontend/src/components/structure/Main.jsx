// import React from 'react'
import { Box, Flex } from '@chakra-ui/react';
import MainContent from './MainContent';
import Navbar from './Navbar';
import LeftSide from './LeftSide';
import RightSide from './RightSide';

const Main = () => {
  return (
    <Box
      alignItems="center"
      gap="10px"
      p="3px"
      mt="20px"
      borderRadius="10px"
    >
      <Box
        display="flex"
        justifyContent="center"
        width="100%"
        height="6vh"
        backgroundColor="lightgray"
        textAlign="center"
      >
        <Navbar />
      </Box>
      <Flex justify="space-evenly">
        <LeftSide />
        <MainContent />
        <RightSide />
      </Flex>
    </Box>
  );
}

export default Main;
