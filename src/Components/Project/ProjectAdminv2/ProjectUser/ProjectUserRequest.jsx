import { Row, Col, Space, Button, Table, Typography } from "antd";
const { Title } = Typography;

const getColumnsRequestMembers = (showModal, projectState = true) => {
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
      title: "Investigador",
      dataIndex: "systemRol",
      key: "systemRol",
      width: "150px",
      render: (text, record) => (
        <span>{record?.SystemRol?.name || "Sin rol"}</span>
      ),
    },
    {
      title: "Trabajo",
      dataIndex: "studentJob",
      key: "studentJob",
      render: (text, record) => {
        if (record?.StudentJobs.length > 0) {
          return (
            <span>{`(${
              record?.StudentJobs[0]?.TypeInvestigation?.name || ""
            })-${record?.StudentJobs[0]?.titleDocument || ""}`}</span>
          );
        } else {
          return <span>Investigador</span>;
        }
      },
    },
  ];

  if (projectState) {
    cols.push({
      title: "Acciones",
      key: "action",
      width: "100px",
      render: (text, record) => (
        <Space size="small">
          <Button type="link" onClick={() => showModal(record, 1)}>
            Aceptar
          </Button>
          <Button type="link" onClick={() => showModal(record, 6)}>
            Rechazar solicitud
          </Button>
        </Space>
      ),
    });
  }

  return cols;
};

const getColumnsRequestJobs = (showModal, projectState = true) => {
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
      title: "Trabajo",
      dataIndex: "studentJob",
      key: "studentJob",
      render: (text, record) => {
        return (
          <span>{`(${record?.TypeInvestigation?.name || ""})-${
            record?.titleDocument || ""
          }`}</span>
        );
      },
    },
    {
      title: "Tutor",
      dataIndex: "tutor",
      key: "tutor",
      render: (text, record) => {
        return (
          <span>
            {record?.Tutor
              ? `${record.Tutor?.firstName} ${record.Tutor?.lastName}`
              : "Sin tutor"}
          </span>
        );
      },
    },
    {
      title: "Semestre inicio",
      dataIndex: "semesterStart",
      key: "semesterStart",
      render: (text, record) => {
        return (
          <span>
            {record?.SemesterStart
              ? `${record.SemesterStart?.name}-${record.SemesterStart?.year}`
              : "Sin inicio"}
          </span>
        );
      },
    },
  ];

  if (projectState) {
    cols.push({
      title: "Acciones",
      key: "action",
      width: "100px",
      render: (text, record) => (
        <Space size="small">
          <Button type="link" onClick={() => showModal(record, 4)}>
            Aceptar
          </Button>
          <Button type="link" onClick={() => showModal(record, 5)}>
            Mandar a Replantear
          </Button>
          <Button
            type="link"
            onClick={() => {
              showModal(record, 7);
            }}
          >
            Rechazar solicitud
          </Button>
        </Space>
      ),
    });
  }

  return cols;
};

export default function ProjectUserRequest({
  list,
  showModal,
  projectState = true,
}) {
  let requestMembesList = list.filter(
    (up) => up.acceptance === "Pendiente" && up.StudentJobs.length === 0
  );
  let requestJobs = [];
  list.map((up) => {
    if (up.StudentJobs.length > 0) {
      up.StudentJobs.map((sj) => {
        if (sj.acceptance === "Pendiente" || sj.acceptance === "Repropuesto") {
          requestJobs.push({ ...sj, User: up.User });
        }
        return sj;
      });
    }
    return up;
  });
  //console.log('requestJob', requestJobs);
  return (
    <>
      <Row justify="space-between" gutter={[0, 24]}>
        <Col
          xs={{ span: 6 }}
          sm={4}
          md={{ span: 11 }}
          lg={{ span: 11 }}
          xl={{ span: 11 }}
        >
          <Title level={4}>Trabajos de Estudiantes</Title>
        </Col>
        <Col
          xs={{ span: 6 }}
          sm={4}
          md={{ span: 6 }}
          lg={{ span: 6 }}
          xl={{ span: 6 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        ></Col>
        <Col span={24}>
          <Table
            columns={getColumnsRequestJobs(showModal, projectState)}
            dataSource={requestJobs}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
      <Row justify="space-between" gutter={[0, 24]}>
        <Col
          xs={{ span: 6 }}
          sm={4}
          md={{ span: 11 }}
          lg={{ span: 11 }}
          xl={{ span: 11 }}
        >
          <Title level={4}>Investigadores</Title>
        </Col>
        <Col
          xs={{ span: 6 }}
          sm={4}
          md={{ span: 6 }}
          lg={{ span: 6 }}
          xl={{ span: 6 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        ></Col>
        <Col span={24}>
          <Table
            columns={getColumnsRequestMembers(showModal, projectState)}
            dataSource={requestMembesList}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
    </>
  );
}
