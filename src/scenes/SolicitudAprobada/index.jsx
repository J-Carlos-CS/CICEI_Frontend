import { KitchenOutlined, Visibility, WaterDropOutlined, CheckCircleOutlineOutlined, AssignmentTurnedIn } from "@mui/icons-material";
import { Box, Chip, Dialog, DialogTitle, IconButton } from "@mui/material";
import DataTable from "components/DataTable";
import Header from "components/Header";
import React, { useEffect, useState } from "react";
import { getAllSolicitudAprobadas, postSolicitudEntregada } from "services/api";
import SolicitudViewTable from "scenes/SolicitudView/SolicitudViewTable";
import { selectUser } from "Auth/userReducer";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { show_alerta } from "services/functions";
import DevolverMateriales from "./DevolverMateriales";

const SolicitudAprobadasView = () => {
  const user = useSelector(selectUser);
  const [solicitudesaprobadas, setSolicitudesAprobadas] = useState([]);
  const [modalFicha, setModalFicha] = useState(false);
  const [url, setURL] = useState({});
  const [id, setID] = useState([""]);
  const [modalEquipo, setModalEquipo] = useState(false);
  const [modalReactivo, setModalReactivo] = useState(false);
  const [modalDevolucion, setModalDevolucion] = useState(false);
  const [idSolicitud, setIdSolicitud] = useState([""]);
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({ CreadoBy: false, ModificadoBy: false, createdAt: false, updatedAt: false });
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const respuesta = await getAllSolicitudAprobadas();
    setSolicitudesAprobadas(respuesta.data.response);
  };
  const openFicha = (proyect) => {
    setModalFicha(true);
    setURL({ guia: proyect.guiaKey, titulo: proyect.titulo });
  };
  const openReactivo = (proyect) => {
    setModalReactivo(true);
    setID(proyect.id);
  };
  const openEquipo = (proyect) => {
    setModalEquipo(true);
    setID(proyect.id);
  };
  const aproveSolicitud = async (proyect) => {
    Swal.fire({
      title: "¿La Entrega de Materiales esta Bien?",
      showCancelButton: true,
      confirmButtonText: "Aprobar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        postSolicitudEntregada(proyect)
          .then((result) => {
            if (result.data.success) {
              show_alerta("Solicitud Aprobada", "success");
              getProducto();
            } else {
              show_alerta("Error al enviar la solicitud", "error");
            }
          })
          .catch((err) => {
            show_alerta("Error al enviar la solicitud", "error");
          });
      }
    });
  };
  const devolverMateriales = (proyect) => {
    setIdSolicitud(proyect.id);
    setModalDevolucion(true);
  };
  const columns = [
    { field: "id", headerName: "NUMERO DE SOLICITUD", flex: 0.5 },
    { field: "solicitante", headerName: "SOLICITANTE", flex: 0.5 },
    { field: "carrera", headerName: "CARRERA", flex: 0.5 },
    { field: "materia", headerName: "MATERIA", flex: 0.5 },
    { field: "tutorNombre", headerName: "TUTOR", flex: 0.5 },
    {
      field: "aprobadoTutor",
      headerName: "APROBADO",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.aprobadoTutor ? "APROBADO" : "PENDIENTE"} color={params.row.aprobadoTutor ? "success" : "error"} />,
    },
    { field: "adminNombre", headerName: "ADMINISTRADOR", flex: 0.5 },
    {
      field: "aprobadoAdministrador",
      headerName: "APROBADO",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.aprobadoAdministrador ? "APROBADO" : "PENDIENTE"} color={params.row.aprobadoAdministrador ? "success" : "error"} />,
    },
    {
      field: "fecha",
      headerName: "FECHA RESERVA",
      flex: 0.5,
      valueGetter: (params) => params.row.fecha.slice(0, params.row.fecha.indexOf("T")),
    },
    { field: "hora", headerName: "HORA RESERVA", flex: 0.5 },
    { field: "comentario", headerName: "COMENTARIO", flex: 0.5 },
    {
      field: "fieldId",
      headerName: "GUIA",
      flex: 0.3,
      renderCell: (params) => (
        <Box>
          <IconButton color="secondary" aria-label="Ver Guia" onClick={() => openFicha(params.row)}>
            <Visibility />
          </IconButton>
        </Box>
      ),
    },
    {
      field: "guiaKey",
      headerName: "Ver Reactivos / Equipos",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <IconButton color="secondary" aria-label="Ver Reactivos" title="Ver Reactivos" onClick={() => openReactivo(params.row)}>
            <WaterDropOutlined />
          </IconButton>
          <IconButton color="secondary" aria-label="Ver Equipos" title="Ver Equipos" onClick={() => openEquipo(params.row)}>
            <KitchenOutlined />
          </IconButton>
        </Box>
      ),
    },
    user.rol === "Administrador" || user.rol === "Investigador"
      ? {
          field: "test",
          headerName: "Entregas",
          flex: 0.5,
          renderCell: (params) =>
            params.row.entregadoAdmi && params.row.entregadoInvestigador ? (
              <Chip label="Entregado" color="success" />
            ) : params.row.entregadoAdmi && !params.row.entregadoInvestigador ? (
              <Chip label="Esperando a la aprobacion" color="warning" />
            ) : (
              <Box>
                <IconButton color="secondary" aria-label="Ver Reactivos" title="Entrega Exitosa" onClick={() => aproveSolicitud(params.row)}>
                  <CheckCircleOutlineOutlined />
                </IconButton>
              </Box>
            ),
        }
      : {},
    user.rol === "Administrador"
      ? {
          field: "devolucion",
          headerName: "Devolucion",
          flex: 0.5,
          renderCell: (params) =>
            params.row.devuelto === null ? (
              params.row.entregadoAdmi && params.row.entregadoInvestigador && params.row.devuelto === null ? (
                <Box>
                  <IconButton color="secondary" aria-label="Ver Ficha" title="Devolver Material" onClick={() => devolverMateriales(params.row)}>
                    <AssignmentTurnedIn />
                  </IconButton>
                </Box>
              ) : null
            ) : (
              <Chip label={params.row.devuelto ? "DEVUELTO" : "PENDIENTE"} color={params.row.devuelto ? "success" : "error"} />
            ),
        }
      : {},
    { field: "CreadoBy", headerName: "CREADO POR", flex: 0.5 },
    {
      field: "createdAt",
      headerName: "CREADO EN",
      flex: 0.5,
      valueGetter: (params) => params.row.createdAt.slice(0, params.row.createdAt.indexOf("T")),
    },
    {
      field: "updatedAt",
      headerName: "MODIFICADO EN",
      flex: 0.5,
      valueGetter: (params) => params.row.updatedAt.slice(0, params.row.updatedAt.indexOf("T")),
    },
  ];
  return (
    <Box m="1rem 2.5rem">
      <Header title="Solicitudes Aprobadas" subtitle="Lista de Todas las Solicitudes Aprobadas" />
      <DataTable rows={solicitudesaprobadas || {}} columns={columns || {}} columnVisibilityModel={columnVisibilityModel || {}} setColumnVisibilityModel={setColumnVisibilityModel || {}} agregar={false || {}} />
      <Dialog open={modalFicha} onClose={() => setModalFicha(false)} alignItems="center" PaperProps={{ style: { maxHeight: 600, maxWidth: 1200 } }}>
        <DialogTitle color="secondary">{url.titulo}</DialogTitle>
        <iframe src={`https://drive.google.com/file/d/${url.guia}/preview`} title="Ficha Técnica" width="1200" height="1200" allow="autoplay"></iframe>
      </Dialog>
      <Dialog open={modalEquipo} onClose={() => setModalEquipo(false)} alignItems="center">
        <SolicitudViewTable id={id} val="Equipos" />
      </Dialog>
      <Dialog open={modalReactivo} onClose={() => setModalReactivo(false)} alignItems="center">
        <SolicitudViewTable id={id} val="Reactivos" />
      </Dialog>
      <Dialog open={modalDevolucion} onClose={() => setModalDevolucion(false)} alignItems="center" PaperProps={{ style: { maxHeight: 600, maxWidth: 1200 } }}>
        <DevolverMateriales _idSolicitud={idSolicitud || {}} closeModal={setModalDevolucion || {}} call={getProducto} />
      </Dialog>
    </Box>
  );
};

export default SolicitudAprobadasView;
