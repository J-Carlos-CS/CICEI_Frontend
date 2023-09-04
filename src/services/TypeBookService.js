import axios from "axios";
const url_api = process.env.REACT_APP_API_URL; 
const TypeBookService = {
  getTypeBooks: async () => {
    try {
      const response = await axios.get(url_api+"/typebook");
      return response;
    } catch (error) {
      return error;
    }
  },
  createTypeBook: async(typeBook)=>{
    try {
      const response = await axios.post(url_api+"/typebook",typeBook);
      return response;
    } catch (error) {
      return error;
    }
  },
  updateTypeBook: async (typeBook) => {
    try {
      const response = await axios.put(url_api+"/typebook",typeBook);
      return response;
    } catch (error) {
      return error;
    }
  },
  deleteTypeBook: async (studentjob) => {
    try {
      const response = await axios.put(url_api+"/typebook/delete",studentjob);
      return response;
    } catch (error) {
      return error;
    }
  }
};
export default TypeBookService;