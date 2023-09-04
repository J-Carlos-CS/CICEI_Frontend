import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Input,
  message,
  InputNumber,
} from "antd";

import ContactService from '../../../services/ContactService.js';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
    md: {
      span: 9,
    },
    lg: {
      span: 10,
    },
    xl: {
      span: 10,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
    md: {
      span: 15,
    },
    lg: {
      span: 14,
    },
    xl: {
      span: 14,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function ContactForm({
  isModalVisible,
  handleOk,
  handleCancel,
  contact=null,
}) {
  const [form] = Form.useForm();
  const [formField, setformField] = useState(null);

  useEffect(() => {
    //console.log('Contact',contact);
    setformField([
      {
        name: ["ubication"],
        value: contact?.ubication,
      },
      {
        name: ["phoneNumberOne"],
        value: {code: parseInt(contact?.phone?.split("///")[0].split(" ")[0]),number:parseInt(contact?.phone?.split("///")[0].split(" ")[1])},
      },
      {
        name: ["phoneNumberTwo"],
        value: {code: parseInt(contact?.phone?.split("///")[1].split(" ")[0]),number:parseInt(contact?.phone?.split("///")[1].split(" ")[1])}
      },
      {
        name: ["secondEmail"],
        value: contact?.email,
      },
    ]);
  }, [contact]);

  const onFinish = (values) => {
    //console.log("valiues", values);
    let newContact = {
      id:contact.id,
      ubication: values.ubication ? values.ubication.toUpperCase() : null,
      phoneNumberOne:
        values.phoneNumberOne.code && values.phoneNumberOne.number
          ? `+${values.phoneNumberOne.code} ${values.phoneNumberOne.number}`
          : null,
      phoneNumberTwo:
        values.phoneNumberTwo.code && values.phoneNumberTwo.number
          ? `+${values.phoneNumberTwo.code} ${values.phoneNumberTwo.number}`
          : null,
      secondEmail: values.secondEmail || null,
    };
    //console.log(newContact);
    ContactService.updateContact(newContact)
    .then(res=>{
      if(res.data?.success){
        message.success("Contacto editado.",4);
        handleOk();
      } else {
        message.error(res.data?.description,5);
      }
    })
    .catch(e=>{
      console.log('error',e.message);
      message.error("Hubo un error. "+e.message,5);
    })
  };

 

  return (
    <Modal
      title="Editar información de contacto"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      footer={null}
    >
      <Form
        className="form"
        {...formItemLayout}
        form={form}
        fields={formField}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          label="País"
          name="ubication"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el nombre de tu pais.",
              whitespace: true,
            },
          ]}
        >
          <Input placeholder="Eg. Bolivia" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="secondEmail"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el email como dirección de contacto.",
              whitespace: true,
            },
          ]}
        >
          <Input placeholder="Eg. cicei.cicei@gmail.com" />
        </Form.Item>

        <Form.Item label="Número de contacto">
          <Input.Group compact>
            <Form.Item
              name={["phoneNumberOne", "code"]}
              noStyle
              rules={[
                {
                  required: false,
                  message: "Prefijo numerico del Pais requerido",
                },
              ]}
            >
              <InputNumber style={{ width: "20%" }} placeholder="Eg. +591" />
            </Form.Item>
            <Form.Item
              name={["phoneNumberOne", "number"]}
              noStyle
              rules={[{ required: false, message: "Province is required" }]}
            >
              <InputNumber style={{ width: "30%" }} placeholder="Eg. 7654321" />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item label="Número de contacto">
          <Input.Group compact>
            <Form.Item
              name={["phoneNumberTwo", "code"]}
              noStyle
              rules={[{ required: false, message: "Province is required" }]}
            >
              <InputNumber style={{ width: "20%" }} placeholder="Eg. +591" />
            </Form.Item>
            <Form.Item
              name={["phoneNumberTwo", "number"]}
              noStyle
              rules={[{ required: false, message: "Province is required" }]}
            >
              <InputNumber style={{ width: "30%" }} placeholder="Eg. 7654321" />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Actualizar
          </Button>
          <Button
            type="secondary"
            htmlType="button"
            onClick={() => {
              handleCancel();
            }}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
