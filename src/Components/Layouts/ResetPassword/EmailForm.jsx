import { useState } from "react";
import { Typography, Row, Col, Form, Input, Button, message } from "antd";
import UserService from "../../../services/UserService.js";
import { useHistory } from "react-router";
const { Title } = Typography;

export default function EmailForm() {
  const [form] = Form.useForm();
  const [resetPassword, setresetPassword] = useState(false);
  const history = useHistory();
  const onFinish = (email) => {
    message.loading({ content: "Procesando...", key: "update" });
    UserService.emailResetPass(email)
      .then((res) => {
        if (res.data?.success) {
          message.success({
            content: "Correo electrónico enviado",
            key: "update",
            duration:5
          });
        } else {
          message.error({
            content:
              "No se pudo enviar correo electrónico para reestablecer la contraseña.",
            key: "update",
            duration:6
          });
        }
        setresetPassword(true);
      })
      .catch((e) => {
        console.log(e.message);
        message.error({
          content:
            "Hubo un error. "+e.message,
          key: "update",
          duration:6
        });
      });
  };
  if (resetPassword) {
    return (
      <>
        <Row align="center">
          <Col>
            <Title level={2}>Reestablecer Contraseña</Title>
          </Col>
        </Row>
        <Row align="center">
          <Col span={16} offset={4}>
            <span>
              Se ha enviado la información necesaria a tu correo electrónico
              para reestablecer tu contraseña.
            </span>
          </Col>
        </Row>
      </>
    );
  }
  return (
    <>
      <Row align="center">
        <Col>
          <Title level={2}>Reestablecer Contraseña</Title>
        </Col>
      </Row>
      <Row align="center">
        <Col>
          <span level={5}>
            Introduce tu correo electronico para reestablecer tu contraseña
          </span>
        </Col>
      </Row>
      <Row align="center" style={{ margin: "25px" }}>
        <Col>
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "El email no es valido.",
                },
                {
                  required: true,
                  message:
                    "Por favor ingresa tu email para reestablecer tu contraseña.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Reestablecer contraseña
              </Button>
              <Button
                htmlType="button"
                style={{ margin: "0 8px" }}
                onClick={() => {
                  history.push("/");
                }}
              >
                Cancelar
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
