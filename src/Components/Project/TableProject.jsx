import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Typography,
  Modal,
  message,
  Tag,
  Row,
  Col,
  Input,
  Tooltip,
} from "antd";
import { Link } from "react-router-dom";
import ProjectService from "../../services/ProjectService";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ProjectChangeLine from "./ProjectChangeLine";
import LineService from "../../services/LineService";
const { Title } = Typography;

const getColumns = (showModal) => {
  return [
    /* {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text) => <span style={{ color: "#1890FF" }}>{text}</span>,
    }, */
    {
      title: "Nombre",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Encargado",
      dataIndex: "leader",
      key: "leader",
      render: (text, record) => {
        return record.User ? (
          <Tag color="gold">{`${record.User.firstName} ${record.User.lastName}`}</Tag>
        ) : (
          <Tag color="lime">Sin lider</Tag>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "state",
      key: "state",
      render: (text, record) => {
        return record.state ? (
          <Tag color="gold">Activo</Tag>
        ) : (
          <Tag color="lime">Finalizado</Tag>
        );
      },
    },
    {
      title: "Línea CICEI",
      dataIndex: "Line",
      key: "Line",
      render: (text, record) => {
        let textLine = "";
        record.LineProjects?.forEach((lp) => {
          if (lp.isMain) {
            textLine = `${lp?.Line?.name}`;
          }
        });
        return textLine;
      },
    },
    {
      title: "Acciones",
      key: "action",
      width: "60px",
      render: (text, record) => (
        <Space size="small">
          <Link to={"/project/viewforuser/" + record.id}>
            <Button type="link" size={"small"}>
              Ver
            </Button>
          </Link>
          <Link to={"/project-panel/" + record.id}>
            <Button type="link" size={"small"}>
              Administrar
            </Button>
          </Link>
          <Button type="link" size={"small"} onClick={() => showModal(record)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];
};

export default function TableProject() {
  const [isChangeModalVisible, setIsChangeModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stateModal, setStateModal] = useState({ visible: false });
  const [projectTarget, setProjectTarget] = useState({ title: "", id: 0 });
  const [filter, setFilter] = useState({ search: "" });
  const showModal = (record) => {
    setProjectTarget({ title: record.title, id: record.id });
    setStateModal({
      visible: true,
    });
  };

  const hideModal = () => {
    setStateModal({
      visible: false,
    });
  };

  const dataFilter = () => {
    let listFiltered = [];
    if (filter.search !== "") {
      listFiltered = data?.filter((p) => {
        if (
          p.title?.toLowerCase().indexOf(filter.search?.toLowerCase()) >= 0 ||
          `${p.User.firstName} ${p.User.lastName}`
            .toLowerCase()
            .indexOf(filter.search?.toLowerCase()) >= 0
        ) {
          return true;
        }
        /*  if (p.state && "Finalizado".indexOf(filter.search?.toLowerCase())) {
          return true;
        }
        if (!p.state && "Activo".indexOf(filter.search?.toLowerCase())) {
          return true;
        } */

        return false;
      });
    } else {
      listFiltered = data;
    }
    return listFiltered;
  };

  const onChangeInputSearch = (e) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const onAcept = () => {
    ProjectService.deleteProject(projectTarget.id)
      .then((res) => {
        if (res.data?.success) {
          message.success("El proyecto fue eliminado.", 3);
          getProjects();
          hideModal();
        } else {
          message.error("No se pudo eliminar el proyecto, intente nuevamente.");
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error(
          "Hubo un error en el servidor al intentar borrar el grupo."
        );
      });
  };

  const getProjects = () => {
    ProjectService.getProjects()
      .then((response) => {
        if (response.data?.success) {
          setData(response.data.response);
          setIsLoading(false);
        } else {
          message.warning("No se encontraron proyectos", 4);
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  const handleOk = (data) => {
    message.loading({ content: "Actualizando", key: "update" });
    LineService.changeLineProjects(data)
      .then(async (res) => {
        if (res.data?.success) {
          try {
            message.success("Proyectos actualizados");
            getProjects();
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            setIsChangeModalVisible(false);
          } catch (e) {
            message.error({ content: e.message, key: "update", duration: 4 });
          }
        } else {
          message.error({
            content: res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        message.error({ content: e.message, key: "update", duration: 5 });
      });
  };

  const handleCancel = () => {
    setIsChangeModalVisible(false);
  };

  useEffect(() => {
    getProjects();
  }, []);
  return (
    <>
      <Title className="title-group">Proyectos</Title>
      <div className="div-container">
        <Link to="/project/form">
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              float: "right",
            }}
          >
            + Crear Proyecto
          </Button>
        </Link>
        <Button
          type="primary"
          style={{
            marginBottom: 16,
            float: "right",
          }}
          onClick={() => {
            setIsChangeModalVisible(true);
          }}
        >
          Mover Proyecto de Línea
        </Button>
        <Row style={{ margin: "1em 0" }}>
          <Col span={7}>
            <Input
              placeholder="Buscar..."
              onChange={onChangeInputSearch}
              prefix={<SearchOutlined className="site-form-item-icon" />}
              suffix={
                <Tooltip title="Extra information">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Col>
        </Row>
        <Table
          rowKey="id"
          className="table-group"
          pagination={{ position: ["none", "bottomCenter"] }}
          columns={getColumns(showModal)}
          dataSource={dataFilter()}
          loading={isLoading}
          size="middle"
        />
      </div>
      <Modal
        title={`Eliminar el Proyecto '${projectTarget.title}'`}
        visible={stateModal.visible}
        onOk={onAcept}
        onCancel={hideModal}
        okText="Aceptar"
        cancelText="Cancelar"
      >
        <p>¿Esta seguro que desea eliminar el Proyecto?</p>
      </Modal>
      {isChangeModalVisible && (
        <ProjectChangeLine
          projects={data}
          isVisible={isChangeModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
}
