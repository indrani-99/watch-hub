import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Button, Image, Spacer, HStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  // if(token)
  // {
  //   setIsLoggedIn(true);
  // }
  // const handleLoginLogout = () => {
  //   if (isLoggedIn) {
  //     token=null;
  //     setIsLoggedIn(false);
  //     navigate("/");
  //   } else {
  //     navigate("/login");
  //   }
  // };
  const handleJoinRoom = () => {
    navigate("/joinroom");
    console.log("Join room");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <Box bg="teal.500" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Box>
            <Button onClick={handleJoinRoom} colorScheme="teal" variant="solid">
              Join Room
            </Button>
          </Box>
        </HStack>
        <Spacer />
        <Box>
          {token ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <Button onClick={handleLogin}>
              Login
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
