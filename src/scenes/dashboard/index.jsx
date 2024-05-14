import { Box, useMediaQuery } from "@mui/material";
import React from "react";
import LogoCICEI from "../../assets/LogoCiceiVertical.png";
import StatBox from "components/StatBox";
import { CancelOutlined, CheckCircleOutlineOutlined, Email, PauseCircleOutlineOutlined } from "@mui/icons-material";
import { useTheme } from "@emotion/react";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 2, width: "30ch" },
        }}
        noValidate
        autoComplete="off">
        <div style={{ textAlign: "center" }}>
          <Box component="img" alt="Logo CICEI" src={LogoCICEI} height="400px" width="500px" borderRadius="50%"></Box>
        </div>
        <div style={{ textAlign: "center" }}>
          <Box mt="20px" display="grid" gridAutoRows="160px" gap="20px">
            <StatBox title="Solicitudes Pendientes" value={"hola"} icon={<PauseCircleOutlineOutlined sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
            <StatBox title="Solicitudes Aprobadas" value={"hola"} icon={<CheckCircleOutlineOutlined sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
            <StatBox title="Solicitudes Rechazadas" value={"hola"} icon={<CancelOutlined sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default Dashboard;
