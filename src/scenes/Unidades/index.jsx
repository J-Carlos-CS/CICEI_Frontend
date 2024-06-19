import React, { useEffect, useState } from "react";
import { show_alerta } from "../../services/functions";
import Header from "components/Header";
import { Box, Button, Chip, Dialog, IconButton, DialogTitle, DialogContent, TextField, FormControlLabel, Switch, DialogActions, MenuItem } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import { getUnidades, putUnidades } from "services/api";
import DataTable from "components/DataTable";

const Unidades = (roles) => {
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [unidades, setUnidades] = useState([]);
  const [operation, setOperation] = useState("");
  const [newUnidades, setNewUnidades] = useState({
    id: 0,
    unidades: "",
    tipo: "",
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
    setNewUnidades({ ...newUnidades, id: 0, estado: false, unidades: "", tipo: "" });
  };
  const openModal = (op, proyec) => {
    clearModal();
    setOperation(op);
    if (op === 1) {
      setTitle("Agregar Unidades");
      setModal(true);
    } else if (op === 2) {
      setTitle("Editar Unidades");
      setNewUnidades(proyec);
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
      show_alerta("Escribe el nombre de la unidad", "warning");
    }
    if (newUnidades.tipo.trim() === "") {
      closeModal();
      show_alerta("Selecciona el tipo de unidad", "warning");
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
        show_alerta(newUnidades.unidades + ", fue creado con exito! ", "success");
      } else {
        show_alerta(newUnidades.unidades + ", fue actualizado con exito! ", "success");
      }
    }
    getProducto();
  };
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "unidades", headerName: "UNIDADES", flex: 0.5 },
    { field: "tipo", headerName: "TIPO", flex: 0.5 },
    {
      field: "estado",
      headerName: "ESTADO",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.estado ? "ACTIVO" : "DESACTIVADO"} color={params.row.estado ? "success" : "error"} />,
    },
    { field: "CreadoBy", headerName: "CREADO POR", flex: 0.5 },
    { field: "ModificadoBy", headerName: "MODIFICADO POR", flex: 0.5 },

    {
      field: "createdAt",
      headerName: "CREADO EN",
      flex: 0.5,
      valueGetter: (params) => params.row.createdAt.slice(0, params.row.createdAt.indexOf("T")),
    },
    {
      field: "updatedAt",
      headerName: "MODIFICADO EN",
      flex: 0.5,
      valueGetter: (params) => params.row.updatedAt.slice(0, params.row.updatedAt.indexOf("T")),
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
        </Box>
      ),
    },
  ];
  return (
    <Box m="1rem 2.5rem">
      <Header title="UNIDADES" subtitle="Lista de Unidades" />
      <DataTable rows={unidades || {}} columns={columns || {}} openModal={openModal || {}} />
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
              <TextField id="unidadesinput" label="Nombre Unidades" defaultValue={newUnidades.unidades} color="secondary" onChange={(e) => setNewUnidades({ ...newUnidades, unidades: e.target.value })} />
              <TextField
                id="selectClasificacion"
                select
                label="Clasificacion"
                color="secondary"
                defaultValue={newUnidades.tipo ? newUnidades.tipo : null}
                onChange={(event) => {
                  setNewUnidades({
                    ...newUnidades,
                    tipo: event.target.value,
                  });
                }}>
                <MenuItem value="Reactivo">Reactivo</MenuItem>
                <MenuItem value="Equipo">Equipo</MenuItem>
              </TextField>
            </div>
            {operation === 2 ? (
              <div class="terms">
                &nbsp; &nbsp;
                <FormControlLabel label="Estado" control={<Switch color="secondary" checked={newUnidades.estado} onChange={(e) => setNewUnidades({ ...newUnidades, estado: e.target.checked })} name="estado" />} />
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
