import {
  Row,
  Col,
  message,
  Button,
  Table,
  Typography,
  Menu,
  Dropdown,
  Tag,
} from "antd";
import StudentJobService from "../../../../services/StudentJobService.js";
const url_api = process.env.REACT_APP_API_URL;

const { Title } = Typography;

const getColumnsRequestJobs = (
  changeStateProgress,
  setStudentJobTarget,
  showModalUpload,
  deleteFileStudentJob,
  showModalEditStudentJob,
  showModalDeleteStudentJob
) => {
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
      title: "Estado",
      dataIndex: "stateProgress",
      key: "stateProgress",
      render: (text, record) => {
        return (
          <Tag
            color={
              record?.Progress?.stateProgress !== "En progreso"
                ? "cyan"
                : "orange"
            }
          >
            {record?.Progress?.stateProgress}
          </Tag>
        );
      },
    },
    {
      title: "Tutor",
      dataIndex: "tutor",
      key: "tutor",
      render: (text, record) => {
        return (
          <Tag
            color={
              record?.Progress?.stateProgress !== "En progreso"
                ? "cyan"
                : "orange"
            }
          >
            {record?.Tutor
              ? `${record.Tutor?.firstName} ${record.Tutor?.lastName}`
              : "Sin tutor"}
          </Tag>
        );
      },
    },
    {
      title: "Semestre inicio",
      dataIndex: "semesterStart",
      key: "semesterStart",
      render: (text, record) => {
        return (
          <Tag
            color={
              record?.Progress?.stateProgress !== "En progreso"
                ? "cyan"
                : "orange"
            }
          >
            {record?.SemesterStart
              ? `${record.SemesterStart?.name}-${record.SemesterStart?.year}`
              : "Sin inicio"}
          </Tag>
        );
      },
    },
    {
      title: "Semestre fin",
      dataIndex: "semesterEnd",
      key: "semesterEnd",
      render: (text, record) => {
        return (
          <Tag
            color={
              record?.Progress?.stateProgress !== "En progreso"
                ? "cyan"
                : "orange"
            }
          >
            {record?.SemesterEnd
              ? `${record.SemesterEnd?.name}-${record.SemesterEnd?.year}`
              : "Pendiente de Defensa"}
          </Tag>
        );
      },
    },
    {
      title: "Acciones sobre Archivo",
      dataIndex: "file",
      width: "150px",
      key: "file",
      render: (text, record) => {
        return (
          <>
            {record.FileStudentJobs?.length > 0 ? (
              <>
                <a
                  href={`${url_api}/file/downloadstudentjobrestrictfile/filestudentjob/${
                    record.FileStudentJobs[0]?.id || 0
                  }/repositoryfile?name=${
                    record.FileStudentJobs[0]?.name || "naranjas"
                  }`}
                >
                  Descargar archivo
                </a>
                <Button
                  type="link"
                  onClick={() => {
                    //setproductTarget(record);
                    deleteFileStudentJob(record);
                  }}
                >
                  Eliminar
                </Button>
              </>
            ) : (
              <Button
                type="link"
                onClick={() => {
                  setStudentJobTarget(record);
                  showModalUpload();
                }}
              >
                Subir archivo
              </Button>
            )}
          </>
        );
      },
    },
    {
      title: "Acciones",
      key: "action",
      width: "100px",
      render: (text, record) => {
        const menu = () => {
          return (
            <Menu>
              <Menu.Item
                key={1}
                onClick={() => {
                  changeStateProgress(record, "Terminado");
                }}
              >
                <span>Terminado</span>
              </Menu.Item>
              <Menu.Item
                key={2}
                onClick={() => {
                  changeStateProgress(record, "En progreso");
                }}
              >
                <span>En progreso</span>
              </Menu.Item>
            </Menu>
          );
        };

        return (
          <>
            <Dropdown overlay={menu}>
              <Button type="link">Cambiar estado del progreso</Button>
            </Dropdown>
            <Button
              type="link"
              onClick={() => {
                showModalDeleteStudentJob(record);
              }}
            >
              Eliminar Trabajo
            </Button>
            <Button
              type="link"
              onClick={() => {
                showModalEditStudentJob(record)
              }}
            >
              Editar Trabajo
            </Button>
          </>
        );
      },
    },
  ];

  return cols;
};

const getColsStudent = () => {
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
      title: "Carrera",
      dataIndex: "careerId",
      key: "careerId",
      render: (text, record) => {
        if (record?.StudentJobs.length > 0) {
          return <span>{`${record?.User?.Career?.name || ""}`}</span>;
        } else {
          return <span>Investigador</span>;
        }
      },
    },
    {
      title: "Institución",
      dataIndex: "institutionId",
      key: "institutionId",
      render: (text, record) => {
        if (record?.StudentJobs.length > 0) {
          return <span>{`${record?.User?.Institution?.name || ""}`}</span>;
        } else {
          return <span>Investigador</span>;
        }
      },
    },
  ];

  return cols;
};

export default function ProjectUserStudents({
  list,
  showModal,
  getData,
  projectId = 0,
  setStudentJobTarget,
  showModalUpload,
  deleteFileStudentJob,
  showModalEditStudentJob,
  showModalDeleteStudentJob
}) {
  let Jobs = [];
  list.map((up) => {
    if (up.StudentJobs.length > 0) {
      up.StudentJobs.map((sj) => {
        if (sj.acceptance === "Aceptado") {
          Jobs.push({ ...sj, User: up.User });
        }
        return sj;
      });
    }
    return up;
  });
  const changeStateProgress = (record, currentProgress) => {

    let studentJobR = {
      ...record,
      currentProgress,
    };
    message.loading({ content: "Actualizando...", key: "updatable" });
    //StudentJobService.updateStudentJob(studentJobR)
    StudentJobService.changeProgress(studentJobR)
      .then((res) => {
        if (res.data?.success) {
          // message.success("Trabajo actualizado", 4);
          getData(projectId);
          message.success({
            content: "Actualizado",
            key: "updatable",
            duration: 3,
          });
        } else {
          message.error({
            content:
              "No se pudo atualizar el trabajo. " + res.data?.description,
            key: "updatable",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        message.error("Hubo un error. " + e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "updatable",
          duration: 5,
        });
      });
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
        >
          {/*  <Button type="primary">Button</Button> */}
        </Col>
        <Col span={24}>
          <Table
            columns={getColsStudent()}
            dataSource={list}
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
        >
          {/* <Button type="primary">Button</Button> */}
        </Col>
        <Col span={24}>
          <Table
            columns={getColumnsRequestJobs(
              changeStateProgress,
              setStudentJobTarget,
              showModalUpload,
              deleteFileStudentJob,
              showModalEditStudentJob,
              showModalDeleteStudentJob
            )}
            dataSource={Jobs}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
    </>
  );
}
