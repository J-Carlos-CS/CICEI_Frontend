import axios from "axios";
const url_api=process.env.REACT_APP_API_URL;
const CenterService={
    getAllCenters: async()=>{
        try {
            const response=await axios.get(url_api+"/center");
            return response;
        } catch (error) {
            return error;
        }
    },
    postCenter: async(center)=> {
        try {
            const response= await axios.post(url_api+"/center/creationcenter",center);
            return response;
        } catch (error) {
            return error;
        }
    },
    updateCenter: async(center)=>{
        try {
            const centerId=center.id;
            const response= await axios.put(url_api+"/center/updatecenter/"+centerId,center);
            return response;
        } catch (error) {
            return error;   
        }

    },
    getCenterById: async(centerId)=>{
        try {
            const response= await axios.get(url_api+"/center/getonecenter/"+centerId);
            return response;
        } catch (error) {
            return error;
        }
    },
    deleteCenterById: async(centerId)=>{
        try {
            const response= await axios.delete(url_api+"/center/deletecenter/"+centerId);
            return response;
        } catch (error) {
            return error;
        }
    },
    getCoordinator: async(CoordinatorId)=>{
        
    }
}
export default CenterService;