import Head from "next/head";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import AdminPage from "@/components/AdminPage";
import UserPage from "@/components/UserPage";

// import { parse as parseCookies } from "cookie";
// import * as jwtDecode from "jwt-decode";
// import { useDispatch } from "react-redux";
// import { login } from "../lib/redux/authSlice";

import { useAppSelector } from "../lib/redux/hooks";
import Footer from "@/components/Footer";

export default function Home() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  console.log("isLoggedIn", isLoggedIn);

  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const username = useAppSelector((state) => state.auth.username);
  const userId = useAppSelector((state) => state.auth.userId);
  return (
    <>
      <Head>
        <title>Green Drive</title>
        <meta name="description" content="Save the world, one tree at a time" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {isLoggedIn ? (
          isAdmin ? (
            <AdminPage
              username={username}
              isAdmin={isAdmin}
              userId={userId}
              isLoggedIn={isLoggedIn}
            />
          ) : (
            <UserPage
              username={username}
              isAdmin={isAdmin}
              userId={userId}
              isLoggedIn={isLoggedIn}
            />
          )
        ) : (
          <LoginForm />
        )}
      </div>
      <Footer />
    </>
  );
}
