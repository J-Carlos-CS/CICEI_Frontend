import React, { useEffect, useState } from "react";
import { show_alerta } from "../../services/functions";
import Header from "components/Header";
import { Box, Button, Chip, Dialog, IconButton, DialogTitle, DialogContent, TextField, FormControlLabel, Switch, DialogActions } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import { getCategoria, putCategoria } from "services/api";
import DataTable from "components/DataTable";

const Categoria = () => {
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [categoria, setCategoria] = useState([]);
  const [operation, setOperation] = useState("");
  const [newCategoria, setNewCategoria] = useState({
    id: 0,
    categoria: "",
    estado: false,
  });
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const respuesta = await getCategoria();
    setCategoria(respuesta.data);
  };
  const clearModal = async () => {
    setNewCategoria({ ...newCategoria, estado: false, categoria: "", id: 0, CreadoBy: "" });
  };
  const openModal = (op, proyec) => {
    clearModal();
    setOperation(op);
    setModal(true);
    if (op === 1) {
      setTitle("Agregar Categoria");
    } else if (op === 2) {
      setTitle("Editar Categoria");
      setNewCategoria({ estado: proyec.estado, categoria: proyec.categoria, id: proyec.id });
    }
  };
  const closeModal = () => {
    setModal(false);
  };
  const validar = () => {
    var method;
    if (newCategoria.categoria.trim() === "") {
      closeModal();
      show_alerta("Escribe el nombre de la categoria", "warning");
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
    const respuesta = await putCategoria(metodo, newCategoria);
    if (respuesta.error) {
      show_alerta("Error en la solicitud", "error");
    } else {
      if (operation === 1) {
        show_alerta("Categoria: " + newCategoria.categoria + ", fue creado con exito! ", "success");
      } else {
        show_alerta("Categoria: " + newCategoria.categoria + ", fue actualizado con exito! ", "success");
      }
    }
    getProducto();
  };
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "categoria", headerName: "CATEGORIA", flex: 0.5 },
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
      <Header title="CATEGORIAS" subtitle="Lista de Categorias" />
      <DataTable rows={categoria || {}} columns={columns || {}} openModal={openModal || {}} />
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
              <TextField id="categoriainput" label="Nombre Categoria" defaultValue={newCategoria.categoria} color="secondary" onChange={(e) => setNewCategoria({ ...newCategoria, categoria: e.target.value })} />
            </div>
            {operation === 2 ? (
              <div class="terms">
                &nbsp; &nbsp;
                <FormControlLabel label="Estado" control={<Switch color="secondary" checked={newCategoria.estado} onChange={(e) => setNewCategoria({ ...newCategoria, estado: e.target.checked })} name="estado" />} />
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

export default Categoria;
