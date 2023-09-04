import React, { useState, useEffect } from "react";
import { message, Modal, Form, Select, Tag, Button } from "antd";
import GroupService from "./../../services/GroupService.js";
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

export default function LineChangeGroup({
  lines = [],
  isVisible = false,
  handleOk,
  handleCancel,
}) {
  console.log('lineas', lines);
  const [groups, setGroups] = useState([]);
  const [form] = Form.useForm();
  const getGroups = () => {
    GroupService.getGroupsByOwnerId()
      .then((res) => {
        if (res.data?.success) {
          console.log("groups", res.data?.response);
          setGroups(res.data?.response);
        } else {
          message.warning("No se encontraron grupos", 4);
        }
      })
      .catch((e) => {
        message.warning("No se encontraron grupos", 4);
      });
  };
  useEffect(() => {
    getGroups();
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
      value: e.code + " " + e.name,
    }));
    return options;
  };

  const onFinish = (value) => {
    let linesId = [];
    lines.forEach((l) => {
      if (value.lines.some((lName) => lName === `${l.code} ${l.name}`)) {
        linesId.push(l.id);
      }
    });

    let dataR = {
        groupId: value.groupTarget,
        linesId
    };
    console.log('dataR',dataR);
    handleOk(dataR);
  };

  return (
    <Modal
      visible={isVisible}
      title="Cambiar de Línea"
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
          name="groupTarget"
          label="Grupo destino"
          rules={[
            {
              required: true,
              message: "Seleccione el Grupo.",
            },
          ]}
        >
          <Select>
            {groups.map((group) => (
              <Select.Option key={group.id} value={group.id}>
                {`${group.code} ${group.name}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="lines"
          label="Líneas"
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
            options={getOptions(lines.filter(l=> !l.isInstitutional))}
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
