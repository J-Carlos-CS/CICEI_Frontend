import React from "react";
import { Box, useTheme, IconButton } from "@mui/material";
import { useGetCategorysQuery, useGetReactivesQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import {EditOutlined , 
  DeleteForeverOutlined } from "@mui/icons-material";

const Categorys
  = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetCategorysQuery();
    
  
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "categoria",
      headerName: "Categoria",
      flex: 0.5,
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
      <Header title="CATEGORIAS" subtitle="Lista de las Categorias" />
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

export default Categorys
