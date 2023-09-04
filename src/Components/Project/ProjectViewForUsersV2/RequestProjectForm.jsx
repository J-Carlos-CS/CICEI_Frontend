import { useState, useEffect } from "react";
import { Divider, Button, Modal, Form,DatePicker ,Select, Input, message } from "antd";
//import { useHistory } from "react-router";
import TypeInvestigationService from "../../../services/TypeInvestigationService.js";
//import SemesterService from "../../../services/SemesterService";
import UserService from "../../../services/UserService.js";
//import UserProjectService from "../../../services/UserProjectService.js";
import moment from "moment";

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

export default function RequestProjectForm({
  isModalVisible,
  userSesion,
  project = null,
  setIsModalVisible,
  isOwner,
  handleOkSubscribe,
}) {
  const [form] = Form.useForm();
  const [typeInvestigation, setTypeInvestigation] = useState([]);
  const [isTutor, setIsTutor] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (userSesion.rolName === "Estudiante") {
      getTypeInvestigation();
      /* getSemesters(); */
      getTutors();
    }
  }, [userSesion.rolName]);

  const getTypeInvestigation = () => {
    TypeInvestigationService.getTypeInvestigation()
      .then((res) => {
        if (res.data?.success) {
          setTypeInvestigation(res.data?.response);
        } else {
          message.error(res.data?.description, 3);
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
      });
  };
  /* const getSemesters = () => {
    SemesterService.getSemesters()
      .then((res) => {
        if (res.data?.success) {
          setSemesters(res.data?.response);
        } else {
          message.error(res.data?.description, 3);
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        console.log(e);
      });
  }; */
  const getTutors = () => {
    UserService.getTutors()
      .then((res) => {
        if (res.data?.success) {
          let data = res.data?.response?.filter((u) => u.state === true) || [];
          setTutors(data);
        } else {
          message.error(res.data?.description, 3);
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        console.log(e);
      });
  };
  const handleOk = () => {
    //setIsModalVisible(false);
    subscribe({});
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = (values) => {
    subscribe(values);
  };

  const subscribe = async (values) => {
    setRequesting(true);
    let userProject = null;
    if (userSesion.rolName === "Administrador") {
      userProject = {
        userId: userSesion.id || null,
        projectId: project.id || null,
        rolProjectId: userSesion.systemRolId || null,
        isMain: false,
        acceptance: "Aceptado",
        state: true,
        status: true,
        uid: userSesion.id || null,
      };
    } else if (
      userSesion.rolName === "CICEI" ||
      userSesion.rolName === "Asociado" ||
      userSesion.rolName === "Consultor"
    ) {
      let acceptance = isOwner ? "Aceptado" : "Pendiente";
      userProject = {
        userId: userSesion.id || null,
        projectId: project.id || null,
        rolProjectId: userSesion.systemRolId || null,
        isMain: false,
        acceptance: acceptance,
        state: true,
        status: true,
        uid: userSesion.id || null,
      };
    } else {
      userProject = {
        userId: userSesion.id || null,
        projectId: project.id || null,
        rolProjectId: userSesion.systemRolId || null,
        isMain: false,
        acceptance: "Pendiente",
        state: true,
        status: true,
        uid: userSesion.id || null,
        titleDocument: values.titleDocument || null,
        semesterStartId: values.semesterStartId || null,
        semesterStart: {
          name: values?.semester?.name || null,
          year: moment(values?.semester?.year)?.format("YYYY") || null,
        },
        typeInvestigationId: values.typeInvestigationId || null,
        tutorId: values.tutorId || null,
        institutionId: userSesion.institutionId,
        careerId: userSesion.careerId,
      };
    }
    await handleOkSubscribe(userProject, setRequesting);
  };
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

  return (
    <>
      {userSesion.rolName === "Estudiante" ? (
        <>
          <Modal
            title="Solicitud de inscripción"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
            footer={null}
          >
            <Form
              className="form"
              {...formItemLayout}
              form={form}
              name="register"
              onFinish={onFinish}
              scrollToFirstError
            >
              <Divider>Describe tu trabajo</Divider>

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
                  {typeInvestigation.map((t) => (
                    <Select.Option key={t.id} value={t.id}>
                      {t.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <Form.Item
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
                name="semester"
                label="Semestre de inicio"
                // noStyle
                rules={[
                  { required: true, message: "El semestre es obligatorio" },
                ]}
              >
                <Input.Group>
                  <Form.Item
                    name={["semester", "name"]}
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
                  <Form.Item name={["semester", "year"]} noStyle {...config}>
                    <DatePicker style={{ width: "50%" }} picker="year" />
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
                <Button type="primary" htmlType="submit" disabled={requesting}>
                  Aceptar
                </Button>
                <Button
                  type="secondary"
                  htmlType="button"
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  Cancelar
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      ) : (
        <>
          <Modal
            title="Solicitud de inscripción"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Aceptar"
            cancelText="Cancelar"
            width={1000}
          >
            <span>
              {`¿Desea solicitar unirse al proyecto "${project.title}?"`}
            </span>
          </Modal>
        </>
      )}
    </>
  );
}
