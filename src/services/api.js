import axios from "axios";

const url = "http://localhost:9000/laboratorio/api";

export const getProyecto = async () => {
  const result = await axios.get(url + "/proyectos");
  return result;
};

export const putProyecto = async (metodo, newProyecto) => {
  const result = await axios({
    method: metodo,
    url:
      newProyecto.id === 0
        ? url + "/proyectos"
        : url + "/proyectos/" + newProyecto.id.toString(),
    data: newProyecto,
  });
  return result;
};

export const getCategoria = async () => {
  const result = await axios.get(url + "/categorias");
  return result;
};

export const putCategoria = async (metodo, newCategoria) => {
  const result = await axios({
    method: metodo,
    url:
      newCategoria.id === 0
        ? url + "/categorias"
        : url + "/categorias/" + newCategoria.id.toString(),
    data: newCategoria,
  });
  return result;
};

export const getUnidades = async () => {
  const result = await axios.get(url + "/unidades");
  return result;
};

export const putUnidades = async (metodo, newUnidades) => {
  const result = await axios({
    method: metodo,
    url:
      newUnidades.id === 0
        ? url + "/unidades"
        : url + "/unidades/" + newUnidades.id.toString(),
    data: newUnidades,
  });
  return result;
};

export const getReactivos = async () => {
  const result = await axios.get(url + "/reactivos");
  return result;
};

export const putReactivos = async (metodo, newReactivos) => {
  const result = await axios({
    method: metodo,
    url:
      newReactivos.id === 0
        ? url + "/reactivos"
        : url + "/reactivos/" + newReactivos.id.toString(),
    data: newReactivos,
  });
  return result;
};

export const deleteReactivo = async (id) => {
  const result = await axios.delete(url + "/reactivos/" + id.toString());
  return result;
};
