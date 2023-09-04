import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const SemesterService = {
  getSemesters: async () => {
    try {
      const response = await axios.get(url_api + "/semester");
      return response;
    } catch (error) {
      return error;
    }
  },
  getSemesterById: async (id) => {
    try {
      const response = await axios.get(url_api + "/semester/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },

  createSemester: async (semester) => {
    try {
      const response = await axios.post(url_api + "/semester/", semester);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  updateSemester: async (semester) => {
    try {
      const response = await axios.put(url_api + "/semester/", semester);
      return response;
    } catch (error) {
      return error;
    }
  },

  deleteSemester: async (semester) => {
    try {
      const response = await axios.put(url_api + "/semester/delete/", semester);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
export default SemesterService;
