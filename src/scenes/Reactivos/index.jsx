import React, { useEffect, useState } from "react";
import { show_alerta } from "../../services/functions";
import Header from "components/Header";
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  useTheme,
  DialogTitle,
  DialogContent,
  TextField,
  FormControlLabel,
  Switch,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { EditOutlined, Send } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import {
  getReactivos,
  putReactivos,
  getCategoria,
  getProyecto,
  getUnidades,
} from "services/api";
import DataGridCustomToolbar from "components/DataGridCustomToolBar";

const Reactivos = () => {
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [reactivos, setReactivos] = useState([]);
  const [categorias, setCategoria] = useState([]);
  const [proyectos, setProyecto] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [operation, setOperation] = useState("");
  const [newReactivos, setNewReactivos] = useState({
    id: 0,
    nombre: "",
    cantidad: 0,
    unidades: "",
    clasificacion: "",
    codigo: "",
    observaciones: "",
    estado: false,
    marca: "",
    fecha_vencimiento: "",
    categoriaId: 0,
    proyectoId: 0,
  });
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const respuesta = await getReactivos();
    setReactivos(respuesta.data);
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
  const clearModal = async () => {
    setNewReactivos({ ...newReactivos, estado: false, reactivos: "" });
  };
  const openModal = (op, proyec) => {
    clearModal();
    setOperation(op);
    if (op === 1) {
      setTitle("Agregar Reactivos");
      setModal(true);
      getCategorias();
      getProyectos();
      getUnidad();
    } else if (op === 2) {
      setTitle("Editar Reactivos");
      setNewReactivos({
        estado: proyec.estado,
        reactivos: proyec.reactivos,
        id: proyec.id,
      });
      getCategorias();
      getProyectos();
      getUnidad();
      setModal(true);
    }
  };

  const closeModal = () => {
    setModal(false);
  };

  const validar = () => {
    var method;
    if (
      newReactivos.npmbre.trim() === "" &&
      newReactivos.cantidad !== 0 &&
      newReactivos.unidades === "" &&
      newReactivos.clasificacion === "" &&
      newReactivos.codigo.trim() === "" &&
      newReactivos.marca.trim() === "" &&
      newReactivos.categoria !== 0 &&
      newReactivos.proyecto !== 0
    ) {
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
  const sendData = async (metodo) => {
    const respuesta = await putReactivos(metodo, newReactivos);

    if (respuesta.error) {
      show_alerta("Error en la solicitud", "error");
    } else {
      if (operation === 1) {
        show_alerta(
          "Reactivos: " + newReactivos.reactivos + ", fue creado con exito! ",
          "success"
        );
      } else {
        show_alerta(
          "Reactivos: " +
            newReactivos.reactivos +
            ", fue actualizado con exito! ",
          "success"
        );
      }
    }
    getProducto();
  };

  const columns = [
    { field: "reactivos", headerName: "REACTIVOS", flex: 0.5 },
    {
      field: "estado",
      headerName: "ESTADO",
      flex: 0.5,
      renderCell: (params) => (
        <Chip
          label={params.row.estado ? "ACTIVO" : "DESACTIVADO"}
          color={params.row.estado ? "success" : "error"}
        />
      ),
    },
    {
      field: "acciones",
      headerName: "ACCIONES",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="secondary"
            aria-label="Editar"
            onClick={() => openModal(2, params.row)}>
            <EditOutlined />
          </IconButton>
          {/*<IconButton color="secondary" aria-label="Eliminar">
            <DeleteForeverOutlined />
          </IconButton>*/}
        </Box>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="REACTIVOS" subtitle="Lista de Reactivos" />
      <Box display="flex" justifyContent="flex-end" mb="1.5rem">
        <Button
          variant="contained"
          color="secondary"
          style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
          endIcon={<Send />}
          onClick={() => openModal(1)}>
          Agregar Reactivos
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
        {" "}
        <DataGrid
          getRowId={(row) => row.id}
          rows={reactivos || []}
          columns={columns}
          disableRowSelectionOnClick
          components={{ Toolbar: DataGridCustomToolbar }}
        />
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
                id="nombreReactivo"
                label="Nombre Reactivo"
                defaultValue={newReactivos.reactivos}
                color="secondary"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) =>
                  setNewReactivos({
                    ...newReactivos,
                    reactivos: e.target.value,
                  })
                }
              />
              <TextField
                id="cantidadRectivo"
                type="number"
                label="Cantidad Reactivo"
                defaultValue={newReactivos.reactivos}
                color="secondary"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) =>
                  setNewReactivos({
                    ...newReactivos,
                    reactivos: e.target.value,
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
                defaultValue={
                  newReactivos.unidades ? newReactivos.unidades : null
                }
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
                defaultValue={
                  newReactivos.clasificacion ? newReactivos.clasificacion : null
                }
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
                defaultValue={
                  newReactivos.categoriaId ? newReactivos.categoriaId : null
                }
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
                defaultValue={
                  newReactivos.proyectoId ? newReactivos.proyectoId : null
                }
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
                defaultValue={
                  newReactivos.observaciones ? newReactivos.observaciones : null
                }
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
                defaultValue={
                  newReactivos.fecha_vencimiento
                    ? newReactivos.fecha_vencimiento
                    : null
                }
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

export default Reactivos;
