import axios from "axios";
const url_api=process.env.REACT_APP_API_URL;
const AcademicUnitService={
    getAllAcademicUnit: async()=>{
        try {
            const response=await axios.get(url_api+"/academicUnit")
            return response;
        } catch (error) {
            return error;
        }
    },
    getListAcademitUnitByCampus:async(centerId)=>{
        try {
            const response=await axios.get(url_api+"/academicUnit/listAUbyCampus/"+centerId)
            return response;
        } catch (error) {
            return error;
        }
    },
}
export default AcademicUnitService;