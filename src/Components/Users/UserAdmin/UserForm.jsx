import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Modal, DatePicker, message } from "antd";
import GradeService from "../../../services/GradeService";
import LoaderSpin from "../../Layouts/Loader/LoaderSpin";
import CareerService from "../../../services/CareerService";
import SystemRolService from "../../../services/SystemRolService";
import InstitutionService from "../../../services/InstitutionService";
import moment from "moment";

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

export default function UserForm({
  user = null,
  isVisible = false,
  handleOk,
  handleCancel,
}) {
  console.log("user", user);
  const [form] = Form.useForm();
  const [grades, setGrades] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [otherCareer, setOtherCareer] = useState(false);
  const [careers, setCareers] = useState([]);
  const [systemRoles, setSystemRoles] = useState([]);
  const dateFormat = "YYYY/MM/DD";
  const [isLoading, setisLoading] = useState({
    status: "loading",
    message: "",
  });
  const onFinish = (values) => {
    let userR = {
      ...values,
      id: user?.id || null,
      birthDate: values?.birthDate
        ? null
        : moment(values?.birthDate).set({
            hour: 0,
            minute: 0,
            seconds: 0,
          })._d,
      nameRole: user?.SystemRol?.name || "",
    };
    console.log("USerROUpdate", userR);
    handleOk(userR);
  };

  const getGrades = () => {
    GradeService.getGrades()
      .then((res) => {
        if (res.data?.success) {
          setGrades(res.data?.response);
        } else {
          message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        console.log(e);
        setisLoading({ status: "error", message: e.message });
      });
  };

  const getInstitutions = () => {
    InstitutionService.getInstitutions()
      .then((res) => {
        if (res.data?.success) {
          let dataInstitutions = res.data?.response;
          setInstitutions(dataInstitutions);
        } else {
          message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        console.log(e);
        setisLoading({ status: "error", message: e.message });
      });
  };

  const getCareers = () => {
    CareerService.getCareers()
      .then((res) => {
        if (res.data?.success) {
          let data = res.data?.response;
          setCareers(data);
        } else {
          message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        console.log(e);
        setisLoading({ status: "error", message: e.message });
      });
  };

  const getSystemRols = () => {
    SystemRolService.getRoles()
      .then((res) => {
        if (res.data?.success) {
          let data = res.data?.response?.filter(
            (role) =>
              role?.name !== "Administrador" && role?.name !== "Supervisor"
          );
          console.log("data", data);

          setSystemRoles(data);
        } else {
          message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        console.log(e);
        setisLoading({ status: "error", message: e.message });
      });
  };

  const onChangeCareer = (e) => {
    if (e === "Other") {
      setOtherCareer(true);
    } else {
      setOtherCareer(false);
    }
  };

  useEffect(() => {
    getGrades();
    getCareers();
    getInstitutions();
    getSystemRols();
  }, []);

  if (
    (isLoading.status === "loading" || isLoading.status === "error") &&
    (!grades.length > 0 || !careers.length > 0)
  ) {
    return <LoaderSpin isLoading={isLoading} />;
  }
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
  return (
    <Modal
      visible={isVisible}
      onOk={() => {}}
      onCancel={() => {
        handleCancel();
      }}
      title="Editar Usuario"
      okText="Aceptar"
      cancelText="Cancel"
      width={700}
      footer={null}
    >
      <Form
        className="form"
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          birthDate: moment(user?.birthDate, dateFormat),
          careerId: user?.careerId,
          gradeId: user?.gradeId,
          grade: user?.grade,
          institutionId: user?.institutionId,
          systemRolId: user?.SystemRol?.id,
        }}
        scrollToFirstError
      >
        {!user?.sintetic && (
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
            <Input disabled={true} />
          </Form.Item>
        )}

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
          name="systemRolId"
          label="Rol"
          rules={[
            {
              required: true,
              message: "Por favor selecciona el rol.",
            },
          ]}
        >
          <Select>
            {systemRoles?.map((systemRole) => (
              <Select.Option value={systemRole?.id} key={systemRole?.id}>
                {systemRole?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {!user?.sintetic && (
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
            <DatePicker />
          </Form.Item>
        )}
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
        {user?.SystemRol?.name === "Estudiante" && (
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
            <Form.Item
              name="institutionId"
              label="Institución"
              rules={[
                {
                  required: true,
                  message:
                    "Por favor selecciona la institución a la que pertence.",
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
                /* onChange={onChangeInstitution} */
              >
                {institutions.map((i) => (
                  <Select.Option key={i.id} value={i.id}>
                    {i.shortName ? `(${i.shortName}) ${i.name}` : "Otra"}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}
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

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="secondary"
            htmlType="button"
            onClick={() => {
              handleCancel();
            }}
          >
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit">
            Aceptar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
