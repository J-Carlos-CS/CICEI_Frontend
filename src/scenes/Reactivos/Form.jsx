import { Box, MenuItem, TextField, DialogContent } from "@mui/material";
import React from "react";

const Form = ({ newReactivos, setNewReactivos, unidades, categorias, proyectos }) => {
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
            id="nombreReactivo"
            label="Nombre Reactivo"
            defaultValue={newReactivos.nombre}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewReactivos({
                ...newReactivos,
                nombre: e.target.value,
              })
            }
          />
          <TextField
            id="cantidadRectivo"
            type="number"
            label="Cantidad Reactivo"
            defaultValue={newReactivos.cantidad}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewReactivos({
                ...newReactivos,
                cantidad: e.target.value,
              })
            }
          />
        </div>
        <div>
          <TextField
            id="selectUnidades"
            select
            label="Unidades"
            color="secondary"
            defaultValue={newReactivos.unidades ? newReactivos.unidades : null}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setNewReactivos({
                ...newReactivos,
                unidades: event.target.value,
              });
            }}>
            {unidades.map((option) => (
              <MenuItem key={option.unidades} value={option.unidades}>
                {option.unidades}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="selectClasificacion"
            select
            label="Clasificacion"
            color="secondary"
            defaultValue={newReactivos.clasificacion ? newReactivos.clasificacion : null}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setNewReactivos({
                ...newReactivos,
                clasificacion: event.target.value,
              });
            }}>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Peligroso">Peligroso</MenuItem>
            <MenuItem value="Restringido">Restringido</MenuItem>
          </TextField>
        </div>
        <div>
          <TextField
            id="codigoReactivo"
            label="Codigo Reactivo"
            defaultValue={newReactivos.codigo}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewReactivos({
                ...newReactivos,
                codigo: e.target.value,
              })
            }
          />
          <TextField
            id="marcaRectivo"
            label="Marca Reactivo"
            defaultValue={newReactivos.marca}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewReactivos({
                ...newReactivos,
                marca: e.target.value,
              })
            }
          />
        </div>
        <div>
          <TextField
            id="selectCategoria"
            select
            label="Categoria"
            color="secondary"
            defaultValue={newReactivos.categoriaId ? newReactivos.categoriaId : null}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setNewReactivos({
                ...newReactivos,
                categoriaId: event.target.value,
              });
            }}>
            {categorias.map((option) => (
              <MenuItem key={option.id.toString()} value={option.id}>
                {option.categoria}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="selectProyecto"
            select
            label="Proyecto"
            color="secondary"
            defaultValue={newReactivos.proyectoId ? newReactivos.proyectoId : null}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setNewReactivos({
                ...newReactivos,
                proyectoId: event.target.value,
              });
            }}>
            {proyectos.map((option) => (
              <MenuItem key={option.id.toString()} value={option.id}>
                {option.proyecto}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div>
          {" "}
          <TextField
            width="30ch"
            id="observacionesReactivo"
            label="Observaciones"
            color="secondary"
            defaultValue={newReactivos.observaciones ? newReactivos.observaciones : null}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setNewReactivos({
                ...newReactivos,
                observaciones: event.target.value,
              });
            }}
            multiline
          />
          <TextField
            id="cantidadRectivo"
            type="date"
            label="Fecha de Vencimiento"
            defaultValue={newReactivos.fecha_vencimiento ? newReactivos.fecha_vencimiento : null}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewReactivos({
                ...newReactivos,
                fecha_vencimiento: e.target.value,
              })
            }
          />
        </div>
      </Box>
    </DialogContent>
  );
};

export default Form;
