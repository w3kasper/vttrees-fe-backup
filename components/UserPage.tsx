import React from "react";
import LeaderBoard from "@/components/LeaderBoard";
import SearchTrees from "@/components/SearchTrees";
import UploadVehicle from "@/components/UploadVehicle";
import PurchaseTrees from "./PurchaseTrees";

import { Box, Button } from "comp-library-vt-vp";
import Image from "next/image";

import Cookies from "js-cookie";
import { logout } from "../lib/redux/authSlice"; // adjust the import path if necessary
import { useDispatch } from "react-redux";

const UserPage = ({
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
  console.log("UserPage", username, isAdmin, userId, isLoggedIn);
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
      <UploadVehicle />
      <PurchaseTrees />
    </>
  );
};

export default UserPage;
