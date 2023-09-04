import { Row,List,Space , Divider,Col, Typography,message} from "antd"
import { useCallback, useEffect, useState } from "react"
import VirtualList from 'rc-virtual-list';
import { useSelector } from "react-redux"
import {selectCenterInformation} from "../../../Auth/centerInformationReducer"
import linesServices from "./../../../services/LineService"
import lineProjectService from "./../../../services/LineProjectService"
import "./CenterListProjects.css"


const {Title}=Typography

const ContainerHeight = 400;

export default function CenterListProyects(params) {
    const center= useSelector(selectCenterInformation).centerInformation;
    const data=[{
          title:'Ant Design Title 1'},
          {title:'Ant Design Title 2'},
    ]
    const [selectCenter,setSelectCenter]=useState([])
    const [listLines,setListLines]=useState([])
    const [listProjects,setListProjects]=useState([])
    
    const getSelectCenter=()=>{
        setSelectCenter(params.body)
    }
    const getListLines=useCallback((centerId)=>{
        linesServices.getAllLinesByCenter(centerId).then((res)=>{
            let ListLines=res.data.response;
            setListLines(listLines.concat(ListLines));
            message.success(`Se tiene ${ListLines.length} lineas`);
        })
    })

    const getListProjects=useCallback((lineId)=>{
        lineProjectService.getListProjectsByLine(lineId).then((res)=>{
            let ListProjects=res.data.response;
            setListProjects(ListProjects);
            message.success(`Se tiene ${ListProjects.length} proyectos`);
        })
    })



    useEffect(()=>{
        getSelectCenter();
        getListLines(selectCenter?.id)
    },[selectCenter])

    return (<>
    <Row style={{background:"gray", opacity: 0.6, borderRadius:10}}> 
            <Col span={12}>
                <Title level={4} style={{textAlign:"center"}}>Lineas</Title>
            </Col>
            <Col span={12}>
                <Title level={4} style={{textAlign:"center"}}>Proyectos</Title>
            </Col>
    </Row>
    <Row > 
        <Col span={12}>
            <List>
                <VirtualList
                    data={listLines}
                    height={ContainerHeight}
                    itemHeight={7}
                    itemKey="id"
                    style={{marginLeft:10}} 
                >
                    {(item) => (
                    <List.Item key={item.id} onClick={()=>{getListProjects(item.id)}}>
                        <List.Item.Meta title={<a>{item.code+"-"+item.name}</a>}
                        />
                    </List.Item>
                    )}
                </VirtualList>
            </List>
        </Col>
        <Col span={12}>
            <List>
                <VirtualList
                    data={listProjects}
                    height={ContainerHeight}
                    itemHeight={7}
                    itemKey="id"
                    style={{marginLeft:10}}
                >
                    {(item) => (
                    <List.Item key={item?.id}>
                        <List.Item.Meta title={<a>{item?.Project?.code+"-"+item?.Project?.title}</a>}
                        />
                    </List.Item>
                    )}
                </VirtualList>
            </List>
        </Col>
    </Row>
    </>)
}
