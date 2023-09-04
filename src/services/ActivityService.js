import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const ActivityService = {
  getActivityByProjectId: async (id) => {
    try {
      const response = await axios.get(url_api + "/activity/project/" + id);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  getActivityById: async (id) => {
    try {
      const response = await axios.get(url_api + "/activity/" + id);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  createActivity: async (activity) => {
    try {
      const response = await axios.post(url_api + "/activity/", activity);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  upadteActivity: async (activity) => {
    try {
      const response = await axios.put(url_api + "/activity/", activity);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  getActivityByUser: async (userId, projectId) => {
    try {
      const response = await axios.get(url_api + "/activity/user/" + userId+"/project/"+projectId);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  changeActivityProgress: async (activity) => {
    try {
      const response = await axios.put(url_api + "/activity/changeprogress", activity);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  deleteActivity: async (id) => {
    try {
      const response = await axios.delete(url_api + "/activity/" + id);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
export default ActivityService;
