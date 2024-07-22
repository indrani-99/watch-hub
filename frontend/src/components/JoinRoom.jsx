import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import { Base_url } from "../utils/util";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function JoinRoom() {
  const [roomlink, setRoomlink] = useState("");
  const navigate = useNavigate();
  const { setRoomid } = useContext(AuthContext);

  const handleRoomJoin = async () => {
    try {
      const joinRoomResponse = await axios.get(roomlink);
      console.log("Join room");

      const parts = roomlink.split("/");
      const roomid = parts[parts.length - 1];
      console.log(roomlink);
      console.log(roomid);

      if (joinRoomResponse.data.success) {
        setRoomid(roomid);
        navigate(`/newroom/${roomid}`);
      }
      else {
        alert(joinRoomResponse.data.error);
      }
    } catch (err) {
      console.error("Error creating room:", err.message);
      alert("Failed to join the room. Please try again.");
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={36}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading as="h2" size="xl" textAlign="center" mb={6}>
        Join a Room
      </Heading>
      <VStack spacing={4}>
        <FormControl id="roomlink" isRequired>
          <FormLabel>Room Link</FormLabel>
          <Input
            placeholder="Paste Room Link Here"
            value={roomlink}
            onChange={(e) => setRoomlink(e.target.value)}
          />
        </FormControl>
        <Button size="lg" colorScheme="teal" onClick={handleRoomJoin}>
          Join
        </Button>
      </VStack>
    </Box>
  );
}

export default JoinRoom;
