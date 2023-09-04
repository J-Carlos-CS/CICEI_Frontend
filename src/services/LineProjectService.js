import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const LineProjectService = {
  getLineProjects: async () => {
    try {
      const response = await axios.get(url_api + "/lineproject");
      return response;
    } catch (error) {
      return error;
    }
  },
  getLineProjectByProjectId: async (id) => {
    try {
      const response = await axios.get(url_api + "/lineproject/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },

  registerLineProject: async (lineproject) => {
    try {
      const response = await axios.post(
        url_api + "/lineproject",
        lineproject
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  deleteLineProject: async (lp) => {
    try {
      const response = await axios.put(url_api + "/lineproject/", lp);
      return response;
    } catch (error) {
      return error;
    }
  },

  getListProjectsByLine: async (lineId)=>{
    try {
      const response= await axios.get(url_api+"/lineproject/listprojects/"+lineId)
      return response;
    } catch (error) {
      return error;
    }
  },
};
export default LineProjectService;
