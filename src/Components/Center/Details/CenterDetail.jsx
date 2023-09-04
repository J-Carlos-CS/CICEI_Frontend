import { Menu, Space,Row,Col,Empty,Layout, Descriptions,Image} from "antd"
import { useCallback, useEffect, useMemo, useState } from "react";
import CenterData from "./CenterData.jsx";
import "./CenterDetail.css" 
import { Route,useHistory,useParams } from "react-router-dom";
import CenterService from "./../../../services/CenterService"
import CenterCoordinator from "./CenterCoordinator";
import CenterListInvestigators from "./CenterListInvestigators.jsx";
import CenterListProyects  from "./CenterListProyects.jsx";
import { BorderInnerOutlined } from "@ant-design/icons";
import CenterInformation from "./CenterInformation.jsx";
import CenterStadistics from "./CenterStadistics.jsx"

const {SubMenu}=Menu;
const { Header, Content, Footer, Sider } = Layout;

const keyPermitedForDataCenter=[
    {
        name:"Nombre",
        key: "name"
    },
    {
        name:"Siglas",
        key: "acronym"
    },
    {
        name:"Siglas",
        key: "acronym"
    },
    {
        name:"Siglas",
        key: "acronym"
    },
    {
        name:"Siglas",
        key: "acronym"
    },
];
  
export default function CenterDetail() {
    const history=useHistory();
    const params=useParams();
    const centerId=params.id;
    const [selectedMenuItem,setSelectedMenuItem]=useState("dataCenter")
    const [center,setCenter]=useState([]);

    const colorBackground= "#4682B4"//"#6495ED" //"#164865"
    
    
    const getCenter=useCallback(()=>{
        CenterService.getCenterById(centerId).then((res)=>{
            const response=res.data.response;
            setCenter(response)
        })
    });

    useEffect(()=>{
        getCenter();
    },[])

    
    const getCoordinator=useCallback(()=>{
    });

    const dataCoordinator=()=>{
        return (<Descriptions title={center.name} bordered>
            {Object.keys(center).map((key,i)=>(
                <Descriptions.Item label={key}>{center[key]}</Descriptions.Item>
            ))
            }
        </Descriptions>)
    }
    

    const centerData= ()=>{
        return (
            <div className="DescriptionDataGeneral" style={{display:"flex",flexDirection:"column",flexWrap:10}}>
                <Image className="LogoBackgroundDataGeneral" width={300} src="https://pm1.aminoapps.com/7728/8dea2e339f23595b7bf01748279bd5977b198801r1-1017-786v2_uhq.jpg"/>
                <Row>
                    as
                </Row>
        <Descriptions 
            title={center.name}
            bordered
            column={{
                xxl: 4,
                xl: 3,
                lg: 3,
                md: 3,
                sm: 2,
                xs: 1,
              }}
              >
            <Descriptions.Item label="Nombre" span={2} >{center.name} </Descriptions.Item >
            <Descriptions.Item label="Sede academica" span={2}>{center.campus}</Descriptions.Item>
            <Descriptions.Item label="Unidad academica" span={2}>{center.academicUnit}</Descriptions.Item>
            <Descriptions.Item label="Fecha de creacion de cartilla"span={2}>{center.createdAt}</Descriptions.Item>
            <Descriptions.Item label="Fecha de actualización de la cartilla"span={2}>{center.updatedAt}</Descriptions.Item>
        </Descriptions>
            </div>
            
        );
    }


    const switChOptionsMenu=(key)=>{
        switch(key){
            case "dataCenter":
                return <CenterData body={center}/>
            break;
            case"dataCoordinator":  
                return <CenterCoordinator body={center}/>
            break;
            case"dataMisionAndVision":
                return <CenterInformation body={center}/>
            break;
            case"listInvestigators":
                return <CenterListInvestigators body={center}/>
            break;
            case"listProjects":
            return <CenterListProyects body={center} />
            break;
            case"dataStadistic":
                return <CenterStadistics body={center}/>
            break;

        }
    }

    return(
    <>
    <Layout style={{margin:30, gap:15}} >
        <Sider 
        breakpoint="lg"
        style={{backgroundColor:"transparent"}}
        >
            <Menu 
            mode="inline"
            onClick={(e)=>{setSelectedMenuItem(e.key)}}
            defaultSelectedKeys={["dataCenter"]}
            defaultOpenKeys={["List"]}
            className="ContainerOfMenuOptions">   
                            <Menu.Item key={"dataCenter"}>
                                    Datos generales
                                </Menu.Item>
                                <Menu.Item key={"dataCoordinator"}>
                                    Coordinador encargado
                                </Menu.Item>
                                <Menu.Item key={"dataMisionAndVision"}>
                                    Objetivos del centro
                                </Menu.Item>
                                <SubMenu
                                title="Lista"
                                key={"List"}
                                >
                                    <Menu.Item key={"listInvestigators"}> 
                                        Investigadores
                                    </Menu.Item>
                                    <Menu.Item key={"listProjects"}> 
                                        Proyectos
                                    </Menu.Item>
                                </SubMenu>
                                <Menu.Item key={"dataStadistic"}>
                                    Estadisticas
                                </Menu.Item>
                            </Menu>
        </Sider>
            <Layout>
            <Content className="ContainerOfMenuOptions"  style={{backgroundColor: colorBackground}}>
                    {switChOptionsMenu(selectedMenuItem)}
            </Content>
            </Layout>
    </Layout>
    </>
    )   
}