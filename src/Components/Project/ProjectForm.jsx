import { useState, useEffect, useRef } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import LoaderSpin from "../Layouts/Loader/LoaderSpin";
import ProjectService from "../../services/ProjectService";
import GroupService from "../../services/GroupService.js";
import InstitutionService from "../../services/InstitutionService.js";
import LineService from "../../services/LineService.js";
import CurrencyService from "../../services/CurrencyService.js";
import UserService from "../../services/UserService.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../Auth/userReducer.js";
import moment from "moment";

import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  message,
  DatePicker,
  Cascader,
  Row,
  Col,
} from "antd";
const { RangePicker } = DatePicker;
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
export default function ProjectForm() {
  //let queryParams = new URLSearchParams(useLocation().search);
  const { current: queryParams } = useRef(
    new URLSearchParams(useLocation().search)
  );
  const history = useHistory();
  const params = useParams();
  const projectId = params.id;
  const [form] = Form.useForm();
  const [leaders, setLeaders] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [linesInstitutional, setLinesInstitutional] = useState([]);
  const [institutionList, setInstitutionList] = useState([]);
  //const [isFinancier, setIsFinancier] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setisLoading] = useState({
    status: "loading",
    message: "",
  });
  const [initialState, setinitialState] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const globalUser = useSelector(selectUser);
  const { current: userSesion } = useRef(globalUser);
  /*  moment(values.rangeDate[0]._d).set({
    hour: 0,
    minute: 0,
    seconds: 0,
  })._d */
  const onFinish = (project) => {
    setRequesting(true);
    const projectForRequest = {
      code: null,
      title: project.title,
      startDate: moment(project.rangeDate[0]._d).set({
        hour: 0,
        minute: 0,
        seconds: 0,
      })._d,
      endDate: moment(project.rangeDate[1]._d).set({
        hour: 0,
        minute: 0,
        seconds: 0,
      })._d,
      description: project.description,
      lineId: project.lineId[1],
      lineInstitutionalId: project.lineInstitutionalId,
      /* institutionId: project.institutionId,
      isFinancier: project.isFinancier ? true : false,
      moneyBudget: project.moneyBudget ? project.moneyBudget : 0,
      currencyId: project.currencyId ? project.currencyId : null, */
      leaderId: project.leaderId,
    };
    ProjectService.registerProject(projectForRequest)
      .then((res) => {
        if (res.data?.success) {
          message.success("Creacion del Proyecto exitosa", 3);
          history.goBack();
        } else {
          setRequesting(false);
          message.error(res.data?.description, 3);
        }
      })
      .catch((e) => {
        setRequesting(false);
        console.log(e.message);
        message.error(e.message, 3);
      });
  };

  const onCancel = () => {
    history.goBack();
  };

  useEffect(() => {
    GroupService.getGroups()
      .then((res) => {
        if (res.data?.success && res.data?.response?.length > 0) {
          let groups = res.data.response;
          groups = groups.filter((l) => l.Lines.length > 0);
          if (userSesion.rolName !== "Administrador") {
            groups = groups.filter((g) => g.userId === userSesion.id);
          }
          if (groups.length > 0) {
            groups = groups.map((g) => {
              const l = g.Lines.map((l) => {
                return {
                  value: l.id,
                  label: `${l.code} - ${l.name}`,
                };
              });
              const groupOptions = {
                value: g.id,
                label: `${g.code} - ${g.name}`,
                children: l,
              };
              return groupOptions;
            });
            console.log("Entrooo",groups)
            setGroupList(groups);
            console.log(groupList)
          } else {
            setisLoading({
              status: "error",
              message: "No tienes grupos con líneas para asociar.",
            });
          }
        } else {
          message.error("No tienes grupos con líneas para asociar.", 3);
          setisLoading({
            status: "error",
            message: "No tienes grupos con líneas para asociar.",
          });
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error("No se pudo obtener la lista de líneas.", 3);
        setisLoading({
          status: "error",
          message: "Hubo un problema en el servidor. " + e.message,
        });
      });

    LineService.getLines()
      .then((res) => {
        let lines = res.data.response;
        lines = lines.filter((l) => l.isInstitutional);
        if (lines.length > 0) {
          console.log("lines",lines)
          setLinesInstitutional(lines);
          console.log("linesInstitucional ",linesInstitutional)
        } else {
          message.error("No existen líneas Institucionales registradas.");
          setisLoading({
            status: "error",
            message:
              "No existen líneas Institucionales para asociarlas al proyecto.",
          });
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error("No se pudo obtener la lista de líneas.", 3);
        setisLoading({
          status: "error",
          message: "Hubo un problema en el servidor. " + e.message,
        });
      });

    InstitutionService.getInstitutions()
      .then((res) => {
        const institutions = res.data.response;
        if (institutions.length > 0) {
          setInstitutionList(institutions);
        } else {
          message.error("No hay institutciones registradas.", 3);
          setisLoading({
            status: "error",
            message: "No hay institutciones registradas.",
          });
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error("No se pudo obtener la lista de instituciones.", 3);
        setisLoading({
          status: "error",
          message: "Hubo un problema en el servidor. " + e.message,
        });
      });

    CurrencyService.getCurrencies()
      .then((res) => {
        const currencies = res.data.response;
        if (currencies.length > 0) {
          setCurrencies(currencies);
        } else {
          message.error("No hay tipos de monedas registradas.", 3);
          setisLoading({
            status: "error",
            message: "No hay tipos de monedas registradas.",
          });
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error("No se pudo obtener la lista de monedas.", 3);
        setisLoading({
          status: "error",
          message: "Hubo un problema en el servidor. " + e.message,
        });
      });
    UserService.getLeaders()
      .then((res) => {
        if (res?.data?.success) {
          console.log("respins", res.data.response);
          setLeaders(
            res.data?.response?.filter(
              (leader) =>
                leader?.SystemRol?.name === "Investigador" ||
                leader?.SystemRol?.name === "Asociado"
            )
          );
        } else {
          message.error(
            "No se pudo obtener la lista de encargados. " +
              res.data?.description,
            5
          );
        }
      })
      .catch((e) => {
        console.log("error. " + e.message);
        message.error("Hubo un error. " + e.messagem, 5);
      });
    if (
      !isNaN(parseInt(queryParams.get("lineId"))) &&
      !isNaN(parseInt(queryParams.get("groupId")))
    ) {
      setinitialState({
        lineId: [
          parseInt(queryParams.get("groupId")),
          parseInt(queryParams.get("lineId")),
        ],
        //isFinancier: false,
      });
    }

    //setisLoading({status:"success",message:"blabla"});
  }, [queryParams, userSesion]);

  if (
    (isLoading.status === "loading" || isLoading.status === "error") &&
    (!currencies.length > 0 ||
      !institutionList.length > 0 ||
      !groupList.length > 0 ||
      !linesInstitutional.length > 0 ||
      !leaders.length > 0)
  ) {
    return <LoaderSpin isLoading={isLoading} />;
  }

  return (
    <>
      <Row>
        <Col span={23} style={{ display: "flex", justifyContent: "center" }}>
          <Title className="title-project">
            {projectId ? "Editar Proyecto" : "Crear Proyecto"}
          </Title>
        </Col>
        <Col span={23}>
          <Form
            {...formItemLayout}
            //fields={fields}
            form={form}
            name="register"
            onFinish={onFinish}
            preserve={false}
            initialValues={initialState}
            scrollToFirstError
          >
            <Form.Item
              name="title"
              label="Título del Proyecto"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa el título del Proyecto.",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/*         <Form.Item
          name="code"
          label="Code"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el Code del Proyecto.",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item> */}

            <Form.Item
              name="description"
              label="Descripción"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa la descripción del proyecto.",
                  whitespace: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="rangeDate"
              label="Fecha Inicio y Final"
              rules={[
                {
                  type: "array",
                  required: true,
                  message: "Por favor selecciona las fechas.",
                },
              ]}
            >
              <RangePicker format={"YYYY/MM/DD"} placeholder={["Fecha de inicio","Fecha de finalización"]} />
            </Form.Item>

            <Form.Item
              label="Línea Cicei"
              name="lineId"
              rules={[
                { required: true, message: "Por favor selecciona una Línea CICEI!" },
              ]}
            >
              <Select
                disabled={
                  !isNaN(parseInt(queryParams.get("lineId"))) &&
                  !isNaN(parseInt(queryParams.get("groupId")))
                }
                options={groupList}
                placeholder="Selecciona una Línea CICEI"
              />
            </Form.Item>

            {linesInstitutional.length > 0 ? (
              <Form.Item
                label="Línea UCB"
                name="lineInstitutionalId"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona una Línea UCB!",
                  },
                ]}
              >
                <Select placeholder="Selecciona una Línea UCB">
                  {linesInstitutional.map((li) => {
                    return (
                      <Select.Option key={li.id} value={li.id}>
                        {" "}
                        {`${li.code} - ${li.name}`}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            ) : null}

            <Form.Item
              label="Encargado"
              name="leaderId"
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona un encargado!",
                },
              ]}
            >
              <Select
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.children[1]
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                placeholder="Selecciona un encargado"
              >
                {leaders.map((li) => {
                  return (
                    <Select.Option key={li.id} value={li.id}>
                      {" "}
                      {`${
                        li.firstName +
                        " " +
                        li.lastName +
                        " - " +
                        li.SystemRol?.name
                      }`}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            {/*   {institutionList.length > 0 ? (
          <>
            <Form.Item
              label="Institución"
              name="institutionId"
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona una institución!",
                },
              ]}
            >
              <Select placeholder="Selecciona una Institución">
                {institutionList.map((i) => {
                  return (
                    <Select.Option key={i.id} value={i.id}>
                      {" "}
                      {`${i.name} - ${i.shortName}`}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item
              label="Financiadora"
              name="isFinancier"
              rules={[
                {
                  required: true,
                  message:
                    "Por favor selecciona si la institutición es financiadora!",
                },
              ]}
            >
              <Radio.Group buttonStyle="solid">
                <Radio.Button
                  value={true}
                  onClick={() => {
                    setIsFinancier(true);
                  }}
                >
                  Si
                </Radio.Button>
                <Radio.Button
                  value={false}
                  onClick={() => {
                    setIsFinancier(false);
                  }}
                >
                  No
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {isFinancier ? (
              <>
                <Form.Item
                  label="Moneda"
                  name="currencyId"
                  rules={[
                    {
                      required: true,
                      message: "Por favor selecciona una Moneda!",
                    },
                  ]}
                >
                  <Select placeholder="Selecciona una Moneda">
                    {currencies.map((c) => {
                      return (
                        <Select.Option key={c.id} value={c.id}>
                          {" "}
                          {`${c.name} - ${c.shortName}`}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Monto"
                  name="moneyBudget"
                  rules={[
                    {
                      required: true,
                      message: "Por favor selecciona una institución!",
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </>
            ) : null}
          </>
        ) : null} */}

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
