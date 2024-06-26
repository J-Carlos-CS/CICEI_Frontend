import React, { useState } from "react";

import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { selectUser } from "../../Auth/userReducer";
import { useGetUserQuery } from "state/api.js";

const Layout = () => {
  //const isUser = useSelector(selectUser);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNavbarOpen] = useState(true);
  const user = useSelector(selectUser);
  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar user={user || {}} isNonMobile={isNonMobile} drawerWidth="250px" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Box flexGrow={1}>
        <Navbar user={user || {}} isSidebarOpen={isSidebarOpen} isNavarOpen={isNavbarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
