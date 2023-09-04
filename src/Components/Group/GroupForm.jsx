import { useState, useEffect, useCallback,useRef } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import GroupService from "../../services/GroupService";
import UserService from "../../services/UserService";
import { selectUser } from "../../Auth/userReducer.js";
import { useSelector } from "react-redux";
import "./GroupForm.css";
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  message,
  Row,
  Col,
} from "antd";
import LoaderSpin from "../Layouts/Loader/LoaderSpin";
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

export default function GroupForm() {
  const history = useHistory();
  const params = useParams();
  const groupId = params.id;
  const globalUser = useSelector(selectUser);
  const {current: sesionUser} = useRef(globalUser);
  const [isLoading, setisLoading] = useState({
    status: "loading",
    message: "",
  });
  const [isAuth, setisAuth] = useState(true);
  const [form] = Form.useForm();
  const [userList, setUserList] = useState([]);
  const [fields, setfields] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const location = useLocation().pathname;

  const getUsers = (params) => {
    UserService.getUserForSelect()
      .then((res) => {
        if (res.data?.success) {
          setUserList(res.data.response);
          setisLoading({ status: "success", message: "" });
        } else {
          setisLoading({
            status: "error",
            message: "No se encontraron usuarios para el grupo.",
          });
        }
      })
      .catch((e) => {
        //console.log(e.message);
        setisLoading({ status: "error", message: e.message });
      });
  };

  const getGroup = useCallback(
    (id) => {
      GroupService.getGroupById(id)
        .then((res) => {
          const group = res.data.response;
          if (res.data?.success) {
            const fields = [
              {
                name: ["name"],
                value: group.name || "",
              },
              {
                name: ["code"],
                value: group.code || "",
              },
              {
                name: ["description"],
                value: group.description || "",
              },
              {
                name: ["userId"],
                value: `${group.userId}` || "",
              },
            ];
            setfields(fields);
            if (
              sesionUser.rolName !== "Administrador" &&
              group.userId !== sesionUser.id
            ) {
              //console.log("error auth");
              setisAuth(false);
            }
            setisLoading({ status: "success", message: "" });
          } else {
            setisLoading({
              status: "error",
              message: "No se encontro el grupo.",
            });
          }
        })
        .catch((e) => {
          message.error(e.message, 3);
          setisLoading({ status: "error", message: e.message });
        });
    },
    [sesionUser],
  );
  useEffect(() => {
    if (groupId) {
      getGroup(groupId);
    }
    getUsers();
  }, [groupId,getGroup]);


  const createGroup = (group) => {
    GroupService.createGroup(group)
      .then((res) => {
        if (res.data?.success) {
          message.success("Grupo registrado", 3);
          history.goBack();
        } else {
          setRequesting(false);
          message.error(
            "Hubo un error al registrar el grupo, intente nuevamente.",
            5
          );
        }
      })
      .catch((e) => {
        setRequesting(false);
        message.error(
          "Algo salio mal al guardar el grupo, intente nuevamente.",
          5
        );
        //console.log(e.message);
      });
  };

  const updateGroup = (group) => {
    GroupService.updateGroup(group)
      .then((res) => {
        if (res.data?.success) {
          message.success("Grupo actualizado.", 3);
          history.goBack();
        } else {
          setRequesting(false);
          message.error(
            "No se pudo actualizar el Grupo. " + res.data.description,
            5
          );
        }
      })
      .catch((e) => {
        setRequesting(false);
        message.error(
          "Algo salio mal al guardar el grupo, intente nuevamente.",
          5
        );
        //console.log(e.message);
      });
  };

  const onFinish = (group) => {
    group.id = groupId;
    group.userId =
      location.indexOf("/group-users/") >= 0 ? sesionUser.id : group.userId;
    //console.log("grup", group);
    setRequesting(true);
    if (groupId !== null && groupId > 0) {
      updateGroup(group);
    } else {
      createGroup(group);
    }
  };

  const onCancel = () => {
    history.goBack();
  };

  if (!isAuth) {
    return (
      <LoaderSpin
        isLoading={{
          status: "error",
          message: "El grupo no te pertence para editarlo.",
        }}
      />
    );
  }

  if (
    isLoading.status === "loading" ||
    isLoading.status === "error" ||
    !userList.length > 0
  ) {
    return <LoaderSpin isLoading={isLoading} />;
  }

  return (
    <>
      <Title className="title-group">
        {groupId ? "Editar Grupo" : "Crear Grupo"}
      </Title>
      <Row>
        <Col span={23}>
          <Form
            {...formItemLayout}
            fields={fields}
            form={form}
            name="register"
            onFinish={onFinish}
            preserve={false}
            scrollToFirstError
          >
            <Form.Item
              name="name"
              label="Nombre del Grupo"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa el nombre del grupo.",
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
                  message: "Por favor ingresa la descripción del grupo.",
                  whitespace: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            {location.indexOf("/group-users/") === -1 ? (
              <Form.Item
                name="userId"
                label="Encargado"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona un encargado!",
                  },
                ]}
              >
                <Select placeholder="Selecciona un encargado">
                  {userList.map((user) => {
                    return (
                      <Select.Option key={`${user.id}`} value={`${user.id}`}>
                        {" "}
                        {`${user.firstName} ${user.lastName} - ${user.SystemRol.name}`}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            ) : null}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={requesting}
              >
                Aceptar
              </Button>
              <Button danger htmlType="button" onClick={onCancel}>
                Cancelar
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
