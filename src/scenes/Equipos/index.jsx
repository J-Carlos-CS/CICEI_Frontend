import React, { useEffect, useState } from "react";
import { show_alerta } from "services/functions";
import Header from "components/Header";
import { Box, Button, Chip, Dialog, IconButton, DialogTitle, DialogActions } from "@mui/material";
import { DeleteForeverOutlined, EditOutlined, RemoveRedEye } from "@mui/icons-material";
import { deleteEquipos, getCategoria, getEquipos, getProyecto, getUnidades, putEquipos } from "services/api";
import { useNavigate } from "react-router-dom";
import DataTable from "components/DataTable";
import Form from "./Form";

const Equipos = () => {
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
    fecha_adquisicion: "",
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const respuesta = await getEquipos();
    setEquipo(respuesta.data);
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
      setNewEquipo(proyec);
    }
  };
  const closeModal = async () => {
    setModal(false);
  };
  const validar = () => {
    var method;
    if (newEquipo.nombre.trim() !== "" && newEquipo.cantidad !== 0 && newEquipo.unidad !== "" && newEquipo.categoriaId !== 0 && newEquipo.proyectoId !== 0 && newEquipo.marca.trim() !== "" && newEquipo.modelo.trim() !== "") {
      closeModal();
      if (operation === 1) {
        method = "POST";
      } else {
        method = "PUT";
      }
      sendData(method);
    } else {
      closeModal();
      show_alerta("COMPLETA TODOS LOS DATOS", "warning");
    }
  };
  const EliminarEquipo = async (id) => {
    const respuesta = await deleteEquipos(id);
    if (respuesta.error) {
      show_alerta("<b>ERROR</b> EN LA SOLICITUD", "error");
    } else {
      show_alerta("<b>EQUIPO</b>: " + newEquipo.nombre + ", FUE ELIMINADO CON EXITO! ", "success");
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
    <Box m="1rem 2.5rem">
      <Header title="EQUIPO" subtitle="LISTADO DE EQUIPOS" />
      <DataTable rows={equipo || {}} columns={columns || {}} columnVisibilityModel={columnVisibilityModel || {}} setColumnVisibilityModel={setColumnVisibilityModel || {}} openModal={openModal || {}} />
      <Dialog open={modal} onClose={closeModal}>
        <DialogTitle color="secondary">{title}</DialogTitle>
        <Form newEquipo={newEquipo || {}} setNewEquipo={setNewEquipo || {}} operation={operation || {}} unidades={unidades || {}} categorias={categorias || {}} proyectos={proyectos || {}} />
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
