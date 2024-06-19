import { DialogContent } from "@mui/material";
import Import from "components/Import";
import React, { useState } from "react";
import { putReactivos } from "services/api";
import { show_alerta } from "services/functions";

const ImportForm = ({ closeModalImport }) => {
  // submit state
  const [excelData, setExcelData] = useState(null);

  const sendData = async (_data) => {
    let res = null;
    for (let i = 0; i < _data.length; i++) {
      const data = _data[i];
      const newReactivos = {
        id: 0,
        nombre: data.NOMBRE,
        cantidad: parseFloat(data.CANTIDAD),
        unidades: data.UNIDADES,
        categoriaId: parseInt(data.CATEGORIA),
        proyectoId: parseInt(data.PROYECTO),
        marca: data.MARCA,
        codigo: data.CODIGO,
        observaciones: data.OBSERVACIONES,
        clasificacion: data.CLASIFICACION,
        estado: data.ESTADO,
      };
      const respuesta = await putReactivos("post", newReactivos);
      if (respuesta.error) {
        throw new Error("Error en la solicitud");
      } else {
        res = respuesta;
      }
    }
    if (res) {
      show_alerta("<b>Importacion</b> realizada con exito!!", "success");
      closeModalImport();
    }
  };
  return (
    <DialogContent>
      <Import excelData={excelData} setExcelData={setExcelData || {}} sendData={sendData || {}} />
    </DialogContent>
  );
};

export default ImportForm;
