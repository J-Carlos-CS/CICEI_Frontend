import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const url = "http://localhost:9000/laboratorio/api";
const Reactivo = {
  createReactivo: async (reactivo) => {
    try {
      const response = await axios.post(url + "/reactivo", reactivo);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  updateReactivo: async (id, reactivo) => {
    try {
      const response = await axios.put(url + "/reactivo/" + id, reactivo);
      return response;
    } catch (error) {
      return error;
    }
  },
  getReactivos: async () => {
    try {
      const response = await axios.get(url + "/reactivo");
      return response;
    } catch (error) {
      return error;
    }
  },
  deleteReactivo: async (id) => {
    try {
      const response = await axios.delete(url + "/reactivo/" + id);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
export default Reactivo;
