import axios from "axios";

const url = "http://localhost:9000/laboratorio/api";

//Login
export const putLogin = async (login) => {
  const result = await axios.post(url + "/user/login", login);
  return result;
};

//Proyecto
export const getProyecto = async () => {
  const result = await axios.get(url + "/proyectos");
  return result;
};
export const putProyecto = async (metodo, newProyecto) => {
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
  const result = await axios({
    method: metodo,
    url: newUnidades.id === 0 ? url + "/unidades" : url + "/unidades/" + newUnidades.id.toString(),
    data: newUnidades,
  });
  return result;
};

//Reactivos
export const getReactivos = async () => {
  const result = await axios.get(url + "/reactivos");
  return result;
};
export const putReactivos = async (metodo, newReactivos) => {
  const result = await axios({
    method: metodo,
    url: newReactivos.id === 0 ? url + "/reactivos" : url + "/reactivos/" + newReactivos.id.toString(),
    data: newReactivos,
  });
  return result;
};
export const deleteReactivo = async (id) => {
  const result = await axios.delete(url + "/reactivos/" + id.toString());
  return result;
};

//Equipos
export const getEquipos = async () => {
  const result = await axios.get(url + "/equipos");
  return result;
};
export const putEquipos = async (metodo, newEquipos) => {
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
