import { Box, Button, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";
import { postInvitarUsuario } from "services/api";
import { show_alerta } from "services/functions";

const UsuarioForm = ({ getProducto, closeModal, title }) => {
  const [newUsuario, setNewUsuario] = useState({
    email: "",
    firstName: "",
    lastName: "",
    rol: "",
  });
  const validar = () => {
    closeModal();
    if (newUsuario.firstName !== "") {
      if (newUsuario.lastName !== "") {
        if (newUsuario.email !== "" && newUsuario.email.includes("@")) {
          if (newUsuario.rol !== "") {
            postInvitarUsuario(newUsuario)
              .then((res) => {
                if (res.data?.success) {
                  show_alerta("Usuario agregado con exito", "success");
                  getProducto();
                } else {
                  show_alerta(res.data.response, "error");
                }
              })
              .catch((err) => {
                show_alerta("Error al agregar la ficha tecnica", "error");
              });
          } else {
            show_alerta("El campo Rol es obligatorio", "error");
          }
        } else {
          show_alerta("El campo Correo es obligatorio", "error");
        }
      } else {
        show_alerta("El campo Apellido es obligatorio", "error");
      }
    } else {
      show_alerta("El campo Nombre es obligatorio", "error");
    }
  };

  return (
    <div>
      <DialogTitle color="secondary">{title}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            width: "auto",
            "& .MuiTextField-root": { m: 1, width: "20ch" },
          }}
          noValidate
          autoComplete="off">
          <div>
            <TextField
              id="firstName"
              label="Nombre "
              color="secondary"
              onChange={(e) =>
                setNewUsuario({
                  ...newUsuario,
                  firstName: e.target.value,
                })
              }
            />
            <TextField
              id="lastName"
              label="Apellido"
              color="secondary"
              onChange={(e) =>
                setNewUsuario({
                  ...newUsuario,
                  lastName: e.target.value,
                })
              }
            />
            <TextField
              id="email"
              label="Correo"
              type="email"
              color="secondary"
              onChange={(e) =>
                setNewUsuario({
                  ...newUsuario,
                  email: e.target.value,
                })
              }
            />
            <TextField
              id="rol"
              select
              label="Rol"
              color="secondary"
              onChange={(event) => {
                setNewUsuario({
                  ...newUsuario,
                  rol: event.target.value,
                });
              }}>
              <MenuItem value="Administrador">Administrador</MenuItem>
              <MenuItem value="Tutor">Tutor</MenuItem>
              <MenuItem value="Investigador">Investigador</MenuItem>
            </TextField>
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="error" onClick={closeModal}>
          Cancelar
        </Button>
        <Button autoFocus color="secondary" onClick={() => validar()}>
          Guardar
        </Button>
      </DialogActions>
    </div>
  );
};

export default UsuarioForm;
