import { useRef } from "react";
import { Modal, Form, Select, Button, InputNumber, message } from "antd";
import ProductService from "../../../../services/ProductService";

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
  productTarget = null,
}) {
  const [form] = Form.useForm();
  const {current:formField} = useRef([
    {
      name: ["progressId"],
      value: productTarget?.Progress?.stateProgress || "Pendiente",
    },
    {
      name: ["progress"],
      value: productTarget?.progress || 0,
    },
  ]);
  //const [formField, setformField] = useState();

  const onFinish = (values) => {
    let product = {
      id: productTarget.id,
      nameProgressId: values.progressId,
      progress: values.progress,
    };
    message.loading({ content: "Actualizando...", key: "update" });
    ProductService.changeProgress(product)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Progreso editado", 3);
          await handleOk();
          message.success({
            content: "Actualizado",
            key: "update",
            duration: 3,
          });
        } else {
          message.error({
            content: "No se pudo editar el progreso",
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        console.log("Error", e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
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
          <Select>
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
