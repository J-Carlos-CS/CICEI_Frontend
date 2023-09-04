import { useState } from "react";
import { Form, Input, Row, Col, Button, message, Typography } from "antd";
import { useLocation, useHistory } from "react-router-dom";
import UserService from "../../../services/UserService.js";
const { Title } = Typography;

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

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 10,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};

export default function ResetPasswordForm() {
  const [form] = Form.useForm();
  const history = useHistory();
  const [passwordConstrains, setPasswordConstrains] = useState({
    lower: false,
    capital: false,
    number: false,
    character: false,
    space: false,
    length: false,
  });
  let query = new URLSearchParams(useLocation().search);

  const onFinish = (values) => {
    let user = {
      password: values.password,
      userInfo: query.get("userInfo"),
      userInfoTwo: query.get("userInfoTwo"),
    };
    UserService.ResetPass(user)
      .then((res) => {
        if (res.data?.success) {
          message.success("Tu contraseña fue reestablecida.", 4);
          history.push("/");
        } else {
          message.error(
            "Hubo un error al intentar reestablecer tu contraseña." +
              res.data?.description,
            4
          );
          console.log(res.data?.description);
        }
      })
      .catch((e) => {
        message.error(
          "Hubo un error al intentar reestablecer tu contraseña." + e.message,
          4
        );
        console.log(e.message);
      });
  };

  return (
    <Row align="center">
      <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
        <Title>Reestablecer contraseña</Title>
      </Col>
      <Col
        xs={{ span: 24, offset: 0 }}
        sm={{ span: 18, offset: 0 }}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Form
          {...formItemLayout}
          style={{ width: "60%" }}
          form={form}
          name="resetpassword"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="password"
            label="Nueva Contraseña"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu nueva contraseña",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  let lower = /(?=.*[a-z])/;
                  let capital = /(?=.*[A-Z])/;
                  let number = /(?=.*\d)/;
                  let character = /(?=.*[$@$!%*?&.])/;

                  let statusPassword = {
                    lower: false,
                    capital: false,
                    number: false,
                    character: false,
                    space: false,
                    length: false,
                  };

                  if (value) {
                    if (lower.test(value)) {
                      statusPassword.lower = true;
                    }
                    if (capital.test(value)) {
                      statusPassword.capital = true;
                    }
                    if (number.test(value)) {
                      statusPassword.number = true;
                    }
                    if (character.test(value)) {
                      statusPassword.character = true;
                    }
                    let arrayPassword = value.split("");
                    if (!arrayPassword.some((caracter) => caracter === " ")) {
                      statusPassword.space = true;
                    }
                    if (
                      arrayPassword.length >= 8 &&
                      arrayPassword.length <= 20
                    ) {
                      statusPassword.length = true;
                    }
                  }
                  setPasswordConstrains(statusPassword);
                  if (
                    statusPassword.length &&
                    statusPassword.lower &&
                    statusPassword.capital &&
                    statusPassword.number &&
                    statusPassword.space &&
                    statusPassword.character
                  ) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(
                      new Error("La contraseña no cumple con las condiciones")
                    );
                  }
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirmar Contraseña"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Por favor confirma tu nueva contraseña",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("Las dos contraseñas no coinciden.")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Row>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span>La contraseña debe tener:</span>
            </Col>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span
                style={{
                  color: passwordConstrains.length ? "rgb(82,196,26)" : "black",
                }}
              >
                -De 8 a 20 caracteres{" "}
                <strong>{passwordConstrains.length ? "(OK)" : ""}</strong>
              </span>
            </Col>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span
                style={{
                  color: passwordConstrains.number ? "rgb(82,196,26)" : "black",
                }}
              >
                -Al menos un número{" "}
                <strong>{passwordConstrains.number ? "(OK)" : ""}</strong>
              </span>
            </Col>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span
                style={{
                  color: passwordConstrains.capital
                    ? "rgb(82,196,26)"
                    : "black",
                }}
              >
                -Al menos una mayuscula{" "}
                <strong>{passwordConstrains.capital ? "(OK)" : ""}</strong>
              </span>
            </Col>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span
                style={{
                  color: passwordConstrains.lower ? "rgb(82,196,26)" : "black",
                }}
              >
                -Al menos una minuscula{" "}
                <strong>{passwordConstrains.lower ? "(OK)" : ""}</strong>
              </span>
            </Col>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span
                style={{
                  color: passwordConstrains.character
                    ? "rgb(82,196,26)"
                    : "black",
                }}
              >
                -Un caracter especial de entre estos{" "}
                <strong>{"($ @ ! % * ? & .)"}</strong>
                <strong>{passwordConstrains.character ? "(OK)" : ""}</strong>
              </span>
            </Col>
          </Row>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Aceptar
            </Button>
            <Button
              type="secondary"
              htmlType="button"
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
  );
}
