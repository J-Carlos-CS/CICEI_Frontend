import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const url = "http://localhost:9000/laboratorio/api";
const Categoria = {
  createCategoria: async (categoria) => {
    try {
      const response = await axios.post(url + "/categoria", categoria);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  updateCategoria: async (id, categoria) => {
    try {
      const response = await axios.put(url + "/categoria/" + id, categoria);
      return response;
    } catch (error) {
      return error;
    }
  },
  getCategorias: async () => {
    try {
      const response = await axios.get(url + "/categoria");
      return response;
    } catch (error) {
      return error;
    }
  },
  deleteCategoria: async (id) => {
    try {
      const response = await axios.delete(url + "/categoria/" + id);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
export default Categoria;
