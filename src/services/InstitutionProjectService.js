import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const InstitutionProjectService = {
  getInstitutionProjects: async () => {
    try {
      const response = await axios.get(url_api + "/lineproject");
      return response;
    } catch (error) {
      return error;
    }
  },
  getInstitutionProjectByProjectId: async (id) => {
    try {
      const response = await axios.get(url_api + "/institutionproject/project/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },


  registerInstitutionProject: async (institutionproject) => {
    try {
      const response = await axios.post(url_api + "/institutionproject", institutionproject);
      return response;
    } catch (error) {
      return error;
    }
  },

  updateInstitutionProject: async (institutionProject) => {
    try {
      const response = await axios.put(url_api + "/institutionproject/",institutionProject);
      return response;
    } catch (error) {
      return error;
    }
  },

  deleteInstitutionProject: async (institutionProject) => {
    try {
      const response = await axios.put(url_api + "/institutionproject/delete" ,institutionProject);
      return response;
    } catch (error) {
      return error;
    }
  },
};
export default InstitutionProjectService;
