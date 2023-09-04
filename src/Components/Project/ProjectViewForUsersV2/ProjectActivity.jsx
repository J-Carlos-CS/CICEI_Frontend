import React, { useState, useContext, useCallback } from "react";
import {
  ProjectContext,
  ActivityContext,
  ProductContext,
} from "./Contexts/ContextProjectUsers";
import {
  Typography,
  Row,
  Col,
  Card,
  message,
  Button,
  Modal,
  Empty,
  Tag,
} from "antd";
import ChangeProgressModal from "./ChangeProgressModal";
import TaskService from "../../../services/TaskService";
import TasksTable from "../ProjectAdminv2/ProjectActivity/TasksTable";
import ActivityService from "../../../services/ActivityService";
import ProjectActivityForm from "./ProjectActivityForm";
import { WarningOutlined } from "@ant-design/icons";
const { Title } = Typography;

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
      });
    } catch (e) {
      console.log(e.message);
      message.error("Error. " + e.message, 5);
    }
  } else {
    console.log("Proceso denegado");
  }
};
//export default function ProjectActivity

const ProjectActivity = React.memo(function ({
  projectId = 0,
  //currentUser = null,
  //getActivities,
  //setActivities,
  //getProducts,
  //setProducts,
  project,
  //activities = { userActivities: [], otherActivities: [] },
  isProjectActive = true,
}) {
  const { currentUser = null } = useContext(ProjectContext);
  const {
    getActivities,
    activities: { userActivities = [], otherActivities = [] },
  } = useContext(ActivityContext);
  const { getProductsByProject: getProducts } = useContext(ProductContext);
  const { projectData } = useContext(ProjectContext);
  //let { userActivities, otherActivities } = activities;
  const [activityTarget, setactivityTarget] = useState(null);
  const [isModalChangeVisible, setIsModalChangeVisible] = useState(false);
  const [isModalTableTasksVisible, setIsModalTableTasksVisible] =
    useState(false);
  const [isModalActivityForm, setIsModalActivityForm] = useState(false);
  //console.log("Activities", activities);

  const showModalProgress = () => {
    setIsModalChangeVisible(true);
  };

  const handleOkChange = async () => {
    try {
      //await runPromises([getActivities], [setActivities]);
      await updateData([getActivities]);
      message.success({
        content: "Actualizado",
        key: "updatable",
        duration: 2,
      });
    } catch (e) {
      message.error({
        content: "Hubo un error. " + e.message,
        key: "updatable",
        duration: 5,
      });
    }
    handleCancelChange();
  };

  const handleCancelChange = () => {
    setactivityTarget(null);
    setIsModalChangeVisible(false);
  };

  const onOKTasksTable = (tasks) => {
    let activityR = {
      id: activityTarget.id,
      Tasks: tasks,
    };
    if (activityTarget?.Progress?.stateProgress !== "Terminado") {
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
            setIsModalTableTasksVisible(false);
            setactivityTarget(null);
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
    } else {
      setIsModalTableTasksVisible(false);
      setactivityTarget(null);
    }
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
          setIsModalTableTasksVisible(false);
        },
        onCancel() {},
        okText: "Aceptar",
        cancelText: "Cancelar",
      });
    } else {
      setactivityTarget(null);
      setIsModalTableTasksVisible(false);
    }
  };

  const createActivity = (activityData, setRequesting) => {
    ActivityService.createActivity(activityData)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Actividad registrada.", 4);
          try {
            //await runPromises([getActivities], [setActivities]);
            await updateData([getActivities]);

            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            handleCancelActivityForm();
          } catch (e) {
            message.error({
              content: "Hubo un error. " + e.message,
              key: "update",
              duration: 5,
            });
          }
        } else {
          setRequesting(false);
          message.error({
            content: "Hubo un error. " + res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        setRequesting(false);
        console.log("error.", e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };

  const updateActivity = (activity, setRequesting) => {
    ActivityService.upadteActivity(activity)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Actividad actualizada.", 4);
          try {
            //await runPromises([getActivities], [setActivities]);
            await updateData([getActivities]);
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            handleCancelActivityForm();
          } catch (e) {
            message.error({
              content: "Hubo un error. " + e.message,
              key: "update",
              duration: 5,
            });
          }
        } else {
          setRequesting(false);
          message.error({
            content: "Hubo un error. " + res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        setRequesting(false);
        //console.log("error.", e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };

  const handleCancelActivityForm = () => {
    setIsModalActivityForm(false);
    setactivityTarget(null);
  };

  const handleOkFormActivity = (activity, create, setRequesting) => {
    message.loading({ content: "Procesando...", key: "update" });
    if (create) {
      createActivity(activity, setRequesting);
    } else {
      updateActivity(activity, setRequesting);
    }
  };

  const deleteActivity = (activity) => {
    message.loading({
      content: "Realizando operaciones espere...",
      key: "update",
    });
    ActivityService.deleteActivity(activity.id)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Actividad eliminada.", 4);
          try {
            /* await runPromises(
              [getActivities, getProducts],
              [setActivities, setProducts]
            ); */
            await updateData([getActivities, getProducts]);
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
          } catch (e) {
            message.error({
              content: "Hubo un error. " + e.message,
              key: "update",
              duration: 5,
            });
          }
        } else {
          message.error({
            content: "Hubo un error. " + res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        console.log("error.", e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };

  const handleDeleteActivity = (activity) => {
    Modal.confirm({
      title: `¿Eliminar actividad?`,
      okText: "Aceptar",
      cancelText: "Cancelar",
      onOk: async () => {
        await deleteActivity(activity);
      },
      onCancel: () => {},
      content: (
        <>
          {activity?.Products?.length > 0 && (
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
                Esta actividad tiene productos registrados si se elimina tambien
                se eliminarán los productos.
              </strong>
            </>
          )}
          <p>Se eliminará la actividad "{activity?.name}."</p>
        </>
      ),
    });
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

  return (
    <>
      {currentUser.isMember &&
        currentUser.rolName !== "Estudiante" &&
        isProjectActive && (
          <Row align="center">
            <Col
              span={22}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                type="primary"
                onClick={() => {
                  setIsModalActivityForm(true);
                }}
              >
                +Registrar actividad
              </Button>
            </Col>
          </Row>
        )}
      {currentUser.isMember && (
        <>
          <Row style={{ marginBottom: "1em" }} align="center">
            <Col span={20}>
              {currentUser.isMember && "Estas son tus actividades:"}
            </Col>
          </Row>
          <Row gutter={[16, 16]} align="center">
            {userActivities.length > 0 ? (
              userActivities.map((activity) => {
                let startDate = new Date(activity.startDate);
                let endDate = new Date(activity.endDate);
                startDate.setMinutes(
                  startDate.getMinutes() + new Date().getTimezoneOffset()
                );
                endDate.setMinutes(
                  endDate.getMinutes() + new Date().getTimezoneOffset()
                );

                let actionList = [];
                if (
                  activity.Progress?.stateProgress === "En progreso" ||
                  /*                     activity.Progress?.stateProgress === "Terminado" ||
                   */ activity.Progress?.stateProgress === "Pendiente"
                ) {
                  //<ButtonChangeStateProgress activity={activity} />
                  actionList.push(
                    <Button
                      type="link"
                      onClick={() => {
                        setactivityTarget(activity);
                        showModalProgress();
                      }}
                    >
                      Editar Estado
                    </Button>
                  );
                  actionList.push(
                    <Button
                      type="link"
                      onClick={() => {
                        setactivityTarget(activity);
                        setIsModalActivityForm(true);
                      }}
                    >
                      Editar Actividad
                    </Button>
                  );
                  actionList.push(
                    <Button
                      type="link"
                      onClick={() => {
                        handleDeleteActivity(activity);
                      }}
                    >
                      Eliminar
                    </Button>
                  );
                }
                if (
                  activity.Progress?.stateProgress === "En progreso" ||
                  activity.Progress?.stateProgress === "Terminado" ||
                  activity.Progress?.stateProgress === "Pendiente"
                ) {
                  actionList.push(
                    <Button
                      type="link"
                      onClick={() => {
                        setactivityTarget(activity);
                        setIsModalTableTasksVisible(true);
                      }}
                    >
                      Ver Tareas
                    </Button>
                  );
                }
                return (
                  <Col
                    key={activity.id}
                    xs={20}
                    sm={10}
                    md={10}
                    lg={10}
                    xl={10}
                  >
                    <Card
                      title={activity.Progress?.stateProgress}
                      bordered={false}
                      actions={isProjectActive ? actionList : []}
                    >
                      <div>
                        <b>Nombre Actividad: </b>
                        {activity.name || ""}
                      </div>
                      <div>
                        <b>Descripción: </b>
                        {activity.description || ""}
                      </div>
                      <div>
                        <b>Responsable: </b>
                        {activity.User?.firstName +
                          " " +
                          activity.User?.lastName}
                      </div>
                      <div>
                        <b>Productos: </b>
                        <Tag color="yellow">
                          {`${activity.Products?.length} Products`}
                        </Tag>
                      </div>
                      <div>
                        <b>Fecha inicio: </b>
                        {startDate.toLocaleString("es") || ""}
                      </div>
                      <div>
                        <b>Fecha fin: </b>
                        {endDate.toLocaleString("es") || ""}
                      </div>
                      <div>
                        <b>Avance: </b>
                        {activity.progress ? activity.progress + "%" : "0%"}
                      </div>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <Empty
                imageStyle={{
                  height: 60,
                }}
                description={
                  <span>
                    Aun no te asignaron o no tienes ninguna actividad.
                  </span>
                }
              ></Empty>
            )}
          </Row>
        </>
      )}
      <Row align="center">
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title level={3}>Actividades del Proyecto</Title>
        </Col>
      </Row>
      {otherActivities.length > 0 ? (
        <Row gutter={[16, 16]} align="center">
          {otherActivities.map((activity) => {
            let startDate = new Date(activity.startDate);
            let endDate = new Date(activity.endDate);
            startDate.setMinutes(
              startDate.getMinutes() + new Date().getTimezoneOffset()
            );
            endDate.setMinutes(
              endDate.getMinutes() + new Date().getTimezoneOffset()
            );
            return (
              <Col key={activity.id} xs={20} sm={10} md={10} lg={10} xl={10}>
                <Card
                  title={activity.Progress?.stateProgress}
                  bordered={false}
                  //actions={actionList}
                >
                  <div>
                    <b>Nombre Actividad: </b>
                    {activity.name || ""}
                  </div>
                  <div>
                    <b>Descripción: </b>
                    {activity.description || ""}
                  </div>
                  <div>
                    <b>Responsable: </b>
                    {activity.User?.firstName + " " + activity.User?.lastName}
                  </div>
                  <div>
                    <b>Fecha inicio: </b>
                    {startDate.toLocaleString("es") || ""}
                  </div>
                  <div>
                    <b>Fecha fin: </b>
                    {endDate.toLocaleString("es") || ""}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Empty
          imageStyle={{
            height: 60,
          }}
          description={
            <span>El proyecto no tienen actividades registradas.</span>
          }
        ></Empty>
      )}
      {isModalChangeVisible && (
        <ChangeProgressModal
          isModalVisible={isModalChangeVisible}
          handleOk={handleOkChange}
          handleCancel={handleCancelChange}
          activityTarget={activityTarget}
        />
      )}
      {isModalTableTasksVisible && (
        <TasksTable
          isVisible={isModalTableTasksVisible}
          onOkTasks={onOKTasksTable}
          onCancelTasks={onCancelTaskTable}
          activity={activityTarget}
          isFromProjectView={true}
        />
      )}
      {isModalActivityForm && (
        <ProjectActivityForm
          isModalVisible={isModalActivityForm}
          handleOk={handleOkFormActivity}
          handleCancel={handleCancelActivityForm}
          projectId={projectId}
          currentUser={currentUser}
          activityTarget={activityTarget}
          datesProject={[projectData?.startDate, projectData?.endDate]}
        />
      )}
    </>
  );
});
export default ProjectActivity;
