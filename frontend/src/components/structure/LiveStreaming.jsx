import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Box, Button, Flex, Heading, Radio, RadioGroup, Stack, Text, useToast } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faStop } from '@fortawesome/free-solid-svg-icons';

const socket = io('http://localhost:3001');

const LiveStreaming = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const pcRef = useRef(new RTCPeerConnection());
    const [isHost, setIsHost] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const pc = pcRef.current;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate);
            }
        };

        pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        socket.on('offer', async (data) => {
            if (!isHost) {
                await pc.setRemoteDescription(new RTCSessionDescription(data));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('answer', answer);
            }
        });

        socket.on('answer', async (data) => {
            await pc.setRemoteDescription(new RTCSessionDescription(data));
        });

        socket.on('candidate', async (data) => {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(data));
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        });

        return () => {
            pc.close();
        };
    }, [isHost]);

    const startStream = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
            pcRef.current.addTrack(track, stream);
        });

        if (isHost) {
            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            socket.emit('offer', offer);
        }

        toast({
            title: "Streaming started.",
            description: "You are now live.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    const stopStream = () => {
        const pc = pcRef.current;
        pc.getSenders().forEach(sender => sender.track.stop());
        pc.close();
        pcRef.current = new RTCPeerConnection();
        localVideoRef.current.srcObject = null;
        remoteVideoRef.current.srcObject = null;

        toast({
            title: "Streaming stopped.",
            description: "You have stopped streaming.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box textAlign="center" p={5} color="white" bg="gray.800" borderRadius="md" boxShadow="lg">
            <Heading mb={4}>Live Streaming App</Heading>
            <RadioGroup onChange={setIsHost} value={isHost ? 'host' : 'guest'}>
                <Stack direction="row" spacing={5} justify="center" mb={4}>
                    <Radio value="host" colorScheme="green">Host</Radio>
                    <Radio value="guest" colorScheme="blue">Guest</Radio>
                </Stack>
            </RadioGroup>
            <Flex justify="center" mb={4}>
                <Button
                    leftIcon={<FontAwesomeIcon icon={faVideo} />}
                    colorScheme="green"
                    onClick={startStream}
                    mr={2}
                >
                    Start Streaming
                </Button>
                <Button
                    leftIcon={<FontAwesomeIcon icon={faStop} />}
                    colorScheme="red"
                    onClick={stopStream}
                >
                    Stop Streaming
                </Button>
            </Flex>
            <Text fontSize="lg" mb={2}>Local Stream:</Text>
            <Box mb={4} bg="gray.700" borderRadius="md" p={2}>
                <video ref={localVideoRef} autoPlay playsInline muted width="100%" />
            </Box>
            <Text fontSize="lg" mb={2}>Remote Stream:</Text>
            <Box mb={4} bg="gray.700" borderRadius="md" p={2}>
                <video ref={remoteVideoRef} autoPlay playsInline width="100%" />
            </Box>
        </Box>
    );
};

export default LiveStreaming;
