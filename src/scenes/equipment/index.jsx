import React from "react";
import { Box, useTheme, IconButton } from "@mui/material";
import { useGetEquipmentQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import {EditOutlined , 
  DeleteForeverOutlined } from "@mui/icons-material";

const Equipment = () => {
    const theme = useTheme();
    const { data, isLoading } = useGetEquipmentQuery();
  
    
    const columns = [
      {
        field: "id",
        headerName: "ID",
        flex: 0.5,
      },
      {
        field: "nombre",
        headerName: "Nombre",
        flex: 0.5,
      },
      {
        field: "cantidad",
        headerName: "Cantidad",
        flex: 0.5,
      },
      {
        field: "unidad",
        headerName: "Unidad",
        flex: 0.5,
      },
      {
        field: "categoria",
        headerName: "Categoría",
        flex: 0.5,
        valueGetter: (params) => params.row.categoria.categoria,
     
      },
      {
        field: "proyectoId",
        headerName: "Proyecto ",
        flex: 0.5,
        valueGetter: (params) => params.row.proyecto.proyecto,
      },
      {
        field: "acciones",
        headerName: "Acciones",
        flex: 0.5,
        renderCell: (params) => (
        <Box>
            <IconButton
              color="secondary"
              onClick={console.log("Editar")}
              aria-label="Editar"
            >
              <EditOutlined />
            </IconButton>
  
            <IconButton
              color="secondary"
              onClick={console.log("Eliminar")}
              aria-label="Eliminar"
            >
              <DeleteForeverOutlined/>
            </IconButton>
          </Box>
        ),
      },
    ];
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="EQUIPO" subtitle="Lista de las equipos" />
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
          }}
        >
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row.id}
            rows={data || []}
            columns={columns}
          />
        </Box>
      </Box>
    );
  };
  

export default Equipment