import React, { useState } from "react";
import { Button, TextField, Box, useTheme, Paper, Grid } from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import Header from "components/Header";
import { putLogin } from "services/api";
import { show_alerta } from "services/functions";
import { useSelector } from "react-redux";
import { login, selectUser } from "../../Auth/userReducer.js";

const Login = () => {
  const isUser = useSelector(selectUser);
  const theme = useTheme();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  if (isUser) {
    return <Navigate to={{ pathname: "/dashboard" }} />;
  }
  const userlogin = async () => {
    setIsLoading(true);
    await putLogin(user)
      .then((res) => {
        if (res.data?.success) {
          login(res.data?.response);
          show_alerta("Inicio de Seccion Correcto", "success");
          navigate("/dashboard");
          window.location.reload();
          navigate("/dashboard");
          window.location.reload();
        }
      })
      .catch((e) => {
        show_alerta(e.message, "error");
      });
    setIsLoading(false);
  };
  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh" color="secondary">
      <Grid item>
        <Paper elevation={3} style={{ padding: theme.spacing(4) }}>
          <Box ustifyContent="center" alignItems="center" color="secondary">
            <Header color="secondary" title="LOGIN" />
            {/* Formulario de inicio de sesión */}
            <div>
              <TextField label="Correo Electronico" type="email" color="secondary" margin="normal" onChange={(e) => setUser({ ...user, email: e.target.value })} />
            </div>
            <div>
              <TextField label="Contraseña" type="password" color="secondary" margin="normal" onChange={(e) => setUser({ ...user, password: e.target.value })} />
            </div>
            <Button variant="contained" color="secondary" style={{ fontSize: "1rem", padding: "0.5rem 1rem", marginTop: theme.spacing(2) }} onClick={() => userlogin()} disabled={isLoading}>
              Iniciar Sesión
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
