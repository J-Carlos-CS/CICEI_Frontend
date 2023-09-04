import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Button, message } from "antd";
import PaymentConsultorService from "../../../../services/PaymentConsultorService";
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
export default function ConsultorPayment({
  isModalVisible,
  handleOk,
  handleCancel,
  userTarget = null,
  institutionProjectsList = [],
}) {
  let institutionList = institutionProjectsList
    .filter((ip) => ip.status)
    .map((ip) => ip.Institution);
  
  const [form] = Form.useForm();
  const [formField, setformField] = useState([]);

  useEffect(() => {
    if (userTarget?.PaymentConsultor) {
      setformField([{
        name: ["institutionId"],
        value: userTarget?.PaymentConsultor?.institutionId || 0,
      }]);
    }
  }, [userTarget]);

  const onCreate = (paymentR) => {
    PaymentConsultorService.registerPayment(paymentR)
      .then((res) => {
        if (res.data?.success) {
          message.success("Información registrada", 3);
          handleOk();
        } else {
          message.error({
            content: "No se pudo registrar la información",
            key: "updatable",
            duration: 4,
          });
        }
      })
      .catch((e) => {
        console.log("Error", e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "updatable",
          duration: 4,
        });
      });
  };

  const onUpdate = (paymentR) => {
    PaymentConsultorService.updatePayment(paymentR)
    .then((res) => {
      if (res.data?.success) {
        message.success("Información actualizada", 3);
        handleOk();
      } else {
        message.error({
          content: "No se pudo actualizar la información",
          key: "updatable",
          duration: 4,
        });
      }
    })
    .catch((e) => {
      console.log("Error", e.message);
      message.error({
        content: "Hubo un error. " + e.message,
        key: "updatable",
        duration: 4,
      });
    });
  };

  const onFinish = (values) => {
    let paymentR = {
      institutionId: values.institutionId || 0,
      userProjectId: userTarget?.id || 0,
      projectId: userTarget?.projectId || 0,
      userId: userTarget?.User?.id || 0,
    };
    
    message.loading({ content: "Actualizando...", key: "updatable" });
    
    if (!userTarget?.PaymentConsultor) {
      onCreate(paymentR);
    } else {
      paymentR.id = userTarget?.PaymentConsultor?.id || 0;
      onUpdate(paymentR);
    }
  };


  return (
    <Modal
      title={"Editar Prorgeso"}
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
          name="institutionId"
          label="Institución"
          rules={[
            {
              required: true,
              message: "Por favor seleccione una institución",
            },
          ]}
        >
          <Select>
            {institutionList.map((institution) => (
              <Select.Option key={institution.id} value={institution.id}>
                {institution.name || "Ninguna"}
              </Select.Option>
            ))}
          </Select>
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
            }}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
