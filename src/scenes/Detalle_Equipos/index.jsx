import { Box, Chip, Dialog, IconButton, DialogTitle, DialogActions, Button } from "@mui/material";
import { EditOutlined, RemoveRedEye, Description } from "@mui/icons-material";
import Header from "components/Header";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDetalleEquipo, postDetalleEquipo } from "services/api";
import DataTable from "components/DataTable";
import Form from "./Form";
import { show_alerta } from "services/functions";

const DetalleEquipos = () => {
  const location = useLocation();
  const equipoId = location.state.id;
  const [title, setTitle] = useState();
  const [modal, setModal] = useState();
  const [operation, setOperation] = useState("");
  const [detalleEquipo, setDetalleEquipo] = useState();
  const [newDetalleEquipo, setNewDetalleEquipo] = useState();
  useEffect(() => {
    getProducto();
  }, []);

  const getProducto = async () => {
    const respuesta = await getDetalleEquipo(equipoId);
    setDetalleEquipo(respuesta.data);
  };
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
    observaciones: false,
    CreadoBy: false,
    ModificadoBy: false,
    createdAt: false,
    updatedAt: false,
  });
  const manual = async (manualId) => {};
  const cleanModal = async () => {
    setNewDetalleEquipo({
      id: 0,
      num_ucb: "",
      observaciones: "",
      fecha_preventivo: "",
      estado: false,
      fecha_Correccion: "",
      fecha_adquisicion: "",
    });
  };
  const openModal = async (op, proyec) => {
    cleanModal();
    setOperation(op);
    setModal(true);
    setNewDetalleEquipo({
      id: proyec.id,
      num_ucb: proyec.num_ucb,
      observaciones: proyec.observaciones,
      fecha_preventivo: proyec.fechas_adquisiciones[0].fecha_preventivo,
      estado: proyec.estado,
      fecha_Correccion: proyec.fechas_adquisiciones[0].fecha_Correccion,
      fecha_adquisicion: proyec.fechas_adquisiciones[0].fecha_adquisicion,
    });
    if (op === 1) {
      setTitle("Ver Equipo");
    } else if (op === 2) {
      setTitle("Editar Equipo");
    }
  };
  const closeModal = async () => {
    setModal(false);
  };

  const validar = async () => {
    var method;
    if (newDetalleEquipo.num_ucb.trim() !== "") {
      closeModal();
      if (operation === 1) {
        method = "POST";
      } else {
        method = "PUT";
      }
      sendData(method);
    }
  };
  const sendData = async (method) => {
    const respuesta = await postDetalleEquipo(method, newDetalleEquipo);
    if (respuesta.error) {
      show_alerta("Error en la solicitud", "error");
    } else {
      if (operation === 1) {
        show_alerta("Equipo: " + newDetalleEquipo.num_ucb + ", fue creado con exito! ", "success");
      } else {
        show_alerta("Equipo: " + newDetalleEquipo.num_ucb + ", fue actualizado con exito! ", "success");
      }
    }
    getProducto();
  };
  const columns = [
    { field: "num_ucb", headerName: "CODIGO", flex: 0.5 },
    { field: "equipoId", headerName: "EQUIPO", flex: 0.5, valueGetter: (params) => params.row.equipo.nombre },
    {
      field: "observaciones",
      headerName: "OBSERVACIONES",
      flex: 0.5,
    },
    {
      field: "estado",
      headerName: "ESTADO",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.estado ? "ACTIVO" : "DESACTIVADO"} color={params.row.estado ? "success" : "error"} />,
    },
    {
      field: "fechas_adquisiciones",
      headerName: "FECHA DE ADQUISICION",
      flex: 0.5,
      valueGetter: (params) => (params.row.fechas_adquisiciones[0].fecha_adquisicion ? params.row.fechas_adquisiciones[0].fecha_adquisicion.slice(0, params.row.fechas_adquisiciones[0].fecha_adquisicion.indexOf("T")) : ""),
    },
    {
      field: "fechas_preventivo",
      headerName: "FECHA DE PREVENCION",
      flex: 0.5,
      valueGetter: (params) => (params.row.fechas_adquisiciones[0].fecha_preventivo ? params.row.fechas_adquisiciones[0].fecha_preventivo.slice(0, params.row.fechas_adquisiciones[0].fecha_preventivo.indexOf("T")) : ""),
    },
    {
      field: "fecha_Correccion",
      headerName: "FECHA DE CORRECCION",
      flex: 0.5,
      valueGetter: (params) => (params.row.fechas_adquisiciones[0].fecha_Correccion ? params.row.fechas_adquisiciones[0].fecha_Correccion.slice(0, params.row.fechas_adquisiciones[0].fecha_Correccion.indexOf("T")) : ""),
    },
    { field: "CreadoBy", headerName: "CREADO POR", flex: 0.5 },
    { field: "ModificadoBy", headerName: "MODIFICADO POR", flex: 0.5 },
    {
      field: "createdAt",
      headerName: "FECHA DE CREACION",
      flex: 0.5,
      valueGetter: (params) => params.row.createdAt.slice(0, params.row.createdAt.indexOf("T")),
    },
    {
      field: "updatedAt",
      headerName: "FECHA DE ACTUALIZACION",
      flex: 0.5,
      valueGetter: (params) => params.row.updatedAt.slice(0, params.row.updatedAt.indexOf("T")),
    },
    {
      field: "acciones",
      headerName: "ACCIONES",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <IconButton color="secondary" aria-label="Ver" onClick={() => openModal(1, params.row)} title="Ver">
            <RemoveRedEye />
          </IconButton>
          <IconButton color="secondary" aria-label="Editar" onClick={() => openModal(2, params.row)} title="Editar">
            <EditOutlined />
          </IconButton>
        </Box>
      ),
    },
  ];
  return (
    <Box m="1rem 2.5rem">
      <Header title="Detalle Equipo" subtitle="LISTA DE DETALLE DE EQUIPOS" />
      <DataTable rows={detalleEquipo || {}} columns={columns || {}} columnVisibilityModel={columnVisibilityModel || {}} setColumnVisibilityModel={setColumnVisibilityModel || {}} openModal={openModal || {}} agregar={false || {}} />
      <Dialog open={modal} onClose={closeModal}>
        <DialogTitle color="secondary">{title}</DialogTitle>
        <Form newDetalleEquipo={newDetalleEquipo || {}} setNewDetalleEquipo={setNewDetalleEquipo || {}} />
        {operation === 2 && (
          <DialogActions>
            <Button autoFocus color="error" onClick={closeModal}>
              Cancelar
            </Button>
            <Button autoFocus color="secondary" onClick={() => validar()}>
              Guardar
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default DetalleEquipos;
