import { useEffect, useMemo, useState } from "react";
import {Card,Descriptions,Image,Space} from "antd"
import ImagePerfil from "../../../Assets/ImagePerfil.jpg"
import LogoUcatolica from "../../../Assets/LogoUcatolica.jpg"

const{Meta}=Card;


export default function CenterData(params) {
    const imageBackground=LogoUcatolica;
    const imagePerfil=ImagePerfil;
    //const imageBackground="https://upload.wikimedia.org/wikipedia/commons/1/1f/Ucatolica2.jpg";
    //const imagePerfil="https://i.pinimg.com/originals/49/c8/e4/49c8e403cd1929e9e7b02126824ff831.jpg";
    

    const colorBackgroundCard="#164865"
    const [centerData,setCenterData]=useState({})
    const [CenterAcademicUnit,setCenterAcademicUnit]=useState({})
    const [centerCampus,setCenterCampus]=useState({})

    useEffect(()=>{
        setCenterData(params.body);
        setCenterCampus(centerData.Campus);
        setCenterAcademicUnit(centerData.AcademicUnit);    
    },[{}])
    
    const convertDateToOnlyDate=(date)=> {
        const newDate=new Date(date);
        const year=newDate.getFullYear();
        const month=newDate.getMonth();
        const day=newDate.getDay();
        /*month=month<10? "0"+month: month
        day=day<10? "0"+day:day
        console.log(year,month,day)*/
        return newDate.toLocaleDateString();
    }
    function convertDateToTime(date) {
        const newDate=new Date(date);
        return newDate.toLocaleTimeString();
    }

    return(
        <>
        <Card 
        style={{backgroundColor: "transparent"}}
        >
            <div style={{display:"grid", position:"relative"}}>
                        <Image className="ImageBackgroundCard" src={imageBackground}></Image>
                        <Image className="ImagePerfilCoordinator" src={imagePerfil} style={{visibility:"hidden"}}></Image>
                        <Meta className="titleCard" title={centerData.name}/>
                    </div>
            <Descriptions
            bordered
            >

                    <Descriptions.Item label="Nombre" span={3} >{centerData?.name} </Descriptions.Item >
                    <Descriptions.Item label="Sede academica" span={3}>{centerCampus?.name}</Descriptions.Item>
                    <Descriptions.Item label="Unidad academica" span={3}>{CenterAcademicUnit?.name}</Descriptions.Item>
                    <Descriptions.Item label="Fecha de creacion"span={2}>{convertDateToOnlyDate(centerData?.createdAt)}</Descriptions.Item>
                    <Descriptions.Item label="Hora de creacion"span={1}>{convertDateToTime(centerData?.createdAt)}</Descriptions.Item>
                    <Descriptions.Item label="Fecha de actualización"span={2}>{convertDateToOnlyDate(centerData?.updatedAt)}</Descriptions.Item>
                    <Descriptions.Item label="Hora de actualización"span={1}>{convertDateToTime(centerData?.createdAt)}</Descriptions.Item>
            </Descriptions>
        </Card>
        </>
    )
}