import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Base_url } from "../utils/util";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomid, setRoomid] = useState(localStorage.getItem("roomid") || null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (roomid) {
      localStorage.setItem("roomid", roomid);
    }
  }, [roomid]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${Base_url}/user/login`, {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setRoomid(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, loading, roomid, setRoomid }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
