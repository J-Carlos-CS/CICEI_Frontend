import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const TypeArticleService = {
  getTypeArticle: async () => {
    try {
      const response = await axios.get(url_api + "/typearticle");
      return response;
    } catch (error) {
      return error;
    }
  },
  createTypeArtcile: async (typeArticle) => {
    try {
      const response = await axios.post(url_api + "/typearticle", typeArticle);
      return response;
    } catch (error) {
      return error;
    }
  },
  updateTypeArticle: async (typeArticle) => {
    try {
      const response = await axios.put(url_api + "/typearticle", typeArticle);
      return response;
    } catch (error) {
      return error;
    }
  },
  deleteTypeArticle: async (typeArticle) => {
    try {
      const response = await axios.put(
        url_api + "/typearticle/delete",
        typeArticle
      );
      return response;
    } catch (error) {
      return error;
    }
  },
};
export default TypeArticleService;
