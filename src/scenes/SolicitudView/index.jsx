import { CancelOutlined, CheckCircleOutlineOutlined, KitchenOutlined, Visibility, WaterDropOutlined } from "@mui/icons-material";
import { Box, Chip, Dialog, DialogTitle, IconButton } from "@mui/material";
import DataTable from "components/DataTable";
import Header from "components/Header";
import React, { useEffect, useState } from "react";
import { getSolicitud, postSolicitudAprobacion } from "services/api";
import Equipos from "./../Equipos/index";
import SolicitudViewTable from "./SolicitudViewTable";
import Swal from "sweetalert2";
import { show_alerta } from "services/functions";
import { selectUser } from "Auth/userReducer";
import { useSelector } from "react-redux";

const SolicitudView = () => {
  const user = useSelector(selectUser);
  const [solicitudes, setSolicitudes] = useState([]);
  const [modalFicha, setModalFicha] = useState(false);
  const [url, setURL] = useState({});
  const [id, setID] = useState([""]);
  const [modalEquipo, setModalEquipo] = useState(false);
  const [modalReactivo, setModalReactivo] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({ CreadoBy: false, ModificadoBy: false, createdAt: false, updatedAt: false });
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const respuesta = await getSolicitud();
    setSolicitudes(respuesta.data.response);
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
      title: "¿Quieres Aprobar la Solicitud?",
      showCancelButton: true,
      confirmButtonText: "Aprobar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        postSolicitudAprobacion(proyect)
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
  const CancelSolicitud = async (proyect) => {
    const { value: ipAddress } = await Swal.fire({
      title: "¿Quiere Cancelar la Solicitud?",
      input: "text",
      inputLabel: "Escriba un comentario",
      inputValidator: (value) => {
        if (!value) {
          return "Por favor, escriba un comentario!";
        }
      },
    });
    if (ipAddress) {
      Swal.fire(`Your IP address is ${ipAddress}`);
    }
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
      flex: 0.5,
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
    user.rol === "Administrador" || user.rol === "Tutor"
      ? {
          field: "test",
          headerName: "Acciones",
          flex: 0.5,
          renderCell: (params) => (
            <Box>
              <IconButton color="secondary" aria-label="Ver Reactivos" title="Aprobar Solicitud" onClick={() => aproveSolicitud(params.row)}>
                <CheckCircleOutlineOutlined />
              </IconButton>
              <IconButton color="secondary" aria-label="Ver Equipos" title="Rechazer Solicitud" onClick={() => CancelSolicitud(params.row)}>
                <CancelOutlined />
              </IconButton>
            </Box>
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
    { field: "ModificadoBy", headerName: "MODIFICADO POR", flex: 0.5 },
    {
      field: "updatedAt",
      headerName: "MODIFICADO EN",
      flex: 0.5,
      valueGetter: (params) => params.row.updatedAt.slice(0, params.row.updatedAt.indexOf("T")),
    },
  ];
  return (
    <Box m="1rem 2.5rem">
      <Header title="Solicitudes Pendientes" subtitle="Lista de Todas las Solicitudes Pendientes" />
      <DataTable rows={solicitudes || {}} columns={columns || {}} columnVisibilityModel={columnVisibilityModel || {}} setColumnVisibilityModel={setColumnVisibilityModel || {}} agregar={false || {}} />
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
    </Box>
  );
};

export default SolicitudView;
