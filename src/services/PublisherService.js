import axios from "axios";
const url_api = process.env.REACT_APP_API_URL; 
const PublisherService = {
  getPublishers: async () => {
    try {
      const response = await axios.get(url_api+"/publisher");
      return response;
    } catch (error) {
      return error;
    }
  },
  createPublisher: async(publisher)=>{
    try {
      const response = await axios.post(url_api+"/publisher",publisher);
      return response;
    } catch (error) {
      return error;
    }
  },
  updatePublisher: async (publisher) => {
    try {
      const response = await axios.put(url_api+"/publisher",publisher);
      return response;
    } catch (error) {
      return error;
    }
  },
  deletePublisher: async (publisher) => {
    try {
      const response = await axios.put(url_api+"/publisher/delete",publisher);
      return response;
    } catch (error) {
      return error;
    }
  }
};
export default PublisherService;