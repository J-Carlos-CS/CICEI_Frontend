import React, { useEffect, useState } from "react";
import { show_alerta } from "services/functions";
import Header from "components/Header";
import { Box, Button, Chip, Dialog, IconButton, useTheme, DialogTitle, DialogContent, TextField, DialogActions, MenuItem } from "@mui/material";
import { DeleteForeverOutlined, EditOutlined, Send, RemoveRedEye } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolBar";
import { deleteEquipos, getCategoria, getEquipos, getProyecto, getUnidades, putEquipos } from "services/api";
import { Navigate, useNavigate } from "react-router-dom";
import DetalleEquipos from "scenes/Detalle_Equipos";

const Equipos = () => {
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [equipo, setEquipo] = useState([]);
  const [categorias, setCategoria] = useState([]);
  const [proyectos, setProyecto] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [operation, setOperation] = useState("");
  const navigate = useNavigate();
  const [newEquipo, setNewEquipo] = useState({
    id: 0,
    nombre: "",
    cantidad: 0,
    unidad: "",
    estado: true,
    categoriaId: 0,
    proyectoId: 0,
    marca: "",
    modelo: "",
  });
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const respuesta = await getEquipos();
    setEquipo(respuesta.data);
    console.log(equipo);
  };
  const getCategorias = async () => {
    const respuesta = await getCategoria();
    setCategoria(respuesta.data);
  };
  const getProyectos = async () => {
    const respuesta = await getProyecto();
    setProyecto(respuesta.data);
  };
  const getUnidad = async () => {
    const respuesta = await getUnidades();
    setUnidades(respuesta.data);
  };
  const cleanModal = async () => {
    setNewEquipo({
      id: 0,
      nombre: "",
      cantidad: null,
      unidad: "",
      modelo: "",
      marca: "",
      estado: true,
      categoriaId: 0,
      proyectoId: 0,
    });
  };
  const openModal = async (op, proyec) => {
    cleanModal();
    setOperation(op);
    setModal(true);
    getCategorias();
    getProyectos();
    getUnidad();
    if (op === 1) {
      setTitle("Agregar Equipo");
    } else if (op === 2) {
      setTitle("Editar Equipo");
      setNewEquipo({
        id: proyec.id,
        nombre: proyec.nombre,
        cantidad: proyec.cantidad,
        unidad: proyec.unidad,
        estado: proyec.estado,
        categoriaId: proyec.categoriaId,
        proyectoId: proyec.proyectoId,
        marca: proyec.marca,
        modelo: proyec.modelo,
      });
    }
  };
  const closeModal = async () => {
    setModal(false);
  };
  const validar = () => {
    var method;
    if (newEquipo.nombre.trim() === "" && newEquipo.cantidad !== 0 && newEquipo.unidad === "" && newEquipo.categoriaId !== 0 && newEquipo.proyectoId !== 0) {
      closeModal();
      show_alerta("completa todos los datos", "warning");
    } else {
      closeModal();
      if (operation === 1) {
        method = "POST";
      } else {
        method = "PUT";
      }
      sendData(method);
    }
  };
  const EliminarEquipo = async (id) => {
    const respuesta = await deleteEquipos(id);
    if (respuesta.error) {
      show_alerta("Error en la solicitud", "error");
    } else {
      show_alerta("Equipo: " + newEquipo.nombre + ", fue eliminado con exito! ", "success");
    }
    getProducto();
  };
  const sendData = async (method) => {
    const respuesta = await putEquipos(method, newEquipo);
    if (respuesta.error) {
      show_alerta("Error en la solicitud", "error");
    } else {
      if (operation === 1) {
        show_alerta("Equipo: " + newEquipo.nombre + ", fue creado con exito! ", "success");
      } else {
        show_alerta("Equipo: " + newEquipo.nombre + ", fue actualizado con exito! ", "success");
      }
    }
    getProducto();
  };
  const ver = async (id) => {
    navigate("/proyeto/detalle", { state: { id: id } });
  };
  const columns = [
    { field: "nombre", headerName: "NOMBRE", flex: 0.5 },
    { field: "cantidad", headerName: "CANTIDAD", flex: 0.5 },
    { field: "unidad", headerName: "UNIDAD", flex: 0.5 },
    { field: "marca", headerName: "MARCA", flex: 0.5 },
    { field: "modelo", headerName: "MODELO", flex: 0.5 },
    {
      field: "categoriaId",
      headerName: "CATEGORIA",
      flex: 0.5,
      valueGetter: (params) => params.row.categoria.categoria,
    },
    {
      field: "proyectoId",
      headerName: "PROYECTO",
      flex: 0.5,
      valueGetter: (params) => params.row.proyecto.proyecto,
    },
    {
      field: "estado",
      headerName: "ESTADO",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.estado ? "ACTIVO" : "DESACTIVADO"} color={params.row.estado ? "success" : "error"} />,
    },
    {
      field: "acciones",
      headerName: "ACCIONES",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <IconButton color="secondary" aria-label="Ver" onClick={() => ver(params.row.id)}>
            <RemoveRedEye />
          </IconButton>
          <IconButton color="secondary" aria-label="Editar" onClick={() => openModal(2, params.row)}>
            <EditOutlined />
          </IconButton>
          <IconButton color="secondary" aria-label="Eliminar" onClick={() => EliminarEquipo(params.row.id)}>
            <DeleteForeverOutlined />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="EQUIPO" subtitle="LISTADO DE EQUIPOS" />
      <Box display="flex" justifyContent="flex-end" mb="1.5rem">
        <Button variant="contained" color="secondary" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} endIcon={<Send />} onClick={() => openModal(1)}>
          Agregar Equipo
        </Button>
      </Box>
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}>
        <DataGrid getRowId={(row) => row.id} rows={equipo || []} columns={columns} disableRowSelectionOnClick components={{ Toolbar: DataGridCustomToolbar }} />
      </Box>
      <Dialog open={modal} onClose={closeModal}>
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
                  label="Fecha de Vencimiento"
                  defaultValue={newEquipo.fecha_vencimiento ? newEquipo.fecha_vencimiento : null}
                  color="secondary"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      fecha_vencimiento: e.target.value,
                    })
                  }
                />
              ) : null}
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
      </Dialog>
    </Box>
  );
};

export default Equipos;
