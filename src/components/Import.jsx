import React, { useState } from "react";
import * as XLSX from "xlsx";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import { show_alerta } from "services/functions";

const Import = ({ excelData, setExcelData, sendData }) => {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // onchange event
  const handleFile = (e) => {
    let fileTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Por favor seleccione un archivo de Excel válido");
        setExcelFile(null);
      }
    } else {
      show_alerta("Por favor seleccione un archivo", "warning");
    }
  };

  // submit event
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      await setExcelData(data);
      sendData(data);
    }
  };
  return (
    <div className="wrapper">
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
        <input type="file" className="form-control" required onChange={handleFile} />
        <br />
        <button type="submit" className="btn btn-success btn-md">
          Cargar
        </button>
        {typeError && (
          <div className="alert alert-danger" role="alert">
            {typeError}
          </div>
        )}
      </form>
      {/* <iframe src="https://drive.google.com/file/d/1EwMWt2U5jSxXoxTGwy6IZ5yms2PM4GG_/preview" width="640" height="480" allow="autoplay"></iframe> */}
    </div>
  );
};

export default Import;
