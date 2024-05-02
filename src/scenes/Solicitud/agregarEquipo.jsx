import { Box, Button, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { show_alerta } from "services/functions";

const AgregarEquipo = ({ Equipos, setData, closeModal, getEquipoSolicitud, titulo }) => {
  const [equipo, setEquipo] = useState([]);
  const [solicitud, setSolicitud] = useState({ estado: false, cantidad: 0 });
  const [equipoSeleccionado, setEquipoSeleccionado] = useState({});
  const [cantidadtotal, setCatidad] = useState({});
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const response = await getEquipoSolicitud();
    let results = response.data.response;
    if (Equipos.length > 0) {
      results.forEach((result) => {
        Equipos.forEach((equipo) => {
          if (result.id === equipo.id) {
            results = results.filter((item) => item.id !== result.id);
          }
        });
      });
      setEquipo(results);
    } else {
      setEquipo(response.data.response);
    }
  };
  return (
    <>
      <DialogTitle color="secondary">Agregar {titulo}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            width: "auto",
            "& .MuiTextField-root": { m: 1, width: "20ch" },
          }}
          noValidate
          autoComplete="off">
          <>
            <TextField
              id="selectEquipo"
              select
              fullWidth
              label={titulo}
              color="secondary"
              onChange={(event) => {
                setSolicitud({
                  ...solicitud,
                  estado: true,
                });
                setSolicitud(equipo.find((option) => option.id === event.target.value));
                setEquipoSeleccionado({ ...equipoSeleccionado, ...equipo.find((option) => option.id === event.target.value) });
                setCatidad(equipo.find((option) => option.id === event.target.value));
              }}>
              {equipo.map((option) => (
                <MenuItem key={option.id} value={option.id} name={option.nombre}>
                  {option.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={solicitud.estado}
              type="number"
              fullWidth
              label={solicitud.hasOwnProperty("unidades") ? "Cantidad en: " + solicitud.unidades : "Cantidad de Unidades"}
              InputProps={{
                inputProps: {
                  min: 0,
                  max: solicitud.cantidad,
                  step: 1,
                },
              }}
              onChange={(e) => {
                setEquipoSeleccionado({
                  ...equipoSeleccionado,
                  cantidad: e.target.value,
                });
              }}
            />
          </>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="error" onClick={() => closeModal(false)}>
          Cancelar
        </Button>
        <Button
          autoFocus
          color="secondary"
          onClick={() => {
            if (equipoSeleccionado.cantidad !== cantidadtotal.cantidad && equipoSeleccionado.cantidad > 0) {
              console.log("++++++++++++++++++++++++++++++++++++++++++++++");
              console.log(cantidadtotal);
              console.log(equipoSeleccionado);
              setData((prevCount) => [...prevCount, equipoSeleccionado]);
            } else {
              show_alerta("La cantidad debe ser mayor a 0", "error");
            }
            closeModal(false);
          }}>
          Guardar
        </Button>
      </DialogActions>
    </>
  );
};

export default AgregarEquipo;
