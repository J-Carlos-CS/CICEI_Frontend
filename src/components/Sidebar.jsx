import React from 'react'
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    Listltem,
    ListItemButton,
    Listltemlcon ,
    ListItemText ,
    Typography ,
    useTheme,
    ListItem,
    ListItemIcon
} from "@mui/material";
import{
    Settings0utlined,
    ChevronLeft,
    ChevronRightOutlined,
    Home0utlined ,
    ShoppingCart0ultined,
    Groups20utlined,
    ReceiptLong0utlined ,
    Public0utlined,
    Point0fSaleOutlined ,
    Today0utlined,
    CalendarMonth0utlined ,
    AdminPanelSettings0utlined,
    TrendingUpOutlined,
    PieChartOutlined,
    CheckCircleOutlineOutlined,
    PauseCircleOutlineOutlined,
    AutoStoriesOutlined,
    CancelOutlinedIcon,
    WaterDropOutlined,
    ScienceOutlined,

    BiotechOutlined,
    HomeOutlined,
    CancelOutlined
} from "@mui/icons-material"

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import profileImage from "assets/ImagePerfil.jpg"

const navItems=[
    {
        text: "Dashboard",
        icon: <HomeOutlined/>

    },
    {
        text: "Inventario",
        icon: null,

    },
    {
        text: "Reactivos/CF",
        icon: < WaterDropOutlined />

    },{
        text: "Equipos/Prod",
        icon: <BiotechOutlined/>

    },
    {
        text: "Materiales/Custom",
        icon: <ScienceOutlined/>

    },
    {
        text: "Manuales",
        icon: <AutoStoriesOutlined />

    },
    {
        text: "Solicitudes",
        icon: null

    },
    {
        text: "Aprobadas",
        icon: <CheckCircleOutlineOutlined   />

    },
    {
        text: "Pendientes",
        icon: <PauseCircleOutlineOutlined  />

    },
    {
        text: "Negadas",
        icon: <CancelOutlined   />

    },



    
]
const Sidebar = ({
    user,
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile,
  }) => {
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
            }}
          >
            <Box width="100%">
              <Box m="1.5rem 2rem 2rem 3rem">
                <FlexBetween color={theme.palette.secondary.main}>
                  <Box display="flex" alignItems="center" gap="0.5rem">
                    <Typography variant="h4" fontWeight="bold">
                      ECOMVISION
                    </Typography>
                  </Box>
                  {!isNonMobile && (
                    <IconButton onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>
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
                          backgroundColor:
                            active === lcText
                              ? theme.palette.secondary[300]
                              : "transparent",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[100],
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ml: "2rem",
                            color:
                              active === lcText
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[200],
                          }}
                        >
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        {active === lcText && (
                          <ChevronRightOutlined sx={{ ml: "auto" }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
        </Drawer>
    )}
  </Box>
  )}
export default Sidebar
