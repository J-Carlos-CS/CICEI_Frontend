import axios from "axios";
const url_api = process.env.REACT_APP_API_URL; 

const GradeService = {
    getGrades: async () => {
        try {
          const response = await axios.get(url_api+"/grade");
          return response;
        } catch (error) {
          console.error(error);
          return error;
        }
      },
};

export default GradeService;
