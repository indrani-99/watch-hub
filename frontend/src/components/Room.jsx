import { useState } from "react";
import RoomNavbar from "./RoomNavbar";
import { FaUserAlt } from "react-icons/fa";
function Room() {
  const [roomMember, setRoomMember] = useState([]);
  return (
    <>
      <div>
        <RoomNavbar />

        {/* room members */}
        <Box>
          {roomMember.length > 0 &&
            roomMember.map((member) => (
              <Box>
                <FaUserAlt />
              </Box>
            ))}
        </Box>
      </div>
    </>
  );
}

export default Room;
