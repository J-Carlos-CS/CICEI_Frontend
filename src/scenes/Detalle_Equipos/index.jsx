import React from "react";
import { useLocation } from "react-router-dom";

const DetalleEquipos = () => {
  const location = useLocation();
  const data = location.state.data;
  return (
    <div>
      <h1>{data}</h1>
    </div>
  );
};

export default DetalleEquipos;
