import { Box, Button, Dialog, Typography } from "@mui/material";
import Header from "components/Header";
import React, { useEffect, useState } from "react";
import { getUsuario } from "services/api";
import ActualizarDatos from "./ActualizarDatos";

const UsuarioPerfil = () => {
  const [user, setUser] = useState({});
  const [modal, setModal] = useState(false);
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const _response = await getUsuario();
    setUser(_response.data.response);
  };
  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
        <Box component="form" sx={{ width: "100%", maxWidth: 500 }} noValidate autoComplete="off">
          <div style={{ textAlign: "center" }}>
            <Header color="primary" title="Perfil" />
            <Typography color="secondary" variant="h3">
              Nombre: {user.firstName + " " + user.lastName}
            </Typography>
            <Typography color="secondary" variant="h3">
              Fecha de Nacimiento: {user.birthDate ? user.birthDate.slice(0, user.birthDate.indexOf("T")) : ""}
            </Typography>
            <Typography color="secondary" variant="h3">
              Rol: {user.rol}
            </Typography>
            <Typography color="secondary" variant="h3">
              Email: {user.email}
            </Typography>
            <Typography color="secondary" variant="h3">
              Celular: {user.cellPhone}
            </Typography>
            <Typography color="secondary" variant="h3">
              Carrera: {user.career}
            </Typography>
            <Button variant="contained" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} color="success" onClick={() => setModal(true)}>
              Actualizar Datos
            </Button>
          </div>
        </Box>
      </Box>
      <Dialog open={modal} onClose={() => setModal(false)} fullWidth maxWidth="md">
        <ActualizarDatos user={user} />
      </Dialog>
    </>
  );
};

export default UsuarioPerfil;
