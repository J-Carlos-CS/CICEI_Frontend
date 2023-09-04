import { useEffect, useState, useCallback, useRef } from "react";
import {
  Steps,
  Button,
  message,
  Row,
  Col,
  Form,
  Input,
  Divider,
  Select,
  DatePicker,
  Typography,
  Modal,
  Spin,
} from "antd";
import LoaderSpin from "../../Components/Layouts/Loader/LoaderSpin";
import UserService from "../../services/UserService";
import TypeInvestigationService from "../../services/TypeInvestigationService";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "../../Auth/userReducer.js";

import moment from "moment";

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

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

const config = {
  rules: [
    {
      type: "object",
      required: true,
      message: "Por favor ingresa el año!",
    },
  ],
};
export default function DirectInvitation() {
  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
  const { current: history } = useRef(useHistory());
  const [visibleModalRefirect, setVisibleModalRefirect] = useState(false);
  const [userProject, setUserProject] = useState(null);
  const [isLoading, setisLoading] = useState({
    status: "success",
    message: "",
  });
  const [isLoadingData, setIsLoadingData] = useState({
    status: "loading",
    message: "",
  });
  const dispatch = useDispatch();

  const fullToken = useRef(null);
  const userLoged = useRef(null);
  const userCredentials = useRef({ email: null, password: null });
  //const { current: query } = useRef(new URLSearchParams(useLocation().search));
  /* const [params, setParams] = useState({
    paramOne: query.get("meta") || "",
    paramTwo: query.get("info") || "",
  }); */
  const [params, setParams] = useState({
    paramOne: new URLSearchParams(useLocation().search).get("meta"),
    paramTwo: new URLSearchParams(useLocation().search).get("info"),
  });
  const [allSteps, setAllSteps] = useState({
    steps: [{ title: "Credenciales" }, { title: "Confirmación" }],
    indexStep: 0,
  });
  const [tutors, setTutors] = useState([]);
  const [typeInvestigation, setTypeInvestigation] = useState([]);
  const [isTutor, setIsTutor] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const onChangeTutor = (e) => {
    let investigation = typeInvestigation.filter(
      (t) =>
        t?.id === e &&
        (t?.name === "Tesis de Grado" ||
        t?.name === "Proyecto de Grado" ||
        t?.name === "Pasantia" ||
        t?.name === "Magíster" ||
        t?.name === "Doctorado")
    );
    if (investigation.length > 0) {
      setIsTutor(true);
    } else {
      setIsTutor(false);
    }
  };
  /* useEffect(() => {
    console.log("logout invitation");
    dispatch(logout());
  }, []); */

  const verifyToken = useCallback(
    async (value1, value2) => {
      try {
        let fullTokenParts = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${value1}.${value2}`;
        fullToken.current = fullTokenParts;
        const {
          data: { response, success, description },
        } = await UserService.verifyJWTDirectInvitation(fullTokenParts);
        if (success) {
          console.log("userProject", response);
          if (userProject?.User?.SystemRol?.name === "Estudiante") {
            setIsStudent(true);
          }
          setUserProject(response);
          setisLoading({ status: "success", message: "" });
        } else {
          if (description === "Error. jwt expired") {
            message.warning({
              content: "La invitación ha caducado.",
              key: "get",
              duration: 5,
            });
          } else {
            message.warning({ content: description, key: "get", duration: 5 });
          }
        }
      } catch (error) {
        message.error(error.message, 5);
      }
    },
    [userProject?.User?.SystemRol?.name]
  );

  const getTutors = useCallback(() => {
    console.log("Tutors");
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { response, description, success },
        } = await UserService.getTutors();
        if (success) {
          let tutors = response.filter((tutor) => tutor.status && tutor.state);
          setTutors(tutors);
          resolve(true);
        } else {
          message.warning({
            content: description,
            key: "getTutors",
            duration: 5,
          });
          reject(false);
        }
      } catch (error) {
        message.warning({
          content: "No se pudo obtener la lista de tutores.",
          key: "getTutors",
          duration: 5,
        });
        reject(false);
      }
    });
  }, []);

  const getTypeInvestigations = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { response, description, success },
        } = await TypeInvestigationService.getTypeInvestigation();
        if (success) {
          setTypeInvestigation(response);
          resolve(true);
        } else {
          message.warning({
            content: description,
            key: "getTypeInvestigation",
            duration: 5,
          });
          reject(false);
        }
      } catch (error) {
        message.warning({
          content: "No se pudo obtener la lista de tipos de investigación.",
          key: "getTypeInvestigation",
          duration: 5,
        });
        reject(false);
      }
    });
  }, []);

  const getData = useCallback(async () => {
    let promises = [getTutors(), getTypeInvestigations()];
    try {
      await Promise.allSettled(promises);
      setIsLoadingData({ status: "success", message: "" });
    } catch (e) {
      message.error("Error en las peticiones", 5);
    }
  }, [getTutors, getTypeInvestigations]);

  useEffect(() => {
    if (isStudent) {
      getData();
    }
  }, [isStudent, getData]);

  useEffect(() => {
    console.log("Hola mundo");
    if (params?.paramOne && params?.paramTwo) {
      verifyToken(params?.paramOne, params?.paramTwo);
    }
  }, [params, verifyToken]);

  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }

  const onFinish = async (credentials) => {
    console.log("Success:", credentials);
    try {
      let {
        data: { response, success, description },
      } = await UserService.validateEmailPassword(credentials);
      if (success) {
        userCredentials.current = {
          email: credentials.email,
          password: credentials.password,
        };
        userLoged.current = response;
        if (allSteps?.indexStep < allSteps?.steps?.length - 1) {
          setAllSteps({ ...allSteps, indexStep: allSteps?.indexStep + 1 });
        }
      } else {
        message.warning({ content: description, key: "validate", duration: 4 });
      }
    } catch (error) {
      message.error({
        content: "Error. " + error.message,
        key: "validate",
        duration: 5,
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onConfirmOk = async () => {
    //console.log("");
    setVisibleModalRefirect(true);
    await new Promise((r) => setTimeout(r, 3000));
    dispatch(login(userLoged.current));
    history.push(`/project/viewforuser/${userProject?.Project?.id}`);
  };
  console.log("compinen");

  const onFinishConfirm = async (values) => {
    try {
      message.loading({
        content: "Procesando...",
        key: "confirm",
        duration: 3,
      });
      console.log("values,", values);
      let user = {
        ...userCredentials.current,
        projectId: userProject?.Project?.id,
        token: fullToken.current,
        typeInvestigationId: values?.typeInvestigationId || null,
        tutorId: values?.tutorId || null,
        semesterStart:
          {
            name: values?.semesterStart?.name || "I",
            year: moment(values?.semesterStart?.year).format("YYYY"),
          } || "",
        titleDocument: values?.titleDocument || "",
      };
      console.log("user", user);
      let {
        data: { success, description },
      } = await UserService.confirmDirectInvitation(user);
      if (success) {
        message.success({
          content: "Ahora eres parte del proyecto.",
          duration: 3,
          key: "confirm",
        });
        onConfirmOk();
      } else {
        if (description === "Error. jwt expired") {
          message.warning({
            content: "La invitación ha caducado.",
            key: "confirm",
            duration: 5,
          });
        } else {
          message.warning({
            content: description,
            key: "confirm",
            duration: 5,
          });
        }
      }
    } catch (e) {
      if (e?.message === "Error. jwt expired") {
        message.error({
          content: "La invitación ha caducado.",
          key: "confirm",
          duration: 5,
        });
      } else {
        message.error({ content: e?.message, key: "get", duration: 5 });
      }
    }
  };

  return (
    <Row align="center">
      <Col span={20}>
        <Steps current={allSteps?.indexStep}>
          {allSteps?.steps.map((step) => (
            <Step key={step?.title} title={step?.title} />
          ))}
        </Steps>
        <div className="steps-content" style={{ marginTop: "4em" }}>
          <Row align="center">
            <Col>
              <Paragraph>
                <strong>Ingresa tus credenciales del sistema</strong>
              </Paragraph>
            </Col>
            <Col span={20}>
              {allSteps?.steps[allSteps?.indexStep]?.title ===
                "Credenciales" && (
                <Form
                  name="credentials"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 10,
                  }}
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingresa tu email!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Contraseña"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingresa tu contraseña!",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{
                      offset: 8,
                      span: 16,
                    }}
                  >
                    <Button type="primary" htmlType="submit">
                      Aceptar
                    </Button>
                  </Form.Item>
                </Form>
              )}
              {allSteps?.steps[allSteps?.indexStep]?.title ===
                "Confirmación" && (
                <>
                  <Title level={2}>Invitación</Title>
                  <Paragraph>
                    <Text>
                      Hola{" "}
                      <strong>{`${userProject?.User?.firstName} ${userProject?.User?.lastName}`}</strong>{" "}
                      fuiste invitado a unirte al proyecto{" "}
                      <strong>{`${userProject?.Project?.title}`}</strong>.
                    </Text>
                  </Paragraph>
                  <Paragraph>
                    <Text>
                      Por favor presiona el boton de confirmar para agregarte al
                      proyecto.
                    </Text>
                  </Paragraph>
                  {isLoadingData?.status === "loading" &&
                    userProject?.User?.SystemRol?.name === "Estudiante" && (
                      <LoaderSpin isLoading={isLoadingData} />
                    )}
                  {userProject?.User?.SystemRol?.name === "Estudiante" &&
                    isLoadingData?.status === "success" && (
                      <Form
                        className="form"
                        {...formItemLayout}
                        name="studentJob"
                        onFinish={onFinishConfirm}
                        scrollToFirstError
                      >
                        <Divider>Describe tu trabajo/propuesta</Divider>

                        <Form.Item
                          name="titleDocument"
                          label="Titulo de documento"
                          rules={[
                            {
                              required: true,
                              message:
                                "Por favor ingresa el titulo de documento de tu trabajo.",
                              whitespace: true,
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="typeInvestigationId"
                          label="Tipo de trabajo"
                          rules={[
                            {
                              required: true,
                              message:
                                "Por favor selecciona el tipo de trabajo.",
                            },
                          ]}
                        >
                          <Select
                            onChange={(e) => {
                              onChangeTutor(e);
                            }}
                          >
                            {typeInvestigation.map((t) => (
                              <Select.Option key={t.id} value={t.id}>
                                {t.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          name="semesterStart"
                          label="Semestre de inicio"
                          // noStyle
                          rules={[
                            {
                              required: true,
                              message: "El semestre es obligatorio",
                            },
                          ]}
                        >
                          <Input.Group>
                            <Form.Item
                              name={["semesterStart", "name"]}
                              noStyle
                              rules={[
                                {
                                  //required: true,
                                  //message: "El semestre es obligatorio",
                                },
                              ]}
                            >
                              <Select>
                                <Select.Option value={"I"}>I</Select.Option>
                                <Select.Option value={"II"}>II</Select.Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              name={["semesterStart", "year"]}
                              noStyle
                              {...config}
                            >
                              <DatePicker
                                style={{ width: "50%" }}
                                picker="year"
                              />
                            </Form.Item>
                          </Input.Group>
                        </Form.Item>

                        {isTutor ? (
                          <Form.Item
                            name="tutorId"
                            label="Tu tutor"
                            rules={[
                              {
                                required: true,
                                message: "Por favor selecciona a tu tutor",
                              },
                            ]}
                          >
                            <Select>
                              {tutors.map((t) => (
                                <Select.Option key={t.id} value={t.id}>
                                  {t.firstName + " " + t.lastName}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        ) : null}

                        <Form.Item {...tailFormItemLayout}>
                          <Button type="primary" htmlType="submit">
                            Aceptar
                          </Button>
                        </Form.Item>
                      </Form>
                    )}
                  {userProject?.User?.SystemRol?.name !== "Estudiante" && (
                    <Button type="primary" onClick={()=>{onFinishConfirm();}}>Confirmar</Button>
                  )}
                </>
              )}
            </Col>
          </Row>
        </div>
      </Col>
      <Modal
        title={"Agregado correctamente al Proyecto"}
        footer={null}
        visible={visibleModalRefirect}
      >
        <div
          size="large"
          style={{ display: "flex", justifyContent: "center", margin: "2em" }}
        >
          <Spin size="large" tip="Redirigiendo al proyecto..." />
        </div>
      </Modal>
    </Row>
  );
}
