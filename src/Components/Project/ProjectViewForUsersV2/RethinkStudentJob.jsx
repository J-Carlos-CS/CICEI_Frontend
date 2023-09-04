import { useState, useEffect, useRef } from "react";
import {
  Select,
  DatePicker,
  Button,
  Form,
  Modal,
  Input,
  Divider,
  message,
} from "antd";
import TypeInvestigationService from "../../../services/TypeInvestigationService";
import UserService from "../../../services/UserService";
//import SemesterService from "../../../services/SemesterService";
//import StudentJobService from "../../../services/StudentJobService.js";
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

export default function RethinkStudentJob({
  isModalVisible,
  handleOk,
  handleCancel,
  studentJobSelected,
}) {
  const [form] = Form.useForm();
  const [typeInvestigation, setTypeInvestigation] = useState([]);
  const [isTutor, setIsTutor] = useState(
    studentJobSelected?.tutorId ? true : false
  );
  const [requesting, setRequesting] = useState(false);
  const [tutors, setTutors] = useState([]);
  const fields = useRef([
    {
      name: ["titleDocument"],
      value: studentJobSelected?.titleDocument || "",
    },
    {
      name: ["typeInvestigationId"],
      value: studentJobSelected?.TypeInvestigation?.id || 0,
    },
    /*  {
      name: ["semesterStartId"],
      value: studentJobSelected?.semesterStartId || 0,
    }, */
    {
      name: ["semesterStart", "name"],
      value: studentJobSelected?.SemesterStart?.name || "I",
    },
    {
      name: ["semesterStart", "year"],
      value: moment(
        `${studentJobSelected?.SemesterStart?.year}0220`
      ) /*  studentJobSelected?.semesterStart?.year || 2020 */,
    },
    {
      name: ["tutorId"],
      value: studentJobSelected?.tutorId || 0,
    },
  ]);

  const onFinish = async (values) => {
    setRequesting(true);
    let studentJobUpdate = {
      id: studentJobSelected.id,
      titleDocument: values.titleDocument,
      typeInvestigationId: values.typeInvestigationId || null,
      semesterStartId: values.semesterStartId || null,
      semesterStart: {
        period: values?.semesterStart?.name || null,
        year: moment(values?.semesterStart?.year)?.format("YYYY") || null,
      },
      tutorId: values.tutorId || null,
      acceptance: "Repropuesto",
    };
    //console.log('studentJobUpdate',studentJobUpdate);
    await handleOk(studentJobUpdate,setRequesting);
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

  /*  const getSemesters = () => {
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
        fields={fields.current}
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
  );
}
