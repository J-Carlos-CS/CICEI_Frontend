import axios from "axios";

const url_api = process.env.REACT_APP_API_URL;
const TaskService = {
  registerTasks: async (activity) => {
    try {
      const response = await axios.post(url_api + "/task/register/", activity);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};

export default TaskService;
