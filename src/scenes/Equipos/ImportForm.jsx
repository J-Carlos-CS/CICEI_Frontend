import { DialogContent } from "@mui/material";
import Import from "components/Import";
import React, { useState } from "react";
import { putEquipos, putReactivos } from "services/api";
import { show_alerta } from "services/functions";

const ImportForm = ({ closeModalImport }) => {
  // submit state
  const [excelData, setExcelData] = useState(null);

  const sendData = async (_data) => {
    let res = null;
    for (let i = 0; i < _data.length; i++) {
      const data = _data[i];
      const newEquipo = {
        id: 0,
        nombre: data.NOMBRE,
        cantidad: parseInt(data.CANTIDAD),
        marca: data.MARCA,
        modelo: data.MODELO,
        unidad: data.UNIDAD,
        categoriaId: parseInt(data.CATEGORIA),
        proyectoId: parseInt(data.PROYECTO),
        estado: data.ESTADO,
      };
      const respuesta = await putEquipos("post", newEquipo);
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
