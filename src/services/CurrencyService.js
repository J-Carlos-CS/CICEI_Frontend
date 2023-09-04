import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const CurrencyService = {
  getCurrencies: async () => {
    try {
      const response = await axios.get(url_api + "/currency");
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  getCurrencyById: async (id) => {
    try {
      const response = await axios.get(url_api + "/currency/" + id);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  createCurrency: async (currency) => {
    try {
      const response = await axios.post(url_api + "/currency/", currency);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  updateCurrency: async (currency) => {
    try {
      const response = await axios.put(url_api + "/currency/", currency);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  deleteCurrency: async (currency) => {
    try {
      const response = await axios.put(url_api + "/currency/delete/",currency);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
export default CurrencyService;
