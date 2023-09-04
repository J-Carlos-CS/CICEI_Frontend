import {useCallback, useEffect, useState} from "react"
import {useHistory,useParams,useLocation}from "react-router-dom"
import CenterService from "../../../services/CenterService"
import CampusService from "../../../services/CampusService"
import AcademicUnitService from "../../../services/AcademicUnitService"
import UserService from "../../../services/UserService"
import {Form, Input, Button, message,Typography,Row, Select} from "antd"


const {Title} = Typography;
const {Option}= Select;
const layout={
  labelCol:{
    span:10,
  },
  wrapperCol:{
    span:20,
  },
  style:{
    maxWidth:1000,
  },
  initialValues:{
    remember: true,
  }
}
export default function CenterForm(){
  const history= useHistory();
  const params= useParams();
  const [form] = Form.useForm();
  const [center, setCenter]=useState([]);
  const [listCampus,setListCampus]=useState([{}]);
  const [listAcademicUnit,setListAcademicUnit]=useState([{}]);
  const [listCoordinators,setListCoordinators]=useState([{}]);
  const [fields, setfields] = useState([]);
  const centerId= params.id;
  const [requesting, setRequesting]=useState(false);
  const location=useLocation().pathname;

  
  const createCenter=useCallback((center)=>{
      setRequesting(false);
      CenterService.postCenter(center)
      .then((res)=>{
        message.success("Registro del centro exitoso");
        history.goBack();
      })
  });
  const updateCenter=useCallback((updateCenter)=>{
    setRequesting(false);
    CenterService.updateCenter(updateCenter)
    .then((res)=>{
      message.success("Actualizanción del centro exitoso");
      history.goBack();
    })
  })
  const getCenterById=useCallback((centerId)=>{
      setRequesting(true);
      CenterService.getCenterById(centerId)
        .then((res)=>{
          if(res.data?.response){
            const centerRes=res.data.response
             setCenter(centerRes);
            if (res.data?.response){
              const fields=[
                {
                  name:["name"],
                  value: centerRes.name || "",
                },
                {
                  name:["acronym"],
                  value: centerRes.acronym || "",
                },
                {
                  name:["academicUnitId"],
                  value: centerRes.academicUnitId || ""
                },
                {
                  name:["campusId"],
                  value: centerRes.campusId || ""
                },
                {
                  name:["coordinatorId"],
                  value: centerRes.coordinatorId || ""
                },
              ];
              setfields(fields);
              AcademicUnitService.getListAcademitUnitByCampus(centerRes.campusId).then((res)=>{
                setListAcademicUnit(res?.data?.response);
              })
            }
          }
        }).catch((e)=>{
          console.error(e)
        })
    },[]);

    const getAllCampus=useCallback(()=>{
      CampusService.getAllCampus().then((res)=>{
        setListCampus(res?.data?.response);
      })
    })
    const getAllAcademicUnit=useCallback((campusId,body)=>{
      console.log("campusId",campusId,"body",body)
      AcademicUnitService.getListAcademitUnitByCampus(campusId).then((res)=>{
        setListAcademicUnit(res?.data?.response);
      })
    })
    const getAllcoordinator=useCallback(()=>{
      UserService.getUsers().then((res)=>{
        setListCoordinators(res?.data?.response);
      })
    })
    
    useEffect(()=>{

      getCenterById(centerId);
      getAllCampus();
      getAllcoordinator();
    },[centerId,getCenterById])

    const onFinish= (center)=>{
      center.id=centerId;
      if(centerId!== null && centerId > 0){
        updateCenter(center);
      }else{
        createCenter(center);
      }
    };

    const createListCampusOptions=(ListCampus)=>{
    }
    return(
      <>
      <Row align="center">
      <Title className="titleCenter" style={{verticalAlign:"middle"}}>
          {centerId ? "Editar centro":"Crear centro"}
        </Title>
      </Row>
       <div id="ContainerForm">
          <Form 
          {...layout}
          fields={fields}
          form={form}
          preserve={false}
          onFinish={onFinish}
          scrollToFirstError
          >
            <Form.Item 
            name="name"
            label="Nombre del centro"
            rules={[
              {
                required: true,
                message: 'Ingrese un nombre para centro'
              }
            ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item 
            name="acronym"
            label="Siglas del centro"
            rules={[
              {
                required: true,
                message: 'Ingrese las siglas del centro' 
              }
            ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item 
            name="campusId"
            label="Sede"
            rules={[
              {
                required: true,
                message: 'Seleccione lugar de la sede del centro' 
              }
            ]}
            >
              <Select 
              placeholder="Selecciona una sede" onSelect={(value,body)=>{getAllAcademicUnit(value,body)}}
              >
              {
                Object.keys(listCampus).map((i,key)=>{
                  return <Option value={listCampus[key].id  } key={listCampus[key].id}>{listCampus[key].name}</Option>
                })
              }
              </Select>
            </Form.Item>
            <Form.Item 
            label="Unidad academica"
            name="academicUnitId"
            rules={[
              {
                required: true,
                message: 'Seleccione la unidad academica a la que pertenece' 
              }
            ]}
            >
              <Select
              placeholder="Selecciona una unidad academica " onSelect={(a,b)=>{console.log("a",a,"b",b)}}
              >
                {
                Object.keys(listAcademicUnit).map((i,key)=>{
                  return <Option value={listAcademicUnit[key].id} key={listAcademicUnit[key].id}>{listAcademicUnit[key].name}</Option>
                })
                }
              </Select>
            </Form.Item>
            <Form.Item
            name="coordinatorId"
            label="Coordinador"
            rules={[
              {
                required: true,
                message: 'Asigne a un coordinador para el centro' 
              }]}
            >
              <Select 
              placeholder="Selecciona un coordinador"
              >
              {
                Object.keys(listCoordinators).map((i,key)=>{
                  return <Option value={listCoordinators[key].id  } key={listCoordinators[key].id}>{listCoordinators[key].firstName+" "+listCoordinators[key].lastName}</Option>
                })
              }
              </Select>
            </Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{
                float:"right",
                marginTop: 16,
                }}
                >
              {centerId? "Actualizar centro":"Registrar centro"}
            </Button>
          </Form>
        </div>
      </>
    )
}
