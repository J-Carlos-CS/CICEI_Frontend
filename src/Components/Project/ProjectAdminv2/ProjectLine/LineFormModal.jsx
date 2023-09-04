import { useState, useEffect, useCallback } from "react";
import { Modal, Form, Select, Button, message } from "antd";
import LineService from "../../../../services/LineService";
import LineProjectService from "../../../../services/LineProjectService.js";
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
export default function LineFormModal({
  isModalVisible = false,
  handleOk,
  handleCancel,
  lineProjects = [],
  projectId,
  onClose,
  //getLineProjects,
}) {
  const [form] = Form.useForm();
  //const [formField, setformField] = useState(null);
  const [isInstitutional, setisInstitutional] = useState(false);
  const [lineList, setlineList] = useState([]);
  const [institutionalLines, setinstitutionalLines] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const getLineByOwner = useCallback(() => {
    LineService.getLinesByOwnerId()
      .then((res) => {
        let data = res.data.response;
        data = data.filter((line) => {
          return !lineProjects.some((lp) => lp.Line?.id === line.id);
        });
        setlineList(data);
      })
      .catch((e) => {
        message.error("Hubo un error. " + e.message, 5);
      });
  }, [lineProjects]);

  const getInstitutionalLines = useCallback(() => {
    LineService.getInstitutionalLines()
      .then((res) => {
        let data = res.data.response;
        data = data.filter((line) => {
          return !lineProjects.some((lp) => lp.Line?.id === line.id);
        });
        //console.log("insti", data);
        setinstitutionalLines(data);
      })
      .catch((e) => {
        message.error("Hubo un error. " + e.message, 5);
      });
  }, [lineProjects]);

  useEffect(() => {
    getLineByOwner();
    getInstitutionalLines();
  }, [getLineByOwner, getInstitutionalLines]);

  const onFinish = async (values) => {
    try {
      setRequesting(true);
      let lineProject = {
        lineId: values.lineId || null,
        isMain: false,
        projectId: parseInt(projectId) || null,
      };
      let {
        data: { response = null, success = false, description = "" },
      } = await LineProjectService.registerLineProject(lineProject);
      if (success) {
        message.success({
          content: "Línea registrada",
          duration: 3,
          key: "onfinish",
        });
        onClose({state:"success"});
      } else {
        message.warn({
          content: "Error. " + description,
          duration: 5,
          key: "onfinish",
        });
        setRequesting(false);
      }
      /*  LineProjectService.registerLineProject(lineProject)
        .then((res) => {
          if (res.data?.success) {
            message.success("Línea registrada.", 4);
            getLineProjects(projectId);
            handleCancel();
          } else {
            setRequesting(false);
            message.error(
              "No se pudo registrar la línea en el proyecto. " +
                res.data?.description,
              5
            );
          }
        })
        .catch((e) => {
          setRequesting(false);
          message.error("Hubo un error. " + e.message, 5);
        }); */
    } catch (error) {
      message.warn({
        content: error.message,
        duration: 5,
        key: "onfinish",
      });
      setRequesting(false);
    }
  };
  return (
    <Modal
      title="Registrar una línea al proyecto"
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
        //fields={formField}
        name="register"
        onFinish={onFinish}
        initialValues={{ isInstitutional: isInstitutional }}
        scrollToFirstError
      >
        {/* <Form.Item
          label="Tipo de Línea"
          name="isInstitutional"
          rules={[
            {
              required: true,
              message: "Por favor seleccione el tipo de línea.",
            },
          ]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button
              key={"Cicei"}
              value={false}
              onClick={() => {
                setisInstitutional(false);
              }}
            >
              CICEI
            </Radio.Button>
            <Radio.Button
              key={"Institutional"}
              value={true}
              onClick={() => {
                setisInstitutional(true);
              }}
            >
              Institucional
            </Radio.Button>
          </Radio.Group>
        </Form.Item> */}
        <Form.Item
          name="lineId"
          label="Línea"
          rules={[
            {
              required: true,
              message: "Por favor selecciona una línea.",
            },
          ]}
        >
          {
            /* isInstitutional */ true ? (
              <Select>
                {institutionalLines.map((line) => (
                  <Select.Option key={line.id} value={line.id}>
                    {line.code + "-" + line.name}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <Select>
                {lineList.map((line) => (
                  <Select.Option key={line.id} value={line.id}>
                    {line.code + "-" + line.name}
                  </Select.Option>
                ))}
              </Select>
            )
          }
        </Form.Item>
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
