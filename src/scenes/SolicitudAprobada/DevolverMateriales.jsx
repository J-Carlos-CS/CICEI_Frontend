import { useTheme } from "@emotion/react";
import { Box, Button, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { getAllMateriales, getMaterialesDevueltos } from "services/api";
import { grey } from "@mui/material/colors";
import DevolucionActions from "./DevolucionActions";
import { show_alerta } from "services/functions";

const DevolverMateriales = ({ _idSolicitud, closeModal, call }) => {
  const theme = useTheme();
  const [materiales, setMateriales] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [rowId, setRowId] = useState(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const response = await getAllMateriales(_idSolicitud);
    setMateriales(response.data.response);
  };
  const confirmarDevolucion = () => {
    try {
      closeModal(false);
      getMaterialesDevueltos(_idSolicitud)
        .then((result) => {
          if (result.data.success) {
            show_alerta("Materiales Devueltos", "success");
            call();
          } else {
            show_alerta(result.data.response, "error");
          }
        })
        .catch((err) => {
          show_alerta("Error al enviar la solicitud", "error");
        });
    } catch (err) {
      console.log(err);
    }
  };
  const columns = [
    { field: "nombre", headerName: "NOMBRE", width: 170 },
    { field: "tipo", headerName: "TIPO", width: 170 },
    { field: "codigo", headerName: "CODIGO", width: 170, editable: true },
    { field: "comentario", headerName: "Comentario", width: 250, editable: true },
    {
      field: "estado",
      headerName: "ESTADO",
      width: 200,
      type: "singleSelect",
      valueOptions: ["OK", "Reservado", "Estropeado"],
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      renderCell: (params) => <DevolucionActions {...{ params, rowId, setRowId }} />,
    },
  ];
  return (
    <>
      <DialogTitle color="secondary">Devolver Materiales</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            height: 400,
            width: "100%",
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
            columns={columns}
            rows={materiales}
            getRowId={(row) => row._id}
            rowsPerPageOptions={[5, 10, 20]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            getRowSpacing={(params) => ({
              top: params.isFirstVisible ? 0 : 5,
              bottom: params.isLastVisible ? 0 : 5,
            })}
            onCellEditCommit={(params) => setRowId(params._id)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="secondary" onClick={() => confirmarDevolucion()}>
          Actualizar
        </Button>
      </DialogActions>
    </>
  );
};

export default DevolverMateriales;
