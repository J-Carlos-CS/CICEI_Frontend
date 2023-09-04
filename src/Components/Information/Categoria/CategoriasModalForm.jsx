import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import Categoria from "../../../services/Categoria.service";
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
export default function CategoriasModalForm({ isModalVisible, handleOk, handleCancel, categoriaTarget = null }) {
  const [form] = Form.useForm();
  const [formField, setformField] = useState(null);

  useEffect(() => {
    if (categoriaTarget) {
      setformField([{ name: ["categoria"], value: categoriaTarget.categoria }]);
    }
  }, [categoriaTarget]);

  const onFinish = (values) => {
    let categoriaR = { ...values };
    //console.log("values", values);
    if (categoriaTarget) {
      categoriaR.id = categoriaTarget.id;
      console.log(categoriaR);
      Categoria.updateCategoria(categoriaR.id, categoriaR)
        .then((res) => {
          if (res.data?.success) {
            message.success("Categoria actualizada.", 3);
            handleOk();
          } else {
            message.error("No se pudo actualizar la Categoria. " + res.data?.description, 5);
          }
        })
        .catch((e) => {
          console.log("error", e.message);
          message.error("Hubo un error. " + e.message, 5);
        });
    } else {
      Categoria.createCategoria(categoriaR)
        .then((res) => {
          if (res.data?.success) {
            message.success("Categoria registrada.", 3);
            handleOk();
          } else {
            message.error("No se pudo registar la categoria. " + res.data?.description, 5);
          }
        })
        .catch((e) => {
          console.log("error", e.message);
          message.error("Hubo un error. " + e.message);
        });
    }
  };
  return (
    <Modal title="Registrar Categoria" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={1000} footer={null}>
      <Form className="form" {...formItemLayout} form={form} fields={formField} name="register" onFinish={onFinish} scrollToFirstError>
        <Form.Item
          name="categoria"
          label="Nombre de la Categoria"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el nombre de la categoria.",
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
