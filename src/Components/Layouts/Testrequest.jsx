import React, { useState, useEffect, useCallback } from "react";
import InstitutionService from "../../services/InstitutionService.js";
import { message, Row, Col, Upload,Button, Progress} from "antd";
import {UploadOutlined} from "@ant-design/icons"
import FileService from "../../services/FileService.js";


export default function Testrequest() {
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });
 // const [count, setCount] = useState(1);
  const bUpload = (file) => {
    return false;
  };

  const handleChange = async ({ file, fileList }) => {
    /* console.log("file", file);
    console.log("files", fileList); */
    if (file?.status === "removed") {
      fileList = [];
      setState({ ...state, fileList });
    } else {
      try {
     /*    const fileType = await FileType.fromBlob(file);
        console.log(fileType);

        let isMime = listMime.some((m) => m === fileType.mime);*/
        //if (isMime && fileType.ext === "rar") { 
         // console.log('myFile', typeof(file.size));
        let fileSize = file?.size?.toFixed(3) || 0.0;
        fileSize = (fileSize / 1024 / 1024);
       /*  console.log('max',repositorySize.maxSize );
        console.log('size',repositorySize.size );
        console.log('filesei',fileSize );
        console.log('max',typeof(repositorySize.maxSize ));
        console.log('size',typeof(repositorySize.size ));
        console.log('filesei',typeof(fileSize ));
 */
        if(true){
           
        
          setState({ ...state, fileList });
          
        } else {
          message.warning("El archivo es mas pesado que el espacio disponible.", 8);
          fileList.pop();
          setState({ ...state, fileList });
        }
      } catch (e) {
        console.log('e',e.message);
          message.error("Archivo invalido",3);
          fileList.pop();
          setState({ ...state, fileList });
      }
    }
  };
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    console.log('file',state?.fileList);
    try{
      const formData = new FormData();
      formData.append("myretrofileapp", state?.fileList[0]?.originFileObj);
      const config = {
        onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(percentCompleted)
          if(percentCompleted % 5 === 0){
            setProgress(percentCompleted);
          }
        },
        headers: { "content-type": "multipart/form-data" }
      }
    
    /*   axios.post(url_api + "/file/testfile", formData, config)
        .then(res => {
          console.log(res)
          alert("Subido");
        })
        .catch(err => console.log(err)) */
        let response = await FileService.testFile(formData,config);
        alert("subido");
    }catch(e){
      message.error(e.message,5);
    }
  }
  return (
    <Row>
      <Col span={24}>
      <Upload
        action=""
        listType="text"
        maxCount={1}
        beforeUpload={bUpload}
        onChange={handleChange}
      >
        <Button disabled={state.fileList.length > 0} icon={<UploadOutlined />}>
          Upload (Max: 1)
        </Button>
      </Upload>
      
      </Col>
      <Col span={24}><Button onClick={handleUpload}>Subir</Button></Col>
      <Col span={24}>
      <Progress percent={progress} status="active" />
      </Col>
    </Row>
  );
}
