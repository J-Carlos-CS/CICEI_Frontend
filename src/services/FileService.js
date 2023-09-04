import axios from "axios";
const url_api = process.env.REACT_APP_API_URL;
const FileService = {
  postUserImage: async (image) => {
    try {
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      const response = await axios.post(
        url_api + "/file/user",
        image,
        config
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  postGroupImage: async (image) => {
    try {
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      const response = await axios.post(
        url_api + "/file/group",
        image,
        config
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  postProduct: async (productFile,config) => {
    try {
      const response = await axios.post(
        url_api + "/file/productfile",
        productFile,
        config
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  postDiffusionProduct: async (productFile,config) => {
    try {
      const response = await axios.post(
        url_api + "/file/diffusionproductfile",
        productFile,
        config
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  deleteFileDiffusionProduct: async(id, projectId)=>{
    try {
      const response = await axios.put(
        url_api + "/file/diffusiodeleterestrictfile/filediffusionproduct/"+id,{projectId}
      );
      return response;
    } catch (error) {
      return error;
    }
  },


  getProduct: async() =>{
    try {
      const response = await axios.get(
        url_api + "/file/download",
      );
      return response;
    } catch (error) {
      return error;
    }
  },

  deleteFileProduct: async(id, projectId)=>{
    try {
      const response = await axios.put(
        url_api + "/file/deleteproductrestrictfile/fileProduct/"+id,{projectId}
      );
      return response;
    } catch (error) {
      return error;
    }
  },



  postStudentJob: async(studentJobFile, config)=>{
    try {
     /*  const config = {
        headers: { "content-type": "multipart/form-data" },
      }; */
      const response = await axios.post(
        url_api + "/file/studentjobfile",
        studentJobFile,
        config
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  

  deleteFileStudentJob: async(id, projectId)=>{
    try {
      const response = await axios.put(
        url_api + "/file/deletestudentjobrestrictfile/filestudentjob/"+id,{projectId}
        );
      return response;
    } catch (error) {
      return error;
    }
  },

  createFolderProject: async(project) =>{
    try {
      const response = await axios.post(
        url_api + "/file/createprojectfolder/",project
        );
      return response;
    } catch (error) {
      return error;
    }
  },

  testFile: async(formData, config)=>{
    try {
      const response = await axios.post(
        url_api + "/file/testfile/",formData, config
        );
      return response;
    } catch (error) {
      return error;
    }
  }
};
export default FileService;
