import React from "react";
import { Box, useTheme, Button, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolBar";
import { Send, Publish } from "@mui/icons-material";

const DataTable = ({ rows, columns, columnVisibilityModel, setColumnVisibilityModel, openModal, agregar, openModalImport, agregarImport }) => {
  const theme = useTheme();
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [],
  });
  return (
    <div>
      <Box display="flex" justifyContent="flex-end" mb="1.5rem">
        {agregarImport && (
          <IconButton aria-label="Importar" color="secondary" size="large" style={{ fontSize: "2rem", padding: "0.5rem 1rem" }} onClick={() => openModalImport()}>
            <Publish />
          </IconButton>
        )}
        {!agregar && (
          <Button variant="contained" color="secondary" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} endIcon={<Send />} onClick={() => openModal(1)}>
            Agregar
          </Button>
        )}
      </Box>
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
          rows={rows || []}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          filterModel={filterModel}
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          pageSizeOptions={[25, 50, 100]}
        />
      </Box>
    </div>
  );
};

export default DataTable;
