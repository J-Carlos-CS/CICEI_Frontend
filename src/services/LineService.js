import axios from "axios";
const url_api = process.env.REACT_APP_API_URL; 
const LineService = {
  getLines: async () => {
    try {
      const response = await axios.get(url_api+"/line");
      return response;
    } catch (error) {
      return error;
    }
  },
  getLineById: async (id) => {
    try {
      const response = await axios.get(url_api + "/line/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },

  getInstitutionalLines: async () => {
    try {
      const response = await axios.get(url_api + "/line/institutionals");
      return response;
    } catch (error) {
      return error;
    }
  },

  getLinesByOwnerId: async () => {
    try {
      const response = await axios.get(url_api + "/line/owner");
      return response;
    } catch (error) {
      return error;
    }
  },

  getLineByIdForView: async(id)=> {
    try {
      const response = await axios.get(url_api + "/line/forview/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },
  getAllLines: async(id)=> {
    try {
      const response = await axios.get(url_api + "/line/alllines/");
      return response;
    } catch (error) {
      return error;
    }
  },
  createLine: async (line) => {
    console.log("createLine",line)
    try {
      const response = await axios.post(
        url_api + "/line/",
        line
      );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  updateLine: async (id,line) => {
    try {
      const response = await axios.put(
        url_api + "/line/"+id,
        line
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  deleteLine: async (id) => {
    try {
      const response = await axios.put(url_api + "/line/delete/"+id);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  changeLineProjects: async(data)=>{
    try {
      const response = await axios.put(url_api + "/line/changelineprojects/",data);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  changeLinesGroup: async(data)=>{
    try {
      const response = await axios.put(url_api + "/line/changelinegroup/",data);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  getAllLinesByCenter: async(CenterId)=>{
    try {
      const response = await axios.get(url_api + "/line/linesbycenter/"+CenterId);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  getLinesOwenByCenter: async(CenterId)=>{
    try {
      const response = await axios.get(url_api + "/line/linesowenbycenter/"+CenterId);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
};
export default LineService;
