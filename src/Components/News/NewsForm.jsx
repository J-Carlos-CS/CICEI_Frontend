import { useState, useEffect } from "react";
import { Modal, Form, Button, Input, message, Divider, Upload } from "antd";
import NewsService from "../../services/NewsService.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PlusOutlined } from "@ant-design/icons";
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
export default function NewsForm({
  isModalVisible = false,
  handleOk,
  handleCancel,
  newsTarget = null,
  userId = 0,
}) {
  const [form] = Form.useForm();
  const [formField, setformField] = useState(null);
  //console.log("newTarget", newsTarget);
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });
  const [textNew, setTextNew] = useState({ text: "" });

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  };
  useEffect(() => {
    if (newsTarget) {
      setformField([
        {
          name: ["title"],
          value: newsTarget?.title,
        },
        {
          name: ["subtitle"],
          value: newsTarget?.subtitle,
        },
      ]);
      setTextNew({ text: newsTarget?.content });
      setState((state) => ({
        ...state,
        fileList: newsTarget?.picture
          ? [
              {
                url: `https://drive.google.com/uc?export=download&id=${newsTarget?.picture}`,
              },
            ]
          : [],
      }));
    }
  }, [newsTarget]);
  const onFinish = (values) => {
    console.log("values", values);
    console.log("list", state.fileList);
    if (!textNew.text) {
      message.warning("La noticia no tiene contenido", 5);
    } else {
      const formData = new FormData();

      message.loading({ content: "Actualizando...", key: "update" });
      if (newsTarget) {
        let imageStatus = state?.fileList[0]?.url
          ? "persist"
          : state?.fileList[0]?.originFileObj
          ? "new"
          : "delete";
        formData.append("imageStatus", imageStatus);
        formData.append(
          "imageNew",
          values.avatar?.fileList[0]?.originFileObj || null
        );
        formData.append("id", newsTarget?.id);
        formData.append("userId", userId);
        formData.append("date", new Date());
        formData.append("content", textNew?.text || "");
        formData.append("title", values?.title);
        formData.append("subtitle", values?.subtitle);
        NewsService.updateNews(formData)
          .then(async (res) => {
            if (res.data?.success) {
              message.success("Noticia actualizada.", 5);
              await handleOk();
              message.success({
                content: "Actualizado",
                key: "update",
                duration: 3,
              });
              handleCancel();
            } else {
              message.error({
                content: res.data?.description,
                key: "update",
                duration: 5,
              });
            }
          })
          .catch((e) => {
            message.error({
              content: "Hubo un problema. " + e.message,
              key: "update",
              duration: 5,
            });
            console.log("error", e.message);
          });
      } else {
        /* newreq = {
          ...values,
          userId,
          date: new Date(),
          content: textNew.text,
        }; */
        formData.append(
          "imageNew",
          values.avatar?.fileList[0]?.originFileObj || null
        );
        formData.append("userId", userId);
        formData.append("date", new Date());
        formData.append("content", textNew?.text || "");
        formData.append("title", values?.title);
        formData.append("subtitle", values?.subtitle);

        //console.log("news", formData.values().map(data=>data));

        NewsService.createNew(formData)
          .then(async (res) => {
            if (res.data?.success) {
              if (res.data?.response === "fullSuccess") {
                message.success("Noticia publicada.", 5);
              } else if (res.data?.response === "Success") {
                message.warning(
                  "Noticia publicada. No se pudo subir la image",
                  5
                );
              }
              await handleOk();
              message.success({
                content: "Actualizado",
                key: "update",
                duration: 3,
              });
              handleCancel();
            } else {
              message.error({
                content: res.data?.description,
                key: "update",
                duration: 5,
              });
            }
          })
          .catch((e) => {
            message.error({
              content: "Hubo un problema. " + e.message,
              key: "update",
              duration: 5,
            });
            console.log("error", e.message);
          });
      }
    }
  };
  const handleChange = (value) => {
    setTextNew({ text: value });
  };
  const handleChangeImage = ({ file, fileList }) => {
    /* console.log("file", file);
    console.log("files", fileList); */
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng && file.status !== "removed") {
      message.error("Solo puedes subir imagenes JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < 6;
    if (!isLt2M && file.status !== "removed") {
      message.error("La imagen no debe exceder los 2Mb!");
    }

    if (isJpgOrPng && isLt2M) {
      setState({ ...state, fileList });
    } else {
      fileList.pop();
      setState({ ...state, fileList });
    }
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title="Registrar Noticia"
      visible={isModalVisible}
      onOk={() => {}}
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
        scrollToFirstError
      >
        <Form.Item
          name="title"
          label="Título"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el título de la noticia.",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="subtitle"
          label="Antetítulo"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el antetítulo de la noticia.",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Divider>Contenido</Divider>
        <ReactQuill
          value={textNew.text}
          onChange={(value) => {
            handleChange(value);
          }}
        />
        <br />
        <Form.Item
          label="Imagen de la Noticia"
          valuePropName="fileList"
          extra="La imagen debe ser JPG/PNG"
        >
          <Form.Item name="avatar">
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={state.fileList}
              onPreview={handlePreview}
              onChange={handleChangeImage}
              beforeUpload={(file) => false}
            >
              {state.fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Modal
            visible={state.previewVisible}
            title={state.previewTitle}
            footer={null}
            onCancel={() => setState({ ...state, previewVisible: false })}
            maskClosable={false}
          >
            <img
              alt="example"
              style={{ width: "100%" }}
              src={state.previewImage}
            />
          </Modal>
        </Form.Item>
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
