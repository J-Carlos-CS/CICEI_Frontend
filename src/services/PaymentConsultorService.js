import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const PaymentConsultorService = {
  registerPayment: async (payment) => {
    try {
      const response = await axios.post(
        url_api + "/paymentconsultor/",
        payment
      );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  updatePayment: async (payment) => {
    try {
      const response = await axios.put(
        url_api + "/paymentconsultor/",
        payment
      );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};

export default PaymentConsultorService;
