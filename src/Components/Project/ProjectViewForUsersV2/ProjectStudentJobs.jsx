import React, { useState, useContext, useCallback } from "react";
import {
  UserProjectContext,
  ProjectContext,
} from "./Contexts/ContextProjectUsers";
import {
  Row,
  Col,
  Typography,
  Empty,
  Card,
  Button,
  Modal,
  message,
} from "antd";
import StudentJobService from "../../../services/StudentJobService";
import FileService from "../../../services/FileService";
import RethinkStudentJob from "./RethinkStudentJob";
import UploadStudentJob from "../ProjectAdminv2/ProjectUser/UploadStudentJob";
const { Text } = Typography;

/* const runPromises = async (listPromises, listSetters) => {
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
}; */
//export default function ProjectStudentJobs
const ProjectStudentJobs = React.memo(function ({
  //members = [],
  //currentUser,
  //projectData,
  //getUserProjects,
  //setUserProjects,
  isProjectActive = true,
  //repositorySize,
  //setRepositorySize,
}) {
  const {
    userProjects: { all: members = [] },
    getUserProjects,
  } = useContext(UserProjectContext);
  const { currentUser, projectData, repositorySize, setRepositorySize } =
    useContext(ProjectContext);
  const [isModalUploadVisible, setIsModalUploadVisible] = useState(false);
  const [isModalRethinkVisible, setIsModalRethinkVisible] = useState(false);
  const [studentJobTarget, setStudentJobTarget] = useState(null);
  let JobsAccepted = [];
  let JobsCurrentUSer = [];
  members.map((up) => {
    if (up.StudentJobs.length > 0) {
      up.StudentJobs.map((sj) => {
        if (
          sj.acceptance === "Aceptado" &&
          (up.userId !== currentUser.User.id ||
            currentUser.rolName !== "Estudiante")
        ) {
          JobsAccepted.push({ ...sj, User: up.User });
        }
        if (
          up.userId === currentUser.User.id &&
          currentUser.rolName === "Estudiante"
        ) {
          JobsCurrentUSer.push({ ...sj, User: up.User });
        }
        return sj;
      });
    }
    return up;
  });
  //console.log("JobsCurrentUSer", JobsCurrentUSer);

  const finishJob = (studentJobSelected) => {
    /*  let studentJobR = {
      ...studentJobSelected,
      currentProgress: "Terminado",
    }; */
    let studentJobR = {
      id: studentJobSelected.id,
      currentProgress: "Terminado",
    };
    message.loading({
      content: "Realizando peticion espere...",
      key: "update",
    });
    //StudentJobService.updateStudentJob(studentJobR)
    StudentJobService.changeProgress(studentJobR)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Trabajo actualizado", 4);
          try {
            //await runPromises([getUserProjects], [setUserProjects]);
            await updateData([getUserProjects]);
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

  const handleFinishJob = (studentJobSelected) => {
    //console.log("stu", studentJobSelected);
    Modal.confirm({
      title: "Finalizar Trabajo",
      okText: "Acpetar",
      cancelText: "Cancelar",
      content: (
        <p>
          Si aceptas daras por terminado tu trabajo con titulo:{" "}
          <strong>{`"${studentJobSelected?.titleDocument}"`}</strong> y ya no
          podras cambiar el estado de tu trabajo.
        </p>
      ),
      onOk: async () => {
        await finishJob(studentJobSelected);
      },
      onCancel: () => {},
    });
  };

  const handleRethinkStudentJob = (studentJobUpdate, setRequesting) => {
    message.loading({
      content: "Realizando petición espere...",
      key: "update",
    });
    //console.log("userss", studentJobUpdate);
    StudentJobService.updateStudentJobAdmin(studentJobUpdate)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Trabajo repropuesto.");
          try {
            //await runPromises([getUserProjects], [setUserProjects]);
            await updateData([getUserProjects]);

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
          setIsModalRethinkVisible(false);
          setStudentJobTarget(null);
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

  const deleteStudentJob = (studentJob) => {
    message.loading({
      content: "Realizando peticion espere...",
      key: "update",
    });
    StudentJobService.deleteStudentJob(studentJob)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Trabajo eliminado.");
          try {
            //await runPromises([getUserProjects], [setUserProjects]);
            await updateData([getUserProjects]);

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

  const handleDeleteStudentJob = (studentJob) => {
    Modal.confirm({
      title: "¿Eliminar propuesta de trabajo en el proyecto?",
      content:
        "Si desea eliminar el trabajo no podra ser parte del proyecto, con este trabajo.",
      okText: "Aceptar",
      cancelText: "Cancelar",
      onOk: () => {
        deleteStudentJob(studentJob);
      },
      onCancel: () => {},
    });
  };

  const handleOkUpload = async (fileList = [], config) => {
    /* console.log("myFile", fileList);
    console.log("studentJobTarget", studentJobTarget); */
    const formData = new FormData();
    formData.append("myretrofileapp", fileList[0]?.originFileObj);
    formData.append("studentJobId", studentJobTarget?.id || 0);
    formData.append("projectId", projectData.id || 0);
    message.loading({
      content: "Realizando operaciones espere...",
      key: "update",
    });
    try {
      let res = await FileService.postStudentJob(formData, config);
      if (res.data?.success) {
        let newSize = parseFloat(res.data?.response?.size);
        setRepositorySize((e) => ({ maxSize: e.maxSize, size: newSize }));
        message.success("Archivo guardado.", 3);
        //await runPromises([getUserProjects], [setUserProjects]);
        await updateData([getUserProjects]);
        message.success({
          content: "Actualizado",
          key: "update",
          duration: 3,
        });
        setIsModalUploadVisible(false);
        setStudentJobTarget(null);
      } else {
        throw new Error(res.data?.description);
      }
    } catch (e) {
      message.error({ content: e.message, key: "update", duration: 5 });
      throw new Error(e.message);
    }

    /* FileService.postStudentJob(formData)
      .then(async (res) => {
        if (res.data?.success) {
          let newSize = parseFloat(res.data?.response?.size);
          setRepositorySize((e) => ({ maxSize: e.maxSize, size: newSize }));
          message.success("Archivo guardado.", 3);
          try {
            await runPromises([getUserProjects], [setUserProjects]);
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            setIsModalUploadVisible(false);
            setStudentJobTarget(null);
          } catch (e) {
            message.error({
              content: "Hubo un error. " + e.message,
              key: "update",
              duration: 5,
            });
          }
        } else {
          message.error({
            content:
              "Algo salio mal al guardar el archivo. " + res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        console.log("error", e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      }); */
  };

  const handleCancelUpload = () => {
    setIsModalUploadVisible(false);
    setStudentJobTarget(null);
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
      {JobsCurrentUSer.some((st) => st.acceptance === "Rechazado") ? (
        <Row align="center">
          <Col span={22} style={{ marginBottom: "1.5em" }}>
            <Text>
              Tienes el siguiente trabajo rechazado, el líder de proyecto seguro
              envio las observaciones a ser corregidas a tu correo electrónico.
              Cuando tengas las correciones deberas replantear el trabajo.
            </Text>
          </Col>
          <Col
            span={24}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {JobsCurrentUSer.filter((st) => st.acceptance === "Rechazado").map(
              (sj) => {
                let actionList = [];
                if (sj.acceptance === "Rechazado") {
                  actionList.push(
                    <Button
                      type="primary"
                      ghost
                      key="view-project"
                      onClick={() => {
                        setStudentJobTarget(sj);
                        setIsModalRethinkVisible(true);
                      }}
                    >
                      Replantear
                    </Button>
                  );
                }
                if (sj?.acceptance === "Rechazado" && currentUser.isMember) {
                  actionList.push(
                    <Button
                      type="primary"
                      ghost
                      key="view-project"
                      onClick={() => {
                        handleDeleteStudentJob(sj);
                      }}
                    >
                      Eliminar
                    </Button>
                  );
                }
                return (
                  <Col key={sj.id} xs={20} sm={10} md={10} lg={10} xl={10}>
                    <Card
                      title={sj.TypeInvestigation.name}
                      bordered={false}
                      actions={isProjectActive ? actionList : []}
                    >
                      <div>
                        <b>Título de Trabajo: </b>
                        {sj.titleDocument}
                      </div>
                      <div>
                        <b>Autor: </b>
                        {sj.User?.firstName + " " + sj.User?.lastName}
                      </div>
                      <div>
                        <b>Estado en el proyecto: </b>
                        {sj.acceptance}
                      </div>
                      <div>
                        <b>Progreso: </b>
                        {sj.Progress?.stateProgress}
                      </div>
                    </Card>
                  </Col>
                );
              }
            )}
          </Col>
        </Row>
      ) : null}

      {currentUser.isMember &&
      JobsCurrentUSer.length > 0 &&
      currentUser.rolName === "Estudiante" ? (
        <Row
          align="center"
          style={{ marginTop: "1.5em", marginBottom: "1.5em" }}
        >
          <Col span={22}>
            <Text>Estos son tus trabajos :</Text>
          </Col>
        </Row>
      ) : (
        <Row align="center" style={{ marginTop: "1.5em" }}>
          <Col>
            {currentUser.isMember &&
              JobsCurrentUSer.length === 0 &&
              currentUser.rolName === "Estudiante" && (
                <Empty
                  imageStyle={{
                    height: 60,
                  }}
                  description={
                    <span>
                      No tienes ningun trabajo aceptado/pendiente de
                      aceptación/rechazado.
                    </span>
                  }
                ></Empty>
              )}
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]} align="center">
        {JobsCurrentUSer.filter(
          (st) =>
            st.acceptance === "Pendiente" ||
            st.acceptance === "Propuesto" ||
            st.acceptance === "Aceptado"
        ).map((sj) => {
          let actionList = [];
          if (
            sj?.acceptance === "Aceptado" &&
            sj?.Progress?.stateProgress === "En progreso"
          ) {
            actionList.push(
              <Button
                type="primary"
                ghost
                key="view-project"
                onClick={() => {
                  handleFinishJob(sj);
                }}
              >
                Finalizar
              </Button>
            );
          }
          if (
            sj?.acceptance === "Aceptado" &&
            sj?.Progress?.stateProgress === "Terminado" &&
            sj?.FileStudentJobs.length === 0 &&
            false
          ) {
            actionList.push(
              <Button
                type="primary"
                ghost
                key="view-project"
                onClick={() => {
                  setStudentJobTarget(sj);
                  setIsModalUploadVisible(true);
                }}
              >
                Subir documento
              </Button>
            );
          }
          return (
            <Col key={sj.id} xs={20} sm={10} md={10} lg={10} xl={10}>
              <Card
                title={sj.TypeInvestigation.name}
                bordered={false}
                actions={isProjectActive ? actionList : []}
              >
                <div>
                  <b>Título de Trabajo: </b>
                  {sj.titleDocument}
                </div>
                <div>
                  <b>Autor: </b>
                  {sj.User?.firstName + " " + sj.User?.lastName}
                </div>
                <div>
                  <b>Estado en el proyecto: </b>
                  {sj.acceptance}
                </div>
                <div>
                  <b>Progreso: </b>
                  {sj.Progress?.stateProgress}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {currentUser.isMember && JobsAccepted.length > 0 ? (
        <Row
          align="center"
          style={{ marginTop: "1.5em", marginBottom: "1.5em" }}
        >
          <Col span={22}>
            <Text>Otros Trabajos:</Text>
          </Col>
        </Row>
      ) : (
        JobsAccepted.length === 0 && (
          <Row align="center" style={{ marginTop: "1.5em" }}>
            <Col>
              <Empty
                imageStyle={{
                  height: 60,
                }}
                description={<span>No hay trabajos. Aun no.</span>}
              ></Empty>
            </Col>
          </Row>
        )
      )}

      <Row gutter={[16, 16]} align="center" style={{ marginTop: "1.5em" }}>
        {JobsAccepted.map((sj) => {
          return (
            <Col key={sj.id} xs={20} sm={10} md={10} lg={10} xl={10}>
              <Card
                title={sj.TypeInvestigation.name}
                bordered={false}
                // actions={actionList}
              >
                <div>
                  <b>Título de Trabajo: </b>
                  {sj.titleDocument}
                </div>
                <div>
                  <b>Estado en el proyecto: </b>
                  {sj.acceptance}
                </div>
                <div>
                  <b>Autor: </b>
                  {sj.User?.firstName + " " + sj.User?.lastName}
                </div>
                <div>
                  <b>Progreso: </b>
                  {sj.Progress?.stateProgress}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
      {isModalRethinkVisible && (
        <RethinkStudentJob
          isModalVisible={isModalRethinkVisible}
          handleOk={handleRethinkStudentJob}
          handleCancel={() => {
            setIsModalRethinkVisible(false);
            setStudentJobTarget(null);
          }}
          studentJobSelected={studentJobTarget}
        />
      )}
      {isModalUploadVisible && (
        <UploadStudentJob
          repositorySize={repositorySize}
          isVisible={isModalUploadVisible}
          handleOk={handleOkUpload}
          handleCancel={handleCancelUpload}
        />
      )}
    </>
  );
});
export default ProjectStudentJobs;
