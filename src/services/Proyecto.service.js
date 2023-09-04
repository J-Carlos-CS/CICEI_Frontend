import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const url = "http://localhost:9000/laboratorio/api";
const Proyecto = {
  createProyecto: async (proyecto) => {
    try {
      const response = await axios.post(url + "/proyecto", proyecto);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  updateProyecto: async (id, proyecto) => {
    try {
      const response = await axios.put(url + "/proyecto/" + id, proyecto);
      return response;
    } catch (error) {
      return error;
    }
  },
  getProyectos: async () => {
    try {
      const response = await axios.get(url + "/proyecto");
      return response;
    } catch (error) {
      return error;
    }
  },
  deleteProyecto: async (id) => {
    try {
      const response = await axios.delete(url + "/proyecto/" + id);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
export default Proyecto;
