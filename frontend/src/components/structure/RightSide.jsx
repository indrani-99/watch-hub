// import React, { useState, useEffect } from 'react'
import { Flex, Box, Text, Input, Button, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const RightSide = ({ activeChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    setMessages([...messages, { text: newMessage, sender: 'me' }]);
    setNewMessage('');
  };

  useEffect(() => {
    // Reset messages when activeChat changes
    setMessages([]);
  }, [activeChat]);

  if (!activeChat) {
    return (
      <Flex
        width="auto"
        height="100vh"
        backgroundColor="#fafafa"
        justifyContent="center"
        alignItems="center"
      >
        <Text>Select a friend to start chatting</Text>
      </Flex>
    );
  }

  return (
    <Flex
      width="75%"
      flexDirection="column"
      justifyContent="space-between"
      height="auto"
      backgroundColor="#fafafa"
      padding="5px"
    >
      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold">
          Chat with {activeChat.name}
        </Text>
      </Box>
      <VStack spacing={4} flex={1} overflowY="auto" padding="4">
        {messages.map((msg, index) => (
          <Box
            key={index}
            alignSelf={msg.sender === 'me' ? 'flex-end' : 'flex-start'}
            bg={msg.sender === 'me' ? 'blue.100' : 'gray.100'}
            borderRadius="md"
            p={2}
          >
            {msg.text}
          </Box>
        ))}
      </VStack>
      <Flex p={4} as="form" onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          mr={2}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </Flex>
    </Flex>
  );
}

export default RightSide;
