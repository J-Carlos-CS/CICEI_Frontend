import { useState, useEffect, useRef } from "react";
import { Select, Button, Form, Modal, Input, message, DatePicker } from "antd";
import TypeInvestigationService from "../../../../services/TypeInvestigationService";
import UserService from "../../../../services/UserService";
import moment from "moment";
//import StudentJobService from "../../../services/StudentJobService.js";
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

export default function RethinkStudentJob({
  isModalVisible,
  handleOk,
  handleCancel,
  studentJobSelected,
}) {
  const [form] = Form.useForm();
  const [typeInvestigation, setTypeInvestigation] = useState([]);
  //const [semesters, setSemesters] = useState([]);
  const [isTutor, setIsTutor] = useState(
    studentJobSelected?.tutorId ? true : false
  );
  const [tutors, setTutors] = useState([]);
  console.log("student job ", studentJobSelected);
  const { current: fields } = useRef([
    {
      name: ["titleDocument"],
      value: studentJobSelected?.titleDocument || "",
    },
    {
      name: ["typeInvestigationId"],
      value: studentJobSelected?.TypeInvestigation?.id || 0,
    },
    {
      name: ["semesterStart", "name"],
      value: studentJobSelected?.SemesterStart?.name || "I",
    },
    {
      name: ["semesterStart", "year"],
      value: moment(
        `${studentJobSelected?.SemesterStart?.year || "2020"}0220`
      ) /*  studentJobSelected?.semesterStart?.year || 2020 */,
    },
    {
      name: ["semesterEnd", "name"],
      value: studentJobSelected?.SemesterEnd?.name || "I",
    },
    {
      name: ["semesterEnd", "year"],
      value: moment(
        `${studentJobSelected?.SemesterEnd?.year}0220`
      ) /*  studentJobSelected?.semesterStart?.year || 2020 */,
    },
    /*  {
      name: ["semesterEndId"],
      value: studentJobSelected?.semesterEndId || 0,
    }, */
    {
      name: ["tutorId"],
      value: studentJobSelected?.tutorId || 0,
    },
  ]);
  //const [fields, setFields] = useState();

  const onFinish = async (values) => {
    console.log("values", values);
    let studentJobUpdate = {
      titleDocument: values.titleDocument || "",
      typeInvestigationId: values.typeInvestigationId || null,
      semesterStartId: values.semesterStartId || null,
      semesterStart: {
        period: values?.semesterStart?.name || null,
        year: moment(values?.semesterStart?.year)?.format("YYYY") || null,
      },
      semesterEnd: {
        period: values?.semesterEnd?.name || null,
        year: moment(values?.semesterEnd?.year)?.format("YYYY") || null,
      },
      semesterEndId: values.semesterEndId || null,
      tutorId: values.tutorId || null,
      id: studentJobSelected.id,
    };

    //console.log("student", studentJobUpdate);
    /* console.log("studentJobUpdate", studentJobUpdate);
    console.log("operando"); */
    /* await handleOk(studentJobUpdate); */
    handleOk(studentJobUpdate);
  };
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
        console.log(e);
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
          setTutors(res.data?.response);
        } else {
          message.error(res.data?.description, 3);
        }
      })
      .catch((e) => {
        message.error(e.message, 3);
        console.log(e);
      });
  };

  useEffect(() => {
    getTypeInvestigation();
    //getSemesters();
    getTutors();
  }, []);

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
    <Modal
      title="Editar trabajo"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      footer={null}
    >
      <Form
        {...formItemLayout}
        form={form}
        fields={fields}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
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
          rules={[{ required: true, message: "El semestre es obligatorio" }]}
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
            <Form.Item name={["semesterStart", "year"]} noStyle {...config}>
              <DatePicker style={{ width: "50%" }} picker="year" />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        {studentJobSelected.semesterEndId && (
          <>
            {/* <Form.Item
              name="semesterEndId"
              label="Semestre de Fin"
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
              name="semesterEnd"
              label="Semestre de Fin"
              // noStyle
              rules={[
                { required: true, message: "El semestre es obligatorio" },
              ]}
            >
              <Input.Group>
                <Form.Item
                  name={["semesterEnd", "name"]}
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
                <Form.Item name={["semesterEnd", "year"]} noStyle {...config}>
                  <DatePicker style={{ width: "50%" }} picker="year" />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </>
        )}

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
                //console.log('option', option)
                if (
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                ) {
                  return true;
                } else {
                  return false;
                }
              }}
            >
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
  );
}
