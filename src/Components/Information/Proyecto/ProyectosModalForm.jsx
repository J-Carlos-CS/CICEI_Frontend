import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import Proyecto from "../../../services/Proyecto.service";
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
export default function ProyectosModalForm({ isModalVisible, handleOk, handleCancel, proyectoTarget = null }) {
  const [form] = Form.useForm();
  const [formField, setformField] = useState(null);

  useEffect(() => {
    if (proyectoTarget) {
      setformField([{ name: ["proyecto"], value: proyectoTarget.proyecto }]);
    }
  }, [proyectoTarget]);

  const onFinish = (values) => {
    let proyectoR = { ...values };
    //console.log("values", values);
    if (proyectoTarget) {
      proyectoR.id = proyectoTarget.id;
      console.log(proyectoR);
      Proyecto.updateProyecto(proyectoR.id, proyectoR)
        .then((res) => {
          if (res.data?.success) {
            message.success("Proyecto actualizada.", 3);
            handleOk();
          } else {
            message.error("No se pudo actualizar la Proyecto. " + res.data?.description, 5);
          }
        })
        .catch((e) => {
          console.log("error", e.message);
          message.error("Hubo un error. " + e.message, 5);
        });
    } else {
      Proyecto.createProyecto(proyectoR)
        .then((res) => {
          if (res.data?.success) {
            message.success("Proyecto registrada.", 3);
            handleOk();
          } else {
            message.error("No se pudo registar la proyecto. " + res.data?.description, 5);
          }
        })
        .catch((e) => {
          console.log("error", e.message);
          message.error("Hubo un error. " + e.message);
        });
    }
  };
  return (
    <Modal title="Registrar Proyecto" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={1000} footer={null}>
      <Form className="form" {...formItemLayout} form={form} fields={formField} name="register" onFinish={onFinish} scrollToFirstError>
        <Form.Item
          name="proyecto"
          label="Nombre de la Proyecto"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el nombre de la proyecto.",
              whitespace: true,
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Aceptar
          </Button>
          <Button
            type="secondary"
            htmlType="button"
            onClick={() => {
              handleCancel();
            }}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
