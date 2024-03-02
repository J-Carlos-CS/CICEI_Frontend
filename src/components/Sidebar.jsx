import React from "react";
import { Box, IconButton, List, ListItemButton, ListItemText, Typography, useTheme, ListItem, ListItemIcon } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import {
  ChevronLeft,
  ChevronRightOutlined,
  KitchenOutlined,
  CheckCircleOutlineOutlined,
  PauseCircleOutlineOutlined,
  AutoStoriesOutlined,
  WaterDropOutlined,
  LibraryBooksOutlined,
  BiotechOutlined,
  HomeOutlined,
  CancelOutlined,
  FeedOutlined,
  Scale,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween.jsx";
import LogoCICEI from "assets/LogoCiceiVertical.png";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Inventario",
    icon: null,
  },
  {
    text: "Reactivos",
    icon: <WaterDropOutlined />,
  },
  {
    text: "Equipos",
    icon: <KitchenOutlined />,
  },
  {
    text: "Categorias",
    icon: <AutoStoriesOutlined />,
  },
  {
    text: "Proyecto",
    icon: <LibraryBooksOutlined />,
  },
  {
    text: "Unidades",
    icon: <Scale />,
  },

  {
    text: "",
    icon: null,
  },
  {
    text: "Guias",
    icon: <FeedOutlined />,
  },
  {
    text: "Ambientes",
    icon: <BiotechOutlined />,
  },
  {
    text: "Solicitudes",
    icon: null,
  },
  {
    text: "Aprobadas",
    icon: <CheckCircleOutlineOutlined />,
  },
  {
    text: "Pendientes",
    icon: <PauseCircleOutlineOutlined />,
  },
  {
    text: "Negadas",
    icon: <CancelOutlined />,
  },
];
const Sidebar = ({ user, drawerWidth, isSidebarOpen, setIsSidebarOpen, isNonMobile }) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}>
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box width="100%" display="flex" alignItems="center" gap="0.5rem">
                  <Box component="img" alt="Logo CICEI" src={LogoCICEI} height="80px" width="80px" borderRadius="50%" />
                  <Typography variant="h4" fontWeight="bold">
                    CICEI LABO
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor: active === lcText ? theme.palette.secondary[300] : "transparent",
                        color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[100],
                      }}>
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[200],
                        }}>
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && <ChevronRightOutlined sx={{ ml: "auto" }} />}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};
export default Sidebar;
