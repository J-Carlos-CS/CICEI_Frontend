import { DialogTitle, DialogContent, DialogActions, Button, Box, TextField } from "@mui/material";
import React from "react";

const ActualizarDatos = ({ user }) => {
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
            />
            <TextField
              id="cellPhone"
              label="CELULAR"
              defaultValue={user.cellPhone}
              color="secondary"
              InputLabelProps={{
                shrink: true,
              }}
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
            />
          </>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="secondary">
          Actualizar
        </Button>
      </DialogActions>
    </>
  );
};

export default ActualizarDatos;
