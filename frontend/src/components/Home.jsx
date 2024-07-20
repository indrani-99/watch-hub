// home // src/components/HomePage.js

import React from 'react';
import { Box, Button, Container, Heading, Text, Image, Stack } from '@chakra-ui/react';

function HomePage() {
  return (
    <Container maxW="container.xl" p={4}>
      <Box
        bg="teal.500"
        color="white"
        p={8}
        borderRadius="md"
        textAlign="center"
        mb={8}
      >
        <Heading as="h1" size="2xl" mb={4}>
          Welcome to Watch2Gether
        </Heading>
        <Text fontSize="lg">
          Experience seamless video watching with friends from anywhere in the world.
        </Text>
      </Box>
      
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} mb={8}>
        <Image
          src="https://via.placeholder.com/400"
          alt="Experience"
          borderRadius="md"
        />
       
      </Stack>
      
      <Box
        bg="gray.100"
        p={8}
        borderRadius="md"
        textAlign="center"
      >
        <Heading as="h2" size="xl" mb={4}>
          Join a Room and Start Watching Together
        </Heading>
        <Text fontSize="md" mb={4}>
          Create a new room or join an existing one to start watching videos with your friends in real-time.
        </Text>
        <Button colorScheme="teal" size="lg" mt={4}>
          Get Started
        </Button>
      </Box>
    </Container>
  );
}

export default HomePage;
