import { useState } from "react";
import { Modal, Form, Select, Button, InputNumber, message } from "antd";
import ActivityService from "./../../../../services/ActivityService";

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
export default function ChangeProgressModal({
  isModalVisible,
  handleOk,
  handleCancel,
  activityTarget = null,
}) {
  const [form] = Form.useForm();
  const [formField, setformField] = useState([
    {
      name: ["progressId"],
      value: activityTarget?.Progress?.stateProgress || "Pendiente",
    },
    {
      name: ["progress"],
      value: activityTarget?.progress || 0,
    },
  ]);

  const onFinish = (values) => {
    let activity = {
      id: activityTarget.id,
      progressId: values.progressId,
      progress: values.progress,
    };
    message.loading({ content: "Actualizando...", key: "updatable" });
     ActivityService.changeActivityProgress(activity)
      .then((res) => {
        if (res.data?.success) {
          message.success("Progreso editado", 3);
          handleOk();
        } else {
          message.error({ content: "No se pudo editar el progreso", key: "updatable",duration:4 });
        }
      })
      .catch((e) => {
        console.log("Error", e.message);
        message.error({ content: "Hubo un error. " + e.message, key: "updatable",duration:4 });
      });
  };

  const onChangeStateProgress = (e) => {
    if (e === "Terminado") {
      setformField([
        {
          name: ["progress"],
          value: 100,
        },
      ]);
    }
    if (e === "Pendiente") {
      setformField([{ name: ["progress"], value: 0 }]);
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
          name="progressId"
          label="Estado del Progreso"
          rules={[
            {
              required: true,
              message: "Por favor seleccione estado de progreso del trabajo.",
            },
          ]}
        >
          <Select onChange={onChangeStateProgress}>
            <Select.Option key={"Pendiente"} value={"Pendiente"}>
              Pendiente
            </Select.Option>
            <Select.Option key={"En progreso"} value={"En progreso"}>
              En progreso
            </Select.Option>
            <Select.Option key={"Terminado"} value={"Terminado"}>
              Terminado
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="progress"
          label="Avance"
          rules={[
            {
              required: true,
              message:
                "Por favor ingrese el valor del porcentaje de avance del trabajo.",
            },
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace("%", "")}
          />
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
