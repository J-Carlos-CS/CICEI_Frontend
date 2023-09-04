import axios from "axios";
const url_api = process.env.REACT_APP_API_URL; 
const CareerService = {
  getCareers: async () => {
    try {
      const response = await axios.get(url_api+"/career");
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  getCareerById: async (id) => {
    try {
      const response = await axios.get(url_api + "/career/" + id);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  createCareer: async (career) => {
    try {
      const response = await axios.post(
        url_api + "/career/",
        career
      );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  updateCareer: async (career) => {
    try {
      const response = await axios.put(
        url_api + "/career/",
        career
      );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  deleteCareer: async (career) => {
    try {
      const response = await axios.put(url_api + "/career/delete/",career);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
};
export default CareerService;
