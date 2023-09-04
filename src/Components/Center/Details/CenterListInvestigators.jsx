import { useState,useEffect, useCallback } from "react";
import {Table,Typography} from "antd";
import UserService from "../../../services/UserService";
import { selectUser } from "../../../Auth/userReducer";
import { useHistory, NavLink, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const {Text}= Typography



export default function CenterListInvestigators(params) {
    const user = useSelector(selectUser);
    const [listUser,setListUser]=useState([])

    const getUsersByCenter=useCallback(()=> {
        UserService.getAllUsersByCenter(params.body.id)
        .then((res)=>{
            const listUsers=res?.data?.response
            setListUser(listUsers)
        }) 
    });


    useEffect(()=>{
        getUsersByCenter()
    },[])

    const columns=[
        {
            title:'Nombre completo',
            dataIndex:'id',
            key:'id',
            render:(i,record)=>{
                const rowName=record?.firstName+" "+record?.lastName;
                return <Text  style={ {
                    width: "100%" ,
                  }}
                  ellipsis={{tooltip: {rowName}}}>
                    {rowName}
                  </Text>

            }
        },
        {
            title:'Rol asignado',
            dataIndex:'systemRolId',
            key:'systemRolId',
            render:(i,record)=>{
                const rowSystemRol=record?.SystemRol?.name
                return <Text  style={ {
                    width: "100%" ,
                  }}
                  ellipsis={{tooltip: {rowSystemRol}}}>
                    {rowSystemRol}
                  </Text>
            }
        },
        {
            title:'Numero de celular',
            dataIndex:'cellPhone',
            key:'cellPhone',
        },
        {
            title:'Correo electronico',
            dataIndex:'email',
            key:'email',
        },
        
    ]
    return (
        <>
        <Table
        columns={columns}
        rowKey="id"
        dataSource={listUser}>
        </Table>
        </>
    )
    
}