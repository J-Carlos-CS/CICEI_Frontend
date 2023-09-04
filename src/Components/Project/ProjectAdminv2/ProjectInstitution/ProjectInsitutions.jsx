import React, { useState, useEffect } from "react";
import InstitutionFormModal from "./InstitutionFormModal";
import {
  Typography,
  Row,
  Col,
  Divider,
  Button,
  Table,
  Space,
  message,
  Modal,
} from "antd";
import InstitutionProjectService from "../../../../services/InstitutionProjectService.js";
const { Title } = Typography;
const getColumns = (
  setipsTarget,
  setisModalFormVisible,
  setisModalDeleteVisible,
  projectState
) => {
  let cols = [
    {
      title: "Siglas",
      dataIndex: "shortName",
      key: "shortName",
      width: "100px",
      render: (text, record) => <span>{record.Institution.shortName}</span>,
      fixed: "left",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: "150px",
      render: (text, record) => <span>{record.Institution.name}</span>,
    },
    {
      title: "Pais",
      dataIndex: "country",
      key: "country",
      width: "150px",
      render: (text, record) => <span>{record.Institution.country}</span>,
    },
    {
      title: "Es Financiadora",
      dataIndex: "isFinancier",
      key: "isFinancier",
      width: "150px",
      render: (text, record) => <span>{record.isFinancier ? "Si" : "No"}</span>,
    },
    {
      title: "Monto",
      dataIndex: "currency",
      key: "currency",
      width: "150px",
      render: (text, record) => (
        <span>
          {record.Currency?.shortName}
          {record.moneyBudget || "0"}
        </span>
      ),
    },
  ];
  if (projectState) {
    cols.push({
      title: "Action",
      key: "action",
      width: "100px",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setipsTarget(record);
              setisModalFormVisible(true);
            }}
          >
            Editar
          </Button>
          <Button
            type="link"
            onClick={() => {
              setipsTarget(record);
              setisModalDeleteVisible(true);
            }}
          >
            Eliminar
          </Button>
        </Space>
      ),
    });
  }

  return cols;
};

const ProjectInsitutions = React.memo (function({ projectId, projectState = true }) {
  const [ips, setIps] = useState([]);
  const [isModalFormVisible, setisModalFormVisible] = useState(false);
  const [isModalDeleteVisible, setisModalDeleteVisible] = useState(false);
  const [ipsTarget, setipsTarget] = useState(null);
  useEffect(() => {
    getInstitutionProjects(projectId);
  }, [projectId]);

  const getInstitutionProjects = (id) => {
    InstitutionProjectService.getInstitutionProjectByProjectId(id)
      .then((res) => {
        if (res.data?.success) {
          setIps(res.data.response);
        } else {
          message.error(res.data?.description, 3);
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error(e.message, 3);
      });
  };

  const handleOkForm = () => {
    setipsTarget(null);
    setisModalFormVisible(false);
  };

  const handleCancelForm = () => {
    setipsTarget(null);
    setisModalFormVisible(false);
  };

  const handleOkDelete = () => {
    InstitutionProjectService.deleteInstitutionProject(ipsTarget)
      .then((res) => {
        if (res.data?.success) {
          message.success("Institución eliminada.", 3);
          setipsTarget(null);
          getInstitutionProjects(projectId);
          handleCancelDelete();
        } else {
          message.error(
            "No se pudo eliminar relación con la institución. " +
              res.data?.description,
            5
          );
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error("Hubo un error. " + e.message, 5);
      });
  };

  const handleCancelDelete = () => {
    setisModalDeleteVisible(false);
  };
  return (
    <>
      <Divider>
        <Title level={4}>Instituciones</Title>
      </Divider>
      <Row justify="center" gutter={[0, 24]}>
        <Col
          xs={{ span: 6, offset: 1 }}
          sm={4}
          md={{ span: 6, offset: 4 }}
          lg={{ span: 6, offset: 4 }}
          xl={{ span: 6, offset: 4 }}
        ></Col>
        <Col
          xs={{ span: 6, offset: 11 }}
          sm={4}
          md={{ span: 6, offset: 8 }}
          lg={{ span: 6, offset: 8 }}
          xl={{ span: 6, offset: 8 }}
        >
          {projectState ? (
            <Button
              type="primary"
              onClick={() => {
                setipsTarget(null);
                setisModalFormVisible(true);
              }}
            >
              +Agregar Institución
            </Button>
          ) : null}
        </Col>
        <Col span={18}>
          <Table
            columns={getColumns(
              setipsTarget,
              setisModalFormVisible,
              setisModalDeleteVisible,
              projectState
            )}
            dataSource={ips}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
      {isModalFormVisible ? (
        <InstitutionFormModal
          isModalVisible={isModalFormVisible}
          handleOk={handleOkForm}
          handleCancel={handleCancelForm}
          projectId={projectId}
          institutionsProject={ips}
          getIPs={getInstitutionProjects}
          ipsTarget={ipsTarget}
        />
      ) : null}
      <Modal
        title={`¿Eliminar la asociación con la institución "${ipsTarget?.Institution?.name}"?`}
        visible={isModalDeleteVisible}
        onOk={handleOkDelete}
        okText="Aceptar"
        cancelText="Cancelar"
        onCancel={handleCancelDelete}
      >
        <p>
          Si acepta se eliminará la relación que tiene la institución con el
          proyecto.
        </p>
      </Modal>
    </>
  );
});
export default ProjectInsitutions;
