import React from 'react'
import {
    Box,
    Divider,
    IconButton,
    List,
    Listltem,
    ListItemButton,
    Listltemlcon ,
    ListItemText ,
    Typography ,
    useTheme,
    ListItem,
    ListItemIcon,
    Button
} from "@mui/material";
import Drawer from '@mui/material/Drawer';
import{
    SettingsOutlined,
    ChevronLeft,
    ChevronRightOutlined,
    KitchenOutlined,
  
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
    LibraryBooksOutlined,
    BiotechOutlined,
    HomeOutlined,
    CancelOutlined,
    SetMealOutlined,
    FeedOutlined,
    ArrowDropDownOutlined
} from "@mui/icons-material"

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween.jsx';
import ImagePerfil from "assets/ImagePerfil.jpg"

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
        text: "Reactivos",
        icon: < WaterDropOutlined />

    },{
        text: "Equipos",
        icon: <KitchenOutlined/>

    },
    {
        text: "Materiales",
        icon: <ScienceOutlined/>

    },
    {
        text: "Categorias",
        icon: <AutoStoriesOutlined />

    },
    
    {
        text: "",
        icon: null

    },
    {
      text: "Proyectos",
      icon: <LibraryBooksOutlined />
  },
    {
        text: "Guias",
        icon: <FeedOutlined/>

    },
    {
        text: "Ambientes",
        icon: <BiotechOutlined/>

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
                      CICEI-LAB
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
            <Box position="absolute" bottom="2rem">
                <Divider/>
                <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
                  <Box
                    component="img"
                    alt="profile"
                    src={ImagePerfil}
                    height="40px"
                    width="40px"
                    borderRadius="50%"
                    sx={{
                      objectFit: "cover"
                    }}
                  />
                    <Box textAlign="left">
                      <Typography fontWeight="bold" fontSize="0.9rem" sx={{color:theme.palette.secondary[100]}}>
                        {user.firstName}
                      </Typography>
                      <Typography  fontSize="0.8rem" sx={{color:theme.palette.secondary[200]}}>
                        {user.systemRol}
                      </Typography>
                      </Box>
                      
                   
                    <SettingsOutlined
                      sx={{color: theme.palette.secondary[300], fontSize:"25px"}}
                    />
                </FlexBetween>
            </Box>
        </Drawer>
    )}
  </Box>
  )}
export default Sidebar