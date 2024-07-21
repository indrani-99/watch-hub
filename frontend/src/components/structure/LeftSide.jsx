import React from 'react';
import { Flex, Avatar, Text, VStack, Box, useBreakpointValue } from '@chakra-ui/react';
import { MdChat } from 'react-icons/md';

const friends = [
  { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Bob Johnson', avatar: 'https://via.placeholder.com/150' },
];

const LeftSide = ({ setActiveChat }) => {
  const sidebarWidth = useBreakpointValue({ base: '100%', md: '20%' });

  return (
    <Flex
      width={sidebarWidth}
      flexDirection="column"
      justifyContent="start"
      height="100vh"
      backgroundColor="blue.50"
      padding={{ base: '2', md: '4' }}
      borderRight="1px"
      borderColor="gray.200"
    >
      <Box p={4} borderBottom="1px" borderColor="gray.200">
        <Text fontSize="lg" fontWeight="bold" color="blue.800">
          Friends
        </Text>
      </Box>
      <VStack spacing={4} mt={4}>
        {friends.map(friend => (
          <Flex
            key={friend.id}
            p={2}
            align="center"
            _hover={{ bg: 'blue.100', cursor: 'pointer' }}
            onClick={() => setActiveChat(friend)}
            w="100%"
            borderRadius="md"
          >
            <Avatar src={friend.avatar} name={friend.name} />
            <Text ml={2} fontSize="md" color="blue.800">{friend.name}</Text>
            <Box ml="auto" color="blue.500">
              <MdChat />
            </Box>
          </Flex>
        ))}
      </VStack>
    </Flex>
  );
}

export default LeftSide;
