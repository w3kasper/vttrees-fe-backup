import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useAppDispatch } from "../lib/redux/hooks";
import { login } from "../lib/redux/authSlice";
import Cookies from "js-cookie";
import Image from "next/image";

import { TextField, Button, Box } from "comp-library-vt-vp";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    signIn(user_name: $username, user_password: $password)
  }
`;

function decodeJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const LoginForm = () => {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [signIn, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data && data.signIn) {
        //localStorage.setItem("token", data.signIn);
        Cookies.set("token", data.signIn);
        setIsLoggedIn(true);
        const payload = decodeJwt(data.signIn);
        setName(payload.username);
        setIsAdmin(payload.isAdmin);
        dispatch(
          login({
            isAdmin: payload.isAdmin,
            username: payload.username,
            userId: payload.sub,
          })
        );
      }
    },
  });

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    signIn({ variables: { username: username, password: password } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>Login successful!</p>
          <p>Name: {name}</p>
          <p>Is Admin: {isAdmin ? "Yes" : "No"}</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2, // spacing between elements
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                maxWidth: 400, // or any width you want
                m: "auto",
                height: "100vh",
              }}
            >
              <Image src="/carlogo.svg" alt="Icon" width={200} height={200} />
              <TextField
                variant="outlined"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
              <TextField
                variant="outlined"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <Button variant="contained" type="submit" fullWidth>
                Login
              </Button>
            </Box>
          </form>
        </>
      )}
    </div>
  );
};

export default LoginForm;
