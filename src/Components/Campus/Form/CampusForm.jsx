import { Form,Modal,Input, theme  } from "antd";
import CampusService from "../../../services/CampusService";
import { useState } from "react";
import { useEffect } from "react";

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

export default function CampusForm(props) {
    const { visible, Option, ShowCreateModal,hideCreateModal, updatedTable,CampusTarget } = props;
    const createCampus= ()=>{
        form.validateFields().then(
            val=>{
                form.resetFields();
                console.log("val",val);   
                CampusService.createCampus(val).then((res)=>{
                    console.log("Create",res)
                });
                updatedTable(true);
                hideCreateModal(false);
            })
    }

    useEffect(()=>{
        //console.log("CampusTargetInto",CampusTarget)
        form.setFieldsValue(Option? form.resetFields() : CampusTarget)
        //console.log("Option",Option)
    },[CampusTarget,ShowCreateModal,Option])

    const handleOnOK=()=>{
        if(Option){
            createCampus()
        }else{
            updateCampus()
        }
    }


    const updateCampus=()=>{
        console.log(CampusTarget)
        console.log(form.getFieldsValue())
        form.validateFields().then(
            val=>{
                form.resetFields();
                console.log("val",val);   
                CampusService.updateCampus(CampusTarget.id,val).then((res)=>{
                    console.log("update",res)
                });
                updatedTable(true);
                hideCreateModal(false);
            })
    }
    const [form]=Form.useForm();
    return (
        <Modal title={ Option? "Agregar nueva sede" : "Actualización de la sede" }
        open={visible}
        onOk={handleOnOK}
        onCancel={()=>{
            hideCreateModal(false)
            form.validateFields().then(
                val=>{
                    form.resetFields();
                })
        }}
        >
            <Form 
            form={form}
            name='formCampus'
            key={"id"}
            >
                <Form.Item 
                name="name"
                label="Ubicación de la sede"
                rules={[
                    {
                        required:true,
                        message:"Por Favor, ingrese lugar donde se ubica la sede",
                    }
                ]
                }>
                    <Input placeholder='Ej: La Paz,Cochabamba,etc'></Input>
                </Form.Item>
                <Form.Item 
                name='location'
                label=":ocalización de la sede"
                rules={[
                    {
                        required:true,
                        message:"Por Favor ingrese",
                    }
                ]
                }
                >
                    <Input placeholder='Codigo de la sede'></Input>
                </Form.Item>
                <Form.Item 
                name='code'
                label="Codigo de la sede"
                rules={[
                    {
                        required:true,
                        message:"Por Favor ingrese el codigo de la sede",
                    }
                ]
                }
                >
                    <Input placeholder='Codigo de la sede'></Input>
                </Form.Item>
            </Form>
        </Modal>
    )
    
}