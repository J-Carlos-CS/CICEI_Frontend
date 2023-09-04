import { useState, useEffect } from "react";
import { Modal, Form, Select, Button, Input, DatePicker, message } from "antd";
import ActivityService from "../../../../services/ActivityService";
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
const filterNames = (input = "", { children: userName = "" }) => {
  //console.log('user',`${userProject?.children}`);
  if (userName.toLowerCase().indexOf(input?.toLowerCase()) >= 0) {
    return true;
  } else {
    return false;
  }
};
export default function ActivityFormModal({
  isModalVisible = false,
  handleOk,
  handleCancel,
  userList = [],
  projectId,
  activityTarget = null,
  setactivityTarget,
  datesProject,
}) {
  //console.log("user", userList);
  const [form] = Form.useForm();
  const [formField, setformField] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const dateFormat = "YYYY/MM/DD";

  useEffect(() => {
    if (activityTarget) {
      setformField([
        { name: ["name"], value: activityTarget.name },
        { name: ["description"], value: activityTarget.description },
        { name: ["userId"], value: activityTarget.userId },
        {
          name: ["rangeDate"],
          value: [
            moment(activityTarget.startDate, dateFormat),
            moment(activityTarget.endDate, dateFormat),
          ],
        },
      ]);
    }
  }, [activityTarget]);

  const createActivity = (activityData) => {
    ActivityService.createActivity(activityData)
      .then((res) => {
        if (res.data?.success) {
          message.success("Actividad registrada.", 4);
          handleOk();
        } else {
          setRequesting(false);
          message.error({
            content: res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        setRequesting(false);
        console.log(e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };

  const updateActivity = (activity) => {
    ActivityService.upadteActivity(activity)
      .then((res) => {
        if (res.data?.success) {
          message.success("Actividad actualizada.", 4);
          handleOk();
        } else {
          setRequesting(false);
          message.error({
            content: res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        console.log(e.message);
        setRequesting(false);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };

  const disableDates = (current) => {
    let start = new Date(datesProject[0]);
    let end = new Date(datesProject[1]);
    /* let start = '2021-10-01';
    let end = '2021-12-22'; */
    if (current < moment(start)) {
      return true;
    } else if (current > moment(end)) {
      return true;
    } else {
      return false;
    }
  };

  const onFinish = (values) => {
    //console.log("values", values);
    setRequesting(true);
    let activityData = {
      id: activityTarget?.id || null,
      name: values.name || "",
      description: values.description || "",
      userId: values.userId || null,
      projectId: parseInt(projectId) || null,
      order: 0,
      progressId: null,
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
    };
    message.loading({ content: "Actualizando", key: "update" });
    if (activityTarget) {
      updateActivity(activityData);
    } else {
      createActivity(activityData);
    }
  };
  return (
    <Modal
      title="Registrar Actividad"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      footer={null}
      centered
    >
      <Form
        //className="form"
        {...formItemLayout}
        form={form}
        fields={formField}
        onFinish={onFinish}
        //layout="vertical"
        name="form_in_modal"
        scrollToFirstError
      >
        {/* <Divider>Describe tu trabajo</Divider> */}

        <Form.Item
          name="name"
          label="Nombre Actividad"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el nombre de la actividad.",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descripción"
          rules={[
            {
              required: true,
              message: "Por favor describa la actividad.",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="userId"
          label="Encargado"
          rules={[
            {
              required: true,
              message: "Por favor seleccione al encargado de la actividad.",
            },
          ]}
        >
          <Select showSearch filterOption={filterNames}>
            {userList.map((u) => (
              <Select.Option key={u.User?.id} value={u.User?.id}>
                {`${u.User?.firstName} ${u.User?.lastName} - ${
                  u?.User?.SystemRol?.name
                } ${u?.User?.sintetic ? "( sintético )" : ""} `}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="rangeDate"
          label="Fecha Inicio y Final"
          rules={[
            { type: "array", required: true, message: "Please select time!" },
          ]}
        >
          <RangePicker disabledDate={disableDates} format={"YYYY/MM/DD"} />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" disabled={requesting}>
            {activityTarget ? "Actualizar" : "Registrar"}
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
