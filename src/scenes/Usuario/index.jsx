import React, { useEffect, useState } from "react";
import { Box, Button, Chip, Dialog, DialogActions, DialogTitle } from "@mui/material";
import DataTable from "components/DataTable";
import Header from "components/Header";
import { getAllUsuarios } from "services/api";
import UsuarioForm from "./UsuarioForm";

const Usuario = () => {
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [usuario, setUsuario] = useState([]);
  const [newUsuario, setNewUsuario] = useState({
    email: "",
    firstName: "",
    lastName: "",
    rol: "",
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
    createdAt: false,
    updatedAt: false,
  });
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const respuesta = await getAllUsuarios();
    setUsuario(respuesta.data);
  };
  const validar = () => {
    var method;
  };
  const openModal = async (proyec) => {
    setNewUsuario(proyec);
    setModal(true);
    setTitle("Agregar Usuario");
  };
  const closeModal = async () => {
    setModal(false);
  };
  const columns = [
    { field: "firstName", headerName: "NOMBRE", flex: 0.5 },
    { field: "lastName", headerName: "APELLIDO", flex: 0.5 },
    { field: "email", headerName: "CORREO", flex: 0.8 },
    { field: "rol", headerName: "ROL", flex: 0.5 },
    { field: "birthDate", headerName: "FECHA DE NACIMIENTO", flex: 0.5, valueGetter: (params) => (params.row.birthDate ? params.row.birthDate.slice(0, params.row.birthDate.indexOf("T")) : null) },
    { field: "career", headerName: "CARRERA", flex: 0.5 },
    { field: "cellPhone", headerName: "CELULAR", flex: 0.5 },
    {
      field: "status",
      headerName: "ESTADO",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.status ? "ACTIVO" : "DESACTIVADO"} color={params.row.status ? "success" : "error"} />,
    },
    { field: "createdAt", headerName: "CREADO EN", flex: 0.5, valueGetter: (params) => params.row.createdAt.slice(0, params.row.createdAt.indexOf("T")) },
    { field: "updatedAt", headerName: "MODIFICADO EN", flex: 0.5, valueGetter: (params) => params.row.updatedAt.slice(0, params.row.updatedAt.indexOf("T")) },
  ];
  return (
    <Box m="1rem 2.5rem">
      <Header title="USUARIOS" subtitle="LISTADO DE USUARIOS" />
      <DataTable rows={usuario || {}} columns={columns || {}} columnVisibilityModel={columnVisibilityModel || {}} setColumnVisibilityModel={setColumnVisibilityModel || {}} openModal={openModal || {}} />
      <Dialog open={modal} onClose={closeModal} PaperProps={{ style: { maxHeight: 600, maxWidth: 1200 } }}>
        <UsuarioForm getProducto={getProducto || {}} closeModal={closeModal} title={title || {}} />
      </Dialog>
    </Box>
  );
};

export default Usuario;
