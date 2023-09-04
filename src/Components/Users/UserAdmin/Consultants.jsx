import { Col, Row, Table } from "antd";

const columns = [
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
    width: "100px",
    render: (text, record) => <span>{record.firstName + " " + record.lastName}</span>,
    fixed: "left",
  },
   {
    title: "Correo electrónico",
    dataIndex: "email",
    width: "150px",
    key: "email",
    render: (text, record) => (
      <span>{record.email}</span>
    ),
  },
  {
    title: "Grado Académico",
    dataIndex: "grade",
    width: "150px",
    key: "grade",
    render: (text, record) => (
      <span>{record.grade}</span>
    ),
  }, 
  {
    title: "Cumpleaños",
    dataIndex: "birthdate",
    width: "150px",
    key: "birthdate",
    render: (text, record) => (
      <span>{record.birthDate}</span>
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

export default function AllUsers({list=[]}) {

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
          <div>
            {/* <Button type="primary" size="small">
              <Link to="/invitation-users">Enviar invitaciones</Link>
            </Button> */}
          </div>
        </Col>
        <Col span={18}>
          <Table
            columns={columns}
            dataSource={list}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
    </>
  );
}
