import React, { useState, useEffect } from 'react';
import { Flex, Box, Text, Input, Button, VStack } from '@chakra-ui/react';

const RightSide = ({ activeChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return; // Prevent sending empty messages
    setMessages([...messages, { text: newMessage, sender: 'me' }]);
    setNewMessage('');
  };

  useEffect(() => {
    setMessages([]); // Clear messages when activeChat changes
  }, [activeChat]);

  if (!activeChat) {
    return (
      <Flex
        width="100%"
        height="100vh"
        backgroundColor="blue.50"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize="lg" color="gray.600">Select a friend to start chatting</Text>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      height="100vh"
      backgroundColor="blue.50"
      padding={{ base: '2', md: '5' }}
      borderLeft="1px"
      borderColor="gray.200"
      overflow="hidden"
    >
      <Box p={4} borderBottom="1px" borderColor="gray.200" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="blue.800">
          Chat with {activeChat.name}
        </Text>
      </Box>
      <VStack spacing={4} flex={1} overflowY="auto" padding="4" mb={16}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            alignSelf={msg.sender === 'me' ? 'flex-end' : 'flex-start'}
            bg={msg.sender === 'me' ? 'blue.100' : 'gray.100'}
            color={msg.sender === 'me' ? 'blue.800' : 'gray.800'}
            borderRadius="md"
            p={3}
            maxWidth="80%"
            wordBreak="break-word"
          >
            {msg.text}
          </Box>
        ))}
      </VStack>
      <Flex
        as="form"
        p={4}
        borderTop="1px"
        borderColor="gray.200"
        alignItems="center"
        position="relative"
        bottom="0"
        width="100%"
        backgroundColor="blue.50"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          mr={2}
          borderRadius="md"
          backgroundColor="white"
          _placeholder={{ color: 'gray.500' }}
          flex="1"
        />
        <Button
          onClick={handleSendMessage}
          colorScheme="blue"
          variant="solid"
        >
          Send
        </Button>
      </Flex>
    </Flex>
  );
};

export default RightSide;
