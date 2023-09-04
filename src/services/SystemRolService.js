import axios from "axios";
const url_api = process.env.REACT_APP_API_URL; 
const SystemRolService = {
  getSytemRolForRegister: async () => {
    try {
      const response = await axios.get(url_api+"/systemrol/register");
      return response;
    } catch (error) {
      return error;
    }
  },
  getRoles: async () => {
    try {
      const response = await axios.get(url_api+"/systemrol");
      return response;
    } catch (error) {
      return error;
    }
  }  
};
export default SystemRolService;