import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Row,
  Col,
  Tag,
  Button,
  Form,
  Input,
  DatePicker,
} from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;

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
const dateFormat = "YYYY/MM/DD";

const FormTask = ({ taskTarget, handleOk, handleCancel, activity }) => {
  const [form] = Form.useForm();
  const [formField, setFormField] = useState([]);
  useEffect(() => {
    if (taskTarget) {
      setFormField([
        {
          name: ["name"],
          value: taskTarget.name,
        },
        {
          name: ["rangeDate"],
          value: [
            moment(taskTarget.startDate, dateFormat),
            moment(taskTarget.endDate, dateFormat),
          ],
        },
      ]);
    }
  }, [taskTarget]);
  const onFinish = (values) => {
    //console.log("values", values);
    let task = {
      name: values.name,
      startDate: moment(values.rangeDate[0]._d).set({
        hour: 0,
        minute: 0,
        seconds: 0,
      })._d,
      endDate: moment(values.rangeDate[1]._d).set({
        hour: 0,
        minute: 0,
        seconds: 0,
      })._d,
      finish: false,
      order: 0,
    };
    /*     let t = new Date();
    let y = moment(values.rangeDate[0]._d).set(
      {
        "hour":0,
        "minute":0,
        "seconds":0
      }
    )._d;
    console.log('y',y); */

    /*    task.startDate = task.startDate.setMinutes(
      task.startDate.getMinutes() + t.getTimezoneOffset()
    );
    task.endDate = task.endDate.setMinutes(
      task.endDate.getMinutes() + t.getTimezoneOffset()
    ); */
    //console.log("taskRR", task);
    if (taskTarget) {
      task.id = taskTarget.id || null;
      if (taskTarget.typeUpdate !== "new") {
        task.typeUpdate = "update";
      } else {
        task.typeUpdate = "new";
      }
      handleOk(task);
    } else {
      task.id = Date.now().toString();
      task.typeUpdate = "new";
      handleOk(task);
    }
  };

  const disableDates = (current) => {
    let start = new Date(activity?.startDate);
    let end = new Date(activity?.endDate);
    if (current < moment(start)) {
      return true;
    } else if (current > moment(end)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Form
      className="form"
      {...formItemLayout}
      form={form}
      fields={formField}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Nombre de la Tarea"
        rules={[
          {
            required: true,
            message: "Por favor ingresa el nombre de la tarea.",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="rangeDate"
        label="Fecha Inicio y Final"
        rules={[
          {
            type: "array",
            required: true,
            message: "Seleccione las fechas",
          },
        ]}
      >
        <RangePicker disabledDate={disableDates} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {taskTarget ? "Actualizar" : "Registrar"}
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
  );
};

const getColumns = (
  showModalForm,
  setTaskTarget,
  setIsModalDeleteVisible,
  isFromProjectView,
  stateProgress
) => {
  let cols = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return <span>{record.name || ""}</span>;
      },
    },
    {
      title: "Fecha inicio",
      dataIndex: "startDate",
      key: "startDate",
      render: (text, record) => {
        return (
          <Tag key={9} color={"yellow"}>
            {record.startDate.toLocaleString("es")}
          </Tag>
        );
      },
    },
    {
      title: "Fecha fin",
      dataIndex: "endDate",
      key: "endDate",
      render: (text, record) => {
        return (
          <Tag key={10} color={"yellow"}>
            {record.endDate.toLocaleString("es")}
          </Tag>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "state",
      key: "state",
      render: (text, record) => {
        let color =
          record.typeUpdate === "new"
            ? "green"
            : record.typeUpdate === "update"
            ? "blue"
            : "purple";
        let texto =
          record.typeUpdate === "new"
            ? "Nuevo"
            : record.typeUpdate === "update"
            ? "Editado"
            : "Sin Cambio";
        return (
          <Tag key={10} color={color}>
            {texto}
          </Tag>
        );
      },
    },
  ];

  if (!isFromProjectView) {
    cols.push({
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setTaskTarget(record);
                setIsModalDeleteVisible(true);
              }}
            >
              Borrar
            </Button>
            <Button
              type="link"
              onClick={() => {
                setTaskTarget(record);
                showModalForm();
              }}
            >
              Editar
            </Button>
          </>
        );
      },
    });
  } else {
    if (stateProgress !== "Terminado") {
      cols.push({
        title: "Acciones",
        dataIndex: "actions",
        key: "actions",
        render: (text, record) => {
          return (
            <>
              <Button
                type="link"
                onClick={() => {
                  setTaskTarget(record);
                  setIsModalDeleteVisible(true);
                }}
              >
                Borrar
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setTaskTarget(record);
                  showModalForm();
                }}
              >
                Editar
              </Button>
            </>
          );
        },
      });
    }
  }

  return cols;
};

const orderArray = (a, b) => {
  if (a.startDate?.getTime() < b.startDate.getTime()) {
    return -1;
  }
  if (a.startDate.getTime() > b.startDate.getTime()) {
    return 1;
  }
  if (a.startDate.getTime() === b.startDate.getTime()) {
    return 0;
  }
};

export default function TasksTable({
  isVisible,
  onOkTasks,
  onCancelTasks,
  activity,
  isFromProjectView = false,
}) {
  const [tasks, setTasks] = useState(
    activity?.Tasks?.map((t) => {
      return {
        ...t,
        startDate: new Date(t.startDate),
        endDate: new Date(t.endDate),
        typeUpdate: "none",
        idString: "",
      };
    }).sort(orderArray) || []
  );
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  //console.log("mytasks", tasks);
  const [isModalTaskVisible, setIsModalTaskVisible] = useState(false);
  const [taskTarget, setTaskTarget] = useState(null);

  const handleOkForm = (task) => {
    //console.log("the task", task);
    if (task.typeUpdate === "new") {
      let pos = 0;
      let isInArray = tasks.some((t, index) => {
        if (t.id === task.id) {
          pos = index;
          return true;
        } else {
          return false;
        }
      });
      if (isInArray) {
        let newArrayTasks = tasks || [];
        newArrayTasks[pos] = task;
        newArrayTasks = newArrayTasks.sort(orderArray);
        setTasks([...newArrayTasks]);
      } else {
        let newArrayTasks = tasks || [];
        newArrayTasks.push(task);
        newArrayTasks = newArrayTasks.sort(orderArray);
        //console.log("new Arrays", newArrayTasks);
        setTasks([...newArrayTasks]);
      }
    }
    if (task.typeUpdate === "update") {
      //console.log("entro");
      let pos = 0;
      let isInArray = tasks.some((t, index) => {
        if (t.id === task.id) {
          pos = index;
          return true;
        } else {
          return false;
        }
      });
      //console.log("inArra", isInArray);
      if (isInArray) {
        let newArrayTasks = tasks;
        newArrayTasks[pos] = task;
        newArrayTasks = newArrayTasks.sort(orderArray);
        setTasks([...newArrayTasks]);
      }
    }
    //setTasks(s=>([...s,{name:"Tora"}]));
    setIsModalTaskVisible(false);
    setTaskTarget(null);
  };

  const handleCancelForm = () => {
    setIsModalTaskVisible(false);
  };

  const showModalForm = () => {
    setIsModalTaskVisible(true);
  };

  const onOKDelete = () => {
    let pos = 0;
    let isNew = false;
    let isInArray = tasks.some((t, index) => {
      if (t.id === taskTarget.id) {
        pos = index;
        if (t.typeUpdate === "new") {
          isNew = true;
        }
        return true;
      }
      return false;
    });
    if (isInArray) {
      if (isNew) {
        let newArray = tasks.filter((t) => t.id !== taskTarget.id);
        setTasks([...newArray]);
      } else {
        let newArray = tasks;
        newArray[pos].typeUpdate = "delete";
        setTasks([...newArray]);
      }
    }
    setIsModalDeleteVisible(false);
    setTaskTarget(null);
  };

  const onCancelDelete = () => {
    setTaskTarget(null);
    setIsModalDeleteVisible(false);
  };

  return (
    <>
      <Modal
        title="Tareas"
        visible={isVisible}
        okText="Guardar"
        cancelText="Cancelar"
        onOk={() => {
          onOkTasks(tasks);
        }}
        onCancel={() => {
          onCancelTasks(tasks);
        }}
        width={1000}
        maskClosable={false}
      >
        <>
          {!isFromProjectView ? (
            <Button
              onClick={() => {
                setIsModalTaskVisible(true);
              }}
              type="primary"
            >
              +Registrar tarea
            </Button>
          ) : activity?.Progress?.stateProgress !== "Terminado" ? (
            <Button
              onClick={() => {
                setIsModalTaskVisible(true);
              }}
              type="primary"
            >
              +Registrar tarea
            </Button>
          ) : null}

          <Row>
            <Col span={23}>
              <Table
                rowKey="id"
                rowClassName={(record) => {
                  return record.typeUpdate === "new"
                    ? "green-row-table"
                    : record.typeUpdate === "update"
                    ? "blue-row-table"
                    : "";
                }}
                columns={getColumns(
                  showModalForm,
                  setTaskTarget,
                  setIsModalDeleteVisible,
                  isFromProjectView,
                  activity?.Progress?.stateProgress
                )}
                pagination={false}
                dataSource={tasks.filter((t) => t.typeUpdate !== "delete")}
              />
            </Col>
          </Row>
        </>
      </Modal>

      {isModalTaskVisible && (
        <Modal
          visible={isModalTaskVisible}
          onCancel={() => {
            setIsModalTaskVisible(false);
          }}
          maskClosable={false}
          width={800}
          footer={null}
          title={taskTarget ? "Actualizar tarea" : "Registrar tarea"}
        >
          <FormTask
            taskTarget={taskTarget}
            handleOk={handleOkForm}
            handleCancel={handleCancelForm}
            activity={activity}
          />
        </Modal>
      )}
      {isModalDeleteVisible && (
        <Modal
          visible={isModalDeleteVisible}
          onCancel={onCancelDelete}
          onOk={onOKDelete}
          okText="Aceptar"
          cancelText="Cancelar"
          maskClosable={false}
          width={800}
          title={"Eliminar Tarea"}
        >
          <p>
            ¿Desea eliminar la tarea: <strong>{taskTarget.name}</strong>?
          </p>
        </Modal>
      )}
    </>
  );
}
