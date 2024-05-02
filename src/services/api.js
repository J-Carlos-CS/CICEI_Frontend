import axios from "axios";
import { selectUser } from "../Auth/userReducer";

const url = "http://localhost:9000/laboratorio/api";
const user = selectUser();
const creadoBy = user ? user.firstName + " " + user.lastName : "";

//Login
export const putLogin = async (login) => {
  const result = await axios.post(url + "/user/login", login);
  return result;
};
export const getAllUsuarios = async () => {
  const result = await axios.get(url + "/user");
  console.log(result);
  return result;
};

export const postInvitarUsuario = async (newUsuario) => {
  try {
    const response = await axios.post(url + "/user/crearUser", newUsuario);
    return response;
  } catch (error) {
    return error;
  }
};

export const putUsuario = async (newUsuario) => {
  try {
    const response = await axios.put(url + "/user/" + newUsuario.id, newUsuario);
    return response;
  } catch (error) {
    return error;
  }
};

//Proyecto
export const getProyecto = async () => {
  const result = await axios.get(url + "/proyectos");
  return result;
};
export const putProyecto = async (metodo, newProyecto) => {
  newProyecto.CreadoBy = creadoBy;
  const result = await axios({
    method: metodo,
    url: newProyecto.id === 0 ? url + "/proyectos" : url + "/proyectos/" + newProyecto.id.toString(),
    data: newProyecto,
  });
  return result;
};

//Categoria
export const getCategoria = async () => {
  const result = await axios.get(url + "/categorias");
  return result;
};
export const putCategoria = async (metodo, newCategoria) => {
  newCategoria.CreadoBy = creadoBy;
  const result = await axios({
    method: metodo,
    url: newCategoria.id === 0 ? url + "/categorias" : url + "/categorias/" + newCategoria.id.toString(),
    data: newCategoria,
  });
  return result;
};

//Unidades
export const getUnidades = async () => {
  const result = await axios.get(url + "/unidades");
  return result;
};
export const putUnidades = async (metodo, newUnidades) => {
  newUnidades.CreadoBy = creadoBy;
  const result = await axios({
    method: metodo,
    url: newUnidades.id === 0 ? url + "/unidades" : url + "/unidades/" + newUnidades.id.toString(),
    data: newUnidades,
  });
  return result;
};

//Reactivos
export const getReactivos = async () => {
  try {
    const result = await axios.get(url + "/reactivos");
    return result;
  } catch (error) {
    return error;
  }
};
export const putReactivos = async (metodo, newReactivos) => {
  try {
    newReactivos.CreadoBy = creadoBy;
    const result = await axios({
      method: metodo,
      url: newReactivos.id === 0 ? url + "/reactivos" : url + "/reactivos/" + newReactivos.id.toString(),
      data: newReactivos,
    });
    return result;
  } catch (error) {
    return error;
  }
};
export const deleteReactivo = async (id) => {
  const result = await axios.delete(url + "/reactivos/" + id.toString());
  return result;
};
export const postFichaTecnica = async (newInforme) => {
  try {
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    const response = await axios.post(url + "/reactivos/informe", newInforme, config);
    return response;
  } catch (error) {
    return error;
  }
};

//Equipos
export const getEquipos = async () => {
  const result = await axios.get(url + "/equipos");
  return result;
};
export const putEquipos = async (metodo, newEquipos) => {
  newEquipos.CreadoBy = creadoBy;
  const result = await axios({
    method: metodo,
    url: newEquipos.id === 0 ? url + "/equipos" : url + "/equipos/" + newEquipos.id.toString(),
    data: newEquipos,
  });
  return result;
};
export const deleteEquipos = async (id) => {
  const result = await axios.delete(url + "/equipos/" + id.toString());
  return result;
};

//Detalle Equipo
export const getDetalleEquipo = async (id) => {
  const result = await axios.get(url + "/detalle/" + id.toString());
  return result;
};
export const postDetalleEquipo = async (metodo, newDetalleEquipo) => {
  newDetalleEquipo.CreadoBy = creadoBy;
  const result = await axios({
    method: metodo,
    url: newDetalleEquipo.id === 0 ? url + "/detalle" : url + "/detalle/" + newDetalleEquipo.id.toString(),
    data: newDetalleEquipo,
  });
  return result;
};

//Manuales
export const getManuales = async () => {
  const result = await axios.get(url + "/manuales");
  return result;
};

//Documentos
export const postDocumentos = async (file) => {
  try {
    console.log("file-----------");
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    const response = await axios.post(url + "/file/informe", file, config);
    return response;
  } catch (error) {
    return error;
  }
};

//Guias
export const getGuias = async (id) => {
  const result = await axios.get(url + "/guias/" + id.toString());
  console.log(result);
  return result;
};
export const postGuia = async (newGuia) => {
  try {
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    const response = await axios.post(url + "/guias", newGuia, config);
    return response;
  } catch (error) {
    return error;
  }
};

//Tutor
export const getInvesigadores = async (id) => {
  const result = await axios.get(url + "/tutorinvestigador/" + id.toString());
  return result;
};
export const getAllInvestigadores = async () => {
  const result = await axios.get(url + "/user/investigador/all");
  return result;
};
export const postInvesigadores = async (newInvestigador) => {
  const result = await axios.post(url + "/tutorinvestigador", newInvestigador);
  return result;
};
export const getTutor = async (id) => {
  const result = await axios.get(url + "/tutorinvestigador/investigador/" + id.toString());
  return result;
};

//solicitud
export const getEquipoSolicitud = async () => {
  const result = await axios.get(url + "/equipos/equipo/disponible");
  return result;
};
export const getReactivosSolicitud = async () => {
  const result = await axios.get(url + "/reactivos/reactivo/disponible");
  return result;
};
