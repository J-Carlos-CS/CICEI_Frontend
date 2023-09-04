import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const ProjectService = {
  getProjects: async () => {
    try {
      const response = await axios.get(url_api + "/project");
      return response;
    } catch (error) {
      return error;
    }
  },
  getProjectById: async (id) => {
    try {
      const response = await axios.get(url_api + "/project/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },

  getProjectDataCenter: async () => {
    try {
      const response = await axios.get(url_api + "/project/datacenter");
      return response;
    } catch (error) {
      return error;
    }
  },
  getProjecstByGroups: async () => {
    try {
      const response = await axios.get(url_api + "/project/groups/select");
      return response;
    } catch (error) {
      return error;
    }
  },
  getProjecstByOwnerGroup: async () => {
    try {
      const response = await axios.get(url_api + "/project/group-owner");
      return response;
    } catch (error) {
      return error;
    }
  },

  getProjectByIdForView: async (id) => {
    try {
      const response = await axios.get(url_api + "/project/forview/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },

  registerProject: async (project) => {
    try {
      const response = await axios.post(url_api + "/project/register", project);
      return response;
    } catch (error) {
      return error;
    }
  },

  deleteProject: async (id) => {
    try {
      const response = await axios.put(url_api + "/project/delete/", {id});
      return response;
    } catch (error) {
      return error;
    }
  },
  getProjectsThatUserNotIn: async(id)=>{
    try {
      const response = await axios.get(url_api + "/project/user-not-in/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },
  upadteProject: async(project)=>{
    try {
      const response = await axios.put(url_api + "/project",project);
      return response;
    } catch (error) {
      return error;
    }
  },

  changeState: async(project)=>{
    try {
      const response = await axios.put(url_api + "/project/changestate",project);
      return response;
    } catch (error) {
      return error;
    }
  }
};
export default ProjectService;
