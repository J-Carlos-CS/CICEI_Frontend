import { useTheme } from "@emotion/react";
import { Box, Chip, Dialog, IconButton, DialogTitle, DialogContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolBar";
import { DeleteForeverOutlined, EditOutlined, Send, RemoveRedEye, Description } from "@mui/icons-material";
import Header from "components/Header";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDetalleEquipo } from "services/api";

const DetalleEquipos = () => {
  const location = useLocation();
  const equipoId = location.state.id;
  const theme = useTheme();
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
      fecha_preventivo: proyec.fechas_adquisiciones.fecha_preventivo,
      estado: proyec.estado,
      fecha_Correccion: proyec.fechas_adquisiciones.fecha_Correccion,
      fecha_adquisicion: proyec.fechas_adquisiciones.fecha_adquisicion,
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
          <IconButton color="secondary" aria-label="Manual" onClick={() => manual(params.row.manualeId)}>
            <Description />
          </IconButton>
          <IconButton color="secondary" aria-label="Ver" onClick={() => openModal(1, params.row)}>
            <RemoveRedEye />
          </IconButton>
          <IconButton color="secondary" aria-label="Editar" onClick={() => openModal(2, params.row)}>
            <EditOutlined />
          </IconButton>
        </Box>
      ),
    },
  ];
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Detalle Equipo" subtitle="LISTA DE DETALLE DE EQUIPOS" />
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
        <DataGrid
          getRowId={(row) => row.id}
          rows={detalleEquipo || []}
          columns={columns}
          components={{ Toolbar: DataGridCustomToolbar }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          pageSizeOptions={[25, 50, 100]}
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
            autoComplete="off"></Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DetalleEquipos;
