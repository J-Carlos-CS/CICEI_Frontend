import { Box, Chip } from "@mui/material";
import Header from "components/Header";
import React, { useEffect, useState } from "react";
import { getAllmaterialesRotos } from "services/api";
import DataTable from "components/DataTable";

const PendientesRotos = () => {
  const equipoId = 2;
  const [detalleEquipo, setDetalleEquipo] = useState();
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const respuesta = await getAllmaterialesRotos();
    setDetalleEquipo(respuesta.data.response);
  };
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});
  const columns = [
    { field: "idSolicitud", headerName: "Numero de Solicitud", flex: 0.5 },
    { field: "solicitante", headerName: "Nombre", flex: 0.5 },
    { field: "material", headerName: "Material", flex: 0.5 },
    { field: "codigo", headerName: "Codigo", flex: 0.5 },
    { field: "tipo", headerName: "Tipo", flex: 0.5 },
    { field: "comentario", headerName: "Comentario", flex: 0.5 },
    {
      field: "estado",
      headerName: "Estado",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.estado} color={params.row.estado === "Reservado" ? "warning" : "error"} />,
    },
    {
      field: "fecha",
      headerName: "Fecha de Uso",
      flex: 0.5,
      valueGetter: (params) => (params.row.fecha ? params.row.fecha.slice(0, params.row.fecha.indexOf("T")) : ""),
    },
    { field: "hora", headerName: "Hora", flex: 0.5 },
  ];
  return (
    <Box m="1rem 2.5rem">
      <Header title="Detalle Equipo" subtitle="LISTA DE DETALLE DE EQUIPOS" />
      <DataTable rows={detalleEquipo || {}} columns={columns || {}} columnVisibilityModel={columnVisibilityModel || {}} setColumnVisibilityModel={setColumnVisibilityModel || {}} agregar={false || {}} />
    </Box>
  );
};

export default PendientesRotos;
