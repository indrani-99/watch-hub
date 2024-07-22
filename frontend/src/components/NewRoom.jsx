import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Input, VStack, FormControl, FormLabel, Heading, Textarea, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import YouTube from 'react-youtube';

function NewRoom() {
  const { roomId } = useParams(); 
  const [videoId, setVideoId] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const chatBoxRef = useRef(null);

  
  const videoOptions = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    
  }, [roomId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "You" }]);
      setMessage("");
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box maxW="container.lg" mx="auto" mt={8} p={8}>
      <Heading as="h2" size="xl" textAlign="center" mb={6}>
        {roomName || "Room"}
      </Heading>
      <Box mb={8}>
        <FormControl id="videoId" mb={4}>
          <FormLabel>Enter YouTube Video ID</FormLabel>
          <Input
            placeholder="Enter YouTube Video ID"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
          />
        </FormControl>
        <YouTube videoId={videoId} opts={videoOptions} />
      </Box>
      <Box>
        <Heading as="h3" size="lg" mb={4}>Chat</Heading>
        <Box
          ref={chatBoxRef}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="lg"
          p={4}
          maxH="300px"
          overflowY="auto"
        >
          {messages.map((msg, index) => (
            <Text key={index} mb={2}><strong>{msg.sender}:</strong> {msg.text}</Text>
          ))}
        </Box>
        <VStack spacing={4} mt={4}>
          <Textarea
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            size="lg"
            colorScheme="teal"
            onClick={handleSendMessage}
            isFullWidth
          >
            Send
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default NewRoom;
