import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const InstitutionService = {
  getInstitutions: async () => {
    try {
      const response = await axios.get(url_api + "/institution");
      return response;
    } catch (error) {
      return error;
    }
  },
  getInstitutionById: async (id) => {
    try {
      const response = await axios.get(url_api + "/institution/" + id);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  createInstitution: async (institution) => {
    try {
      const response = await axios.post(url_api + "/institution/", institution);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  updateInstitution: async (institution) => {
    try {
      const response = await axios.put(url_api + "/institution/", institution);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  deleteInstitution: async (institution) => {
    try {
      const response = await axios.put(
        url_api + "/institution/delete/",
        institution
      );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
export default InstitutionService;
