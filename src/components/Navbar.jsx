import React, { useState } from "react";
import { LightModeOutlined, DarkModeOutlined, ArrowDropDownOutlined, SettingsOutlined } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import { useDispatch } from "react-redux";
import { setMode } from "state";
import ImagePerfil from "assets/ImagePerfil.jpg";
import { AppBar, useTheme, Toolbar, IconButton, Button, Box, Typography, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "./../Auth/userReducer";
const Navbar = ({ user, isSidebarOpen, isNavarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  let isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const close = () => {
    var res = logout();
    if (res) {
      navigate("/login");
      window.location.reload();
    }
  };
  const isClose = () => (isOpen = false);
  const perfil = () => {
    isClose();
    navigate("/perfil");
    isClose();
    setAnchorEl(null);
  };
  return isNavarOpen ? (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween></FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => dispatch(setMode())}>{theme.palette.mode === "dark" ? <DarkModeOutlined sx={{ fontSize: "25px" }} /> : <LightModeOutlined sx={{ fontSize: "25px" }} />}</IconButton>
          {/* <IconButton>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton> */}
          <FlexBetween>
            <Button onClick={handleClick} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", textTransform: "none", gap: "1rem" }}>
              {/* <Box
                component="img"
                alt="profile"
                src={ImagePerfil}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{
                  objectFit: "cover",
                }}
              /> */}
              <Box textAlign="left">
                <Typography fontWeight="bold" fontSize="0.85rem" sx={{ color: theme.palette.secondary[100] }}>
                  {user.firstName ? user.firstName + " " + user.lastName : ""}
                </Typography>
                <Typography fontSize="0.75rem" sx={{ color: theme.palette.secondary[200] }}>
                  {user.systemRol}
                </Typography>
              </Box>
              <ArrowDropDownOutlined sx={{ color: theme.palette.secondary[300], fontSize: "25px" }} />
            </Button>
            <Menu anchorEl={anchorEl} open={isOpen} onClose={isClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
              <MenuItem onClick={() => perfil()}>Perfil</MenuItem>
              <MenuItem onClick={() => close()}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  ) : null;
};

export default Navbar;
