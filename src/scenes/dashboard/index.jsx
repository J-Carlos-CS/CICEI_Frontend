import { Box } from "@mui/material";
import React from "react";
import LogoCICEI from "../../assets/LogoCiceiVertical.png";

const Dashboard = () => {
  return (
    <Box mt={10} width="100%" display="flex" gap="0.5rem" alignItems="center" justifyContent="center">
      <Box component="img" alt="Logo CICEI" src={LogoCICEI} height="400px" width="500px" borderRadius="50%"></Box>
      {/*
      <Box
        component="img"
        alt="Logo CICEI"
        src={LogoUCB}
        height="200px"
        width="400px"
       
      >
      </Box>
      */}
    </Box>
  );
};

export default Dashboard;
