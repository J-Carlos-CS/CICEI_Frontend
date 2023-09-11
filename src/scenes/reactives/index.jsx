import React from "react";
import { Box, useTheme, IconButton } from "@mui/material";
import { useGetCategorysQuery, useGetReactivesQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import {EditOutlined , 
  DeleteForeverOutlined } from "@mui/icons-material";
const Reactives = () => {
    
    const theme = useTheme();
    const { data, isLoading } = useGetReactivesQuery();

   

const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.2,
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
      field: "unidades",
      headerName: "Unidades",
      flex: 0.5,
    },
    {
      field: "marca",
      headerName: "Marca",
      flex: 0.5,
    },
    {
      field: "clasificacion",
      headerName: "Clasificación",
      flex: 0.5,
    },
    {
      field: "fecha_vencimiento",
      headerName: "Fecha de Vencimiento",
      flex: 0.5,
    },
    {
      field: "categoria.estado",
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
              
              aria-label="Editar"
            >
              <EditOutlined />
            </IconButton>
  
            <IconButton
              color="secondary"
       
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
        <Header title="REACTIVOS" subtitle="Lista de los Reactivos" />
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
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    );
  };
export default Reactives