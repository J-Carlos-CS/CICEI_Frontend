import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const NewsService = {
  getNews: async (id) => {
    try {
      const response = await axios.get(url_api + "/news");
      return response;
    } catch (error) {
      /*       console.error(error);
       */ return error;
    }
  },
  createNew: async (body) => {
    try {
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      const response = await axios.post(url_api + "/news/", body, config);
      //const response = await axios.post(url_api + "/news", body);
      return response;
    } catch (error) {
      // console.error(error);
      return error;
    }
  },

  updateNews: async (body) => {
    try {
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      const response = await axios.put(url_api + "/news", body, config);
      return response;
    } catch (error) {
      // console.error(error);
      return error;
    }
  },

  deleteNew: async (newId) => {
    try {
      const response = await axios.delete(url_api + "/news/" + newId);
      return response;
    } catch (error) {
      //console.error(error);
      return error;
    }
  },

  changeState: async (myNew) => {
    try {
      const response = await axios.put(url_api + "/news/updatestate", myNew);
      return response;
    } catch (error) {
      //console.error(error);
      return error;
    }
  },
};
export default NewsService;
