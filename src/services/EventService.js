import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const EventService = {
  getEvents: async () => {
    try {
      const response = await axios.get(url_api + "/event");
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  getEventById: async (id) => {
    try {
      const response = await axios.get(url_api + "/event/" + id);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  registerEvent: async (event) => {
    try {
      const response = await axios.post(url_api + "/event/", event);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  updateEvent: async (event) => {
    try {
      const response = await axios.put(url_api + "/event/", event);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  deleteEvent: async (event) => {
    try {
      const response = await axios.post(url_api + "/event/delete/",event);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
export default EventService;
