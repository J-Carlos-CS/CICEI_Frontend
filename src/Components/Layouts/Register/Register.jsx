import { useState, useEffect, useRef, useCallback } from "react";
import {
  Form,
  Input,
  Cascader,
  Select,
  Button,
  Radio,
  DatePicker,
  Divider,
  message,
  InputNumber,
  Row,
  Col,
  Typography,
} from "antd";
import { useHistory, useLocation } from "react-router";
import "./Register.css";
import InstitutionService from "../../../services/InstitutionService.js";
import TypeInvestigationService from "../../../services/TypeInvestigationService.js";
import CareerService from "../../../services/CareerService";
import SemesterService from "../../../services/SemesterService";
import ProjectService from "../../../services/ProjectService.js";
import UserService from "../../../services/UserService.js";
import SystemRolService from "../../../services/SystemRolService.js";
import GradeService from "../../../services/GradeService";
import LoaderSpin from "../Loader/LoaderSpin";
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

//const { Option } = Select;

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

export default function Register() {
  const [form] = Form.useForm();
  const [institutions, setInstitutions] = useState([]);
  const [typeInvestigation, setTypeInvestigation] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [careers, setCareers] = useState([]);
  const [projectGroups, setProjectGroups] = useState([]);
  const [isTutor, setIsTutor] = useState(false);
  const [typeUser, setTypeUser] = useState("");
  const [tutors, setTutors] = useState([]);
  const [systemRols, setSystemRols] = useState([]);
  const [grades, setGrades] = useState([]);
  const history = useHistory();
  const [otherInstitution, setotherInstitution] = useState(false);
  const [isLoading, setisLoading] = useState({
    status: "loading",
    message: "",
  });
  const [otherCareer, setOtherCareer] = useState(false);
  const [initialValuesForm, setinitialValuesForm] = useState({});
  const { current: query } = useRef(new URLSearchParams(useLocation().search));
  const [passwordConstrains, setPasswordConstrains] = useState({
    lower: false,
    capital: false,
    number: false,
    character: false,
    space: false,
    length: false,
  });
  const [requesting, setRequesting] = useState(false);
  const onChangeTypeUser = (e) => {
    const typeuser = systemRols.filter(
      (sr) => sr.id === parseInt(e.target.value)
    )[0].name;
    setTypeUser(typeuser);
  };

  const onFinish = (values) => {
    //console.log("values", values);
    setRequesting(true);
    const user = {
      email: values?.email.toLowerCase(),
      password: values?.password,
      lastName: values?.lastName,
      firstName: values?.firstName,
      systemRolId: values?.systemRolId || null,
      projectId: values?.projectId
        ? values?.projectId.length === 3
          ? values?.projectId[2]
          : null
        : null,
      birthDate: values?.birthDate._d,
      grade: values?.grade || null,
      gradeId: values?.gradeId || null,
      institutionId:
        values?.institutionId === "Other"
          ? 0
          : values?.institutionId
          ? values?.institutionId
          : null,
      careerId:
        values?.careerId === "Other"
          ? 0
          : values?.careerId
          ? values?.careerId
          : null, //values.careerId || null,
      otherCareerName: values?.otherCareerName,
      otherInstitutionName: values?.otherInstitutionName,
      otherInstitutionAcronym: values?.otherInstitutionAcronym,
      country: values?.country,
      isMain: false,
      titleDocument: values?.titleDocument || null,
      semesterStartId: values?.semesterStartId || null,
      semesterStart: {
        name: values?.semesterStart?.name || null,
        year: moment(values?.semesterStart?.year)?.format("YYYY") || null,
      },
      typeInvestigationId: values?.typeInvestigationId || null,
      tutorId: values?.tutorId || null,
      ubication: values?.ubication ? values?.ubication?.toUpperCase() : null,
      phoneNumberOne:
        values?.phoneNumberOne?.code && values?.phoneNumberOne?.number
          ? `${values?.phoneNumberOne?.code} ${values?.phoneNumberOne?.number}`
          : null,
      phoneNumberTwo:
        values?.phoneNumberTwo?.code && values?.phoneNumberTwo?.number
          ? `${values?.phoneNumberTwo?.code} ${values?.phoneNumberTwo?.number}`
          : null,
      secondEmail: values?.secondEmail || null,
      token:
        query.get("userInfo") && query.get("userInfoTwo")
          ? `${query.get("userInfo")}.${query.get("userInfoTwo")}`
          : null,
    };
    //? `${query.get("userInfo")}` + "." + `${query.get("userInfoTwo")}`

    message.loading({ content: "Registrando...", key: "update" });

    UserService.registerUser(user)
      .then((res) => {
        if (res.data?.success) {
          message.success({
            content: "Registro exitoso",
            key: "update",
            duration: 5,
          });
          history.push("/");
        } else {
          setRequesting(false);
          message.error({
            content:
              "No se pudo completar el registro. " + res.data?.description,
            key: "update",
            duration: 6,
          });
        }
      })
      .catch((e) => {
        setRequesting(false);
        console.log(e.message);
        message.error({
          content: "No se pudo completar el registro. " + e.message,
          key: "update",
          duration: 6,
        });
      });
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

  const onChangeInstitution = (e) => {
    if (e === "Other") {
      setotherInstitution(true);
    } else {
      setotherInstitution(false);
    }
  };

  const onChangeCareer = (e) => {
    if (e === "Other") {
      setOtherCareer(true);
    } else {
      setOtherCareer(false);
    }
  };

  const sendTokenValidation = useCallback(() => {
    let user = {
      userInfo: query.get("userInfo"),
      userInfoTwo: query.get("userInfoTwo"),
    };
    UserService.sendTokenValidation(user)
      .then((res) => {
        let {
          data: { response, success },
        } = res;
        if (success) {
          let user = {};
          if (response.hasOwnProperty("email")) {
            user = { ...user, email: response.email };
          }
          if (response.hasOwnProperty("systemRolId")) {
            user = {
              ...user,
              systemRolId: response.systemRolId,
              systemRol: response?.systemRol,
            };
          }
          if (
            response.hasOwnProperty("projectId") &&
            response.hasOwnProperty("groupId") &&
            response.hasOwnProperty("lineId")
          ) {
            user = {
              ...user,
              projectId: [
                response.groupId,
                response.lineId,
                response.projectId,
              ],
            };
          }
          setTypeUser(user.systemRol);
          setinitialValuesForm(user);
        } else {
          message.error(res.data?.description, 3);
          if (res.data?.description === "jwt expired") {
            setisLoading({
              status: "error",
              message: "La invitación ha caducado.",
            });
          } else {
            setisLoading({ status: "error", message: res.data?.description });
          }
          //setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        //console.log(e);
        if (e.message === "jwt expired") {
          setisLoading({
            status: "error",
            message: "La invitación ha caducado.",
          });
        } else {
          setisLoading({ status: "error", message: e.message });
        }
      });
  }, [query]);

  useEffect(() => {
    getInstitutions();
    getTypeInvestigation();
    getCareers();
    getProjectsGroups();
    getSemesters();
    getTutors();
    getSystemRols();
    getGrades();
  }, []);

  useEffect(() => {
    if (query.get("userInfo") && query.get("userInfoTwo")) {
      sendTokenValidation();
    }
  }, [query, sendTokenValidation]);

  const getGrades = () => {
    GradeService.getGrades()
      .then((res) => {
        if (res.data?.success) {
          setGrades(res.data?.response);
          //setisLoading({status:true,message:""});
        } else {
          message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        //console.log(e);
        setisLoading({ status: "error", message: e.message });
      });
  };

  const getSystemRols = () => {
    SystemRolService.getSytemRolForRegister()
      .then((res) => {
        if (res.data?.success) {
          setSystemRols(res.data?.response);
          //setisLoading({status:true,message:""});
        } else {
          message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        //console.log(e);
        setisLoading({ status: "error", message: e.message });
      });
  };

  const getTutors = () => {
    UserService.getTutors()
      .then((res) => {
        if (res.data?.success) {
          let tutors = res.data?.response.filter(
            (tutor) => tutor.status && tutor.state
          );
          setTutors(tutors);
        } else {
          /*  message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description }); */
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        //console.log(e);
        setisLoading({ status: "error", message: e.message });
      });
  };

  const getSemesters = () => {
    SemesterService.getSemesters()
      .then((res) => {
        if (res.data?.success) {
          setSemesters(res.data?.response);
          //setisLoading({status:true,message:""});
        } else {
          message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        //console.log(e);
        setisLoading({ status: "error", message: e.message });
      });
  };

  const getProjectsGroups = () => {
    ProjectService.getProjecstByGroups()
      .then((res) => {
        if (res.data?.success) {
          let groups = res.data?.response.map((g) => ({
            value: g.id,
            label: g.code,
            children: g.Lines.map((l) => ({
              value: l.id,
              label: l.code,
              children: l.LineProjects.map((lp) => ({
                value: lp.Project.id,
                label: lp.Project.code,
              })),
            })),
          }));
          setProjectGroups(groups);
        } else {
          message.warning(res.data?.description, 3);
          //setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        //console.log(e);
        //setisLoading({ status: "error", message: e.message });
      });
  };

  const getInstitutions = () => {
    InstitutionService.getInstitutions()
      .then((res) => {
        if (res.data?.success) {
          let dataInstitutions = res.data?.response;
          dataInstitutions.push({ name: "Otra", id: "Other" });
          setInstitutions(dataInstitutions);
        } else {
          message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        //console.log(e);
        setisLoading({ status: "error", message: e.message });
      });
  };

  const getTypeInvestigation = () => {
    TypeInvestigationService.getTypeInvestigation()
      .then((res) => {
        if (res.data?.success) {
          setTypeInvestigation(res.data?.response);
          //setisLoading({status:true,message:""});
        } else {
          message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        //console.log(e);
        setisLoading({ status: "error", message: e.message });
      });
  };

  const getCareers = () => {
    CareerService.getCareers()
      .then((res) => {
        if (res.data?.success) {
          let data = res.data?.response;
          data.push({ name: "Otra", id: "Other" });
          setCareers(data);

          //setisLoading({status:true,message:""});
        } else {
          message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        //console.log(e);
        setisLoading({ status: "error", message: e.message });
      });
  };
  const prefixSelector = (myGrades) => {
    return (
      <Form.Item
        name="gradeId"
        noStyle
        rules={[
          {
            required: true,
            message: "Por favor selecciona tu grado académico ",
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

  if (
    (isLoading.status === "loading" || isLoading.status === "error") &&
    (!institutions.length > 0 ||
      !typeInvestigation.length > 0 ||
      !semesters.length > 0 ||
      !careers.length > 0 ||
      !grades.length > 0 ||
      (initialValuesForm?.systemRol === "Estudiante" &&
        (!projectGroups.length > 0 || !tutors.length > 0)) ||
      !systemRols.length > 0 ||
      (query.get("userInfo") &&
        query.get("userInfoTwo") &&
        !initialValuesForm.hasOwnProperty("email")))
  ) {
    return <LoaderSpin isLoading={isLoading} />;
  }

  return (
    <Row align="center" style={{ marginTop: "2em" }}>
      <Col span={23} style={{ display: "flex", justifyContent: "center" }}>
        <Title level={1}>Registro Sistema CICEI</Title>
      </Col>
      <Col span={23} style={{ display: "flex", justifyContent: "center" }}>
        <Form
          className="form"
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={initialValuesForm}
          scrollToFirstError
        >
          <Form.Item
            label="Investigador"
            name="systemRolId"
            rules={[
              {
                required: true,
                message:
                  "Por favor selecciona el tipo de investigador que eres.",
              },
            ]}
          >
            <Radio.Group
              buttonStyle="solid"
              disabled={initialValuesForm?.hasOwnProperty("systemRolId")}
            >
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
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input disabled={initialValuesForm?.email ? true : false} />
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
            name="birthDate"
            label="Fecha de Nacimiento"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu fecha de nacimiento.",
              },
            ]}
          >
            <DatePicker placeholder="" />
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

          {/*   {typeUser !== "Estudiante" ? (
            <Form.Item
              name="grade"
              label="Grado Academico"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu grado Academico.",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null} */}

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
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              {
                required: true,
                message: "Por favor ingresa una contraseña!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  let lower = /(?=.*[a-z])/;
                  let capital = /(?=.*[A-Z])/;
                  let number = /(?=.*\d)/;
                  let character = /(?=.*[$@$!%*?&.])/;

                  let statusPassword = {
                    lower: false,
                    capital: false,
                    number: false,
                    character: false,
                    space: false,
                    length: false,
                  };

                  if (value) {
                    if (lower.test(value)) {
                      statusPassword.lower = true;
                    }
                    if (capital.test(value)) {
                      statusPassword.capital = true;
                    }
                    if (number.test(value)) {
                      statusPassword.number = true;
                    }
                    if (character.test(value)) {
                      statusPassword.character = true;
                    }
                    let arrayPassword = value.split("");
                    if (!arrayPassword.some((caracter) => caracter === " ")) {
                      statusPassword.space = true;
                    }
                    if (
                      arrayPassword.length >= 8 &&
                      arrayPassword.length <= 20
                    ) {
                      statusPassword.length = true;
                    }
                  }
                  setPasswordConstrains(statusPassword);
                  if (
                    statusPassword.length &&
                    statusPassword.lower &&
                    statusPassword.capital &&
                    statusPassword.number &&
                    statusPassword.space &&
                    statusPassword.character
                  ) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(
                      new Error("La contraseña no cumple con las condiciones")
                    );
                  }
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirmar Contraseña"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("Las contraseñas no coinciden.")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Row>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span>La contraseña debe tener:</span>
            </Col>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span
                style={{
                  color: passwordConstrains.length ? "rgb(82,196,26)" : "black",
                }}
              >
                -De 8 a 20 caracteres{" "}
                <strong>{passwordConstrains.length ? "(OK)" : ""}</strong>
              </span>
            </Col>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span
                style={{
                  color: passwordConstrains.number ? "rgb(82,196,26)" : "black",
                }}
              >
                -Al menos un número{" "}
                <strong>{passwordConstrains.number ? "(OK)" : ""}</strong>
              </span>
            </Col>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span
                style={{
                  color: passwordConstrains.capital
                    ? "rgb(82,196,26)"
                    : "black",
                }}
              >
                -Al menos una mayuscula{" "}
                <strong>{passwordConstrains.capital ? "(OK)" : ""}</strong>
              </span>
            </Col>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span
                style={{
                  color: passwordConstrains.lower ? "rgb(82,196,26)" : "black",
                }}
              >
                -Al menos una minuscula{" "}
                <strong>{passwordConstrains.lower ? "(OK)" : ""}</strong>
              </span>
            </Col>
            <Col xs={{ span: 0 }} sm={{ span: 8 }}></Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <span
                style={{
                  color: passwordConstrains.character
                    ? "rgb(82,196,26)"
                    : "black",
                }}
              >
                -Un caracter especial de entre estos{" "}
                <strong>{"($ @ ! % * ? & .)"}</strong>
                <strong>{passwordConstrains.character ? "(OK)" : ""}</strong>
              </span>
            </Col>
          </Row>

          {typeUser === "Estudiante" ? (
            <>
              <Divider>Describe tu trabajo</Divider>
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
          {
            typeUser === "Estudiante" ? (
              <>
                <Divider>Proyecto a ingresar</Divider>

                <Form.Item
                  label="Proyecto"
                  name="projectId"
                  rules={[
                    {
                      required: true,
                      message: "Por favor selecciona un Proyecto!",
                    },
                  ]}
                >
                  <Cascader
                    disabled={initialValuesForm?.projectId?.length === 3}
                    options={projectGroups}
                  />
                </Form.Item>
              </>
            ) : null
            /*  <>
              <Form.Item label="Proyecto" name="projectId">
                <Cascader
                  //disabled={initialValuesForm?.projectId?.length === 3}
                  disabled={true}
                  options={projectGroups}
                  placeholder=""
                />
              </Form.Item>
            </> */
          }
          <Divider>Información de contacto</Divider>
          <Form.Item
            label="País"
            name="ubication"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el nombre de tu pais.",
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="Ej. Bolivia" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="secondEmail"
            rules={[
              {
                required: true,
                message:
                  "Por favor ingresa el email como dirección de contacto.",
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="Ej. cicei.cicei@gmail.com" />
          </Form.Item>

          {/*  <Form.Item label="Número de contacto">
            <Input.Group compact>
              <Form.Item
                name={["phoneNumberOne", "code"]}
                noStyle
                rules={[
                  {
                    required: false,
                    message: "Prefijo numerico del Pais requerido",
                  },
                ]}
              >
                <InputNumber style={{ width: "20%" }} placeholder="Eg. +591" />
              </Form.Item>
              <Form.Item
                name={["phoneNumberOne", "number"]}
                noStyle
                rules={[{ required: false, message: "Province is required" }]}
              >
                <InputNumber
                  style={{ width: "30%" }}
                  placeholder="Eg. 7654321"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item> */}
          {/*  <Form.Item label="Número de contacto">
            <Input.Group compact>
              <Form.Item
                name={["phoneNumberTwo", "code"]}
                noStyle
                rules={[{ required: false, message: "Province is required" }]}
              >
                <InputNumber style={{ width: "20%" }} placeholder="Eg. +591" />
              </Form.Item>
              <Form.Item
                name={["phoneNumberTwo", "number"]}
                noStyle
                rules={[{ required: false, message: "Province is required" }]}
              >
                <InputNumber
                  style={{ width: "30%" }}
                  placeholder="Eg. 7654321"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item> */}

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={requesting}>
              Registrarse
            </Button>
            <Button
              type="secondary"
              htmlType="button"
              onClick={() => {
                history.push("/");
              }}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
