//done indrani

import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Image,
  Stack,
  Center,
  Input,
} from "@chakra-ui/react";
import { Base_url } from "../utils/util";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";

function Home() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [roomInput, setRoomInput] = useState(false);
  const [roomName, setRoomName] = useState("");
  const handleRoomCreate = () => {
    if (token) {
      console.log("Hello!");
      navigate('/createroom'); 
    } else {
      navigate('/login'); 
    }
  };


  return (<>
    <Navbar/>
    <Container maxW="container.md" mt={16}>
    
      <Box textAlign="center" py={20} px={6}>
        <Image
          src="../../public/images/WatchHub.jpeg"
          alt="WatchHub Logo"
          boxSize="150px"
          mx="auto"
          mb={4}
        />
        <Heading as="h1" size="2xl" mb={4}>
          Welcome to WatchHub
        </Heading>
        <Text fontSize="lg" mb={6}>
          Create your own room and watch YouTube videos with your friends and
          enjoy.
        </Text>
        <Button size="lg" colorScheme="teal" onClick={handleRoomCreate}>
          Create a Room
        </Button>
      </Box>
      {roomInput && <Input placeholder="Enter room name" />}
    </Container>
    </>
  );
}

export default Home;
