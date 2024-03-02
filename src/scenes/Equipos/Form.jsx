import { Box, MenuItem, TextField, DialogContent } from "@mui/material";
import React from "react";

const Form = ({ newEquipo, setNewEquipo, operation, unidades, categorias, proyectos }) => {
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
            defaultValue={newEquipo.nombre}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewEquipo({
                ...newEquipo,
                nombre: e.target.value,
              })
            }
          />
          <TextField
            id="cantidadEquipo"
            type="number"
            label="Cantidad Equipo"
            defaultValue={newEquipo.cantidad}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewEquipo({
                ...newEquipo,
                cantidad: e.target.value,
              })
            }
          />
        </div>
        <div>
          <TextField
            id="marcaEquipo"
            label="Marca Equipo"
            defaultValue={newEquipo.marca}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewEquipo({
                ...newEquipo,
                marca: e.target.value,
              })
            }
          />
          <TextField
            id="modeloEquipo"
            label="Modelo Equipo"
            defaultValue={newEquipo.modelo}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewEquipo({
                ...newEquipo,
                modelo: e.target.value,
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
            defaultValue={newEquipo.unidad ? newEquipo.unidad : null}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setNewEquipo({
                ...newEquipo,
                unidad: event.target.value,
              });
            }}>
            {unidades.map((option) => (
              <MenuItem key={option.unidades} value={option.unidades}>
                {option.unidades}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="selectCategoria"
            select
            label="Categoria"
            color="secondary"
            defaultValue={newEquipo.categoriaId ? newEquipo.categoriaId : null}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setNewEquipo({
                ...newEquipo,
                categoriaId: event.target.value,
              });
            }}>
            {categorias.map((option) => (
              <MenuItem key={option.id.toString()} value={option.id}>
                {option.categoria}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div>
          <TextField
            id="selectProyecto"
            select
            label="Proyecto"
            color="secondary"
            defaultValue={newEquipo.proyectoId ? newEquipo.proyectoId : null}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setNewEquipo({
                ...newEquipo,
                proyectoId: event.target.value,
              });
            }}>
            {proyectos.map((option) => (
              <MenuItem key={option.id.toString()} value={option.id}>
                {option.proyecto}
              </MenuItem>
            ))}
          </TextField>
          {operation === 1 ? (
            <TextField
              id="fecha"
              type="date"
              label="Fecha de Adquisicion"
              defaultValue={newEquipo.fecha_adquisicion ? newEquipo.fecha_adquisicion : null}
              color="secondary"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                setNewEquipo({
                  ...newEquipo,
                  fecha_adquisicion: e.target.value,
                })
              }
            />
          ) : null}
        </div>
      </Box>
    </DialogContent>
  );
};

export default Form;
