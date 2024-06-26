import { DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import { postGuia } from "services/api";
import { show_alerta } from "services/functions";

const AddFile = ({ id, user, getProducto, setModal }) => {
  const [file, setFile] = useState("");
  const submitText = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);
    formData.append("user", user);
    postGuia(formData)
      .then((res) => {
        if (res.data?.success) {
          show_alerta("Ficha Tecnica Agregada", "success");
        } else {
          show_alerta("Error al agregar la ficha tecnica", "error");
        }
        getProducto();
      })
      .catch((err) => {
        show_alerta("Error al agregar la ficha tecnica", "error");
      });
    setModal(false);
  };
  return (
    <>
      <DialogTitle color="secondary">Agregar Guia de Laboratorio</DialogTitle>
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
      </DialogContent>{" "}
    </>
  );
};

export default AddFile;
