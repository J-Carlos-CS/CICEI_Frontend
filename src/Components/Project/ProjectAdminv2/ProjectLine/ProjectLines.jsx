import React, { useState, useContext, useCallback } from "react";
import { NavLink } from "react-router-dom";
import LineFormModal from "./LineFormModal";
import {
  Typography,
  Row,
  Col,
  Divider,
  Button,
  Table,
  Space,
  message,
  Tag,
  Modal,
} from "antd";
import LineProjectService from "../../../../services/LineProjectService.js";
import { ProjectContext } from "../Contexts/AdminProjectContexts";
const { Title } = Typography;

const getColumns = (
  setlineProjectTarget,
  setisModalDeleteVisible,
  projectState
) => {
  let cols = [
    {
      title: "Institucional",
      dataIndex: "isInstitutional",
      width: "150px",
      key: "isInstitutional",
      render: (text, record) => {
        let component = (
          <span>
            {!record.Line.isInstitutional ? (
              record.isMain ? (
                <>
                  Línea CICEI <Tag color="gold">Principal</Tag>
                </>
              ) : (
                <>Línea CICEI</>
              )
            ) : (
              "Línea UCB"
            )}
          </span>
        );
        return component;
      },
    },
    {
      title: "Línea Code",
      dataIndex: "code",
      key: "code",
      width: "100px",
      render: (text, record) => <span>{record.Line?.code}</span>,
    },
    {
      title: "Nombre Línea",
      dataIndex: "name",
      key: "name",
      width: "100px",
      render: (text, record) => <span>{record.Line?.name}</span>,
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
  ];

  if (projectState) {
    cols.push({
      title: "Acciones",
      key: "action",
      width: "150px",
      render: (text, record) => (
        <Space size="middle">
          <NavLink to={"/line/view/" + record.Line.id}>Ver</NavLink>
          {!record.isMain ? (
            <Button
              type="link"
              onClick={() => {
                setlineProjectTarget(record);
                setisModalDeleteVisible(true);
              }}
            >
              Eliminar
            </Button>
          ) : null}
        </Space>
      ),
    });
  }

  return cols;
};

const ProjectLines = React.memo(function () {
  const [lineProjects, setLineProjects] = useState([]);
  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [lineProjectTarget, setlineProjectTarget] = useState(null);
  const [isModalDeleteVisible, setisModalDeleteVisible] = useState(false);
  const {
    projectData: { state: projectState = true, id: projectId, LineProjects },
    getProject,
  } = useContext(ProjectContext);
  //console.log('li8inessss')
  /*   useEffect(() => {
    getLineProjects(projectId);
  }, [projectId]);

  const getLineProjects = (id) => {
    LineProjectService.getLineProjectByProjectId(id)
      .then((res) => {
        if (res.data?.success) {
          setLineProjects(res.data?.response);
        } else {
          message.error(res.data?.description, 3);
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error(e.message, 3);
      });
  }; */

  const handleOkForm = () => {
    setIsModalFormVisible(false);
  };

  const handleCancelForm = () => {
    setIsModalFormVisible(false);
  };

  const onCloseFormModal = async (action = { state: "close" }) => {
    try {
      if (action.state === "success") {
        message.loading({
          content: "Actualizando...",
          key: "onclose",
          duration: 3,
        });
        await updateData([getProject]);
        message.success({
          content: "Actualizado.",
          key: "onclose",
          duration: 3,
        });
      } else {
        handleOkForm();
      }
    } catch (error) {
      message.error({ content: error.message, key: "onclose", duration: 5 });
    }
  };

  const updateData = useCallback(async (promisesArray) => {
    if (promisesArray?.length > 0) {
      let promises = promisesArray.map((functionUpdater) => functionUpdater());
      try {
        await Promise.allSettled(promises);
      } catch (error) {
        message.error({
          content: "Algo salio mal al actualizar la información del proyecto.",
          duration: 5,
          key: "payloads",
        });
      }
    } else {
      message.error({
        content: "Lista de actualización vacia.",
        duration: 5,
        key: "payloads",
      });
    }
  }, []);
  const handleOkDelete = async () => {
    let lineProject = {
      id: lineProjectTarget.id,
      lineId: lineProjectTarget.lineId,
      projectId: projectId,
    };
    try {
      let {
        data: { response = null, description = "", success = false },
      } = await LineProjectService.deleteLineProject(lineProject);
      if (success) {
        message.success({
          content: "Línea eliminada.",
          duration: 5,
          key: "delete",
        });
        onCloseFormModal({state:"success"});
        setisModalDeleteVisible(false);
      } else {
        message.warning({
          content: "Error. " + description,
          duration: 5,
          key: "delete",
        });
      }
    } catch (error) {
      message.error({ content: error.message, duration: 5, key: "delete" });
    }
    /*  console.log(lineProject);

    LineProjectService.deleteLineProject(lineProject)
      .then((res) => {
        if (res.data?.success) {
          message.success("Línea desasociada", 3);
          setlineProjectTarget(null);
          setisModalDeleteVisible(false);
          getLineProjects(projectId);
        } else {
          message.error(res.data?.description, 5);
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error(e.message, 5);
      }); */
  };

  const handleCancelDelete = () => {
    setlineProjectTarget(null);
    setisModalDeleteVisible(false);
  };

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
          {projectState ? (
            <Button
              type="primary"
              onClick={() => {
                setIsModalFormVisible(true);
              }}
            >
              + Añadir Línea
            </Button>
          ) : null}
        </Col>
        <Col span={18}>
          <Table
            columns={getColumns(
              setlineProjectTarget,
              setisModalDeleteVisible,
              projectState
            )}
            dataSource={LineProjects}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
      {isModalFormVisible ? (
        <LineFormModal
          isModalVisible={isModalFormVisible}
          handleOk={handleOkForm}
          handleCancel={handleCancelForm}
          lineProjects={LineProjects}
          projectId={projectId}
          onClose={onCloseFormModal}
          //getLineProjects={getLineProjects}
        />
      ) : null}
      <Modal
        title={
          "¿Eliminar línea " +
          lineProjectTarget?.Line?.code +
          " " +
          lineProjectTarget?.Line?.name +
          "?"
        }
        visible={isModalDeleteVisible}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
      >
        <p>Si acepta la línea solo se desvinculará de este proyecto.</p>
      </Modal>
    </>
  );
});

export default ProjectLines;
