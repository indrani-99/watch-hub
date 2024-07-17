import React, { useState } from "react";
import axios from "axios";

const CreateRoom = () => {
  const [name, setName] = useState("");

  const createRoom = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/rooms", {
        name,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create Room</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Room Name"
      />
      <button onClick={createRoom}>Create</button>
    </div>
  );
};

export default CreateRoom;
