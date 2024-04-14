import { Box, Chip } from "@mui/material";
import React, { useState, useEffect } from "react";
import { getManuales } from "services/api";
import Header from "components/Header";
import DataTable from "components/DataTable";

const Manuales = () => {
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [manuales, setManuales] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({ createdAt: false, updatedAt: false });

  useEffect(() => {
    getProducto();
  }, []);

  const getProducto = async () => {
    const respuesta = await getManuales();
    setManuales(respuesta.data);
  };
  const columns = [
    { field: "equipoId", headerName: "EQUIPO", flex: 0.5, valueGetter: (params) => params.row.equipo.nombre },
    { field: "nombre", headerName: "NOMBRE", flex: 0.5 },
    { field: "num_manuales", headerName: "CANTIDAD", flex: 0.5 },
    { field: "tipo", headerName: "TIPO", flex: 1 },
    { field: "observaciones", headerName: "OBSERVACIONES", flex: 1 },
    {
      field: "digital",
      headerName: "DIGITAL",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.digital ? "Si" : "No"} color={params.row.digital ? "success" : "error"} />,
    },
    { field: "link_manual", headerName: "LINK", flex: 1 },
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
      field: "estado",
      headerName: "ESTADO",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.estado ? "ACTIVO" : "DESACTIVADO"} color={params.row.estado ? "success" : "error"} />,
    },
    { field: "createdAt", headerName: "Fecha de Creacion", flex: 1 },
    { field: "updatedAt", headerName: "Fecha de Actualizacion", flex: 1 },
  ];
  return (
    <Box m="1rem 2.5rem">
      <Header title="Manuales" subtitle="Lista de Manuales" />
      <DataTable rows={manuales || {}} columns={columns || {}} columnVisibilityModel={columnVisibilityModel || {}} setColumnVisibilityModel={setColumnVisibilityModel || {}} agregar={false || {}} />
    </Box>
  );
};

export default Manuales;
