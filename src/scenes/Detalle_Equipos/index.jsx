import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
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
  const columns = [
    { field: "num_ucb", headerName: "CODIGO", flex: 0.5 },
    { field: "equipoId", headerName: "Equipo", flex: 0.5, valueGetter: (params) => params.row.equipo.nombre },
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
        <DataGrid getRowId={(row) => row.id} rows={detalleEquipo || []} columns={columns} disableRowSelectionOnClick components={{ Toolbar: DataGridCustomToolbar }} />
      </Box>
    </Box>
  );
};

export default DetalleEquipos;
