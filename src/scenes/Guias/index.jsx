import { Box, Chip, Dialog, IconButton } from "@mui/material";
import { selectUser } from "Auth/userReducer";
import DataTable from "components/DataTable";
import Header from "components/Header";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getGuias } from "services/api";
import { DeleteForeverOutlined, EditOutlined, AddCircleOutline, Visibility } from "@mui/icons-material";

import AddFile from "./AddFile";

const Guias = () => {
  const user = useSelector(selectUser);
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [guias, setGuias] = useState([]);
  const [modalGuia, setModalGuia] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});
  const [URL, setURL] = useState("");
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const respuesta = await getGuias(user.id);
    setGuias(respuesta.data.response);
  };
  const openModal = (op, proyec) => {
    setModal(true);
  };
  const openFicha = (proyect) => {
    setModalGuia(true);
    setURL(proyect.file);
  };
  const columns = [
    { field: "titulo", headerName: "TITULO", flex: 0.5 },
    {
      field: "file",
      headerName: "Guia",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <IconButton color="secondary" aria-label="Ver Guia" onClick={() => openFicha(params.row)}>
            <Visibility />
          </IconButton>
        </Box>
      ),
    },
    {
      field: "estado",
      headerName: "ESTADO",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.estado ? "ACTIVO" : "DESACTIVADO"} color={params.row.estado ? "success" : "error"} />,
    },
    { field: "CreadoBy", headerName: "CREADO POR", flex: 0.5 },
    {
      field: "createdAt",
      headerName: "CREADO EN",
      flex: 0.5,
      valueGetter: (params) => params.row.createdAt.slice(0, params.row.createdAt.indexOf("T")),
    },
  ];
  return (
    <Box m="1rem 2.5rem">
      <Header title="Guias" subtitle="LISTADOS DE LAS GUIAS" />
      <DataTable rows={guias || {}} columns={columns || {}} columnVisibilityModel={columnVisibilityModel || {}} setColumnVisibilityModel={setColumnVisibilityModel || {}} openModal={openModal || {}} />
      <Dialog open={modal} onClose={() => setModal(false)}>
        <AddFile id={user.id} user={user.firstName + " " + user.lastName} getProducto={getProducto} setModal={setModal} />
      </Dialog>
      <Dialog open={modalGuia} onClose={() => setModalGuia(false)} alignItems="center" PaperProps={{ style: { maxHeight: 800, maxWidth: 1200 } }}>
        <iframe src={`https://drive.google.com/file/d/${URL}/preview`} title="Ficha Técnica" width="1200" height="1200" allow="autoplay"></iframe>
      </Dialog>
    </Box>
  );
};

export default Guias;
