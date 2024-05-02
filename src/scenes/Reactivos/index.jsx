import React, { useEffect, useState } from "react";
import { show_alerta } from "../../services/functions";
import Header from "components/Header";
import { Box, Button, Chip, Dialog, IconButton, DialogTitle, DialogActions } from "@mui/material";
import { DeleteForeverOutlined, EditOutlined, AddCircleOutline, Visibility } from "@mui/icons-material";
import { getReactivos, putReactivos, getCategoria, getProyecto, getUnidades, deleteReactivo } from "services/api";
import DataTable from "components/DataTable";
import Form from "./Form";
import ImportForm from "./ImportForm";
import FormImport from "./FormImport";

const Reactivos = () => {
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [modalImport, setModalImport] = useState(false);
  const [reactivos, setReactivos] = useState([]);
  const [categorias, setCategoria] = useState([]);
  const [proyectos, setProyecto] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [operation, setOperation] = useState("");
  const [reactivoID, setReactivoID] = useState(0);
  const [modalForm, setModalForm] = useState(false);
  const [modalFicha, setModalFicha] = useState(false);
  const [URL, setURL] = useState("");
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({ observaciones: false, marca: false, fecha_vencimiento: false, CreadoBy: false, ModificadoBy: false, createdAt: false, updatedAt: false });
  const [newReactivos, setNewReactivos] = useState({
    id: 0,
    nombre: "",
    cantidad: 0,
    unidades: "",
    clasificacion: "",
    codigo: "",
    observaciones: "",
    estado: false,
    marca: "",
    fecha_vencimiento: "",
    categoriaId: 0,
    proyectoId: 0,
  });
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const respuesta = await getReactivos();
    setReactivos(respuesta.data);
  };
  const getCategorias = async () => {
    const respuesta = await getCategoria();
    setCategoria(respuesta.data);
  };
  const getProyectos = async () => {
    const respuesta = await getProyecto();
    setProyecto(respuesta.data);
  };
  const getUnidad = async () => {
    const respuesta = await getUnidades();
    setUnidades(respuesta.data);
  };
  const clearModal = async () => {
    setNewReactivos({
      ...newReactivos,
      id: 0,
      nombre: "",
      cantidad: null,
      unidades: "",
      clasificacion: "",
      codigo: "",
      observaciones: "",
      estado: false,
      marca: "",
      fecha_vencimiento: "",
      categoriaId: 0,
      proyectoId: 0,
    });
  };
  const openModal = (op, proyec) => {
    clearModal();
    setOperation(op);
    setModal(true);
    getUnidad();
    getCategorias();
    getProyectos();
    if (op === 1) {
      setTitle("Agregar Reactivos");
    } else if (op === 2) {
      setTitle("Editar Reactivos");
      setNewReactivos(proyec);
    }
  };
  const closeModal = () => {
    setModal(false);
  };
  const closeModalForm = () => {
    setModalForm(false);
  };
  const openModalImport = () => {
    setModalImport(true);
  };
  const closeModalImport = () => {
    setModalImport(false);
    getProducto();
  };
  const openModalForm = (proyect) => {
    setModalForm(true);
    setReactivoID(proyect.id);
  };
  const validar = () => {
    var method;
    closeModal();
    if (
      newReactivos.nombre.trim() !== "" &&
      newReactivos.cantidad !== 0 &&
      newReactivos.unidades !== "" &&
      newReactivos.clasificacion !== "" &&
      newReactivos.codigo.trim() !== "" &&
      newReactivos.marca.trim() !== "" &&
      newReactivos.categoriaId !== 0 &&
      newReactivos.proyectoId !== 0
    ) {
      if (operation === 1) {
        method = "POST";
      } else {
        method = "PUT";
      }
      sendData(method);
    } else {
      closeModal();
      show_alerta("Completa Todos los Datos", "warning");
    }
  };
  const EliminarReactivo = async (proyec) => {
    console.log(proyec);
    if (proyec.id) {
      const respuesta = await deleteReactivo(proyec.id);
      if (respuesta.error) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Reactivos: " + proyec.nombre + ", fue eliminado con exito! ", "success");
      }
      getProducto();
    }
  };
  const sendData = async (metodo) => {
    console.log(newReactivos);
    const respuesta = await putReactivos(metodo, newReactivos);
    if (respuesta.error) {
      show_alerta("Error en la solicitud", "error");
    } else {
      if (operation === 1) {
        show_alerta("Reactivos: " + newReactivos.nombre + ", fue creado con exito! ", "success");
      } else {
        show_alerta("Reactivos: " + newReactivos.nombre + ", fue actualizado con exito! ", "success");
      }
    }
    getProducto();
  };
  const openFicha = (proyect) => {
    setModalFicha(true);
    setURL(proyect.ficha_tecnica);
  };
  const closeModalFicha = () => {
    setModalFicha(false);
  };

  const columns = [
    { field: "nombre", headerName: "NOMBRE", flex: 0.5 },
    { field: "cantidad", headerName: "CANTIDAD", flex: 0.5 },
    { field: "unidades", headerName: "UNIDADES", flex: 0.5 },
    {
      field: "categoriaId",
      headerName: "CATEGORIA",
      flex: 0.5,
      valueGetter: (params) => params.row.categoria.categoria,
    },
    {
      field: "proyectoId",
      headerName: "PROYECTO",
      flex: 0.5,
      valueGetter: (params) => params.row.proyecto.proyecto,
    },
    { field: "marca", headerName: "MARCA", flex: 0.5 },
    { field: "codigo", headerName: "CODIGO", flex: 0.5 },
    {
      field: "observaciones",
      headerName: "OBSERVACIONES",
      flex: 0.5,
    },
    { field: "clasificacion", headerName: "CLASIFICACION", flex: 0.5 },
    {
      field: "fecha_vencimiento",
      headerName: "FECHA VENCIMIENTO",
      flex: 0.5,
      valueGetter: (params) => (params.row.fecha_vencimiento ? params.row.fecha_vencimiento.slice(0, params.row.fecha_vencimiento.indexOf("T")) : ""),
    },
    {
      field: "ficha_tecnica",
      headerName: "FICHA TECNICA",
      flex: 0.5,
      renderCell: (params) =>
        params.row.ficha_tecnica ? (
          <Box>
            <IconButton color="secondary" aria-label="Ver Ficha" onClick={() => openFicha(params.row)}>
              <Visibility />
            </IconButton>
          </Box>
        ) : (
          <Box>
            <IconButton color="secondary" aria-label="Agregar Ficha" onClick={() => openModalForm(params.row)}>
              <AddCircleOutline />
            </IconButton>
          </Box>
        ),
    },
    {
      field: "estado",
      headerName: "ESTADO",
      flex: 0.5,
      renderCell: (params) => <Chip label={params.row.estado ? "ACTIVO" : "DESACTIVADO"} color={params.row.estado ? "success" : "error"} />,
    },
    { field: "CreadoBy", headerName: "CREADO POR", flex: 0.5 },
    { field: "ModificadoBy", headerName: "MODIFICADO POR", flex: 0.5 },

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
    {
      field: "acciones",
      headerName: "ACCIONES",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <IconButton color="secondary" aria-label="Editar" onClick={() => openModal(2, params.row)}>
            <EditOutlined />
          </IconButton>
          <IconButton color="secondary" aria-label="Eliminar" onClick={() => EliminarReactivo(params.row)}>
            <DeleteForeverOutlined />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="1rem 2.5rem">
      <Header title="REACTIVOS" subtitle="Lista de Reactivos" />
      <DataTable
        rows={reactivos || {}}
        columns={columns || {}}
        columnVisibilityModel={columnVisibilityModel || {}}
        setColumnVisibilityModel={setColumnVisibilityModel || {}}
        openModal={openModal || {}}
        openModalImport={openModalImport || {}}
        agregarImport={true || {}}
      />
      <Dialog open={modal} onClose={closeModal}>
        <DialogTitle color="secondary">{title}</DialogTitle>
        <Form newReactivos={newReactivos || {}} setNewReactivos={setNewReactivos || {}} unidades={unidades || {}} categorias={categorias || {}} proyectos={proyectos || {}} />
        <DialogActions>
          <Button autoFocus color="error" onClick={closeModal}>
            Cancelar
          </Button>
          <Button autoFocus color="secondary" onClick={() => validar()}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={modalImport} onClose={closeModalImport} alignItems="center" PaperProps={{ style: { maxHeight: 600, maxWidth: 1200 } }}>
        <DialogTitle color="secondary">Importar Datos para Reactivos</DialogTitle>
        <ImportForm closeModalImport={closeModalImport} />
      </Dialog>
      <Dialog open={modalForm} onClose={closeModalForm}>
        <FormImport id={reactivoID || {}} closeModalForm={closeModalForm || {}} getProducto={getProducto} />
      </Dialog>
      <Dialog open={modalFicha} onClose={closeModalFicha} alignItems="center" PaperProps={{ style: { maxHeight: 600, maxWidth: 1200 } }}>
        <iframe src={`https://drive.google.com/file/d/${URL}/preview`} title="Ficha Técnica" width="1200" height="1200" allow="autoplay"></iframe>
      </Dialog>
    </Box>
  );
};

export default Reactivos;
