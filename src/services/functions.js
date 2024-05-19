import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function show_alerta(mensaje, icono, _time = 1500, foco = "") {
  onfocus(foco);
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    timer: _time,
    title: mensaje,
    icon: icono,
    showConfirmButton: false,
  });
}

function onfocus(foco) {
  if (foco !== "") {
    document.getElementById(foco).focus();
  }
}
