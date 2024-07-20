// import React, { useState } from 'react'
import { Flex, Avatar, Text, Box, VStack } from '@chakra-ui/react';

const friends = [
  { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Bob Johnson', avatar: 'https://via.placeholder.com/150' },
  { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Bob Johnson', avatar: 'https://via.placeholder.com/150' },
];

const LeftSide = ({ setActiveChat }) => {
  return (
    <Flex
      width="15%"
      flexDirection="column"
      justifyContent="start"
      height="auto"
      backgroundColor="#fafafa"
      padding="5px"
    >
      <VStack spacing={4}>
        {friends.map(friend => (
          <Flex
            key={friend.id}
            p={2}
            align="center"
            _hover={{ bg: 'gray.100', cursor: 'pointer' }}
            onClick={() => setActiveChat(friend)}
            w="100%"
          >
            <Avatar src={friend.avatar} name={friend.name} />
            <Text ml={2}>{friend.name}</Text>
          </Flex>
        ))}
      </VStack>
    </Flex>
  );
}

export default LeftSide;
