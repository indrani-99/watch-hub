import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false); 

  useEffect(() => {
    if (!isNameSet) {
      const userName = prompt("Enter Your Name to Join");
      setName(userName);
      setIsNameSet(true); 
      socket.emit("new-user-joined", userName);
    }

    socket.on("user-joined", (name) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { name, message: "joined the chat", position: "left" },
      ]);
    });

    socket.on("receive", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { name: data.name, message: data.message, position: "left" },
      ]);
    });

    socket.on("left", (name) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { name, message: "left the chat", position: "left" },
      ]);
    });

    return () => {
      socket.off("user-joined");
      socket.off("receive");
      socket.off("left");
    };
  }, [isNameSet]); 

  const sendMessage = (e) => {
    e.preventDefault();
    setMessages((prevMessages) => [
      ...prevMessages,
      { name: "You", message, position: "right" },
    ]);
    socket.emit("send", message);
    setMessage("");
  };

  return (
    <Box className="App">
      <Flex as="nav" bg="blue.500" p={4} color="white" >
        <Heading as="h4" size="md" style={{ textAlign: "center" }}>
          Chat with us
        </Heading>
      </Flex>
      <Box
        className="container"
        id="message-container"
        p={4}
        overflowY="auto"
        maxH="400px"
      >
        <Stack spacing={3}>
          {messages.map((msg, index) => (
            
            <Flex
              key={index}
              bg={msg.position === "left" ? "gray.100" : "blue.100"}
              p={3}
              borderRadius="md"
              alignSelf={msg.position === "left" ? "flex-start" : "flex-end"}
              maxW="auto"
            >

              <Text>
                {msg.name}: {msg.message}
              </Text>
            </Flex>
          ))}
        </Stack>
      </Box>
      <Box className="send" p={4}>
        <FormControl id="send-container" as="form" onSubmit={sendMessage}>
          <Flex>
            <Input
              type="text"
              id="messageInp"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              flex="1"
              mr={2}
            />
            <Button className="btn" type="submit" colorScheme="blue">
              Send
            </Button>
          </Flex>
        </FormControl>
      </Box>
    </Box>
  );
}

export default Chat;
