import { Box, DialogContent, FormControlLabel, Switch, TextField } from "@mui/material";
import React from "react";

const Form = ({ newDetalleEquipo, setNewDetalleEquipo }) => {
  console.log("---------------------------------------------------------");
  console.log(newDetalleEquipo);
  return (
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
            id="nombreEquipo"
            label="Nombre Equipo"
            defaultValue={newDetalleEquipo.num_ucb}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewDetalleEquipo({
                ...newDetalleEquipo,
                num_ucb: e.target.value,
              })
            }
          />
          <TextField
            id="datetime-local"
            type="date"
            label="Fecha de Adquisicion"
            defaultValue={newDetalleEquipo.fecha_adquisicion ? newDetalleEquipo.fecha_adquisicion.slice(0, newDetalleEquipo.fecha_adquisicion.indexOf("T")) : ""}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewDetalleEquipo({
                ...newDetalleEquipo,
                fecha_adquisicion: e.target.value,
              })
            }
          />
        </div>
        <div>
          <TextField
            id="fecha"
            type="date"
            label="Fecha de Preventivo"
            defaultValue={newDetalleEquipo.fecha_preventivo ? newDetalleEquipo.fecha_preventivo.slice(0, newDetalleEquipo.fecha_preventivo.indexOf("T")) : ""}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewDetalleEquipo({
                ...newDetalleEquipo,
                fecha_preventivo: e.target.value,
              })
            }
          />
          <TextField
            id="fecha"
            type="date"
            label="Fecha de Correccion"
            InputLabelProps={{ shrink: true, required: true }}
            defaultValue={newDetalleEquipo.fecha_Correccion ? newDetalleEquipo.fecha_Correccion.slice(0, newDetalleEquipo.fecha_Correccion.indexOf("T")) : ""}
            color="secondary"
            onChange={(e) =>
              setNewDetalleEquipo({
                ...newDetalleEquipo,
                fecha_Correccion: e.target.value,
              })
            }
          />
        </div>
        <div>
          <TextField
            width="30ch"
            height="80rem"
            id="observacionesReactivo"
            label="Observaciones"
            color="secondary"
            defaultValue={newDetalleEquipo.observaciones ? newDetalleEquipo.observaciones : null}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setNewDetalleEquipo({
                ...newDetalleEquipo,
                observaciones: event.target.value,
              });
            }}
            multiline
          />
          <div class="terms">
            &nbsp; &nbsp;
            <FormControlLabel label="Estado" control={<Switch color="secondary" checked={newDetalleEquipo.estado} onChange={(e) => setNewDetalleEquipo({ ...newDetalleEquipo, estado: e.target.checked })} name="estado" />} />
          </div>
        </div>
      </Box>
    </DialogContent>
  );
};

export default Form;
