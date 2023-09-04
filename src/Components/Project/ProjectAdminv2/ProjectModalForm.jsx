import { useState, useEffect, useCallback } from "react";
import { Modal, Form, Button, Input, DatePicker, message, Select } from "antd";
import UserService from "../../../services/UserService.js";
import moment from "moment";
const { RangePicker } = DatePicker;
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
export default function ProjectModalForm({
  isModalVisible = false,
  handleOk,
  handleCancel,
  title = "",
  description = "",
  startDate = null,
  endDate = null,
  id,
  ProjectService,
  userMainId,
  groupLeaderId,
  userSesion,
}) {
  const [form] = Form.useForm();
  const [formField, setformField] = useState(null);
  const dateFormat = "YYYY/MM/DD";
  const [requesting, setRequesting] = useState(false);
  const [leaders, setLeaders] = useState([]);

  const setFields = useCallback(() => {
    setformField([
      { name: ["title"], value: title },
      { name: ["description"], value: description },
      {
        name: ["rangeDate"],
        value: [moment(startDate, dateFormat), moment(endDate, dateFormat)],
      },
      { name: ["userMainId"], value: userMainId },
    ]);
  }, [title, description, startDate, endDate, userMainId]);
  useEffect(() => {
    setFields();
    UserService.getLeaders()
      .then((res) => {
        if (res?.data?.success) {
          console.log("respins", res.data.response);
          setLeaders(
            res.data?.response?.filter(
              (leader) =>
                leader?.SystemRol?.name === "CICEI" ||
                leader?.SystemRol?.name === "Asociado"
            )
          );
        } else {
          message.error(
            "No se pudo obtener la lista de encargados. " +
              res.data?.description,
            5
          );
        }
      })
      .catch((e) => {
        console.log("error. " + e.message);
        message.error("Hubo un error. " + e.messagem, 5);
      });
  }, [setFields]);

  const onFinish = (values) => {
    setRequesting(true);
    let project = {
      id: id,
      title: values.title || "",
      description: values.description || "",
      /* startDate: new Date(values.rangeDate[0]._d),
      endDate: new Date(values.rangeDate[1]._d), */
      startDate: moment(values.rangeDate[0]._d).set({
        hour: 0,
        minute: 0,
        seconds: 0,
      })._d,
      endDate: moment(values.rangeDate[1]._d).set({
        hour: 0,
        minute: 0,
        seconds: 0,
      })._d,
      userMainId: values.userMainId || null,
    };
    //console.log('project',project);
    ProjectService.upadteProject(project)
      .then((res) => {
        if (res.data?.success) {
          message.success("Proyecto actualizado.", 4);
          handleOk();
        } else {
          setRequesting(false);
          message.error(res.data?.description, 5);
        }
      })
      .catch((e) => {
        setRequesting(false);
        console.log(e.message);
        message.error("Hubo un error. " + e.message, 5);
      });
  };
  return (
    <Modal
      title="Editar Proyecto"
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
          name="title"
          label="Título del proyecto"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el título del proyecto.",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descripción"
          rules={[
            {
              required: true,
              message: "Por favor describa el proyecto.",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="rangeDate"
          label="Fecha Inicio y Final"
          rules={[
            {
              type: "array",
              required: true,
              message:
                "Por favor selecciona la fecha de inicio y final del proyecto.",
            },
          ]}
        >
          <RangePicker />
        </Form.Item>
        {userSesion?.id === groupLeaderId ||
        userSesion?.rolName === "Administrador" ? (
          <>
            <Form.Item
              label="Encargado"
              name="userMainId"
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona un encargado!",
                },
              ]}
            >
              <Select
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.children[1]
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                placeholder="Selecciona un encargado"
              >
                {leaders.map((li) => {
                  return (
                    <Select.Option key={li.id} value={li.id}>
                      {" "}
                      {`${
                        li.firstName +
                        " " +
                        li.lastName +
                        " - " +
                        li.SystemRol?.name
                      }`}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </>
        ) : null}
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" disabled={requesting}>
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
