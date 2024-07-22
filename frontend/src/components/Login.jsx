import { Button, Heading } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setMessage("Login successful");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      setMessage("Login failed");
      console.log(error);
    }
  };

  const handleNewUser = () => {
    navigate("/register");
  };

  return (
    <div className="loginMain">
      <Heading as="h5" size="xl" style={{ textAlign: "center" }}>
        Login
      </Heading>
      <br />
      {message && <div>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="loginInput"
        />
        <br />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="loginInput"
        />
        <br />
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            type="submit"
            style={{ width: "100%" }}
            className="buttoRL"
            colorScheme="blue"
          >
            Login
          </Button>
          <br />
          <Button
            size="md"
            height="43px"
            width="300px"
            border="2px"
            borderColor="blue.500"
            onClick={handleNewUser}
          >
            Create Account
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;
