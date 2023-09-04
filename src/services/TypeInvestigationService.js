import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const TypeInvestigationService = {
  getTypeInvestigation: async () => {
    try {
      const response = await axios.get(url_api + "/typeinvestigation");
      return response;
    } catch (error) {
      return error;
    }
  },
  getTypeInvestigationById: async (id) => {
    try {
      const response = await axios.get(url_api + "/typeinvestigation/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },

  createTypeInvestigation: async (typeinvestigation) => {
    try {
      const response = await axios.post(
        url_api + "/typeinvestigation/",
        typeinvestigation
      );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  updateTypeInvestigation: async (typeinvestigation) => {
    try {
      const response = await axios.put(
        url_api + "/typeinvestigation/",
        typeinvestigation
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  deleteTypeInvestigation: async (typeinvestigation) => {
    try {
      const response = await axios.put(
        url_api + "/typeinvestigation/delete/",
        typeinvestigation
      );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
export default TypeInvestigationService;
