import { useEffect, useState } from "react"
import "./CenterCoordinator.css"
import { Row,Layout, Descriptions,Image,Card } from "antd"
import ImagePerfil from "../../../Assets/ImagePerfil.jpg"
import LogoUcatolica from "../../../Assets/LogoUcatolica.jpg"



const {Meta} = Card;
const colorBackgroundCard="#4682B4" //"#164865"

export default function CenterCoordinator(params){
    const [centerBody,setCenterBody]=useState([]);
    const [coordinatorCenterRol,setCoordinatorCenterRol]=useState([]);
    const [coordinatorCenter,setCoordinatorCenter]=useState([]);
    //const imageBackground="https://upload.wikimedia.org/wikipedia/commons/1/1f/Ucatolica2.jpg";
    //const imagePerfil="https://i.pinimg.com/originals/49/c8/e4/49c8e403cd1929e9e7b02126824ff831.jpg";
    const imageBackground=LogoUcatolica;
    const imagePerfil=ImagePerfil;

    useEffect(()=>{
        {console.log("props send",params)}
        setAllUseState()
    },[{}])

    const setAllUseState=()=>{
        setCenterBody(params?.body);
        setCoordinatorCenterRol(params?.body?.SystemRol);
        setCoordinatorCenter(params?.body?.User);
    }

    const convertDateToOnlyDate=(date)=> {
        if(date==="null"){
            const newDate=new Date(date);
            const year=newDate.getFullYear();
            const month=newDate.getMonth();
            const day=newDate.getDay();
            /*month=month<10? "0"+month: month
            day=day<10? "0"+day:day
            console.log(year,month,day)*/
            return newDate.toLocaleDateString();
        }
        else{
            return date;
        }
    }
    function convertDateToTime(date) {
        const newDate=new Date(date);
        return newDate.toLocaleTimeString();
    }
    

    function DataConstructorViewWithParams() {
        return( 
                <Card
                style={{backgroundColor:"transparent"}}
                >
                    <div style={{display:"grid", position:"relative"}}>
                        <Image className="ImageBackgroundCard" src={imageBackground}></Image>
                        <Image className="ImagePerfilCoordinator" src={imagePerfil} style={{visibility:"visible "}}></Image>
                    </div>
                    <Meta align="center" className="titleCard" title={centerBody.name}/>
                    <Descriptions
                    bordered
                    >
                        {Object.keys(params.body).map((key,i)=>{
                            return <Descriptions.Item key={key} label={key} span={4}>{params.body[key]}</Descriptions.Item>   
                        })
                        }
                    </Descriptions>
                </Card>
        );
    }
    function DataConstructorView() {
        return( 
                <Card
                style={{backgroundColor:colorBackgroundCard}}
                >
                    <div style={{display:"grid", position:"relative"}}>
                        <Image className="ImageBackgroundCard" src={imageBackground}></Image>
                        <Image className="ImagePerfilCoordinator" src={imagePerfil} style={{visibility:"visible "}}></Image>
                        <Meta className="titleCard" title={centerBody.name}/>
                    </div>
                    <Descriptions
                    bordered
                    >
                        {console.log(coordinatorCenter)}
                    <Descriptions.Item label="Nombres" span={3} >{coordinatorCenter?.firstName} </Descriptions.Item >
                    <Descriptions.Item label="Apellidos" span={3}>{coordinatorCenter?.lastName}</Descriptions.Item>
                    <Descriptions.Item label="Rol" span={3}>{coordinatorCenterRol?.name}</Descriptions.Item>
                    <Descriptions.Item label="Correo electornico" span={3}>{coordinatorCenter?.email}</Descriptions.Item>
                    <Descriptions.Item label="Fecha de nacimiento"span={2}>{convertDateToOnlyDate(centerBody?.birthDate)}</Descriptions.Item>
                    <Descriptions.Item label="Numero de celular"span={2}>{coordinatorCenter?.cellPhone}</Descriptions.Item>
                    <Descriptions.Item label="Fecha de creacion"span={2}>{convertDateToOnlyDate(coordinatorCenter?.createdAt)}</Descriptions.Item>
                    <Descriptions.Item label="Hora de creacion"span={1}>{convertDateToTime(coordinatorCenter?.createdAt)}</Descriptions.Item>
                    <Descriptions.Item label="Fecha de actualización"span={2}>{convertDateToOnlyDate(coordinatorCenter?.updatedAt)}</Descriptions.Item>
                    <Descriptions.Item label="Hora de actualización"span={1}>{convertDateToTime(coordinatorCenter?.createdAt)}</Descriptions.Item>
                    </Descriptions>
                </Card>
        );
    }

    return(
        <>
        <div style={{background:"gray", borderColor:"violet", wordWrap:"break-word"}}>
            {DataConstructorView()}
        </div>
        </>
    )

}