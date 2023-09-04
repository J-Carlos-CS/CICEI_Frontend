import {
  Typography,
  Row,
  Col,
  Card,
  //Select,
  Button,
  /*  Modal,
  message,
  Form,
  Input,
  Divider, */
  Empty,
} from "antd";
import { useHistory } from "react-router";
/* import TypeInvestigationService from "../../../services/TypeInvestigationService";
import UserService from "../../../services/UserService";
import SemesterService from "../../../services/SemesterService";
import StudentJobService from "../../../services/StudentJobService.js"; */
const { Text } = Typography;

/* const formItemLayout = {
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
 */
export default function MyJobs({ list = [], getData }) {
  let history = useHistory();
/*   const [typeInvestigation, setTypeInvestigation] = useState([]);
  const [studentJobTarget, setstudentJobTarget] = useState(null);
  const [userProjectId, setuserProjectId] = useState(null); */
/*   const [isModalVisible, setIsModalVisible] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [form] = Form.useForm();
  const [isTutor, setIsTutor] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [isModalFinishJobVisible, setisModalFinishJobVisible] = useState(false);
  const [fields, setFields] = useState([
    {
      name: ["titleDocument"],
      value: "",
    },
    {
      name: ["typeInvestigationId"],
      value: 0,
    },
    {
      name: ["semesterStartId"],
      value: 0,
    },
    {
      name: ["tutorId"],
      value: 0,
    },
  ]); */

/*   useEffect(() => {
    if (
      list.some((l) => {
        return l.StudentJobs.some((sj) => sj.acceptance === "Rechazado");
      })
    ) {
      getTypeInvestigation();
      getSemesters();
      getTutors();
    }
  }, [list]); */

  /* const showModal = (sj) => {
    setIsModalVisible(true);
    if (sj.tutorId) {
      setIsTutor(true);
    }
    setuserProjectId(sj.id);
    setFields([
      {
        name: ["titleDocument"],
        value: sj.titleDocument || "",
      },
      {
        name: ["typeInvestigationId"],
        value: sj.TypeInvestigation?.id || 0,
      },
      {
        name: ["semesterStartId"],
        value: sj.semesterStartId || 0,
      },
      {
        name: ["tutorId"],
        value: sj.tutorId || 0,
      },
    ]);
  }; */

/*   const handleOkFinishJob = () => {
    let studentJobR = {
      ...studentJobTarget,
      currentProgress: "Terminado",
    };
    StudentJobService.updateStudentJob(studentJobR)
      .then((res) => {
        if (res.data?.success) {
          message.success("Trabajo actualizado", 4);
          setstudentJobTarget(null);
          setisModalFinishJobVisible(false);
          getData();
        } else {
          message.error(
            "No se pudo atualizar el trabajo. " + res.data?.description,
            5
          );
        }
      })
      .catch((e) => {
        message.error("Hubo un error. " + e.message);
        console.log("error.", e.message);
      });
  }; */

/*   const handleCancelFinishJob = () => {
    setstudentJobTarget(null);
    setisModalFinishJobVisible(false);
  };

  const handleOk = () => {
    //setIsModalVisible(false);
  };
 */
/*   const handleCancel = () => {
    setFields([
      {
        name: ["titleDocument"],
        value: "",
      },
      {
        name: ["typeInvestigationId"],
        value: 0,
      },
      {
        name: ["semesterStartId"],
        value: 0,
      },
      {
        name: ["tutorId"],
        value: 0,
      },
    ]);
    setuserProjectId(null);
    setIsModalVisible(false);
  }; */
/*   const onFinish = (values) => {
    let studentJobUpdate = {
      ...values,
      typeInvestigationId: values.typeInvestigationId || null,
      semesterStartId: values.semesterStartId || null,
      tutorId: values.tutorId || null,
      acceptance: "Repropuesto",
      id: userProjectId,
    };
    StudentJobService.updateStudentJob(studentJobUpdate)
      .then((res) => {
        if (res.data?.success) {
          message.success("Trabajo repropuesto.");
          handleCancel();
          getData();
        } else {
          message.error("Hubo un error." + res.data?.description, 5);
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error("Hubo un problema en el servidor. " + e.message, 5);
      });
  }; */

/*   const getTypeInvestigation = () => {
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
        //console.log(e);
      });
  }; */

/*   const getSemesters = () => {
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
        //console.log(e);
      });
  };
  const getTutors = () => {
    UserService.getTutors()
      .then((res) => {
        if (res.data?.success) {
          setTutors(res.data?.response);
        } else {
          message.error(res.data?.description, 3);
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        //console.log(e);
      });
  }; */

/*   const onChangeTutor = (e) => {
    let investigation = typeInvestigation.filter(
      (t) =>
        t.id === e &&
        (t.name === "Tesis de Grado" ||
          t.name === "Proyecto de Grado" ||
          t.name === "Pasantia")
    );
    if (investigation.length > 0) {
      setIsTutor(true);
    } else {
      setIsTutor(false);
    }
  }; */

  return (
    <>
      {list.length > 0 ? (
        <Row align="start" style={{ marginTop: "1.5em" }}>
          <Col>
            <Text>Estos son tus trabajos :</Text>
          </Col>
        </Row>
      ) : (
        <Row align="center" style={{ marginTop: "1.5em" }}>
          <Col>
            <Empty
              imageStyle={{
                height: 60,
              }}
              description={
                <span>
                  No tienes ningun trabajo aceptado/pendiente de
                  aceptación/rechazado.
                </span>
              }
            ></Empty>
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]} align="center">
        {list.map((l) => {
          return l.StudentJobs.map((sj) => {
            let actionList = [
              <Button
                type="primary"
                ghost
                key="view-project"
                onClick={() => {
                  history.push(`/project/view/${l.Project?.id}`);
                }}
              >
                Ir al Proyecto
              </Button>,
            ];
            /*   if (sj.acceptance === "Rechazado") {
              actionList.push(
                <Button
                  type="primary"
                  ghost
                  key="view-project"
                  onClick={() => {
                    showModal(sj);
                  }}
                >
                  Replantear
                </Button>
              );
            }
            if (
              sj?.acceptance === "Aceptado" &&
              sj?.Progress?.stateProgress === "En progreso"
            ) {
              actionList.push(
                <Button
                  type="primary"
                  ghost
                  key="view-project"
                  onClick={() => {
                    setstudentJobTarget(sj);
                    setisModalFinishJobVisible(true);
                  }}
                >
                  Finalizar
                </Button>
              );
            } */

            return (
              <Col key={sj.id} xs={20} sm={10} md={10} lg={10} xl={10}>
                <Card
                  title={sj.TypeInvestigation.name}
                  bordered={false}
                  actions={actionList}
                >
                  <div>
                    <b>Título de Trabajo: </b>
                    {sj.titleDocument}
                  </div>
                  <div>
                    <b>Proyecto: </b>
                    {l.Project?.title}
                  </div>
                  <div>
                    <b>Estado en el proyecto: </b>
                    {sj.acceptance}
                  </div>
                  <div>
                    <b>Progreso: </b>
                    {sj.Progress?.stateProgress}
                  </div>
                </Card>
              </Col>
            );
          });
        })}
      </Row>
      {/* <>
        <Modal
          title="Replanteando solicitud"
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
            fields={fields}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Divider>Replantea tu trabajo/propuesta</Divider>

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
            <Form.Item
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
                Replantear
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

        {isModalFinishJobVisible && (
          <Modal
            title="Finalizar Trabajo"
            visible={isModalFinishJobVisible}
            onOk={handleOkFinishJob}
            okText="Acpetar"
            cancelText="Cancelar"
            onCancel={handleCancelFinishJob}
          >
            <p>
              Si aceptas daras por terminado tu trabajo con titulo:{" "}
              <strong>{`"${studentJobTarget?.titleDocument}"`}</strong> y ya no
              podras cambiar el estado de tu trabajo.
            </p>
          </Modal>
        )}
      </> */}
    </>
  );
}
