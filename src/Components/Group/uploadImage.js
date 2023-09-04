import React, { useState } from "react";
import { Upload, Modal, message, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from 'axios';


function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const PicturesWall = () => {
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });

  const handleCancel = () => setState({ ...state, previewVisible: false });

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
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error("Image must smaller than 10MB!");
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

  const handleUpload = () => {
    const { fileList } = state;//<= en State tengo mi lista de imagenes
    const formData = new FormData();//<= Esto es importante, es lo que se utiliza para transportar binarios como imagenes,etc.
    formData.append("avatar", fileList[0].originFileObj);//<=Elijo solo la primera imagen para enviar y la nombro avatar
    formData.append("user", "Jotas");//<=agrego otra propiedad que tal vez quisiera
    console.log(formData.get('avatar'));
    const config = {     
      headers: { 'content-type': 'multipart/form-data' }//<=Le digo como tiene que tratar la info
      }

      axios.post("http://localhost:4000/api/group/image", formData, config) //<=Le digo a donde, que cosa y como estoy enviando
      .then(function (response) {
        console.log(response);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
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
      <Modal
        visible={state.previewVisible}
        title={state.previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={state.previewImage} />
      </Modal>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={state.fileList.length === 0}
        //loading={uploading}
        style={{ marginTop: 16 }}
      >
        {false ? "Uploading" : "Start Upload"}
      </Button>
    </>
  );
};

export default PicturesWall;
