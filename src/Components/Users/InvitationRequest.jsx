import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Select,
  Row,
  Col,
  message,
  Spin,
  Divider,
  Tooltip,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import UserService from "../../services/UserService";
import SystemRolService from '../../services/SystemRolService';
import LoaderSpin from '../Layouts/Loader/LoaderSpin';
import { Redirect } from "react-router-dom";
const { Option } = Select;

export default function InvitationRequest() {
  const [form] = Form.useForm();
  const [isCharging, setisCharging] = useState(false);
  const [redirect, setredirect] = useState(false);
  const [isLoading, setisLoading] = useState({status:"loading", message:""});
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = () => {
    SystemRolService.getRoles()
    .then((res) => {
      if (res.data?.success) {
        let partialRoles = res.data?.response.filter(r => r.name === "Investigador" || r.name === "Asociado" || r.name === "DirectorNacional");
        setRoles(partialRoles);
        setisLoading({status:"success",message:""});
      } else {
          message.error("Hubo un error al intentar obtener los roles." + res.data?.description,4);
          setisLoading({status:"error", message:res.data?.description});
      }
    })
    .catch((e) => {
      message.error("Hubo un error en el servidor." + e.message,4);
      console.log(e.message);
      setisLoading({status:"error", message:e.message});
    });
  }

  const onFinish = (emails) => {
    if(emails.invitations && emails.invitations.length>0) {
      setisCharging(true);
      UserService.sendInvitations(emails)
        .then((res) => {
          if (res.data?.success) {
            message.success("Se ha enviado las invitaciones correctamente", 5);
            setisCharging(false);
            setredirect(true);
          } else {
            message.error(res.data?.description, 5);
            //console.log(res.data?.description);
          }
        })
        .catch((e) => {
          message.error(e.message, 5);
          console.log(e.message);
        });
    }else {
      message.error("No registraste ningun email para enviar invitación.",7);
    }
    
  };

  if(isLoading.status === "loading" || isLoading.status === "error" ){
    return (<LoaderSpin isLoading={isLoading} />);
  }

  return (
    <>
      <Form
        form={form}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="invitations">
          {(fields, { add, remove }) => (
            <Row align="start">
              {fields.map((field, index) => (
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 14, offset: 5 }}
                  lg={{ span: 10, offset: 7 }}
                  xl={{ span: 10, offset: 7 }}
                  key={field.key}
                >
                  <Space align="baseline" split={<Divider type="vertical"/>}>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.sights !== curValues.sights
                      }
                    >
                      {() => (
                        <Form.Item
                          {...field}
                          label="Rol"
                          name={[field.name, "systemRolId"]}
                          fieldKey={[field.fieldKey, "systemRolId"]}
                          rules={[{ required: true, message: "Rol faltante." }]}
                        >
                          <Select placeholder="Seleccione un rol" style={{ width: 130 }}>
                            {roles.map((r) => {
                              return <Option key={r.id} value={r.id}>{r.name}</Option>;
                            })}
                          </Select>
                        </Form.Item>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Email"
                      name={[field.name, "email"]}
                      fieldKey={[field.fieldKey, "email"]}
                      rules={[
                        {
                          type: "email",
                          required: true,
                          message: "email no valido.",
                        },
                      ]}
                    >
                      <Input placeholder="Ingrese un correo electronico"/>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                </Col>
              ))}
              <Col span={10} offset={7}>
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    disabled={isCharging}
                  >
                    Añadir invitación
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form.List>
        <Row align="center">
          <Col
            xs={{ span: 20 }}
            sm={{ span: 20 }}
            md={{ span: 14 }}
            lg={{ span: 10 }}
            xl={{ span: 10 }}
          >
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isCharging}>
                Enviar invitaciones
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Row justify="center">
        <Col
          span={10}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isCharging ? (
            <>
              <h3 style={{ margin: "1em" }}>Enviando Invitaciones</h3>
              <Spin size="large" />
            </>
          ) : null}
          {redirect ? (
            <>
              <Redirect to="/users"/>
            </>
          ) : null}
        </Col>
      </Row>
    </>
  );
}
