import { useState } from "react";
import { Row, Col, Table, Tag, Button, message } from "antd";
import ConsultorPayment from "./ConsultorPayment";

const getColumns = (setIsModalPaymentVisible, setUserTarget) => {
  let cols = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {(record?.User?.firstName || "Sin") +
            " " +
            (record?.User?.lastName || "identidad")}
        </span>
      ),
      fixed: "left",
    },
    {
      title: "Correo electrónico",
      dataIndex: "email",
      key: "email",
      render: (text, record) => <span>{record.User?.email}</span>,
    },
    {
      title: "Rol",
      dataIndex: "systemRol",
      key: "systemRol",
      render: (text, record) => (
        <>
          <span>{record?.SystemRol?.name || "Sin rol"}</span>
          {record.isMain ? (
            <Tag color={"yellow"} key={"yellow"}>
              LÍDER
            </Tag>
          ) : null}
        </>
      ),
    },
    {
      title: "Acciones",
      key: "action",
      width: "50px",
      render: (text, record) => {
        let component =
          record.SystemRol?.name === "Consultor" ? (
            <Button
              type="link"
              onClick={() => {
                setUserTarget(record);
                setIsModalPaymentVisible(true);
              }}
            >
              Seleccionar origen de Pago
            </Button>
          ) : null;
        return component;
      },
    },
  ];

  return cols;
};

export default function ProjectUserResearchers({
  list,
  showModal,
  getData,
  institutionProjects = [],
}) {
  const [isModalPaymentVisible, setIsModalPaymentVisible] = useState(false);
  const [userTarget, setUserTarget] = useState(null);

  const handleOkFormPayment = async () => {
    getData();
    message.success("Actualizado", 3);
    setIsModalPaymentVisible(false);
    setUserTarget(false);
  };

  const handleCancelFormPayment = () => {
    setIsModalPaymentVisible(false);
    setUserTarget(false);
  };

  return (
    <>
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
        ></Col>
        <Col span={24}>
          <Table
            columns={getColumns(setIsModalPaymentVisible, setUserTarget)}
            dataSource={list}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
      {isModalPaymentVisible && (
        <ConsultorPayment
          isModalVisible={isModalPaymentVisible}
          handleOk={handleOkFormPayment}
          handleCancel={handleCancelFormPayment}
          userTarget={userTarget}
          institutionProjectsList={institutionProjects}
        />
      )}
    </>
  );
}
