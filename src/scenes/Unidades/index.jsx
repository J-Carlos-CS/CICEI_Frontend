import React, { useEffect, useState } from "react";
import { show_alerta } from "../../services/functions";
import Header from "components/Header";
import { Box, Button, Chip, Dialog, IconButton, useTheme, DialogTitle, DialogContent, TextField, FormControlLabel, Switch, DialogActions } from "@mui/material";
import { EditOutlined, Send } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { getUnidades, putUnidades } from "services/api";

const Unidades = () => {
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [unidades, setUnidades] = useState([]);
  const [operation, setOperation] = useState("");
  const [newUnidades, setNewUnidades] = useState({
    id: 0,
    unidades: "",
    estado: false,
  });

  useEffect(() => {
    getProducto();
  }, []);

  const getProducto = async () => {
    const respuesta = await getUnidades();
    setUnidades(respuesta.data);
  };
  const clearModal = async () => {
    setNewUnidades({ ...newUnidades, estado: false, unidades: "" });
  };
  const openModal = (op, proyec) => {
    clearModal();
    setOperation(op);
    if (op === 1) {
      setTitle("Agregar Unidades");
      setModal(true);
    } else if (op === 2) {
      setTitle("Editar Unidades");
      setNewUnidades({ estado: proyec.estado, unidades: proyec.unidades, id: proyec.id });
      setModal(true);
    }
  };

  const closeModal = () => {
    setModal(false);
  };

  const validar = () => {
    var method;
    if (newUnidades.unidades.trim() === "") {
      closeModal();
      show_alerta("Escribe el nombre de la unidades", "warning");
    } else {
      closeModal();
      if (operation === 1) {
        method = "POST";
      } else {
        method = "PUT";
      }
      sendData(method);
    }
  };
  const sendData = async (metodo) => {
    const respuesta = await putUnidades(metodo, newUnidades);

    if (respuesta.error) {
      show_alerta("Error en la solicitud", "error");
    } else {
      if (operation === 1) {
        show_alerta("Unidades: " + newUnidades.unidades + ", fue creado con exito! ", "success");
      } else {
        show_alerta("Unidades: " + newUnidades.unidades + ", fue actualizado con exito! ", "success");
      }
    }
    getProducto();
  };
  const columns = [
    { field: "unidades", headerName: "UNIDADES", flex: 0.5 },
    {
      field: "estado",
      headerName: "ESTADO",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.estado ? "ACTIVO" : "DESACTIVADO"} color={params.row.estado ? "success" : "error"} />,
    },
    {
      field: "acciones",
      headerName: "ACCIONES",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <IconButton color="secondary" aria-label="Editar" onClick={() => openModal(2, params.row)}>
            <EditOutlined />
          </IconButton>
          {/*<IconButton color="secondary" aria-label="Eliminar">
            <DeleteForeverOutlined />
          </IconButton>*/}
        </Box>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="UNIDADES" subtitle="Lista de Unidades" />
      <Box display="flex" justifyContent="flex-end" mb="1.5rem">
        <Button variant="contained" color="secondary" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} endIcon={<Send />} onClick={() => openModal(1)}>
          Agregar Unidades
        </Button>
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
        {" "}
        <DataGrid getRowId={(row) => row.id} rows={unidades || []} columns={columns} />
      </Box>
      <Dialog open={modal} onClose={closeModal}>
        <DialogTitle color="secondary">{title}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off">
            <div>
              {" "}
              <TextField
                id="unidadesinput"
                label="Nombre Unidades"
                defaultValue={newUnidades.unidades}
                color="secondary"
                onChange={(e) => setNewUnidades({ ...newUnidades, unidades: e.target.value })}
              />
            </div>
            {operation === 2 ? (
              <div class="terms">
                &nbsp; &nbsp;
                <FormControlLabel
                  label="Categoia Activa"
                  control={
                    <Switch
                      color="secondary"
                      checked={newUnidades.estado}
                      onChange={(e) => setNewUnidades({ ...newUnidades, estado: e.target.checked })}
                      name="estado"
                    />
                  }
                />
              </div>
            ) : null}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="error" onClick={closeModal}>
            Cancelar
          </Button>
          <Button autoFocus color="secondary" onClick={() => validar()}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Unidades;
