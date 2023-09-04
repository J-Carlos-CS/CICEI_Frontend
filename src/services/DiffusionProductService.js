import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const DiffusionProductService = {
  getDiffusionProduct: async (projectId) => {
    try {
      const response = await axios.get(
        url_api + "/diffusionproduct/project/" + projectId
      );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  registerDiffusionProduct: async (product) => {
    try {
      const response = await axios.post(url_api + "/diffusionproduct", product);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  editDiffusionProduct: async (product) => {
    try {
      const response = await axios.put(url_api + "/diffusionproduct/"+product.id, product);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  deleteDiffusionProduct: async(productId)=>{
    try {
      const response = await axios.delete(url_api + "/diffusionproduct/"+productId);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
};
export default DiffusionProductService;
