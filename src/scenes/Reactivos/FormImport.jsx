import { Box, DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import { show_alerta } from "services/functions";
import { postFichaTecnica } from "services/api";

const FormImport = ({ id, closeModalForm }) => {
  const [file, setFile] = useState("");

  const submitText = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);
    console.log(formData);
    postFichaTecnica(formData)
      .then((res) => {
        if (res.data?.success) {
          show_alerta("Ficha Tecnica Agregada", "success");
        } else {
          show_alerta("Error al agregar la ficha tecnica", "error");
        }
      })
      .catch((err) => {
        show_alerta("Error al agregar la ficha tecnica", "error");
      });
    closeModalForm();
  };
  return (
    <div>
      <DialogTitle color="secondary">Agregar Ficha Tecnica</DialogTitle>
      <DialogContent>
        <div className="wrapper">
          <form className="formStyle" onSubmit={submitText}>
            <input type="file" className="form-control" accept="application/pdf" required onChange={(e) => setFile(e.target.files[0])} />
            <br />
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </form>
        </div>
      </DialogContent>
    </div>
  );
};

export default FormImport;
