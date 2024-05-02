import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, Switch, TextField } from "@mui/material";
import React, { useState } from "react";
import { putUsuario } from "services/api";
import { show_alerta } from "services/functions";

const UsuarioFormEdit = ({ getProducto, closeModal, title, Usuario }) => {
  const [newUsuario, setNewUsuario] = useState(Usuario);
  const validar = () => {
    closeModal();
    try {
      if (newUsuario.rol !== "") {
        putUsuario(newUsuario)
          .then((res) => {
            if (res.data?.success) {
              show_alerta("Usuario actualizado con exito", "success");
              getProducto();
            } else {
              show_alerta(res.data.response, "error");
            }
          })
          .catch((err) => {
            show_alerta("Error al actualizar la ficha tecnica", "error");
          });
      } else {
        show_alerta("El campo Rol es obligatorio", "error");
      }
    } catch (error) {
      show_alerta(error, "error");
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
              id="rol"
              select
              label="Rol"
              color="secondary"
              defaultValue={newUsuario.rol}
              InputLabelProps={{
                shrink: true,
              }}
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
          <div class="terms">
            &nbsp; &nbsp;
            <FormControlLabel label="Estado" control={<Switch color="secondary" checked={newUsuario.status} onChange={(e) => setNewUsuario({ ...newUsuario, status: e.target.checked })} name="estado" />} />
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

export default UsuarioFormEdit;
