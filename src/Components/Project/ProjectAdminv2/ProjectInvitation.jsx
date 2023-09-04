import { useState, useEffect, useCallback, useRef } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Space,
  Row,
  Col,
  Select,
  Spin,
} from "antd";
import { useParams, useHistory } from "react-router";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import SystemRolService from "../../../services/SystemRolService";
import ProjectService from "../../../services/ProjectService.js";
import UserService from "../../../services/UserService.js";
import LoaderSpin from "../../Layouts/Loader/LoaderSpin";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/userReducer.js";

export default function ProjectInvitation() {
  const [form] = Form.useForm();
  const projectId = parseInt(useParams().id);
  const globalUser = useSelector(selectUser);
  const { current: userSesion } = useRef(globalUser);
  const [isAuth, setisAuth] = useState(false);
  const [systemRoles, setsystemRoles] = useState([]);
  const [isCharging, setisCharging] = useState(false);
  //const [redirect, setredirect] = useState(false);
  const history = useHistory();
  const [isLoading, setisLoading] = useState({
    status: "loading",
    message: "",
  });
  const [project, setProject] = useState(null);

  const getProject = useCallback((id) => {
    ProjectService.getProjectById(id)
      .then((res) => {
        if (res.data?.success) {
          let data = res.data.response;
          data = {
            ...data,
            userLeader:
              data.UserProjects.filter(
                (up) => up.status === true && up.isMain === true
              )[0] || null,
          };
          //console.log("data", data);
          setProject(res.data?.response);
          if (
            userSesion.rolName !== "Administrador" &&
            data.LineProjects[0]?.Line?.Group?.userId !== userSesion.id &&
            data.userLeader?.userId !== userSesion.id
          ) {
            setisAuth(false);
            setisLoading({
              status: "error",
              message: "El proyecto no te pertenece.",
            });
          } else {
            setisAuth(true);
          }
        } else {
          message.error(
            "No se encontro el proyecto para enviar invitaciones.",
            5
          );
          setisLoading({
            status: "error",
            message: "No se encontro el proyecto para enviar invitaciones.",
          });
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error("Hubo un problema en el servidor." + e.message, 5);
        setisLoading({ status: "error", message: "" });
      });
  }, [userSesion]);

  const getSystemRoles = () => {
    SystemRolService.getRoles()
      .then((res) => {
        if (res.data?.success && res.data?.response.length > 0) {
          let roles = res.data.response.filter(
            (sr) =>
              sr.name === "Estudiante" ||
              sr.name === "Asociado" ||
              sr.name === "Consultor"
          );
          setsystemRoles(roles);
          setisLoading({ status: "success", message: "" });
        } else {
          message.error("Hubo un problema al tratar de obtener los roles. ", 5);
          setisLoading({
            status: "error",
            message: "No se encontraton roles.",
          });
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error(
          "Hubo un problema al tratar de obtener los roles. " + e.message,
          5
        );
        setisLoading({ status: "error", message: e.message });
      });
  };

  useEffect(() => {
    if (!isNaN(projectId)) {
      getSystemRoles();
      getProject(projectId);
    } else {
      setisLoading({ status: "error", message: "Error en datos" });
    }
  }, [projectId,getProject]);

  const onFinish = (values) => {
    if (!values.users?.length > 0) {
      message.error(
        "No se registro ningun correo electrónico para enviar invitación.",
        5
      );
    } else {
      let invitations = values.users.map((u) => {
        return {
          ...u,
          projectId,
          lineId: project?.LineProjects[0]?.lineId,
          groupId: project?.LineProjects[0]?.Line?.Group?.id,
        };
      });
      //console.log("req", invitations);
      setisCharging(true);
      UserService.sendInvitations({ invitations })
        .then((res) => {
          if (res.data?.success) {
            message.success("Se ha enviado las invitaciones correctamente", 5);
            setisCharging(false);
            //setredirect(true);
            history.goBack();
          } else {
            message.error(res.data?.description, 5);
            /*  console.log(res.data?.description);
            console.log("emailerr", res.data?.response); */
            setisLoading({
              status: "error",
              message: `No se pudo enviar invitaciones para los siguientes correos electrónicos: ${res.data?.response?.invitationFail.map(
                (e) => e.email
              )}. Reintentelo mas tarde o revise su conexión a internet.`,
            });
          }
        })
        .catch((e) => {
          message.error(e.message, 5);
          //console.log(e);
          setisLoading({
            status: "error",
            message:
              "Hubo un problema en el servidor al enviar las invitaciones",
          });
        });
    }
  };

  if (
    isLoading.status === "loading" ||
    isLoading.status === "error" ||
    !systemRoles.length > 0 ||
    !isAuth
  ) {
    return <LoaderSpin isLoading={isLoading} />;
  }
  return (
    <>
      <Row align="center">
        <Col
          xs={{ span: 22 }}
          sm={{ span: 20 }}
          md={{ span: 16 }}
          lg={{ span: 10 }}
          xl={{ span: 10 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Form
            name="dynamic_form_nest_item"
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            style={{ width: "100%" }}
          >
            <Form.List name="users">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "email"]}
                        fieldKey={[fieldKey, "email"]}
                        rules={[
                          {
                            type: "email",
                            required: true,
                            message: "Ingrese un correo electrónico.",
                          },
                        ]}
                        style={{ width: "10em" }}
                      >
                        <Input placeholder="Correo electrónico" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "systemRolId"]}
                        fieldKey={[fieldKey, "systemRolId"]}
                        rules={[
                          { required: true, message: "Seleccione el rol." },
                        ]}
                        style={{ width: "10em" }}
                      >
                        <Select>
                          {systemRoles.map((sr) => (
                            <Select.Option key={sr.id} value={sr.id}>
                              {sr.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      {/*                       <Form.Item
                        {...restField}
                        name={[name, "isMain"]}
                        fieldKey={[fieldKey, "isMain"]}
                      >
                        <Checkbox.Group>
                          <Checkbox
                            checked={false}
                            value={false}
                            onChange={() => {console.log()}}
                          >
                            Lider
                          </Checkbox>
                        </Checkbox.Group>
                      </Form.Item> */}
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
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
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isCharging}>
                Enviar invitaciones
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
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
        </Col>
      </Row>
    </>
  );
}
