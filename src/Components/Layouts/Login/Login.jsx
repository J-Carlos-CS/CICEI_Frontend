import { useState } from "react";
import { login } from "../../../Auth/userReducer.js";
import { information } from "../../../Auth/centerInformationReducer.js"
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../Auth/userReducer";
import { useHistory, NavLink, Redirect } from "react-router-dom";
import { Form, Input, Button, Typography, message, Row, Col } from "antd";
import UserService from "../../../services/UserService.js";
import CenterService from "../../../services/CenterService.js";
import "./Login.css";
const { Title } = Typography;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
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
export default function Login() {
  const user = useSelector(selectUser);
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return <Redirect to={{ pathname: "/home" }} />;
  }

  const onFinish = (values) => {
    setIsLoading(true);
    message.loading({content:"Procesando...",key:"update"});
    UserService.login(values)
      .then((res) => {
        if (res.data?.success) {
          message.success({content:"Acceso aceptado", key:"update",duration:2});
          console.log(res.data?.response,"aaaaaaaaaaaaasdsd")
          dispatch(login(res.data?.response));
          CenterService.getCenterById(res?.data?.response?.centerId).then(res=>{
            let center=res?.data?.response;
            dispatch(information(center));
          });

          history.push("/home");
        } else {
          message.error(res.data?.description);
          message.error({content:res.data?.description,key:"update",duration:4});
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error({content:e.message,key:"update",duration:4});
      });
    setIsLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Row align="center" style={{ marginTop: "3em" }}>
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Title>Ingresar</Title>
        </Col>
        <Col
          xs={{ span: 24, offset: 0 }}
          sm={{ span: 18, offset: 0 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Form
            style={{ width: "60%" }}
            name="basic"
            {...formItemLayout}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Por favor ingresa tu correo electrónico!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu contraseña!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* <Row align="end" style={{ marginBottom: "1rem" }}>
                <Col>
                  <NavLink to="/email-reset-password">
                    {"Olvidé mi contraseña"}
                  </NavLink>
                </Col>
              </Row> */}

            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: "15px" }}
                disabled={isLoading}
              >
                Ingresar
              </Button>
              <NavLink to="/email-reset-password">
                {"Olvidé mi contraseña"}
              </NavLink>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
