import { DialogContent, DialogTitle } from "@mui/material";
import DataTable from "components/DataTable";
import React, { useEffect, useState } from "react";
import { getEquipoSolicitudView, getReactivoSolicitudView } from "services/api";

const SolicitudViewTable = ({ id, val }) => {
  const [data, setData] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    if (val === "Equipos") {
      const response = await getEquipoSolicitudView(id);
      setData(response.data.response);
    }
    if (val === "Reactivos") {
      const response = await getReactivoSolicitudView(id);
      setData(response.data.response);
    }
  };
  const columns = [
    { field: "nombre", headerName: "NOMBRE", flex: 0.5 },
    { field: "cantidad", headerName: "CANTIDAD", flex: 0.5 },
    { field: "unidades", headerName: "UNIDADES", flex: 0.5 },
  ];

  return (
    <div>
      <DialogTitle color="secondary">Lista de {val}</DialogTitle>
      <DialogContent>
        <DataTable rows={data || {}} columns={columns || {}} columnVisibilityModel={columnVisibilityModel || {}} setColumnVisibilityModel={setColumnVisibilityModel || {}} agregar={false || {}} />
      </DialogContent>
    </div>
  );
};

export default SolicitudViewTable;
