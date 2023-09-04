import React, { useState, useEffect, useCallback } from "react";
import {
  Col,
  message,
  Modal,
  Row,
  Typography,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
} from "antd";
import UserService from "../../../../services/UserService";
//import SemesterService from "../../../../services/SemesterService";
import LoaderSpin from "../../../Layouts/Loader/LoaderSpin";
import TypeInvestigationService from "../../../../services/TypeInvestigationService";
import { selectUser } from "../../../../Auth/userReducer";
import { useSelector } from "react-redux";
import moment from "moment";
const { Title } = Typography;
const { Option } = Select;

const config = {
  rules: [
    {
      type: "object",
      required: true,
      message: "Por favor ingresa el año!",
    },
  ],
};
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

export default function ModalInviteUser({
  setShowModalForm,
  projectId,
  onCloseForm,
  userId,
}) {
  const [isLoading, setIsLoading] = useState({
    status: "loading",
    message: "",
  });
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const [tutors, setTutors] = useState([]);
  const [isTutor, setIsTutor] = useState(false);
  const [typeInvestigations, setTypeInvestigations] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const globalUser = useSelector(selectUser);

  const getUser = useCallback(async () => {
    try {
      let res = await UserService.getSinteticUserById(userId);
      if (res.data?.success) {
        console.log("myUser", userId);
        setUser(res.data?.response || null);
        setIsLoading({ status: "success", message: "" });
      } else {
        setIsLoading({ status: "error", message: res.data.description });
        message.error(res.data.decription, 5);
      }
    } catch (e) {
      message.error(e.message, 5);
    }
  }, [userId]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const onCancel = () => {
    setShowModalForm(false);
  };

  /*  const getSemesters = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      let res = await SemesterService.getSemesters();
      if (res.data?.success) {
        resolve(res.data?.response);
      } else {
        reject(res.data?.description);
      }
    });
  }, []); */

  const getTutors = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      let res = await UserService.getTutors();
      if (res.data?.success) {
        let tutors = res.data?.response?.filter(
          (tutor) => tutor.status /* && tutor.state */
        );
        resolve(tutors);
      } else {
        reject(res.data?.description);
      }
    });
  }, []);

  const getTypeInvestigation = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      let res = await TypeInvestigationService.getTypeInvestigation();
      console.log("res", res);
      if (res.data?.success) {
        resolve(res.data.response);
      } else {
        reject(res.data.description);
      }
    });
  }, []);

  const getDataForm = useCallback(async () => {
    try {
      let errorBool = false;
      let listSetters = [setTypeInvestigations, setTutors];
      let values = await Promise.allSettled([
        getTypeInvestigation(),
        getTutors(),
      ]);
      values.forEach((result, index) => {
        if (result.status === "rejected") {
          errorBool = true;
          message.error(
            "Error al obtener los datos del servidor. " + result.reason,
            5
          );
        } else {
          listSetters[index](result.value);
        }
      });
      if (!errorBool) {
        setIsLoading({ status: "success", message: "" });
      }
    } catch (e) {
      console.log(e.message);
      message.error("Error. " + e.message, 5);
    }
  }, [getTypeInvestigation, getTutors]);

  const onFinish = async (values) => {
    /*  console.log("values", values);
    console.log("user",user); */
    setRequesting(true);
    try {
      let userForDB = null;
      userForDB = {
        id: user.id,
        lastName: user.lastName || null,
        firstName: user.firstName || null,
        systemRolId: user?.systemRolId || null,
        projectId: projectId || null,
        grade: user?.grade || null,
        gradeId: user?.gradeId || null,
        institutionId: user.institutionId || null,
        careerId: user.careerId,
        isMain: false,
        titleDocument: values.titleDocument || null,
        semesterStartId: values.semesterStartId || null,
        semesterStart: {
          period: values?.semesterStart?.name || null,
          year: moment(values?.semesterStart?.year)?.format("YYYY") || null,
        },
        typeInvestigationId: values.typeInvestigationId || null,
        tutorId: values.tutorId || null,
        uid: globalUser.id,
      };
      //console.log("object",userForDB )
      message.loading({ content: "Procesando...", key: "create" });

      let response = await UserService.agregateUserToProject(userForDB);
      if (response.data.success) {
        onCloseForm({ success: true, message: "Usuario agregado" }, setShowModalForm);
      } else {
        setRequesting(false);
        onCloseForm({ success: false, message: response?.data?.description }, setShowModalForm);
      }
    } catch (e) {
      setRequesting(false);
      onCloseForm({ success: false, message: e.message }, setShowModalForm);
    }
  };

  const onChangeTutor = (e) => {
    let investigation = typeInvestigations.filter(
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
  useEffect(() => {
    //console.log("Control");
    getDataForm();
  }, [getDataForm]);

  const onOk = () => {};
  return (
    <Modal
      title={!user?.sintetic ? "Invitar a usuario" : "Agregar a usuario"}
      okText={!user?.sintetic ? "Invitar" : "Agregar"}
      cancelText="Cancelar"
      visible={true}
      onOk={onOk}
      onCancel={onCancel}
      maskClosable={false}
      footer={null}
    >
      <Row>
        <Col span={23}>
          {isLoading.status === "loading" || isLoading.status === "error" ? (
            <LoaderSpin isLoading={isLoading} />
          ) : (
            <>
              <Title
                level={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >{`¿Deseas agregar a ${
                user?.firstName.toUpperCase() + user?.lastName.toUpperCase()
              } al Proyecto?`}</Title>
              {user.SystemRol && (
                <>
                  <h3>Rol</h3>
                  <p>{"Investigador " + user.SystemRol?.name}</p>
                </>
              )}
              {user.Grade && (
                <>
                  <h3>Grado académico</h3>
                  <p>{user.Grade?.name + "--" + user.grade}</p>
                </>
              )}
              {user.Institution && (
                <>
                  <h3>Institución</h3>
                  <p>{user.Institution?.name}</p>
                </>
              )}
              {user.Career && (
                <>
                  <h3>Institución</h3>
                  <p>{user.Career?.name}</p>
                </>
              )}
              {user.status ? (
                <>
                  <>
                    <h3>Estado del usuario</h3>
                    <p>{!user.sintetic ? "Usuario Real" : "Usuario Sintético"}</p>
                  </>
                </>
              ) : null}

              <>
                <Form
                  {...formItemLayout}
                  //fields={fields}
                  form={form}
                  name="register sintetic user"
                  onFinish={onFinish}
                  preserve={false}
                  scrollToFirstError
                >
                  {user.SystemRol.name === "Estudiante" ? (
                    <>
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
                            message: "Por favor selecciona el tipo de trabajo.",
                          },
                        ]}
                      >
                        <Select
                          onChange={(e) => {
                            onChangeTutor(e);
                          }}
                        >
                          {typeInvestigations.map((t) => (
                            <Select.Option key={t.id} value={t.id}>
                              {t.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      {/*   <Form.Item
                        name="semesterStartId"
                        label="Semestre de Inicio"
                        rules={[
                          {
                            required: true,
                            message:
                              "Por favor selecciona el semestre que inicia/inicio el trabajo.",
                          },
                        ]}
                      >
                        <Select>
                          {semesters.map((t) => (
                            <Select.Option key={t.id} value={t.id}>
                              {t.name + "-" + t.year}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item> */}
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
                              <Option value={"I"}>I</Option>
                              <Option value={"II"}>II</Option>
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
                          <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                              if (
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              ) {
                                return true;
                              } else {
                                return false;
                              }
                            }}
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                          >
                            {tutors.map((t) => (
                              <Select.Option key={t.id} value={t.id}>
                                {t.firstName + " " + t.lastName}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      ) : null}
                    </>
                  ) : null}

                  <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" disabled={requesting}>
                      Agregar
                    </Button>
                    <Button
                      type="secondary"
                      htmlType="button"
                      onClick={() => {
                        setShowModalForm(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  </Form.Item>
                </Form>
              </>
            </>
          )}
        </Col>
      </Row>
    </Modal>
  );
}
