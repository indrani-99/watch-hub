import React, { useState } from 'react';
import { Box, SimpleGrid, AspectRatio, ChakraProvider } from '@chakra-ui/react';
import ReactPlayer from 'react-player';

const videos = [
  { id: 1, url: 'https://www.youtube.com/watch?v=N3TdtAH5Sbw&t=195s', title: 'Video 1' },
  { id: 2, url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', title: 'Video 2' },
  { id: 3, url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', title: 'Video 3' },
];

const MainContent = () => {
  const [selectedVideo, setSelectedVideo] = useState(videos[0].url);

  return (
    <ChakraProvider>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        padding="5"
        bg="pink"
        boxShadow="lg"
        borderRadius="md"
        maxW="container.md"
        mx="auto"
      >
        {/* Selected Video */}
        <AspectRatio ratio={16 / 9} width="90%" mb={4}>
          <ReactPlayer url={selectedVideo} width="90%" height="100%" />
        </AspectRatio>

        {/* Video Cards */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
          {videos.map((video) => (
            <Box
              key={video.id}
              bg="white"
              p={4}
              borderRadius="md"
              boxShadow="md"
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
              onClick={() => setSelectedVideo(video.url)}
            >
              <AspectRatio ratio={16 / 9} mb={2}>
                <ReactPlayer url={video.url} light={true} width="100%" height="100%" />
              </AspectRatio>
              <Box textAlign="center" fontWeight="bold">{video.title}</Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </ChakraProvider>
  );
};

export default MainContent;
