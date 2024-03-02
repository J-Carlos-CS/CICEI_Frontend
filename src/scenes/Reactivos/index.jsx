import React, { useEffect, useState } from "react";
import { show_alerta } from "../../services/functions";
import Header from "components/Header";
import { Box, Button, Chip, Dialog, IconButton, DialogTitle, DialogActions } from "@mui/material";
import { DeleteForeverOutlined, EditOutlined } from "@mui/icons-material";
import { getReactivos, putReactivos, getCategoria, getProyecto, getUnidades, deleteReactivo } from "services/api";
import DataTable from "components/DataTable";
import Form from "./Form";

const Reactivos = () => {
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [reactivos, setReactivos] = useState([]);
  const [categorias, setCategoria] = useState([]);
  const [proyectos, setProyecto] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [operation, setOperation] = useState("");
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({ observaciones: false, marca: false, fecha_vencimiento: false });
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
    setNewReactivos({
      ...newReactivos,
      id: 0,
      nombre: "",
      cantidad: null,
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
  };
  const openModal = (op, proyec) => {
    clearModal();
    setOperation(op);
    setModal(true);
    getUnidad();
    getCategorias();
    getProyectos();
    if (op === 1) {
      setTitle("Agregar Reactivos");
    } else if (op === 2) {
      setTitle("Editar Reactivos");
      setNewReactivos(proyec);
    }
  };
  const closeModal = () => {
    setModal(false);
  };
  const validar = () => {
    var method;
    closeModal();
    if (
      newReactivos.nombre.trim() !== "" &&
      newReactivos.cantidad !== 0 &&
      newReactivos.unidades !== "" &&
      newReactivos.clasificacion !== "" &&
      newReactivos.codigo.trim() !== "" &&
      newReactivos.marca.trim() !== "" &&
      newReactivos.categoriaId !== 0 &&
      newReactivos.proyectoId !== 0
    ) {
      if (operation === 1) {
        method = "POST";
      } else {
        method = "PUT";
      }
      sendData(method);
    } else {
      closeModal();
      show_alerta("completa todos los datos", "warning");
    }
  };
  const EliminarReactivo = async (id) => {
    if (id) {
      const respuesta = await deleteReactivo(id);
      if (respuesta.error) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Reactivos: " + newReactivos.nombre + ", fue eliminado con exito! ", "success");
      }
      getProducto();
    }
  };
  const sendData = async (metodo) => {
    console.log(newReactivos);
    const respuesta = await putReactivos(metodo, newReactivos);
    if (respuesta.error) {
      show_alerta("Error en la solicitud", "error");
    } else {
      if (operation === 1) {
        show_alerta("Reactivos: " + newReactivos.nombre + ", fue creado con exito! ", "success");
      } else {
        show_alerta("Reactivos: " + newReactivos.nombre + ", fue actualizado con exito! ", "success");
      }
    }
    getProducto();
  };

  const columns = [
    { field: "nombre", headerName: "NOMBRE", flex: 0.5 },
    { field: "cantidad", headerName: "CANTIDAD", flex: 0.5 },
    { field: "unidades", headerName: "UNIDADES", flex: 0.5 },
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
    { field: "marca", headerName: "MARCA", flex: 0.5 },
    { field: "codigo", headerName: "CODIGO", flex: 0.5 },
    {
      field: "observaciones",
      headerName: "OBSERVACIONES",
      flex: 0.5,
    },
    { field: "clasificacion", headerName: "CLASIFICACION", flex: 0.5 },
    {
      field: "fecha_vencimiento",
      headerName: "FECHA VENCIMIENTO",
      flex: 0.5,
      valueGetter: (params) => params.row.fecha_vencimiento.slice(0, params.row.fecha_vencimiento.indexOf("T")),
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
          <IconButton color="secondary" aria-label="Editar" onClick={() => openModal(2, params.row)}>
            <EditOutlined />
          </IconButton>
          <IconButton color="secondary" aria-label="Eliminar" onClick={() => EliminarReactivo(params.row.id)}>
            <DeleteForeverOutlined />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="1rem 2.5rem">
      <Header title="REACTIVOS" subtitle="Lista de Reactivos" />
      <DataTable rows={reactivos || {}} columns={columns || {}} columnVisibilityModel={columnVisibilityModel || {}} setColumnVisibilityModel={setColumnVisibilityModel || {}} openModal={openModal || {}} />
      <Dialog open={modal} onClose={closeModal}>
        <DialogTitle color="secondary">{title}</DialogTitle>
        <Form newReactivos={newReactivos || {}} setNewReactivos={setNewReactivos || {}} unidades={unidades || {}} categorias={categorias || {}} proyectos={proyectos || {}} />
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
