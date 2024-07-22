// import React from 'react'
import { Box, Flex, Input, Image, Button } from "@chakra-ui/react";
import MainContent from "./MainContent";
import Navbar from "./RoomNavbar";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import RoomNavbar from "../RoomNavbar";
import { Base_url } from "../../utils/util";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chat from "../Chat";

const Main = () => {
  const { roomid, setRoomid } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLeave = async () => {
    try {
      const leaveResponse = await axios.get(`${Base_url}/room/leave/${roomid}`);
      if (leaveResponse.data.success) {
        setRoomid(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Error leaving room:", error.message);
    }
  };

  useEffect(() => {
    if (!roomid) {
      navigate("/");
    }
  }, [roomid]);
  return (
    <Box alignItems="center" gap="10px" borderRadius="10px">
      <Box
        backgroundColor="black"
        width="100%"
        height="10vh"
        style={{ padding: "30px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          paddingX="2rem"
          height="100%"
          maxWidth="1200px"
          margin="0 auto"
        >
          <Image
            src="../../../public/images/WatchHub.jpeg"
            height="6vh"
            width="4vw"
            marginLeft="-100px"
          />

          <Flex flex="1" marginX="1rem" alignItems="center">
            <Input
              placeholder="Search here YouTube videos"
              marginRight="1rem"
              backgroundColor="white"
            />
            <Button colorScheme="teal" variant="solid" marginRight="1rem">
              Search
            </Button>
          </Flex>

          <Box
            style={{
              backgroundColor: "rgb(34, 195, 94)",
              color: "white",
              width: "37%",
              padding: "7px",
              borderRadius: "5px",
            }}
            colorScheme="teal"
            variant="solid"
            marginRight="1rem"
          >
            RoomLink:
            <span style={{ fontStyle: "italic" }}>
              {" "}
              {`${Base_url}/room/join/${roomid}`}
            </span>
          </Box>
          <Button colorScheme="red" variant="solid" onClick={handleLeave}>
            Leave
          </Button>
        </Flex>
      </Box>
      <Flex>
        <LeftSide />
        <MainContent />
       <Chat/>
      </Flex>
    </Box>
  );
};

export default Main;

