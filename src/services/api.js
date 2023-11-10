import axios from "axios";

const url = "http://localhost:9000/laboratorio/api";

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
