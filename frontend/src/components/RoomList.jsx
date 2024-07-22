import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); 

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/rooms");
        setRooms(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRooms();
  }, []);

  const joinRoom = (roomId, participant) => {
    socket.emit("joinRoom", { roomId, participant });
  };

  useEffect(() => {
    socket.on("participantJoined", (participant) => {
      console.log(`${participant} joined the room`);
    });

    return () => {
      socket.off("participantJoined");
    };
  }, []);

  return (
    <div>
      <h2>Room List</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            {room.name}
            <button onClick={() => joinRoom(room._id, "John Doe")}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
