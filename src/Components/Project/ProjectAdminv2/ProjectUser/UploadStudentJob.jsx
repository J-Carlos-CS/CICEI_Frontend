import { useState } from "react";
import { Upload, Button, Modal, message,Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";
//import FileType from "file-type/browser";

//let listMime = ["application/x-rar-compressed", "application/octet-stream","application/vnd.rar"];

export default function UploadProduct({
  isVisible,
  handleOk,
  handleCancel,
  productTarget = null,
  repositorySize = { maxSize: 2048, size: 0 },
}) {
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });
  const [progress, setProgress] = useState(0);
  //const [confirmLoading, setConfirmLoading] = useState(false);
  const [status, setStatus] = useState("active");
  const bUpload = (file) => {
    return false;
  };

  const handleChange = async ({ file, fileList }) => {
    if (file?.status === "removed") {
      fileList = [];
      setState({ ...state, fileList });
    } else {
      try {
        let fileSize = file?.size?.toFixed(3) || 0.0;
        fileSize = fileSize / 1024 / 1024;
        if (fileSize + repositorySize.size <= repositorySize.maxSize) {
          setState({ ...state, fileList });
        } else {
          message.warning(
            "El archivo es mas pesado que el espacio disponible.",
            8
          );
          fileList.pop();
          setState({ ...state, fileList });
        }
      } catch (e) {
        console.log("e", e.message);
        message.error("Archivo invalido", 3);
        fileList.pop();
        setState({ ...state, fileList });
      }
    }
  };

  const handleUpload = async () => {
    //await handleOk(state.fileList);
    try {
      if (state.fileList.length > 0) {
        const config = {
          onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            if (percentCompleted % 5 === 0) {
              setProgress(percentCompleted);
            }
          },
          headers: { "content-type": "multipart/form-data" },
        };
        //setConfirmLoading(true);
        await handleOk(state.fileList, config);
      }
    } catch (e) {
      setStatus("exception");
    }
  };

  return (
    <>
      <Modal
        title="Subir archivo"
        okText="Subir archivo"
        cancelText="Cancelar"
        visible={isVisible}
        onOk={() => {
          handleUpload();
        }}
        onCancel={handleCancel}
      >
        <Upload
          action=""
          listType="text"
          maxCount={1}
          beforeUpload={bUpload}
          onChange={handleChange}
        >
          <Button
            disabled={state.fileList.length > 0}
            icon={<UploadOutlined />}
          >
            Upload (Max: 1)
          </Button>
        </Upload>
        <Progress percent={progress} status={status} />
        {status === "exception" && <div>Error al subir el archivo, vuelva a intentar.</div>}
       </Modal>
    </>
  );
}
