import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import LineService from "../../services/LineService.js";
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  message,
  Radio,
  Row,
  Col,
} from "antd";
import GroupService from "../../services/GroupService.js";
import { selectUser } from "../../Auth/userReducer.js";
import { useSelector } from "react-redux";
import LoaderSpin from "../Layouts/Loader/LoaderSpin";
import { selectCenterInformation } from "../../Auth/centerInformationReducer.js";

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
export default function LineForm() {
  const globalCenterInformation=useSelector(selectCenterInformation).CenterInformation
  const globalUser = useSelector(selectUser);
  const { current: userSesion } = useRef(globalUser);
  const history = useHistory();
  const params = useParams();
  const lineId = params.id || null;
  const [fields, setFields] = useState([]);
  const [form] = Form.useForm();
  const [groupList, setGroupList] = useState([]);
  const [isInstitutional, setIsInstitutional] = useState(false);
  const [isLoading, setisLoading] = useState({
    status: "loading",
    message: "",
  });
  const [isAuth, setisAuth] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const onCreateLine = (line) => {
    LineService.createLine(line)
      .then((res) => {
        if (res.data?.success) {
          message.success("Se guardo la línea correctamente", 5);
          history.goBack();
        } else {
          setRequesting(false);
          message.error(
            "No se pudo registrar la línea." + res.data?.description,
            5
          );
        }
      })
      .catch((e) => {
        setRequesting(false);
        message.error(
          "Hubo un error en el servidor, no se pudo guardar la línea." +
            e.message,
          3
        );
        //console.log(e);
      });
  };

  const onUpdateLine = (line) => {
    LineService.updateLine(lineId, line)
      .then((res) => {
        //console.log("res", res);
        if (res.data?.success) {
          message.success("Se guardo la línea correctamente", 3);
          history.goBack();
        } else {
          setRequesting(false);
          message.error(
            "No se pudo registrar la línea." + res.data?.description,
            3
          );
        }
      })
      .catch((e) => {
        setRequesting(false);
        message.error(
          "Hubo un error en el servidor, no se pudo guardar la línea." +
            e.message,
          3
        );
        //console.log(e);
      });
  };

  const onFinish = (line) => {
    console.log("globalUser", globalUser)
    const lineData={
      ...line,
      centerId: globalUser?.centerId,
    }
    setRequesting(true);
    if (lineId) {
      onUpdateLine(lineData);
    } else {
      onCreateLine(lineData);
    }
  };

  const onCancel = () => {
    history.goBack();
  };

  const getLine = useCallback(
    (id) => {
      LineService.getLineById(id)
        .then((res) => {
          if (res.data?.success) {
            const line = res.data?.response;
            const fields = [
              {
                name: ["name"],
                value: line.name || "",
              },
              {
                name: ["code"],
                value: line.code || "",
              },
              {
                name: ["description"],
                value: line.description || "",
              },
              {
                name: ["groupId"],
                value: line.groupId || 0,
              },
              {
                name: ["isInstitutional"],
                value: line.isInstitutional,
              },
            ];
            setFields(fields);
            setIsInstitutional(line.isInstitutional);
            setisLoading({ status: "success", message: "" });
            if (
              userSesion.rolName !== "Administrador" &&
              line.Group?.userId !== userSesion.id &&
              line.uid !== userSesion.id
            ) {
              setisAuth(false);
            }
          } else {
            setisLoading({
              status: "error",
              message: "No se pudo obtener la línea.",
            });
          }
        })
        .catch((e) => {
          message.error(
            "Hubo un error en el servidor, no se encontro la línea.",
            3
          );
          //console.log(e.message);
          setisLoading({ status: "error", message: e.message });
        });
    },
    [userSesion]
  );

  const getGroups = () => {
    GroupService.getGroups()
      .then((res) => {
        if (res.data?.success && res.data?.response.length > 0) {
          const groups = res.data?.response;
          setGroupList(groups);
          setisLoading({ status: "success", message: "" });
        } else {
          message.error("No existen grupos para asociar la línea.", 3);
          setisLoading({
            status: "error",
            message: "No existen grupos para asociar la línea.",
          });
        }
      })
      .catch((e) => {
        message.error("No se pudo obtener la lista de grupos.", 3);
        setisLoading({
          status: "error",
          message: "No se pudo obtener la lista de grupos.",
        });
      });
  };

  useEffect(() => {
    if (lineId) {
      getLine(lineId);
    }
    getGroups();
  }, [lineId, getLine]);

  if (!isAuth) {
    return (
      <LoaderSpin
        isLoading={{
          status: "error",
          message: "No eres propietario de la línea para editarla.",
        }}
      />
    );
  }

  if (
    isLoading.status === "loading" ||
    isLoading.status === "error" ||
    (lineId !== null && !fields.length > 0) ||
    !groupList.length > 0
  ) {
    return <LoaderSpin isLoading={isLoading} />;
  }

  return (
    <>
      <Title className="title-line">
        {lineId ? "Editar línea" : "Crear línea"}
      </Title>
      {}
      <Row align="center">
        <Col span={20}>
          <Form
            //className="form"
            {...formItemLayout}
            fields={fields}
            form={form}
            name="register"
            onFinish={onFinish}
            preserve={false}
            /*  initialValues={{
          isInstitutional: isInstitutional,
        }} */
            scrollToFirstError
          >
            <Form.Item
              name="name"
              label="Nombre de la línea"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa el nombre de la línea.",
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
                  message: "Por favor ingresa la descripción de la línea.",
                  whitespace: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item label="Línea" name="isInstitutional">
              <Radio.Group buttonStyle="solid">
                <Radio.Button
                  value={false}
                  onClick={() => {
                    setIsInstitutional(false);
                  }}
                >
                  CICEI
                </Radio.Button>
                <Radio.Button
                  value={true}
                  onClick={() => {
                    setIsInstitutional(true);
                  }}
                >
                  Institucional
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {isInstitutional === false ? (
              <Form.Item
                name="groupId"
                label="Grupo"
                rules={[
                  { required: true, message: "Por favor selecciona un grupo!" },
                ]}
              >
                <Select placeholder="Selecciona un grupo">
                  {groupList.map((group) => {
                    return (
                      <Select.Option key={group.id} value={group.id}>
                        {" "}
                        {`${group.code} - ${group.name}`}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            ) : null}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" disabled={requesting}>
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
