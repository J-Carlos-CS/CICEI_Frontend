import axios from "axios";
import jwt_decode from "jwt-decode";
const url_api = process.env.REACT_APP_API_URL;

const UserService = {
  getUsers: async () => {
    try {
      const response = await axios.get(url_api + "/user");
      return response;
    } catch (error) {
      return error;
    }
  },
  getUserForSelect: async () => {
    try {
      const response = await axios.get(url_api + "/user/usersforselect");
      return response;
    } catch (error) {
      return error;
    }
  },
  getUsersToSincro: async () => {
    try {
      const response = await axios.get(url_api + "/user/users-to-sincro");
      return response;
    } catch (error) {
      return error;
    }
  },
  getLeaders: async () => {
    try {
      const response = await axios.get(url_api + "/user/leaders");
      return response;
    } catch (error) {
      return error;
    }
  },

  getUsertoinvite: async (projectId) => {
    try {
      const response = await axios.get(
        url_api + "/user/usertoinvite/" + projectId
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  sendDirectInvitation: async (args) => {
    args.restRoute = `${process.env.REACT_APP_BASENAME}/direct-invitation-to-project`;
    try {
      const response = await axios.post(
        url_api + "/user/senddirectemailinvitation/",
        args
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  validateEmailPassword: async (credentials) => {
    try {
      const response = await axios.post(
        url_api + "/user/validatecredentialsemailpassword",
        credentials
      );
      if (response.data.success) {
        const token = response.data.response;
        const user = jwt_decode(token);
        response.data.response = {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          id: user?.id,
          picture: user?.picture,
          rolName: user?.rolName,
          systemRolId: user?.systemRolId,
          leaderGroup: user?.leaderGroup,
          token,
        };
      }
      return response;
    } catch (error) {
      return error;
    }
  },
  confirmDirectInvitation: async (args) => {
    try {
      const response = await axios.post(
        url_api + "/user/confirmdirectinvitation/",
        args
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  getUsersForAdmin: async () => {
    try {
      const response = await axios.get(url_api + "/user/for-admin");
      return response;
    } catch (error) {
      return error;
    }
  },
  getTutors: async () => {
    try {
      const response = await axios.get(url_api + "/user/tutors");
      return response;
    } catch (error) {
      return error;
    }
  },
  getUserById: async (id) => {
    try {
      const response = await axios.get(url_api + "/user/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },

  getSinteticUsers: async (name) => {
    try {
      const response = await axios.get(
        url_api + "/user/sintetic-users/" + name
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  agregateUserToProject: async (user) => {
    try {
      const response = await axios.post(
        url_api + "/user/agregateusertoproject",
        user
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  getAllSintetics: async () => {
    try {
      const response = await axios.get(url_api + "/user/allsintetics");
      return response;
    } catch (error) {
      return error;
    }
  },
  registerUser: async (user) => {
    try {
      const response = await axios.post(url_api + "/user/register", user);
      return response;
    } catch (error) {
      return error;
    }
  },
  login: async (credentials) => {
    try {
      const response = await axios.post(url_api + "/user/login", credentials);
      if (response.data.success) {
        const token = response.data.response;
        const user = jwt_decode(token);
        response.data.response = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          id: user.id,
          picture: user.picture,
          rolName: user.rolName,
          systemRolId: user.systemRolId,
          leaderGroup: user.leaderGroup,
          centerId: user.centerId,
          token,
        };
      }
      console.log("response service",response)
      return response;
    } catch (error) {
      return error;
    }
  },

  decodeJWT: (token) => {
    const user = jwt_decode(token);
    let response = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id,
      picture: user.picture,
      rolName: user.rolName,
      systemRolId: user.systemRolId,
      leaderGroup: user.leaderGroup,
      centerId: user.centerId,
      token,
    };
    return response;
  },

  emailResetPass: async (user) => {
    try {
      const response = await axios.post(
        url_api + "/user/email-reset-password",
        user
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  ResetPass: async (user) => {
    try {
      const response = await axios.post(
        url_api + "/user/reset-forgot-password",
        user
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  verifyJWTDirectInvitation: async (token) => {
    try {
      const response = await axios.post(
        url_api + "/user/verifyjwtdirectinvitation",
        { token }
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  verifycredentialsfromdirectinvitation: async (credentials) => {
    try {
      const response = await axios.post(
        url_api + "/user/verifycredentialsfromdirectinvitation",
        credentials
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  sincroUser: async (users) => {
    try {
      const response = await axios.post(url_api + "/user/sincro-users", users);
      return response;
    } catch (error) {
      return error;
    }
  },

  sendInvitations: async (emails) => {
    try {
      const response = await axios.post(
        url_api + "/user/send-email-invitation",
        emails
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  sendTokenValidation: async (token) => {
    try {
      const response = await axios.post(url_api + "/user/verify-token", token);
      return response;
    } catch (error) {
      return error;
    }
  },
  editUser: async (user) => {
    try {
      const response = await axios.put(url_api + "/user/useredit/", user);
      return response;
    } catch (error) {
      return error;
    }
  },

  createSintenticUser: async (body) => {
    try {
      const response = await axios.post(
        url_api + "/user/register-sintetic-user",
        body
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  getSinteticUserById: async (id) => {
    try {
      const response = await axios.get(
        url_api + "/user/sinteticuserbyid/" + id
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  updatePicture: async (pictureId, body) => {
    try {
      const response = await axios.put(
        url_api + "/user/picture/" + pictureId,
        body
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  agregateUser: async (user) => {
    try {
      const response = await axios.put(url_api + "/user/agregate", user);
      return response;
    } catch (error) {
      return error;
    }
  },
  excludeUser: async (user) => {
    try {
      const response = await axios.put(url_api + "/user/exclude", user);
      return response;
    } catch (error) {
      return error;
    }
  },
  registerUserSinteticAdmin: async (user) => {
    try {
      const response = await axios.post(
        url_api + "/user/register-sintetic-user-admin",
        user
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  editUserSinteticAdmin: async (user) => {
    try {
      const response = await axios.put(
        url_api + "/user/edit-sintetic-user-admin",
        user
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  getAllUsersByCenter: async(centerId)=>{
    try {
      const response= await axios.get(url_api+"/user/listusersbycenter/"+centerId);
      return response;
    } catch (error) {
      return error;
    }
  },
};
export default UserService;
