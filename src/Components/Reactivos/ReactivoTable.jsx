import { Table, Typography, Space, Modal, Input, Form, Row, Button, message, Col } from "antd";
import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, SnippetsOutlined, SearchOutlined } from "@ant-design/icons";
import CampusService from "../../services/CampusService";

import { Link } from "react-router-dom";
import { useForm } from "antd/lib/form/Form";
import CampusForm from "../Campus/Form/CampusForm";
const { Title, Text } = Typography;

export default function Reactivos(props) {
  const [Campuses, setCampuses] = useState([]);
  const [ShowCreate, setShowCreate] = useState(false);
  const [OptionModal, setOptionModal] = useState(false);
  const [IsUpdated, setIsUpdated] = useState(false);
  const [ShowDeleteModal, setShowDeleteModal] = useState(false);
  const [CampusTarget, setCampusTarget] = useState({});

  const { visible, setVisible, onSave } = props;

  const [form] = Form.useForm();

  const getListCampuses = () => {
    CampusService.getAllCampus().then((res) => {
      const campuses = res.data.response;
      setCampuses(campuses);
      setIsUpdated(false);
    });
  };

  const ShowCreateModal = () => {
    setShowCreate(true);
    setOptionModal(true);
  };
  const hideCreateModal = (res) => {
    setShowCreate(res);
  };
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
  };

  const updateCampusModal = (record) => {
    setShowCreate(true);
    setOptionModal(false);
    console.log("1 record", record);
    setCampusTarget(record);
    console.log("2 CampusTarget ", CampusTarget);
  };

  const updatedTable = (response) => {
    setIsUpdated(response);
  };

  const handleClickDelete = (record) => {
    console.log(record);
    setShowDeleteModal(true);
    setCampusTarget(record);
  };

  const deleteCampusById = () => {
    try {
      CampusService.deleteCampus(CampusTarget.id).then((res) => {
        if (res.data?.success) {
          message.success("Se elimino correctamente el campus", 3);
          setIsUpdated(true);
          setShowDeleteModal(false);
        }
      });
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    getListCampuses();
  }, [IsUpdated]);
  const columns = [
    {
      title: "Nombre",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Ubicación",
      key: "location",
      dataIndex: "location",
    },
    {
      title: "Codigo",
      key: "code",
      dataIndex: "code",
    },
    {
      title: "Opciones",
      key: "optionsCampus",
      dataIndex: "",
      render: (_, record) => (
        <Space size="large" align="center">
          <a onClick={() => updateCampusModal(record)} style={{ display: "flex", flexDirection: "column" }}>
            <EditOutlined></EditOutlined>
            <Text>Editar</Text>
          </a>
          <a style={{ display: "flex", flexDirection: "column" }} onClick={() => handleClickDelete(record)}>
            <DeleteOutlined></DeleteOutlined>
            <Text>Eliminar</Text>
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row align="center" style={{ marginTop: "25px" }}>
        <Col xs={{ span: 20 }} sm={{ span: 16 }} md={{ span: 16 }} lg={{ span: 16 }} xl={{ span: 16 }} style={{ display: "flex", justifyContent: "center" }}>
          <Title>Reactivos</Title>
        </Col>
      </Row>
      <Row>
        <Col offset={20}>
          <Button
            onClick={ShowCreateModal}
            type="primary"
            style={{
              marginRight: "4%",
              marginBottom: 16,
              float: "right",
            }}>
            Agregar nuevo campus
          </Button>
        </Col>
      </Row>
      <Table style={{ marginLeft: "50px", marginRight: "50px", borderRadius: "3%" }} columns={columns} dataSource={Campuses} key="id"></Table>
      <CampusForm
        CampusTarget={CampusTarget}
        ShowCreateModal={ShowCreateModal}
        visible={ShowCreate}
        Option={OptionModal}
        hideCreateModal={hideCreateModal}
        updatedTable={updatedTable}></CampusForm>

      <Modal
        title={`Eliminar el campus '${CampusTarget.name}'`}
        open={ShowDeleteModal}
        onOk={deleteCampusById}
        onCancel={() => setShowDeleteModal(false)}></Modal>
    </>
  );
}
