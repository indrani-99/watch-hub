import { Box, Image } from "@chakra-ui/react";
import { TiSocialYoutube } from "react-icons/ti";
import { HiUserPlus } from "react-icons/hi2";
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { IoVideocamOff } from "react-icons/io5";


function RoomNavbar() {
  return (
    <>
      <Box>
        <Box>
          <Image src="" alt="" />
        </Box>
        <Box w="100%" p={4} color="black">
          Search here
          <TiSocialYoutube />
        </Box>
        <Box>
          <HiUserPlus />
          <IoMdMic />
          <IoMdMicOff />
          <FaVideo />
          <IoVideocamOff />
        </Box>
      </Box>
    </>
  );
}

export default RoomNavbar;