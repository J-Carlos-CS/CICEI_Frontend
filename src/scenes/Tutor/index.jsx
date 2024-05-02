import { Box, Chip, Dialog } from "@mui/material";
import { selectUser } from "Auth/userReducer";
import DataTable from "components/DataTable";
import Header from "components/Header";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getInvesigadores } from "services/api";
import Form from "./Form";

const Tutor = () => {
  const user = useSelector(selectUser);
  const [modal, setModal] = useState(false);
  const [investigadores, setInvestigadores] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});
  useEffect(() => {
    getProducto();
  }, []);
  function openModal() {
    setModal(true);
  }
  const getProducto = async () => {
    const respuesta = await getInvesigadores(user.id);
    setInvestigadores(respuesta.data.response);
  };
  const columns = [
    { field: "firstName", headerName: "NOMBRE", flex: 0.5 },
    { field: "lastName", headerName: "APELLIDO", flex: 0.5 },
    { field: "email", headerName: "CORREO", flex: 0.8 },
    { field: "career", headerName: "CARRERA", flex: 0.5 },
    { field: "cellPhone", headerName: "CELULAR", flex: 0.5 },
    {
      field: "status",
      headerName: "ESTADO",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.status ? "ACTIVO" : "DESACTIVADO"} color={params.row.status ? "success" : "error"} />,
    },
  ];
  return (
    <Box m="1rem 2.5rem">
      <Header title="Investigadores" subtitle="Lista de Investigadores a cargo del Tutor" />
      <DataTable rows={investigadores || {}} columns={columns || {}} columnVisibilityModel={columnVisibilityModel || {}} setColumnVisibilityModel={setColumnVisibilityModel || {}} openModal={openModal || {}} />
      <Dialog open={modal} onClose={() => setModal(false)}>
        <Form closeModal={setModal} tutorId={user.id} getProductoTable={getProducto || {}} />
      </Dialog>
    </Box>
  );
};

export default Tutor;
