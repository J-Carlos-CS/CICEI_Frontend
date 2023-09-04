import React, { useState, useContext, useCallback } from "react";
import {
  Typography,
  Row,
  Col,
  Divider,
  message,
  Button,
  Tag,
  Table,
  Modal,
} from "antd";
import { WarningOutlined } from "@ant-design/icons";
import ActivityFormModal from "./ActivityFormModal";
import ActivityService from "../../../../services/ActivityService.js";
import TaskService from "../../../../services/TaskService";
import GantActivities from "../ProjectActivity/GantActivities";
import ChangeProgressModal from "./ChangeProgressModal";
import TasksTable from "./TasksTable";
import {
  ActivityContext,
  ProjectContext,
  ProductContext,
  DiffusionProductContext,
} from "../Contexts/AdminProjectContexts";
const { Title } = Typography;

const getColumns = (
  setactivityTarget,
  showModalForm,
  showModal,
  showModalProgress,
  projectState,
  showModalTaskTable
) => {
  let cols = [
    {
      title: "Nombre Actividad",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <span>{record.name}</span>,
      fixed: "left",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <>
          <span>{record?.description}</span>
        </>
      ),
    },
    {
      title: "Fecha Inicio - Fecha Final",
      dataIndex: "dates",
      key: "dates",
      render: (text, record) => {
        let startDate = new Date(record.startDate);
        let endDate = new Date(record.endDate);
        /*   startDate.setMinutes(
          startDate.getMinutes() + new Date().getTimezoneOffset()
        );
        endDate.setMinutes(
          endDate.getMinutes() + new Date().getTimezoneOffset()
        ); */
        return (
          <>
            <Tag key={9} color={"yellow"}>
              {startDate.toLocaleString("es")}
            </Tag>
            <Tag key={10} color={"yellow"}>
              {endDate.toLocaleString("es")}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "stateProgress",
      key: "stateProgress",
      render: (text, record) => (
        <>
          <Tag color={"yellow"} key={"yellow"}>
            {record.Progress?.stateProgress}
          </Tag>
        </>
      ),
    },
    {
      title: "Avance",
      dataIndex: "progress",
      key: "progress",
      render: (text, record) => (
        <>
          <Tag color={"yellow"} key={"yellow"}>
            {record.progress ? record.progress + "%" : "No registrado"}
          </Tag>
        </>
      ),
    },
    {
      title: "Encargado",
      dataIndex: "userId",
      key: "userId",
      render: (text, record) => (
        <>
          <Tag color={"yellow"} key={"yellow"}>
            {record.User?.firstName + " " + record.User?.lastName}
          </Tag>
        </>
      ),
    },
    {
      title: "¿Producto?",
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <>
          {record.Products.length > 0 ? (
            <Tag
              color={"cyan"}
              key={"cyan"}
            >{`(${record.Products.length}) Productos`}</Tag>
          ) : (
            <Tag color={"yellow"} key={"yellow"}>
              "Sin producto"
            </Tag>
          )}
        </>
      ),
    },
    {
      title: "¿Producto Difusión?",
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <>
          {record.DiffusionProducts?.length > 0 ? (
            <Tag
              color={"cyan"}
              key={"cyan"}
            >{`(${record.DiffusionProducts?.length}) Productos`}</Tag>
          ) : (
            <Tag color={"yellow"} key={"yellow"}>
              "Sin producto"
            </Tag>
          )}
        </>
      ),
    },
  ];
  if (projectState) {
    cols.push({
      title: "Acciones",
      key: "action",
      render: (text, record) => (
        <>
          {!record.isMain && record?.SystemRol?.name !== "Estudiante" ? (
            <Button
              type="link"
              onClick={() => {
                setactivityTarget(record);
                showModalForm();
              }}
            >
              Editar
            </Button>
          ) : null}
          <Button
            type="link"
            onClick={() => {
              setactivityTarget(record);
              showModalProgress();
            }}
          >
            Editar Progreso
          </Button>
          <Button
            type="link"
            onClick={() => {
              setactivityTarget(record);
              showModalTaskTable();
            }}
          >
            Editar tareas
          </Button>
          <Button
            type="link"
            onClick={() => {
              setactivityTarget(record);
              showModal();
            }}
          >
            Borrar
          </Button>
        </>
      ),
    });
  }

  return cols;
};

const runPromises = async (listPromises, listSetters) => {
  if (
    listPromises.length > 0 &&
    listSetters.length > 0 &&
    listPromises.length === listSetters.length
  ) {
    let promises = listPromises.map((f) => f());
    try {
      let results = await Promise.allSettled(promises);
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          message.error("Error al actualizar. " + result.reason, 5);
        } else {
          listSetters[index](result.value);
        }
        //console.log("termine mi proceso");
      });
    } catch (e) {
      console.log(e.message);
      message.error("Error. " + e.message, 5);
    }
  } else {
    console.log("Proceso denegado");
  }
};

const ProjectActivity = React.memo(function ({
  projectId,
  //datesProject = [new Date(), new Date()],
  //UsersForActivities = [],
  //projectState = true,
  //activies = [],
  /* getActivities,
  setActivities, */
}) {
  //console.log("EStas son mis activies", activies);
  const {
    activities = [],
    getActivities,
    setActivities,
  } = useContext(ActivityContext);
  const {
    projectData: {
      state: projectState = true,
      UsersForActivities = [],
      startDate,
      endDate,
    },
  } = useContext(ProjectContext);
  const { getProducts } = useContext(ProductContext);
  const { getDiffusionProducts } = useContext(DiffusionProductContext);
  //console.log("activitiesUser",UsersForActivities);
  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [isModalChangeProgress, setIsModalChangeProgress] = useState(false);
  const [activityTarget, setactivityTarget] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalTasksTableVisible, setIsModalTasksTableVisible] =
    useState(false);
  const [gant, setgant] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    message.loading({ content: "Actualizando...", key: "updatable" });
    ActivityService.deleteActivity(activityTarget.id)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Actividad eliminada.", 5);
          setactivityTarget(null);
          //getActivitiesByProjectId(projectId);
          await updateData([getActivities, getProducts, getDiffusionProducts]);
          setIsModalVisible(false);
          message.success({
            content: "Actualizado",
            key: "updatable",
            duration: 3,
          });
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error({
          content: "Error al Actualizar. " + e.message,
          key: "updatable",
          duration: 3,
        });
      });
  };

  const handleCancel = () => {
    setactivityTarget(null);
    setIsModalVisible(false);
  };

  const showModalForm = () => {
    setIsModalFormVisible(true);
  };

  const handleOkForm = async () => {
    try {
      setIsModalFormVisible(false);
      setactivityTarget(null);
      message.loading({
        content: "Actualizando...",
        key: "updateActivities",
        duration: 5,
      });
      await updateData([getActivities, getProducts, getDiffusionProducts]);
      message.success({
        content: "Actualizado",
        key: "updateActivities",
        duration: 3,
      });
    } catch (error) {
      message.error({
        content: error.message,
        key: "updateActivities",
        duration: 3,
      });
    }
  };

  const handleCancelForm = () => {
    setactivityTarget(null);
    setIsModalFormVisible(false);
  };

  const showModalProgress = () => {
    setIsModalChangeProgress(true);
  };

  const handleOkChangeProgress = async () => {
    try {
      setIsModalChangeProgress(false);
      setactivityTarget(null);
      message.loading({
        content: "Actualizando...",
        key: "changeprogress",
        duration: 5,
      });
      await updateData([getActivities]);
      message.success({
        content: "Actualizado",
        key: "changeprogress",
        duration: 3,
      });
    } catch (error) {
      message.error({
        content: error.message,
        key: "changeprogress",
        duration: 3,
      });
    }
  };

  const handleCancelChangeProgress = () => {
    setactivityTarget(null);
    setIsModalChangeProgress(false);
  };

  const showModalTaskTable = () => {
    setIsModalTasksTableVisible(true);
  };

  const onOKTasksTable = (tasks) => {
    let activityR = {
      id: activityTarget.id,
      Tasks: tasks,
    };
    //console.log("activityR", activityR);
    message.loading({ content: "Actualizando...", key: "update" });
    TaskService.registerTasks(activityR)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Tareas actualizadas.", 3);
          //await runPromises([getActivities], [setActivities]);
          await updateData([getActivities]);

          message.success({
            content: "Actualizado",
            key: "update",
            duration: 3,
          });
          setactivityTarget(null);
          setIsModalTasksTableVisible(false);
        } else {
          message.error({
            content: "No se pudo actualizar. " + res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        console.log("error");
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };

  const onCancelTaskTable = (tasks) => {
    let anyTask = tasks.some((t) => t.typeUpdate !== "none");
    if (anyTask) {
      Modal.confirm({
        title: "Estas saliendo sin guardar tus cambios.",
        content:
          "Las modificaciones que hiciste en las tareas se perderan. ¿Deseas salir de todas maneras? ",
        onOk() {
          setactivityTarget(null);
          setIsModalTasksTableVisible(false);
        },
        onCancel() {},
        okText: "Aceptar",
        cancelText: "Cancelar",
      });
    } else {
      setactivityTarget(null);
      setIsModalTasksTableVisible(false);
    }
  };

  /* const onClick = ({ key }) => {
    let activity = {
      ...activityTarget,
      progress: key,
    };
    message.loading({ content: "Actualizando...", key: "updatable" });
    ActivityService.changeActivityProgress(activity)
      .then(async (res) => {
        if (res.data?.success) {
          await runPromises([getActivities], [setActivities]);
          message.success({
            content: "Se actualizó el estado.",
            key: "updatable",
            duration: 3,
          });
          setactivityTarget(null);
        } else {
          message.error({
            content:
              "No se pudo actualizar el estado. " + res.data?.description,
            key: "updatable",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "updatable",
          duration: 5,
        });
      });
  }; */
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
  return (
    <>
      <Divider>
        <Title level={4}>Actividades</Title>
      </Divider>
      <>
        <Row justify="center" gutter={[0, 24]}>
          <Col
            xs={{ span: 6, offset: 1 }}
            sm={4}
            md={{ span: 6, offset: 4 }}
            lg={{ span: 6, offset: 4 }}
            xl={{ span: 6, offset: 4 }}
          >
            <Button
              type="primary"
              onClick={() => {
                setgant(!gant);
              }}
            >
              Diagrama de Gant
            </Button>
          </Col>
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
                  setactivityTarget(null);
                  showModalForm();
                }}
              >
                + Crear Actividad
              </Button>
            ) : null}
          </Col>
          <Col span={23}>
            <Table
              columns={getColumns(
                setactivityTarget,
                showModalForm,
                showModal,
                showModalProgress,
                projectState,
                showModalTaskTable
              )}
              dataSource={activities}
              rowKey="id"
              scroll={{ x: "max-content" }}
            />
          </Col>
        </Row>
      </>
      {isModalFormVisible ? (
        <ActivityFormModal
          isModalVisible={isModalFormVisible}
          handleOk={handleOkForm}
          handleCancel={handleCancelForm}
          userList={UsersForActivities}
          projectId={projectId}
          activityTarget={activityTarget}
          setactivityTarget={setactivityTarget}
          //datesProject={datesProject}
          datesProject={[startDate, endDate]}
        />
      ) : null}
      {isModalVisible && (
        <Modal
          title={`¿Eliminar actividad?`}
          visible={isModalVisible}
          onOk={handleOk}
          okText="Aceptar"
          cancelText="Cancelar"
          onCancel={handleCancel}
        >
          {(activityTarget?.Products?.length > 0 ||
            activityTarget?.DiffusionProducts?.length > 0) && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <WarningOutlined
                  style={{
                    color: "yellow",
                    fontSize: "24px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    width: "50px",
                    height: "50px",
                    background: "black",
                    borderRadius: "50%",
                  }}
                />
                <strong> Actividad con productos</strong>
              </div>
              <br />
              <strong>
                Si esta actividad tiene productos registrados si se elimina
                tambien se eliminarán los productos.
              </strong>
            </>
          )}
          <p>Se eliminará la actividad "{activityTarget?.name}."</p>
        </Modal>
      )}
      {isModalChangeProgress && (
        <ChangeProgressModal
          isModalVisible={isModalChangeProgress}
          handleOk={handleOkChangeProgress}
          handleCancel={handleCancelChangeProgress}
          activityTarget={activityTarget}
        />
      )}
      {isModalTasksTableVisible && (
        <TasksTable
          isVisible={isModalTasksTableVisible}
          onOkTasks={onOKTasksTable}
          onCancelTasks={onCancelTaskTable}
          activity={activityTarget}
        />
      )}

      {gant && activities.length > 0 ? (
        <GantActivities
          list={activities}
          /* datesProject={datesProject} */
          datesProject={[startDate, endDate]}
        />
      ) : null}
    </>
  );
});

export default ProjectActivity;
