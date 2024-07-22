// import React, { useContext, useEffect, useState } from "react";
// import { Flex, Avatar, Text, Box, VStack, Divider } from "@chakra-ui/react";
// import { Base_url } from "../../utils/util";
// import { AuthContext } from "../../context/AuthContext";
// import axios from "axios";

// const LeftSide = ({ setActiveChat }) => {
//   const { roomid } = useContext(AuthContext);

//   const [members, setMembers] = useState([]);
//   const [countMember, setCountMember] = useState(0);
//   useEffect(() => {
//     async function callMe() {
//       const response = await axios.get(
//         `${Base_url}/room/activemembers/${roomid}`
//       );
//       setMembers(response.data.data);
//       setCountMember(response.data.data.length);
//       console.log(response.data.data);
//     }

//     callMe();

//     const intervalId = setInterval(callMe, 5000);

//     return () => clearInterval(intervalId);
//   }, [roomid]);

//   return (
//     <Flex
//       width={{ base: "100%", md: "20%" }}
//       flexDirection="column"
//       height="100vh"
//       backgroundColor="#f7f7f7"
//       padding="1rem"
//       borderRight="1px solid #e2e8f0"
//       boxShadow="lg"
//       position="relative"
//     >
//       <Box mb={4}>
//         <Text fontSize="lg" fontWeight="bold" mb={2}>
//           Room Members
//         </Text>
//         <Divider />
//       </Box>
//       <VStack spacing={3} align="stretch">
//         {members.map((friend) => (
//           <Flex
//             key={friend.id}
//             p={3}
//             align="center"
//             borderRadius="md"
//             bg="white"
//             boxShadow="sm"
//             _hover={{ bg: "gray.100", cursor: "pointer" }}
//             onClick={() => setActiveChat(friend)}
//             transition="background 0.2s ease"
//           >
//             <Avatar src={friend.avatar} name={friend.username} size="md" />
//             <Text ml={3} fontWeight="medium" fontSize="md">
//               {friend.username}
//             </Text>
//           </Flex>
//         ))}
//       </VStack>
//     </Flex>
//   );
// };

// export default LeftSide;

import React, { useContext, useEffect, useState } from "react";
import { Flex, Avatar, Text, Box, VStack, Divider, Heading } from "@chakra-ui/react";
import { Base_url } from "../../utils/util";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const LeftSide = ({ setActiveChat }) => {
  const { roomid } = useContext(AuthContext);

  const [members, setMembers] = useState([]);
  const [countMember, setCountMember] = useState(0);

  useEffect(() => {
    async function callMe() {
      try {
        const response = await axios.get(`${Base_url}/room/activemembers/${roomid}`);
        setMembers(response.data.data);
        setCountMember(response.data.data.length);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching room members:", error);
      }
    }

    callMe();

    const intervalId = setInterval(callMe, 5000);

    return () => clearInterval(intervalId);
  }, [roomid]);

  return (
    <Flex
      width={{ base: "100%", md: "20%" }}
      flexDirection="column"
      height="100vh"
      backgroundColor="white"
      padding="1rem"
      borderRight="1px solid #e2e8f0"
      boxShadow="md"
      position="relative"
    >
      <Box mb={4}>
        <Heading as="h3" size="md" mb={2} color="teal.600">
          Room Members
        </Heading>
        <Divider borderColor="teal.300" />
      </Box>
      <VStack spacing={4} align="stretch">
        {members.map((friend) => (
          <Flex
            key={friend.id}
            p={3}
            align="center"
            borderRadius="md"
            bg="gray.50"
            boxShadow="sm"
            _hover={{ bg: "teal.50", cursor: "pointer" }}
            onClick={() => setActiveChat(friend)}
            transition="background 0.2s ease"
          >
            <Avatar src={friend.avatar} name={friend.username} size="sm" />
            <Text ml={3} fontWeight="medium" fontSize="md" color="gray.700">
              {`${friend.username}`} <Box as="span" fontSize="sm" fontStyle="italic">{friend.role === "host" && "(host)"}</Box>
            </Text>
          </Flex>
        ))}
      </VStack>
    </Flex>
  );
};

export default LeftSide;

