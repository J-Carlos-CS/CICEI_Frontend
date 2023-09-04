import axios from "axios";
const url_api=process.env.REACT_APP_API_URL;
const CampusService={
    getAllCampus: async()=>{
        try {
            const response=await axios.get(url_api+"/campus")
            return response;
        } catch (error) {
            return error;
        }
    },
    getlistCampus: async()=>{
        try {
            const response=await axios.get(url_api+"/campus/listcampus")
            return response;
        } catch (error) {
            return error;
        }
    },
    createCampus: async(newCampus)=>{
        try {
            const response=await axios.post(url_api+"/campus/createcampus",newCampus);
            return response;
        } catch (error) {
            return error;
        }
    },
    deleteCampus: async(campusId)=>{
        try {
            const response=await axios.delete(url_api+"/campus/deletecampus/"+campusId)
            return response
        } catch (error) {
            return error;
        }
    },
    updateCampus: async(campusId,updatecampus)=>{
        try {
            const response=await axios.put(url_api+"/campus/updatecampus/"+campusId,updatecampus)
            return response
        } catch (error) {
            return error;
        }
    },
}
export default CampusService;