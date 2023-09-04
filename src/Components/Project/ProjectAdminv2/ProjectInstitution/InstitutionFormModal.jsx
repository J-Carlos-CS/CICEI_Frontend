import { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Form,
  Select,
  Button,
  message,
  Radio,
  InputNumber,
  Input,
} from "antd";
import InstitutionService from "../../../../services/InstitutionService.js";
import CurrencyService from "../../../../services/CurrencyService.js";
import InstitutionProjectService from "../../../../services/InstitutionProjectService.js";
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
export default function InstitutionFormModal({
  isModalVisible = false,
  handleOk,
  handleCancel,
  projectId,
  institutionsProject,
  getIPs,
  ipsTarget,
}) {
  const [form] = Form.useForm();
  const [institutionList, setinstitutionList] = useState([]);
  const [formField, setformField] = useState(null);
  const [isFinancier, setIsFinancier] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [otherInstitution, setOtherInstitution] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const getInstitutions = useCallback(() => {
    InstitutionService.getInstitutions()
      .then((res) => {
        let institutions = res.data.response;
        institutions.push({ name: "Otra", id: "Other" });
        if (institutions.length > 0) {
          if (!ipsTarget) {
            institutions = institutions.filter((institution) => {
              return !institutionsProject.some(
                (ip) => ip.Institution?.id === institution.id
              );
            });
          }
          setinstitutionList(institutions);
        } else {
          message.error("No hay instituciones disponibles.", 3);
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error("No se pudo obtener la lista de instituciones.", 5);
      });
  }, [ipsTarget, institutionsProject]);
  useEffect(() => {
    getInstitutions();
  }, [getInstitutions]);
  useEffect(() => {
    getCurrencies();
  }, []);

  useEffect(() => {
    if (ipsTarget) {
      setIsFinancier(ipsTarget.isFinancier);
      setformField([
        {
          name: ["institutionId"],
          value: ipsTarget.Institution?.id,
        },
        {
          name: ["isFinancier"],
          value: ipsTarget.isFinancier,
        },
        {
          name: ["currencyId"],
          value: ipsTarget.currencyId,
        },
        {
          name: ["moneyBudget"],
          value: ipsTarget.moneyBudget,
        },
      ]);
    }
  }, [ipsTarget]);

  const getCurrencies = (params) => {
    CurrencyService.getCurrencies()
      .then((res) => {
        const currencies = res.data.response;
        if (currencies.length > 0) {
          setCurrencies(currencies);
        } else {
          message.error("No hay tipos de monedas registradas.", 3);
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error("No se pudo obtener la lista de monedas.", 3);
      });
  };
  const onFinish = (values) => {
    setRequesting(true);
    let institutionProject = {
      id: ipsTarget?.id || null,
      isFinancier: values.isFinancier || false,
      moneyBudget: values.moneyBudget || 0,
      currencyId: values.currencyId || null,
      institutionId:
        values.institutionId === "Other"
          ? 0
          : values.institutionId
          ? values.institutionId
          : null,
      projectId: parseInt(projectId) || null,
      otherInstitutionName: values.otherInstitutionName,
      otherInstitutionAcronym: values.otherInstitutionAcronym,
      country: values.country,
    };

    // console.log(institutionProject);

    if (ipsTarget) {
      InstitutionProjectService.updateInstitutionProject(institutionProject)
        .then((res) => {
          if (res.data?.success) {
            message.success("Institución actualizada.", 3);
            getIPs(projectId);
            handleCancel();
          } else {
            setRequesting(false);
            message.error(
              "No se pudo actualizar la institución. " + res.data?.description,
              5
            );
          }
        })
        .catch((e) => {
          setRequesting(false);
          console.log(e.message);
          message.error("Hubo un error. " + e.message, 5);
        });
    } else {
      InstitutionProjectService.registerInstitutionProject(institutionProject)
        .then((res) => {
          if (res.data?.success) {
            message.success("Institución registrada.", 3);
            getIPs(projectId);
            handleCancel();
          } else {
            setRequesting(false);
            message.error(
              "No se pudo registrar a la institución en el proyecto.",
              3
            );
          }
        })
        .catch((e) => {
          setRequesting(false);
          console.log(e.message);
          message.error("Hubo un error. " + e.message, 5);
        });
    }
  };

  const onChangeInstitution = (e) => {
    if (e === "Other") {
      setOtherInstitution(true);
    } else {
      setOtherInstitution(false);
    }
  };

  return (
    <Modal
      title="Registrar una Institución"
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
        fields={formField}
        name="register"
        onFinish={onFinish}
        initialValues={{ isFinancier: isFinancier }}
        scrollToFirstError
      >
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
          <Select
            disabled={ipsTarget ? true : false}
            placeholder="Selecciona una Institución"
            onChange={onChangeInstitution}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              if (
                option.children
                  ?.join()
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              ) {
                return true;
              } else {
                return false;
              }
            }}
          >
            {institutionList.map((i) => {
              return (
                <Select.Option key={i.id} value={i.id}>
                  {i.shortName ? `(${i.shortName})` : ""} {i.name}
                </Select.Option>
              );
            })}
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
                  message: "Por favor ingrese las siglas de la institución.",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder={"Siglas de la institución. (Ej: UCB)"} />
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
              <Input placeholder={"Pais de la institución. (Ej: Bolivia)"} />
            </Form.Item>
          </>
        ) : null}
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
                  message: "Por favor ingrese un Monto valido!",
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </>
        ) : null}
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" disabled={requesting}>
            Registrar
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
