import axios from "axios";
const url_api = process.env.REACT_APP_API_URL; 
const ContactService = {
  updateContact: async (contact) => {
    try {
      const response = await axios.put(url_api+"/contact", contact);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
export default ContactService;
