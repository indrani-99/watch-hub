import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import Room from "./Room";
import Logout from "./Logout";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import { AuthContext } from "../context/AuthContext";
import NewRoom from "./NewRoom";
import Main from "./structure/Main";

const AllRoute = () => {
  const { token } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {token ? (
        <>
          <Route path="/logout" element={<Logout />} />
          <Route path="/room" element={<Room />} />
          <Route path="/createroom" element={<CreateRoom />} />
          <Route path="/newroom/:roomid" element={<Main/>} />
          <Route path="/joinroom" element={<JoinRoom />} />
        </>
      ) : (
        <>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </>
      )}
    </Routes>
  );
};

export default AllRoute;
