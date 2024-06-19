import { DialogTitle, DialogContent, DialogActions, Button, Box, TextField } from "@mui/material";
import { logout } from "Auth/userReducer";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postActualizarDatos } from "services/api";
import { show_alerta } from "services/functions";

const ActualizarDatos = ({ user, closeModal, getProducto }) => {
  const [userdatos, setUserDatos] = useState({
    career: "",
    cellPhone: "",
    birthDate: "",
  });
  const navigate = useNavigate();

  const validar = () => {
    closeModal();
    if (userdatos.career !== "") {
      if (userdatos.cellPhone !== "") {
        if (userdatos.birthDate !== "") {
          postActualizarDatos(userdatos)
            .then((res) => {
              if (res.data?.success) {
                show_alerta("Datos Actualizados con exito", "success");
                var _res = logout();
                if (_res) {
                  navigate("/login");
                  window.location.reload();
                }
              } else {
                show_alerta(res.data.response, "error");
              }
            })
            .catch((err) => {
              show_alerta("Error al actualizar los Datos", "error");
            });
        } else {
          show_alerta("El campo fecha de Nacimiento es obligatorio", "error");
        }
      } else {
        show_alerta("El campo Celular es obligatorio", "error");
      }
    } else {
      show_alerta("El campo Carrera es obligatorio", "error");
    }
  };
  return (
    <>
      <DialogTitle>Actualizar Datos</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            width: "auto",
            "& .MuiTextField-root": { m: 1, width: "30ch" },
          }}
          noValidate
          autoComplete="off">
          <>
            <TextField
              id="career"
              label="CARRERA"
              defaultValue={user.career}
              color="secondary"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                setUserDatos({
                  ...userdatos,
                  career: e.target.value,
                })
              }
            />
            <TextField
              id="cellPhone"
              label="CELULAR"
              defaultValue={user.cellPhone}
              color="secondary"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                setUserDatos({
                  ...userdatos,
                  cellPhone: e.target.value,
                })
              }
            />
          </>
          <>
            <TextField
              id="birthDate"
              type="date"
              label="Fecha de Nacimiento"
              defaultValue={user.birthDate ? user.birthDate.slice(0, user.birthDate.indexOf("T")) : ""}
              color="secondary"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                setUserDatos({
                  ...userdatos,
                  birthDate: e.target.value,
                })
              }
            />
          </>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="secondary" onClick={() => validar()}>
          Actualizar
        </Button>
      </DialogActions>
    </>
  );
};

export default ActualizarDatos;
