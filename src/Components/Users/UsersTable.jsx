import { useState } from "react";
import { Button, Col, Row, Table, Divider, Typography } from "antd";
import { Link } from "react-router-dom";
//import UserService from "../../services/UserService.js";

const { Title } = Typography;
const columns = [
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
    width: "100px",
    render: (text, record) => <span>{record.Line.code}</span>,
    fixed: "left",
  },
  {
    title: "Institucional",
    dataIndex: "isInstitutional",
    width: "150px",
    key: "isInstitutional",
    render: (text, record) => (
      <span>{record.Line.isInstitutional ? "Línea UCB" : "Línea CICEI"}</span>
    ),
  },
  {
    title: "Grupo Code",
    dataIndex: "Group",
    width: "150px",
    key: "Group",
    render: (text, record) => (
      <span>{record.Line?.Group?.code || "Sin Grupo"}</span>
    ),
  },
  /* {
      title: "Acciones",
      key: "action",
      width: "150px",
      render: (text, record) => (
        <Space size="middle">
          <NavLink to={"/line/view/" + record.Line.id}>Ver</NavLink>
          <span>Eliminar</span>
        </Space>
      ),
    }, */
];

export default function UsersTable() {
  const [userList, setuserList] = useState([]);

  return (
    <>
      <Divider>
        <Title level={4}>Líneas</Title>
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
          <div>
            <Button type="primary" size="small">
              <Link to="/invitation-users">Enviar invitaciones</Link>
            </Button>
          </div>
        </Col>
        <Col span={18}>
          <Table
            columns={columns}
            dataSource={userList}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
    </>
  );
}
