import React, { useEffect } from "react";
import LeaderBoard from "@/components/LeaderBoard";
import SearchTrees from "@/components/SearchTrees";
import CreateMake from "@/components/CreateMake";
import CreateModel from "@/components/CreateModel";
import UpdateRatio from "@/components/UpdateRatio";
import UploadVehicle from "@/components/UploadVehicle";

import { Box, Button } from "comp-library-vt-vp";
import Image from "next/image";

import Cookies from "js-cookie";
import { useRouter } from "next/router";

import { logout } from "../lib/redux/authSlice"; // adjust the import path if necessary
import { useDispatch } from "react-redux";

const AdminPage = ({
  username,
  isAdmin,
  userId,
  isLoggedIn,
}: {
  username: string;
  isAdmin: boolean;
  userId: number;
  isLoggedIn: boolean;
}) => {
  const dispatch = useDispatch();
  console.log("AdminPage", username, isAdmin, userId, isLoggedIn);
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          border: 1,
          borderColor: "divider",
          borderRadius: 10,
          p: 1,
          px: 1, // Increase horizontal padding
          bgcolor: "background.paper",
          margin: 1,
          display: "flex",
          alignItems: "center",
          gap: 2, // Add space between items
        }}
      >
        <Image src="/icon.svg" alt="Icon" width={44} height={44} />{" "}
        {/* Add your image */}
        {username} {isAdmin}{" "}
        <Button
          variant="outlined"
          onClick={() => {
            Cookies.remove("token");
            isLoggedIn = false;
            dispatch(logout());
            //window.location.reload();
          }}
          sx={{ borderRadius: 10, py: 1 }} // Set the border radius to 10
        >
          Logout
        </Button>
      </Box>

      <SearchTrees />
      <LeaderBoard />
      <CreateMake />
      <CreateModel />
      <UpdateRatio />
    </>
  );
};

export default AdminPage;
