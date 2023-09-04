import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const StudentJobService = {
  getStudentJob: async () => {
    try {
      const response = await axios.get(url_api + "/studentjob");
      return response;
    } catch (error) {
      return error;
    }
  },
  acceptJob: async (studentjob) => {
    try {
      const response = await axios.put(
        url_api + "/studentjob/acceptjob",
        studentjob
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  changeProgress: async (studentjob) => {
    try {
      const response = await axios.put(
        url_api + "/studentjob/changestateprogress",
        studentjob
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  updateStudentJob: async (studentjob) => {
    try {
      const response = await axios.put(url_api + "/studentjob", studentjob);
      return response;
    } catch (error) {
      return error;
    }
  },
  updateStudentJobAdmin: async (studentjob) => {
    try {
      const response = await axios.put(
        url_api + "/studentjob/updatestudentjobadmin",
        studentjob
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  rejectStudentJob: async (studentjob) => {
    try {
      const response = await axios.put(
        url_api + "/studentjob/reject-job",
        studentjob
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  deleteStudentJob: async (studentjob) => {
    try {
      const response = await axios.put(
        url_api + "/studentjob/delete",
        studentjob
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  getTutorials: async () => {
    try {
      const response = await axios.get(url_api + "/studentjob/tutorials");
      return response;
    } catch (error) {
      return error;
    }
  },
  deleteStudentJobStatus: async (studentjob) => {
    try {
      const response = await axios.put(
        url_api + "/studentjob/deletestatus",
        studentjob
      );
      return response;
    } catch (error) {
      return error;
    }
  },
};
export default StudentJobService;
