import axios from "axios";
const url_api = process.env.REACT_APP_API_URL; 
const GroupService = {
  getGroups: async () => {
    try {
      const response = await axios.get(url_api+"/group");
      return response;
    } catch (error) {
      return error;
    }
  },
  getGroupById: async (id) => {
    try {
      const response = await axios.get(url_api + "/group/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },

  getGroupsByOwnerId: async (id) => {
    try {
      const response = await axios.get(url_api + "/group/owner");
      return response;
    } catch (error) {
      return error;
    }
  },

  getGroupByIdForView: async (id) => {
    try {
      const response = await axios.get(url_api + "/group/forview/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },

  createGroup: async (group) => {
    try {
      const response = await axios.post(
        url_api + "/group/",
        group
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  updateGroup: async (group) => {
    try {
      const response = await axios.put(
        url_api + "/group/",
        group
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  postImage: async (image) => {
    try {
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      const response = await axios.post(url_api + "/group/image", image, config);
      return response;
    } catch (error) {
      return error;
    }
  },

  deleteGroup: async (id) => {
    try {
      const response = await axios.put(url_api + "/group/delete/"+id);
      return response;
    } catch (error) {
      return error;
    }
  },

  updateGroupImage: async(group)=>{
    try {
      const response = await axios.put(url_api + "/group/updateimg/",group);
      return response;
    } catch (error) {
      return error;
    }
  }
};
export default GroupService;
