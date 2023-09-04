import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const UserProjectService = {
  getUserProjects: async () => {
    try {
      const response = await axios.get(url_api + "/userproject");
      return response;
    } catch (error) {
      return error;
    }
  },
  getUserProjectByProjectId: async (id) => {
    try {
      const response = await axios.get(url_api + "/userproject/project/" + id);
      return response;
    } catch (error) {
      return error;
    }
  }, //
  updateRole: async (body) => {
    try {
      const response = await axios.put(
        url_api + "/userproject/editrole/",
        body
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  registerUserProject: async (project) => {
    try {
      const response = await axios.post(
        url_api + "/userproject/register",
        project
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  rejectRequest: async (userProject) => {
    try {
      const response = await axios.put(
        url_api + "/userproject/rejectrequest",
        userProject
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  acceptMember: async (id) => {
    try {
      const response = await axios.put(
        url_api + "/userproject/accept/" + id,
        {}
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  rejectMember: async (id) => {
    try {
      const response = await axios.put(
        url_api + "/userproject/reject/" + id,
        {}
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  makeLeader: async (id) => {
    try {
      const response = await axios.put(
        url_api + "/userproject/makemain/" + id,
        {}
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  deleteUserProject: async (userProject) => {
    try {
      const response = await axios.post(
        url_api + "/userproject/delete/",
        userProject
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  getUsersToDirectAgregation: async (projectId) => {
    try {
      const response = await axios.get(
        url_api + "/userproject/userstodirectagregation/project/" + projectId
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  subscribeUserProject: async (userProject) => {
    try {
      const response = await axios.post(
        url_api + "/userproject/subscribe",
        userProject
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  unsubscribeUserProject: async (userProject) => {
    try {
      const response = await axios.post(
        url_api + "/userproject/unsubscribe",
        userProject
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  getProjectsByUserId: async (userId) => {
    try {
      const response = await axios.get(url_api + "/userproject/user/" + userId);
      return response;
    } catch (error) {
      return error;
    }
  },
  agregateUserToProjects: async (data) => {
    try {
      const response = await axios.post(
        url_api + "/userproject/agregateusertoproject/",
        data
      );
      return response;
    } catch (error) {
      return error;
    }
  },
};
export default UserProjectService;
