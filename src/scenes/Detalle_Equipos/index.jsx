import { useTheme } from "@emotion/react";
import { Box, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolBar";
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
  const [detalleEquipo, setDetalleEquipo] = useState();
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
      valueGetter: (params) =>
        params.row.fechas_adquisiciones[0].fecha_adquisicion
          ? params.row.fechas_adquisiciones[0].fecha_adquisicion.slice(0, params.row.fechas_adquisiciones[0].fecha_adquisicion.indexOf("T"))
          : "",
    },
    {
      field: "createdAt",
      headerName: "FECHA DE CREACION",
      flex: 0.5,
      valueGetter: (params) => params.row.createdAt.slice(0, params.row.createdAt.indexOf("T")),
    },
    {
      field: "updatedAt",
      headerName: "FECHA DE Actualizacion",
      flex: 0.5,
      valueGetter: (params) => params.row.updatedAt.slice(0, params.row.updatedAt.indexOf("T")),
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
        />
      </Box>
    </Box>
  );
};

export default DetalleEquipos;
