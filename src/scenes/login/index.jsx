import React, { useState } from "react";
import { Box, useTheme, IconButton,Button,Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem   } from "@mui/material";

import {useGetReactivesQuery,
  useCreateReactiveMutation,
  useUpdateReactiveMutation  } from "state/api";

import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DataGridCustomToolBar from "components/DataGridCustomToolBar"

const Users = () => {
    
    const theme = useTheme();
   
    return (
      <Box m="1.5rem 2.5rem">
   
        <Header title="LOGIN" subtitle="Lista de los Reactivos" />
        <Box display="flex" justifyContent="flex-end" mb="1rem">
          <Button
          variant="contained"
          color="secondary"
          style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} // Ajustar el tamaño del texto y el espacio interno
          onClick={openAddReactive}
          >
            Iniciar Sesión
          </Button>
        </Box>
       
      </Box>
    
  );
};

export default Users