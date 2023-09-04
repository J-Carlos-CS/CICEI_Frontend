import { useState } from "react";
import { Modal, Form, Button, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import FileService from "../../../services/FileService.js";
import UserService from "../../../services/UserService.js";

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
export default function PictureForm({
  isModalVisible,
  handleOk,
  handleCancel,
  pictureId = 0,
  userId = 0,
}) {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });
  const [requesting, setRequesting] = useState(false);
  const onFinish = (values) => {
    //console.log("values", values);
    //console.log("avatar", values.avatar?.fileList[0]?.originFileObj);
    setRequesting(true);
    message.loading({
      content: "Actualizando foto...",
      key: "uploading",
      duration: 6,
    });
    const formData = new FormData();
    formData.append("avatar", values.avatar?.fileList[0]?.originFileObj);
    formData.append("id", pictureId);
    FileService.postUserImage(formData)
      .then((res) => {
        if (res.data?.success) {
          UserService.updatePicture(res.data?.response.id, { id: userId })
            .then((res) => {
              if (res.data?.success) {
                message.success({
                  content: "Foto actualizada.",
                  key: "uploading",
                  duration: 4,
                });
                handleOk();
              } else {
                message.error({
                  content: "No se pudo guardar la imagen",
                  key: "uploading",
                  duration: 4,
                });
              }
            })
            .catch((e) => {
              setRequesting(false);

              console.log("error", e.message);
            });
        } else {
          setRequesting(false);

          message.error({
            content: "No se pudo guardar la imagen.",
            key: "uploading",
            duration: 4,
          });
        }
      })
      .catch((e) => {
        setRequesting(false);
        message.error({ content: "Hubo un error. " + e.message, duration: 5 });
        console.log("error", e.message);
      });
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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

    setState({
      ...state,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  const handleChange = ({ file, fileList }) => {
    /* console.log("file", file);
    console.log("files", fileList); */
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng && file.status !== "removed") {
      message.error("Solo puedes subir imagenes JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
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

  const bUpload = (file) => {
    return false;
  };

  return (
    <Modal
      title="Cambiar Foto"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      footer={null}
      maskClosable={false}
    >
      <Form
        className="form"
        {...formItemLayout}
        // fields={fields}
        form={form}
        name="Cambiar foto"
        onFinish={onFinish}
        preserve={false}
        scrollToFirstError
      >
        <Form.Item
          label="Foto"
          valuePropName="fileList"
          extra="La imagen debe ser JPG/PNG"
        >
          <Form.Item name="avatar">
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={state.fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={bUpload}
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

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            disabled={state.fileList.length === 0 || requesting}
            type="primary"
            htmlType="submit"
          >
            Aceptar
          </Button>
          <Button danger htmlType="button" onClick={handleCancel}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
