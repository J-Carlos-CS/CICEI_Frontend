import { Row, Col, Space, Button, Table, Tag } from "antd";

const getColumns = (showModal,projectState) => {
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
      render: (text, record) => (
        <span>
          {record.User?.email}
        </span>
      ),
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
    
  ];

  if(projectState){
    cols.push({
      title: "Acciones",
      key: "action",
      width:"50px",
      render: (text, record) => (
        <Space size="small">
          <Button
            type="link"
            onClick={() => {
              showModal(record, 1);
            }}
          >
            Agregar
          </Button>
        </Space>
      ),
    });
  }

  return cols;
}

export default function ProjectUserRejected({ list, showModal,projectState=true }) {

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
        >
        </Col>
        <Col span={24}>
          <Table
            columns={getColumns(showModal,projectState)}
            dataSource={list}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
    </>
  );
}
