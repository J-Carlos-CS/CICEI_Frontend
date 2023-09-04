import { useState, useEffect, useCallback } from "react";
import UserService from "../../../services/UserService";
import { Modal, Form, Divider, Button, Select, message, Row, Col } from "antd";
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
export default function SincroUsers({ onCloseModal, sinteticSelected }) {
  console.log(sinteticSelected);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  // const [formField, setFormField] = useState([]);
  const onFinish = async (values) => {
    try {
      let users = {
        sinteticUser: { id: sinteticSelected.id },
        user: { id: userSelected.id },
      };
      message.loading({
        content: "Procesando...",
        key: "request",
        duration: 3,
      });
      //console.log("users", users);
      let {data:{success, description}} = await UserService.sincroUser(users);
      if (success) {
        message.success({
          content: "Usuarios sincronizados.",
          key: "request",
          duration: 3,
        });
        onCloseModal({state: "success"});
      } else {
        message.error({
          content: "Error al sincronizar usuarios. "+ description,
          key: "request",
          duration: 3,
        });
      }
    } catch (error) {
      message.error(error.message, 5);
    }
  };

  const getUsers = useCallback(async () => {
    try {
      let response = await UserService.getUsersToSincro();
      if (response.data?.success) {
        setUsers(response?.data?.response);
      } else {
        message.error({
          content: "No se pudo obtener la lista de usuarios.",
          key: "create",
          duration: 5,
        });
      }
    } catch (error) {
      message.error(error.message, 4);
    }
  }, []);

  const onChangeUser = (id) => {
    let index = users.findIndex((e) => e.id === id);
    let user = users[index];
    console.log("user", user);
    setUserSelected(user);
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <>
      <Modal
        title={"Sincronizar Usuarios"}
        footer={null}
        onCancel={() => {
          onCloseModal();
        }}
        onOk={() => {}}
        visible={true}
      >
        <Divider>{"Usuario sintético"}</Divider>
        <Row>
          <Col span={4}>Nombre:</Col>
          <Col span={18}>
            <b>{`${
              sinteticSelected?.firstName + " " + sinteticSelected?.lastName
            }`}</b>
          </Col>
          <Col span={4}>Rol:</Col>
          <Col span={18}>
            <b>{`${sinteticSelected?.SystemRol?.name}`}</b>
          </Col>
          <Col span={4}>Grado:</Col>
          <Col span={18}>
            <b>{`${
              sinteticSelected?.Grade?.name + " " + sinteticSelected?.grade
            }`}</b>
          </Col>
          {sinteticSelected?.Institution && (
            <>
              <Col span={4}>Institución:</Col>
              <Col span={18}>
                <b>{`${sinteticSelected?.Institution?.name}`}</b>
              </Col>
            </>
          )}
        </Row>

        <br />
        <Divider>{"Seleccione al usuario real"}</Divider>

        <Form
          {...formItemLayout}
          form={form}
          //fields={formField}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="realUser"
            label="Usuario real"
            rules={[
              {
                required: true,
                message: "Por favor seleccione el tipo de usuario.",
              },
            ]}
          >
            <Select
              showSearch
              filterOption={(input, option) => {
                return (
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                );
              }}
              onChange={(id) => {
                onChangeUser(id);
              }}
            >
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user?.firstName +
                    " " +
                    user?.lastName +
                    " - " +
                    user?.SystemRol?.name}
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
                onCloseModal();
              }}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>

        {userSelected && (
          <>
            <Row>
              <Col span={4}>Nombre:</Col>
              <Col span={18}>
                <b>{`${
                  userSelected?.firstName + " " + userSelected?.lastName
                }`}</b>
              </Col>
              <Col span={4}>Rol:</Col>
              <Col span={18}>
                <b>{`${userSelected?.SystemRol?.name}`}</b>
              </Col>
              <Col span={4}>Grado:</Col>
              <Col span={18}>
                <b>{`${
                  userSelected?.Grade?.name + " " + userSelected?.grade
                }`}</b>
              </Col>
              {userSelected?.Institution && (
                <>
                  <Col span={4}>Institución:</Col>
                  <Col span={18}>
                    <b>{`${userSelected?.Institution?.name}`}</b>
                  </Col>
                </>
              )}
            </Row>

            <br />
            <Row>
              <Col span={24}>
                <b>
                  Nota: Toda la información registrada del usuario sintético
                  pasará a ser del usuario real que ha seleccionado.
                </b>
              </Col>
            </Row>
          </>
        )}
      </Modal>
    </>
  );
}
