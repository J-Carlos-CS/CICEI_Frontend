import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Button, Input, DatePicker, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import EventService from "../../services/EventService";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
const { confirm } = Modal;
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
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
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
    md: { span: 16, offset: 8 },
    lg: { span: 16, offset: 8 },
    xl: { span: 16, offset: 8 },
  },
};
export default function EventForm({ eventSelected = null, onCloseModal }) {
  const [form] = Form.useForm();
  const [textNew, setTextNew] = useState({ text: "" });
  const [formFields, setFormFields] = useState([]);

  const onFinish = async (values) => {
    if (!textNew.text) {
      message.warning("El evento no tiene contenido.");
    } else {
      if (!eventSelected) {
        try {
          let newEvent = {
            startDate: values.startDate._d,
            endDate: values.endDate._d,
            title: values.title,
            shortTitle: values.shortTitle,
            description: textNew.text,
          };
          let {
            data: { success, description },
          } = await EventService.registerEvent(newEvent);
          if (success) {
            message.success({
              content: "Evento registrado.",
              key: "create",
              duration: 4,
            });
            onCloseModal({ state: "success" });
          } else {
            message.error({
              content: "No se pudo registrar. " + description,
              key: "create",
              duration: 4,
            });
          }
        } catch (error) {
          message.error({
            content: "Error. " + error.message,
            duration: 5,
            key: "create",
          });
        }
      } else {
        try {
          let editEvent = {
            id: eventSelected.id,
            startDate: values.startDate._d,
            endDate: values.endDate._d,
            title: values.title,
            shortTitle: values.shortTitle,
            description: textNew.text,
          };
          let {
            data: { success, description },
          } = await EventService.updateEvent(editEvent);
          if (success) {
            message.success({
              content: "Evento editado",
              duration: 3,
              key: "edit",
            });
            onCloseModal({ state: "success" });
          } else {
            message.error({
              content: "Error al editar el evento. " + description,
              duration: 3,
              key: "edit",
            });
          }
        } catch (error) {
          message.error({
            content: "Error. " + error.message,
            duration: 5,
            key: "create",
          });
        }
      }
    }
  };
  const onChangeText = (value) => {
    setTextNew({ text: value });
  };

  const getFormFields = useCallback((event) => {
    setFormFields([
      {
        name: "title",
        value: event?.title,
      },
      {
        name: "shortTitle",
        value: event?.shortTitle,
      },
      {
        name: "startDate",
        value: moment(event?.startDate),
      },
      {
        name: "endDate",
        value: moment(event?.endDate),
      },
    ]);
    setTextNew({ text: event?.description });
  }, []);

  useEffect(() => {
    if (eventSelected) {
      getFormFields(eventSelected);
    }
  }, [getFormFields, eventSelected]);

  const onDeleteEvent = async () => {
    try {
      const eventToDelete = {
        id: eventSelected.id,
      };
      let {
        data: { success, description },
      } = await EventService.deleteEvent(eventToDelete);
      if (success) {
        message.success({
          content: "Evento eliminado.",
          duration: 3,
          key: "delete",
        });
        onCloseModal({ state: "success" });
      } else {
        message.warning({
          content: "No se pudo eliminar el evento. " + description,
          duration: 5,
          key: "update",
        });
      }
    } catch (error) {
      message.error({
        content: "Error. " + error.message,
        duration: 5,
        key: "delete",
      });
    }
  };

  const handleDeleteEvent = () => {
    confirm({
      title: "¿Deseas eliminar el evento?",
      icon: <ExclamationCircleOutlined />,
      content: "Presiona confirmar para eliminar el evento.",
      onOk() {
        onDeleteEvent();
      },
      onCancel() {},
    });
  };
  return (
    <Modal
      title={eventSelected ? "Editar Evento" : "Crear evento"}
      visible={true}
      onCancel={onCloseModal}
      footer={null}
      maskClosable={false}
    >
      <Form
        className="form"
        {...formItemLayout}
        form={form}
        fields={formFields}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="title"
          label="Título"
          rules={[
            {
              required: true,
              message: "Por favor ingrese el título.",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="shortTitle"
          label="Título corto"
          rules={[
            {
              required: true,
              message: "Por favor ingrese el título corto.",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Fecha de inicio"
          rules={[
            {
              type: "object",
              required: true,
              message: "Por favor selecciona la fecha de inicio!",
            },
          ]}
        >
          <DatePicker
            placeholder="Seleccione la fecha"
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="Fecha de final"
          rules={[
            {
              type: "object",
              required: true,
              message: "Por favor selecciona la fecha de final!",
            },
          ]}
        >
          <DatePicker
            placeholder="Seleccione la fecha"
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>
        <ReactQuill
          value={textNew.text}
          style={{ minHeight: "10em" }}
          onChange={onChangeText}
          modules={modules}
        />
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Aceptar
          </Button>
          <Button
            type="secondary"
            htmlType="button"
            onClick={() => {
              onCloseModal();
            }}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {eventSelected && (
          <Button
            type="primary"
            htmlType="button"
            onClick={() => {
              handleDeleteEvent();
            }}
            danger
            style={{ margin: "auto" }}
          >
            Eliminar Evento
          </Button>
        )}
      </div>
      <br />
    </Modal>
  );
}
