import React, { useState, useEffect } from "react";
import LineService from "./../../services/LineService.js";
import { message, Modal, Form, Select, Tag, Button } from "antd";

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
      span: 8,
    },
    xl: {
      span: 8,
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
      span: 16,
    },
    xl: {
      span: 16,
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

export default function ProjectChangeLine({
  projects = [],
  isVisible = false,
  handleOk,
  handleCancel,
}) {
  const [lines, setLines] = useState([]);
  const [form] = Form.useForm();
  const getLines = (params) => {
    LineService.getLinesByOwnerId()
      .then((res) => {
        if (res.data?.success) {
          //console.log("lineas", res.data?.response);
          setLines(res.data?.response);
        } else {
          message.warning("No se encontraron líneas", 4);
        }
      })
      .catch((e) => {
        message.warning("No se encontraron líneas", 4);
      });
  };
  useEffect(() => {
    getLines();
  }, []);

  function tagRender(props) {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={"gold"}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  }
  const getOptions = (list) => {
    let options = list.map((e) => ({
      value: e.code + " " + e.title,
    }));
    return options;
  };

  const onFinish = (value) => {
    //console.log("params", value);
    let projectsId = [];
    projects.forEach((p) => {
      if (value.projects.some((pName) => pName === `${p.code} ${p.title}`)) {
        projectsId.push(p.id);
      }
    });
    let dataR = {
      lineId: value.lineTarget,
      projectsId,
    };
    //console.log(dataR);
    handleOk(dataR);
  };

  return (
    <Modal
      visible={isVisible}
      title="Cambiar de línea"
      okText="Aceptar"
      cancelText="Cancelar"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={1000}
    >
      <Form
        {...formItemLayout}
        form={form}
        //fields={formField}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="lineTarget"
          label="línea destino"
          rules={[
            {
              required: true,
              message: "Seleccione la línea.",
            },
          ]}
        >
          <Select>
            {lines.map((line) => (
              <Select.Option key={line.id} value={line.id}>
                {`${line.code} ${line.name}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="projects"
          label="Proyectos"
          rules={[
            {
              required: true,
              message: "Seleccione uno o varios proyectos.",
            },
          ]}
        >
          <Select
            mode="multiple"
            showArrow
            tagRender={tagRender}
            //defaultValue={["gold", "cyan"]}
            style={{ width: "100%" }}
            options={getOptions(projects)}
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
