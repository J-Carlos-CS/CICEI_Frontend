import { useState, useEffect, useCallback } from "react";
import UserService from "../../../services/UserService";
//import TypeInvestigationService from "../../../services/TypeInvestigationService";
import SystemRolService from "../../../services/SystemRolService.js";
import LoaderSpin from "../../../Components/Layouts/Loader/LoaderSpin";
import GradeService from "../../../services/GradeService";
import CareerService from "../../../services/CareerService";
//import SemesterService from "../../../../services/SemesterService";
import InstitutionService from "../../../services/InstitutionService.js";
import { selectUser } from "../../../Auth/userReducer";
import { useSelector } from "react-redux";
import {
  Input,
  Radio,
  Modal,
  Form,
  Row,
  Col,
  message,
  Select,
  Divider,
  Button,
  //DatePicker,
} from "antd";
//import moment from "moment";

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

/* const { Option } = Select;

const config = {
  rules: [
    {
      type: "object",
      required: true,
      message: "Por favor ingresa el año!",
    },
  ],
}; */

export default function SinteticUserForm({
  sinteticSelected = null,
  setShowModalForm,
  onCloseForm,
  onCancelForm,
}) {
  const [systemRols, setSystemRols] = useState([]);
  //const [typeInvestigations, setTypeInvestigations] = useState([]);
  const [otherInstitution, setOtherInstitution] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  /*   const [isTutor, setIsTutor] = useState(false);
  const [tutors, setTutors] = useState([]); */
  const globalUser = useSelector(selectUser);

  const [isLoading, setIsLoading] = useState({
    status: "loading",
    message: "",
  });
  const [typeUser, setTypeUser] = useState("");
  const [otherCareer, setOtherCareer] = useState(false);
  const [careers, setCareers] = useState([]);

  const [grades, setGrades] = useState([]);
  const [form] = Form.useForm();
  const [FormFields, setFormFields] = useState(null);
  const onChangeTypeUser = (e) => {
    const typeuser = systemRols.filter(
      (sr) => sr.id === parseInt(e.target.value)
    )[0].name;
    if (typeUser !== "Estudiante") {
      setOtherCareer(false);
      setOtherInstitution(false);
    }
    setTypeUser(typeuser);
  };

  const getFormFields = useCallback((user) => {
    setFormFields(() => [
      {
        name: ["systemRolId"],
        value: user?.SystemRol?.id,
      },
      {
        name: ["firstName"],
        value: user?.firstName,
      },
      {
        name: ["lastName"],
        value: user?.lastName,
      },
      {
        name: ["grade"],
        value: user?.grade,
      },
      {
        name: ["gradeId"],
        value: user?.gradeId,
      },
      {
        name: ["institutionId"],
        value: user?.institutionId,
      },
      {
        name: ["careerId"],
        value: user?.careerId,
      },
    ]);
  }, []);

  const onChangeCareer = (e) => {
    if (e === "Other") {
      setOtherCareer(true);
    } else {
      setOtherCareer(false);
    }
  };

  /*   const onChangeTutor = (e) => {
    let investigation = typeInvestigations.filter(
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
  const onChangeInstitution = (e) => {
    if (e === "Other") {
      setOtherInstitution(true);
    } else {
      setOtherInstitution(false);
    }
  };

  /*   const getTypeInvestigation = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      let res = await TypeInvestigationService.getTypeInvestigation();
      console.log("res", res);
      if (res.data?.success) {
        resolve(res.data.response);
      } else {
        reject(res.data.description);
      }
    });
  }, []); */
  const getCareers = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      let res = await CareerService.getCareers();
      if (res.data?.success) {
        res.data.response.push({ name: "Otra", id: "Other" });
        resolve(res.data.response);
      } else {
        reject(res.data.description);
      }
    });
  }, []);

  const getSystemRols = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      let res = await SystemRolService.getSytemRolForRegister();
      if (res.data?.success) {
        resolve(res.data.response);
      } else {
        reject(res.data.description);
      }
    });
  }, []);

  const getGrades = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      let res = await GradeService.getGrades();
      if (res.data?.success) {
        resolve(res.data?.response);
      } else {
        reject(res.data?.description);
      }
    });
  }, []);

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

  const getInstitutions = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      let res = await InstitutionService.getInstitutions();
      if (res.data?.success) {
        res.data?.response?.push({ name: "Otra", id: "Other" });
        resolve(res.data?.response);
      } else {
        reject(res.data?.description);
      }
    });
  }, []);

  /*   const getTutors = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      let res = await UserService.getTutors();
      if (res.data?.success) {
        let tutors = res.data?.response?.filter(
          (tutor) => tutor.status && tutor.state
        );
        resolve(tutors);
      } else {
        reject(res.data?.description);
      }
    });
  }, []); */

  const onOk = () => {};

  const onCancel = () => {
    onCancelForm();
  };

  const onFinish = async (values) => {
    console.log("values", values);
    try {
      const user = {
        id: sinteticSelected?.id || 0,
        lastName: values.lastName || null,
        firstName: values.firstName || null,
        systemRolId: values.systemRolId || null,
        grade: values.grade || null,
        gradeId: values.gradeId || null,
        institutionId:
          values.institutionId === "Other"
            ? 0
            : values.institutionId
            ? values.institutionId
            : null,
        careerId:
          values.careerId === "Other"
            ? 0
            : values.careerId
            ? values.careerId
            : null, //values.careerId || null,
        otherCareerName: values.otherCareerName || null,
        otherInstitutionName: values.otherInstitutionName || null,
        otherInstitutionAcronym: values.otherInstitutionAcronym || null,
        country: values.country || null,
        uid: globalUser.id,
      };
      //console.log("objectUser", user);
      message.loading({ content: "Procesando...", key: "create" });
      let response = null;
      if (sinteticSelected) {
        response = await UserService.editUserSinteticAdmin(user);
      } else {
        response = await UserService.registerUserSinteticAdmin(user);
      }
      if (response.data.success) {
        onCloseForm({ success: true, message: null }, setShowModalForm);
      } else {
        onCloseForm(
          { success: false, message: response?.data?.description },
          setShowModalForm
        );
      }
    } catch (e) {
      onCloseForm({ success: false, message: e.message }, setShowModalForm);
    }
  };
  const getDataForm = useCallback(async () => {
    try {
      let errorBool = false;
      let listSetters = [
        setSystemRols,
        //setTypeInvestigations,
        setGrades,
        setCareers,
        setInstitutions,
        // setTutors,
      ];
      let values = await Promise.allSettled([
        getSystemRols(),
        //getTypeInvestigation(),
        getGrades(),
        getCareers(),
        getInstitutions(),
        //getTutors(),
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
  }, [
    //getTypeInvestigation,
    getSystemRols,
    getGrades,
    getCareers,
    getInstitutions,
    //getTutors,
  ]);

  const prefixSelector = (myGrades) => {
    return (
      <Form.Item
        name="gradeId"
        noStyle
        rules={[
          {
            required: true,
            message: "Por favor selecciona tu grado académico",
          },
        ]}
      >
        <Select style={{ width: 150 }}>
          {myGrades.map((grade) => (
            <Select.Option value={grade.id} key={grade.id}>
              {grade.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    );
  };

  useEffect(() => {
    console.log("Control");
    getDataForm();
  }, [getDataForm]);
  useEffect(() => {
    if (sinteticSelected) {
      console.log("control");
      if (sinteticSelected?.SystemRol?.name === "Estudiante") {
        setTypeUser("Estudiante");
      }
      getFormFields(sinteticSelected);
    }
  }, [getFormFields, sinteticSelected]);

  /*   
      if (isLoading.status === "loading" || isLoading.status === "error") {
        return <LoaderSpin isLoading={isLoading} />;
      } */

  return (
    <Modal
      title={
        sinteticSelected
          ? "Editar usuario sintético"
          : "Registrar usuario sintético"
      }
      okText="Aceptar"
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
            <Form
              {...formItemLayout}
              fields={FormFields}
              form={form}
              name="register sintetic user"
              onFinish={onFinish}
              preserve={false}
              scrollToFirstError
            >
              <Form.Item
                label="Investigador"
                name="systemRolId"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona el tipo de investigador.",
                  },
                ]}
              >
                <Radio.Group buttonStyle="solid">
                  {systemRols.map((sr) => (
                    <Radio.Button
                      key={sr.id}
                      value={sr.id}
                      onClick={onChangeTypeUser}
                    >
                      {sr.name}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="firstName"
                label="Nombres"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tus nombres.",
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Apellidos"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tus apellidos.",
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="grade"
                label="Grado Académico"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu especialidad o afinidad",
                  },
                ]}
              >
                <Input
                  addonBefore={prefixSelector(grades)}
                  placeholder={"(Ej: En Química orgánica)"}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              {typeUser === "Estudiante" ? (
                <>
                  <Form.Item
                    name="careerId"
                    label="Carrera"
                    rules={[
                      {
                        required: true,
                        message: "Por favor selecciona tu carrera.",
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
                      onChange={onChangeCareer}
                    >
                      {careers.map((c) => (
                        <Select.Option key={c.id} value={c.id}>
                          {c.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {otherCareer && (
                    <Form.Item
                      name="otherCareerName"
                      label=" "
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingresa el nombre de tu carrera.",
                          whitespace: true,
                        },
                      ]}
                    >
                      <Input
                        placeholder={
                          "Ingrese el nombre de tu carrera.(Ej: ingenieria petrolera)"
                        }
                      />
                    </Form.Item>
                  )}
                </>
              ) : null}
              {typeUser === "Estudiante" ? (
                <>
                  <Divider>Institución del estudiante</Divider>
                  <Form.Item
                    name="institutionId"
                    label="Institución"
                    rules={[
                      {
                        required: true,
                        message:
                          "Por favor selecciona la institución a la que perteneces.",
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
                      onChange={onChangeInstitution}
                    >
                      {institutions.map((i) => (
                        <Select.Option key={i.id} value={i.id}>
                          {i.shortName ? `(${i.shortName}) ${i.name}` : "Otra"}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {otherInstitution ? (
                    <>
                      <Form.Item
                        name="otherInstitutionName"
                        label=" "
                        rules={[
                          {
                            required: true,
                            message:
                              "Por favor ingresa ingrese el nombre de la institución.",
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input
                          placeholder={
                            "Ingrese el nombre de la institución.(Ej: Universidad Catolica Boliviana)"
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        name="otherInstitutionAcronym"
                        label=" "
                        rules={[
                          {
                            required: true,
                            message:
                              "Por favor ingrese las siglas de la institución.",
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input
                          placeholder={"Siglas de la institución. (Ej: UCB)"}
                        />
                      </Form.Item>
                      <Form.Item
                        name="country"
                        label=" "
                        rules={[
                          {
                            required: true,
                            message:
                              "Por favor ingrese el pais al que pertenece la institución.",
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input
                          placeholder={"Pais de la institución. (Ej: Bolivia)"}
                        />
                      </Form.Item>
                    </>
                  ) : null}
                </>
              ) : null}
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  {sinteticSelected ? "Editar" : "Registrar"}
                </Button>
                <Button
                  type="secondary"
                  htmlType="button"
                  onClick={() => {
                    onCancelForm();
                  }}
                >
                  Cancelar
                </Button>
              </Form.Item>
            </Form>
          )}
        </Col>
      </Row>
    </Modal>
  );
}
