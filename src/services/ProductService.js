import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const ProductService = {
  getProductsByProjectId: async (id) => {
    try {
      const response = await axios.get(url_api + "/product/project/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },
  getProductsByUserId: async (id) => {
    try {
      const response = await axios.get(url_api + "/product/user/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },
  registerProduct: async (product) => {
    try {
      const response = await axios.post(url_api + "/product", product);
      return response;
    } catch (error) {
      return error;
    }
  },

  changeProgress: async (product) => {
    try {
      const response = await axios.put(url_api + "/product/changeprogress", product);
      return response;
    } catch (error) {
      return error;
    }
  },

  getProductsDataCenter: async () => {
    try {
      const response = await axios.get(url_api + "/product/datacenter");
      return response;
    } catch (error) {
      return error;
    }
  },
  updateProduct: async (product) => {
    try {
      const response = await axios.put(url_api + "/product", product);
      return response;
    } catch (error) {
      return error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(url_api + "/product/" + id);
      return response;
    } catch (error) {
      return error;
    }
  },
};
export default ProductService;
