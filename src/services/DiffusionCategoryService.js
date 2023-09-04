import axios from "axios";
const url_api = process.env.REACT_APP_API_URL; 
const DiffusionCategoryService = {
  getDiffusionCategory: async () => {
    try {
      const response = await axios.get(url_api+"/diffusioncategories");
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
export default DiffusionCategoryService;
