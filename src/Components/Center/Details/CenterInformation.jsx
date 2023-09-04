import {Link} from "react-router-dom"
import LineService from "../../../services/LineService";
import {Typography, Collapse,Divider,Anchor} from "antd"
import { useState, useMemo, useEffect, useCallback } from "react";

const{Text}= Typography;
const {Panel}=Collapse;


function callback(key) {
  console.log(key);
}

export default function CenterInformation(params){
  const [centerData,setCenterData]=useState([])
  const [centerDataLines,setCenterDataLines]=useState([])


  const getLinesByCenterId=useCallback(()=>{
    LineService.getLinesOwenByCenter(params.body.id).then((res)=>{
      setCenterDataLines(res.data.response.rows);
    })
  })
  useEffect(()=>{
    setCenterData(params.body.CenterDatum);
    getLinesByCenterId();
  },[])
  return (
    <>
    <Collapse onChange={callback}>
    <Panel header="Campo de Acción del Centro" key="1">
      <p>{centerData.action}</p>
    </Panel>
    <Panel header="Objetivo del Centro" key="2">
      <p>{centerData.objetive}</p>
    </Panel>
    <Panel header="Líneas de Investigación del Centro" key="3">
      <ul style={{padding:20}}>
      {centerDataLines.map((res)=>{
        return <li>{res.name}</li>
      })}
      </ul>
    </Panel>
  </Collapse>
    </>
  )
} 