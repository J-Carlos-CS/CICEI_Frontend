import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { postSolicitudEntragadaInvestigador } from "services/api";
import { show_alerta } from "services/functions";
import Swal from "sweetalert2";

const SolicitudEntregada = () => {
  const [solicitud] = useSearchParams();
  const navigate = useNavigate();
  const [_solicitud] = useState({
    solicitud: solicitud.get("solicitud"),
  });
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const result = await postSolicitudEntragadaInvestigador(_solicitud);
    if (result.data.success) {
      Swal.fire({
        icon: "success",
        title: "La Aprobacion se ha Realizado con Exito!!!",
        showConfirmButton: false,
        timer: 5000,
      });
      navigate("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Hubo un Error vuelve a Intentarlo",
        showConfirmButton: false,
        timer: 5000,
      });
      navigate("/login");
    }
  };
  return <></>;
};

export default SolicitudEntregada;
