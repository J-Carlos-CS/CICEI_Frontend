import axios from "axios";
const url_api = process.env.REACT_APP_API_URL; 
const TypeProductService = {
  getTypeProduct: async () => {
    try {
      const response = await axios.get(url_api+"/typeproduct");
      return response;
    } catch (error) {
      return error;
    }
  },
  createTypeproduct: async(typeProduct)=>{
    try {
      const response = await axios.post(url_api+"/typeproduct", typeProduct);
      return response;
    } catch (error) {
      return error;
    }
  },
  updateTypeProduct: async (typeProduct) => {
    try {
      const response = await axios.put(url_api+"/typeproduct",typeProduct);
      return response;
    } catch (error) {
      return error;
    }
  },
  deleteTypeproduct: async (typeProduct) => {
    try {
      const response = await axios.put(url_api+"/typeproduct/delete",typeProduct);
      return response;
    } catch (error) {
      return error;
    }
  }
};
export default TypeProductService;