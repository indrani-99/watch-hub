// import React from 'react'
import { Flex, Button, Box } from "@chakra-ui/react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const RoomNavbar = () => {
  const {roomid}=useContext(AuthContext);

  return (
    <Box backgroundColor="teal.500" width="100%" height="6vh">
    <Flex
      alignItems="center"
      justifyContent="space-between"
      paddingX="2rem"
      height="100%"
      maxWidth="1200px"
      margin="0 auto"
    >
      <Image src="../../../public/images/WatchHub.jpeg" height="4vh" />

      <Flex flex="1" marginX="1rem" alignItems="center">
        <Input
          placeholder="Search here YouTube videos"
          marginRight="1rem"
          backgroundColor="white"
        />
        <Button colorScheme="teal" variant="solid" marginRight="1rem">
          Search
        </Button>
      </Flex>

      <Button colorScheme="teal" variant="solid" marginRight="1rem">
        RoomLink : {`${Base_url}/room/join/${roomid}`}
      </Button>
      <Button colorScheme="red" variant="solid">
        Leave
      </Button>
    </Flex>
  </Box>
  );
};

export default RoomNavbar;

