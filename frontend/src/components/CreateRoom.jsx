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

function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const { setRoomid } = useContext(AuthContext);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handleRoomCreate = async () => {
    try {
      if (roomName) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        const payload = { roomname: roomName };
        const response = await axios.post(
          `${Base_url}/room/create`,
          payload,
          config
        );

        const roomid = response.data.data;
        setRoomid(roomid);
        alert("Room created successfully");
        const roomLink = `${Base_url}/room/join/${roomid}`;
        const joinRoomResponse = await axios.get(roomLink);
        if (joinRoomResponse.data.success) navigate(`/newroom/${roomid}`);
        else {
          alert(joinRoomResponse.data.error);
        }
        console.log(response.data.data);
        console.log("Room created");
      } else {
        alert("Please enter a room name");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
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
        Create a Room
      </Heading>
      <VStack spacing={4}>
        <FormControl id="roomname" isRequired>
          <FormLabel>Room Name</FormLabel>
          <Input
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </FormControl>
        <Button size="lg" colorScheme="teal" onClick={handleRoomCreate}>
          Create
        </Button>
      </VStack>
    </Box>
  );
}

export default CreateRoom;
