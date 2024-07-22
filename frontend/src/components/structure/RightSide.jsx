import { Flex, Box, Text, Input, Button, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Chat from '../Chat';

const RightSide = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    setMessages([...messages, { text: newMessage, sender: 'me' }]);
    setNewMessage('');
  };

  useEffect(() => {
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
        <Chat/>
       
      </Flex>
    );
  }
}
  
export default RightSide;

