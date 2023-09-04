import axios from "axios";

const url_api = process.env.REACT_APP_API_URL;
const StatusPublishService = {
  getStatusPublish: async () => {
    try {
      const response = await axios.get(url_api + "/statuspublish/");
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};

export default StatusPublishService;
