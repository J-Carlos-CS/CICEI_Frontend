import React, { useState } from "react";
import {IconButton,Button,Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  useTheme, Paper, Grid 
  } from "@mui/material";
  import { useLocation, useNavigate } from 'react-router-dom';
import {
  useGetUserQuery, useCreateUserMutation, useLoginUserMutation,  } from "services/userService";

import { DataGrid } from "@mui/x-data-grid";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DataGridCustomToolBar from "components/DataGridCustomToolBar"
import Header from "components/Header";

const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginUserMutation();
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const handleLogin = async () => {
    try {
      // Llama a la función de inicio de sesión (login) pasando el email y la contraseña
      const response = await login({ email, password });
      console.log(response)
      // Verifica si la respuesta de la API fue exitosa (debes adaptar esto según tu API)
      if (response.status === "success") {
        // La autenticación fue exitosa
        // Aquí puedes manejar el token de autenticación, redireccionar al usuario, etc.
        console.log("Inicio de sesión exitoso");
      } else {
        // La autenticación falló, puedes manejar los errores aquí
        console.error("Fallo en el inicio de sesión");
      }
    } catch (error) {
      // Maneja cualquier error de la llamada a la API
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <Grid
      container
      justifyContent="center" // Centra horizontalmente en el centro
      alignItems="center"     // Centra verticalmente en el centro
      height="100vh"          // Establece el alto al 100% de la pantalla
      color="secondary"
    >
      <Grid item>
        <Paper elevation={3} style={{ padding: theme.spacing(4) }}>
          <Box width="300px">
            <Header title="LOGIN" subtitle="Ingresa tus credenciales" />
            {/* Formulario de inicio de sesión */}
            <TextField
              label="Correo Electrónico"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="secondary"
              style={{ fontSize: "1rem", padding: "0.5rem 1rem", marginTop: theme.spacing(2) }}
              onClick={() => {
                handleLogin()
                navigate(`/dashboard`);
                setActive(`/dashboard`);
              }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;