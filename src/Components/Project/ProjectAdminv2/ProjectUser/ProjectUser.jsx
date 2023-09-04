import React, { useState, useCallback, useContext } from "react";
import {
  Row,
  Col,
  Divider,
  Tabs,
  Typography,
  message,
  Modal,
  Input,
} from "antd";
import {
  TeamOutlined,
  MailOutlined,
  SolutionOutlined,
  FileSearchOutlined,
  FrownOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import UserProjectService from "../../../../services/UserProjectService.js";
import StudentJobService from "../../../../services/StudentJobService.js";
import FileService from "../../../../services/FileService.js";
import ProjectUserRequest from "./ProjectUserRequest";
import ProjectUserMembers from "./ProjectUserMembers";
import ProjectUserStudents from "./ProjectUserStudents";
import ProjectUserResearchers from "./ProjectUserResearchers";
import ProjectUserRejected from "./ProjectUserRejected";
import UploadStudentJob from "./UploadStudentJob";
import RethinkStudentJob from "./RethinkStudentJob";
import SinteticUser from "./SinteticUser.jsx";
import { useSelector } from "react-redux";
import {
  UserContext,
  ActivityContext,
  ProductContext,
  ProjectContext,
  DiffusionProductContext
} from "../Contexts/AdminProjectContexts.js";
import { selectUser } from "./../../../../Auth/userReducer";

const { TabPane } = Tabs;
const { Title } = Typography;

const ProjectUser = React.memo(function ({
  projectId,
  //refreshProjectData,
  //projectState = true,
  // GroupLeaderId,
  /* usersList = {
    members: [],
    requests: [],
    rejecteds: [],
    students: [],
    researchers: [],
  }, */
  /*   getUserProjects,
  setUserProjects, */
  /*   getActivities,
  setActivities, */
  /*   getProducts,
  setProducts, */
  //getProject,
  //setProjectData,
  //institutionProjects = [],
  /* repositorySize,
  setRepositorySize, */
}) {
  console.log("userMain");
  //Contextos
  const { userProjects: usersList, getUserProjects } = useContext(UserContext);
  const { getActivities } = useContext(ActivityContext);
  const { getProducts } = useContext(ProductContext);
  const {
    projectData: {
      institutionProjects = [],
      state: projectState = true,
      GroupLeaderId,
    },
    getProject,
    setProjectData,
    repositorySize,
    setRepositorySize,
    refreshProjectData
  } = useContext(ProjectContext);

  const currentUser = useSelector(selectUser);
  let { members, requests, rejecteds, students, researchers } = usersList;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState({});
  const [reasonText, setReasonText] = useState("");
  const [input, setInput] = useState(false);
  const [isModalUploadVisible, setIsModalUploadVisible] = useState(false);
  const [studentJobTarget, setStudentJobTarget] = useState(null);
  const sharedProps = {
    style: {
      width: "100%",
    },
  };

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
          //console.log("termine mi proceso");
        });
      } catch (e) {
        console.log(e.message);
        message.error("Error. " + e.message, 5);
      }
    } else {
      console.log("Proceso denegado");
    }
  }; */

  const showModal = (record, action) => {
    let dataModal = {};
    switch (action) {
      case 1:
        dataModal = {
          title: `¿ Desea aceptar a ${record.User.firstName} ${record.User.lastName} ?`,
          description: `Si acepta se agregará a "${record.User.firstName} ${record.User.lastName}" en el proyecto.`,
          id: record.id,
          action,
        };
        break;
      case 2:
        dataModal = {
          title: `¿ Desea suspender a ${record.User.firstName} ${record.User.lastName} ?`,
          description: `Si suspende a "${record.User.firstName} ${record.User.lastName}" no podrá acceder al proyecto pero todos sus trabajos o investigaciones no desaparecerán. Podrás quitarle la suspensión en el futuro si así lo deseas.`,
          id: record.id,
          action,
        };
        break;
      case 3:
        dataModal = {
          title: `¿ Desea convertir a Líder de proyecto a ${record.User.firstName} ${record.User.lastName} ?`,
          description: `Si acepta a "${record.User.firstName} ${record.User.lastName}" como Líder cualquier otro Líder del proyecto dejará de serlo. El Líder tendra los siguientes permisos: Aceptar miembros, aceptar a miembros rechazados, agregar nuevas líneas, agregar instituciones y todas las acciones que tengan que ver con las actividades del proyecto.`,
          id: record.id,
          action,
        };
        break;
      case 4:
        dataModal = {
          title: `¿ Desea aceptar el trabajo de ${record.User.firstName} ${record.User.lastName}?`,
          description: `Si acepta este trabajo ${record.User.firstName} ${record.User.lastName} sera parte del proyecto.`,
          id: record.id,
          data: record,
          action,
        };
        break;
      case 5:
        dataModal = {
          title: `¿ Desea rechazar el trabajo de ${record.User.firstName} ${record.User.lastName}?`,
          description: `Puede escribir el motivo por el cual el trabajo será rechazado para informar al estudiante.`,
          id: record.id,
          data: record,
          action,
        };
        setInput(true);
        break;
      case 6:
        dataModal = {
          title: `¿ Rechazar solicitud de ${record.User.firstName} ${record.User.lastName}?`,
          description: `Si rechaza la solicitud de ${record.User.firstName} ${record.User.lastName} no sera parte del proyecto.`,
          id: record.id,
          data: record,
          action,
        };

        break;
      case 7:
        dataModal = {
          title: `¿ Rechazar solicitud de trabajo de ${record.User.firstName} ${record.User.lastName}?`,
          description: `Si ${record.User.firstName} ${record.User.lastName} aun no es parte del proyecto no sera miembro, por el contrario si es miembro se mantendra aun si rechaza esta solicitud de trabajo.`,
          id: record.id,
          data: record,
          action,
        };
        break;
      case 8:
        if (record?.isMain) {
          dataModal = {
            title: `Acción imposible`,
            description: `No puedes eliminar al encargado del proyecto (${record.User.firstName} ${record.User.lastName}), antes debes elegir a otro miembro o usuario como encargado. `,
            id: record.id,
            data: record,
            action,
            denegate: true,
          };
        } else {
          dataModal = {
            title: `¿Desea eliminar a ${record.User.firstName} ${record.User.lastName} del proyecto?`,
            description: `Si ${record.User.firstName} ${record.User.lastName} es eliminado todos sus trabajos, actividades y productos seran eliminados tambien. El usuario aun puede unirse al proyecto en otra oportunidad.`,
            id: record.id,
            data: record,
            action,
          };
        }
        break;
      default:
        break;
    }
    setInfoModal(dataModal);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    switch (infoModal.action) {
      case 1:
        acceptMember(infoModal.id);
        break;
      case 2:
        rejectMember(infoModal.id);
        break;
      case 3:
        makeLeader(infoModal.id);
        break;
      case 4:
        acceptJob(infoModal.data);
        break;
      case 5:
        rejectJob(infoModal.data);
        setReasonText("");
        setInput(false);
        break;
      case 6:
        deleteRequest(infoModal.data);
        break;
      case 7:
        deleteRequestStudentJob(infoModal.data);
        break;
      case 8:
        deleteUserProject(infoModal.data);
        break;
      default:
        break;
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setInput(false);
    setReasonText("");
    setIsModalVisible(false);
  };

  const deleteUserProject = async (data) => {
    try {
      console.log("data", data);
      message.loading({ content: "Actualizando...", key: "update" });
      let response = await UserProjectService.deleteUserProject(data);
      if (response?.data?.success) {
        message.success("Usuario eliminado", 5);
        //getUPs(projectId);
        /*   await runPromises(
          [getUserProjects, getActivities, getProducts],
          [setUserProjects, setActivities, setProducts]
        ); */
        await updateData([getProject,getUserProjects, getActivities, getProducts]);
        message.success({
          content: "Actualizado",
          key: "update",
          duration: 5,
        });
      } else {
        message.error({
          content: response?.data?.description,
          key: "update",
          duration: 5,
        });
      }
    } catch (e) {
      message.error({ content: e.message, key: "update", duration: 5 });
    }
  };

  const deleteRequestStudentJob = async (data) => {
    try {
      let userProjectR = {
        id: data.userProjectId,
        studentJobId: data.id,
      };
      //Esta es la misma funcion de eliminar una solicitud a un investigador, solo que aqui
      //tambien enviamos en id del trabajo para su eliminacion
      message.loading({ content: "Actualizando...", key: "update" });
      let response = await UserProjectService.rejectRequest(userProjectR);
      if (response?.data?.success) {
        message.success("Solicitud eliminada", 5);
        //await runPromises([getUserProjects], [setUserProjects]);
        await updateData([getUserProjects]);

        message.success({
          content: "Actualizado",
          key: "update",
          duration: 5,
        });
      } else {
        throw new Error(response?.data?.description);
      }
    } catch (e) {
      message.error({ content: e.message, key: "update", duration: 5 });
    }
  };

  const deleteRequest = async (data) => {
    try {
      let userProjectR = {
        id: data.id,
      };
      message.loading({ content: "Actualizando...", key: "update" });
      let response = await UserProjectService.rejectRequest(userProjectR);
      if (response?.data?.success) {
        message.success("Solicitud rechazada", 5);
        //await runPromises([getUserProjects], [setUserProjects]);
        await updateData([getUserProjects]);
        message.success({
          content: "Actualizado",
          key: "update",
          duration: 5,
        });
      } else {
        throw new Error(response?.data?.description);
      }
    } catch (e) {
      message.error({ content: e.message, key: "update", duration: 5 });
    }
  };

  const acceptJob = (data) => {
    let job = {
      acceptance: "Aceptado",
      id: data.id,
    };
    message.loading({ content: "Actualizando...", key: "updatable" });
    //StudentJobService.updateStudentJob(job)
    StudentJobService.acceptJob(job)
      .then(async (res) => {
        if (res.data?.success) {
          /*   await runPromises(
            [getProject, getActivities, getUserProjects],
            [setprojectData, setActivities, setUserProjects]
          ); */
          await updateData([getProject, getActivities, getUserProjects]);
          /* getUPs(projectId);
          refreshProjectData(); */
          message.success({
            content: "Actualizado",
            key: "updatable",
            duration: 3,
          });
        } else {
          message.error({
            content: res.data?.description,
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
          duration: 3,
        });
      });
  };

  const rejectJob = (data) => {
    data = { ...data, reason: reasonText, acceptance: "Rechazado" };
    message.loading({ content: "Actualizando...", key: "updatable" });

    StudentJobService.rejectStudentJob(data)
      .then((res) => {
        if (res.data?.success) {
          getUPs(projectId);
          message.success({
            content: "Actualizado",
            key: "updatable",
            duration: 3,
          });
        } else {
          message.error({
            content: res.data?.description,
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
          duration: 3,
        });
      });
  };

  const acceptMember = (id) => {
    message.loading({ content: "Actualizando...", key: "updatable" });
    UserProjectService.acceptMember(id)
      .then(async (res) => {
        if (res.data?.success) {
          /*  getUPs(projectId);
          refreshProjectData(); */
          /* await runPromises(
            [getProject, getActivities, getUserProjects],
            [setprojectData, setActivities, setUserProjects]
          ); */
          await updateData([getProject, getActivities, getUserProjects]);

          message.success({
            content: "Actualizado",
            key: "updatable",
            duration: 3,
          });
        } else {
          message.error({
            content: res.data?.description,
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
          duration: 3,
        });
      });
  };

  const rejectMember = (id) => {
    message.loading({ content: "Actualizando...", key: "updatable" });
    UserProjectService.rejectMember(id)
      .then(async (res) => {
        if (res.data?.success) {
          /*  getUPs(projectId);
          refreshProjectData(); */
          /* await runPromises(
            [getProject, getActivities, getUserProjects],
            [setprojectData, setActivities, setUserProjects]
          ); */
          await updateData([getProject, getActivities, getUserProjects]);

          message.success({
            content: "Actualizado",
            key: "updatable",
            duration: 3,
          });
        } else {
          message.error({
            content: res.data?.description,
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
          duration: 3,
        });
      });
  };

  const makeLeader = (id) => {
    message.loading({ content: "Actualizando...", key: "updatable" });
    UserProjectService.makeLeader(id)
      .then(async (res) => {
        if (res.data?.success) {
          /* await runPromises(
            [getProject, getActivities, getUserProjects],
            [setprojectData, setActivities, setUserProjects]
          ); */
          await updateData([getProject, getActivities, getUserProjects]);

          //console.log("proceso terminado");

          message.success({
            content: "Actualizado",
            key: "updatable",
            duration: 3,
          });
        } else {
          message.error({
            content: res.data?.description,
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
          duration: 3,
        });
      });
  };

  const handleOkUpload = async (fileList = [], config) => {
    const formData = new FormData();
    formData.append("myretrofileapp", fileList[0]?.originFileObj);
    formData.append("studentJobId", studentJobTarget?.id || 0);
    formData.append("projectId", projectId || 0);

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
    /*  FileService.postStudentJob(formData)
      .then(async (res) => {
        if (res.data?.success) {
          let newSize = parseFloat(res.data?.response?.size);
          setRepositorySize((e) => ({ maxSize: e.maxSize, size: newSize }));
          message.success("Archivo guardado.", 3);
          try {
            getUPs();
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

  const showModalUpload = useCallback(() => {
    setIsModalUploadVisible(true);
  }, []);

  const deleteFileStudentJob = (id, projectId) => {
    FileService.deleteFileStudentJob(id, projectId)
      .then(async (res) => {
        if (res.data?.success) {
          let newSize = parseFloat(res.data?.response?.size);
          setRepositorySize((e) => ({ maxSize: e.maxSize, size: newSize }));
          message.success("Archivo eliminado.", 3);
          try {
            getUPs();
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
            content:
              "Algo salio mal al eliminar el archivo. " + res.data?.description,
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
      });
  };

  const deleteFileProduct = (studentJob) => {
    Modal.confirm({
      title: "¿Desea eliminar el archivo?",
      content: `Si procede sera imposible recuperar la información.`,
      onOk: () => {
        deleteFileStudentJob(
          studentJob.FileStudentJobs[0]?.id || 0,
          projectId || 0
        );
      },
      onCancel: () => {},
      okText: "Acpetar",
      cancelText: "Cancelar",
    });
  };

  const OkEditStudentJob = async (st) => {
    try {
      message.loading({ content: "Actualizando...", key: "update" });
      let response = await StudentJobService.updateStudentJobAdmin(st);
      message.success("Trabajo actualizado");
      if (response.data?.success) {
        //await runPromises([getUserProjects], [setUserProjects]);
        await updateData([getUserProjects]);
      } else {
        throw new Error(response.data?.description);
      }
      message.success({ content: "Actualizado", key: "update", duration: 3 });
      setIsModalEditVisible(false);
      setStudentJobTarget(null);
    } catch (e) {
      message.error({ content: e.message, key: "update", duration: 5 });
    }
  };
  const CancelEditStudentJob = () => {
    setIsModalEditVisible(false);
    setStudentJobTarget(null);
  };
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);

  const showModalEditStudentJob = useCallback((st) => {
    setStudentJobTarget(st);
    setIsModalEditVisible(true);
  }, []);

  const [isModalDeleteStudentJobVisible, setIsModalDeleteStudentJobVisible] =
    useState(false);

  const showModalDeleteStudentJob = useCallback((st) => {
    setStudentJobTarget(st);
    setIsModalDeleteStudentJobVisible(true);
  }, []);

  const okDeleteStudentJob = async () => {
    let stR = {
      id: studentJobTarget.id,
      titleDocument: studentJobTarget.titleDocument,
      projectId: parseInt(projectId),
    };
    try {
      message.loading({ content: "Actualizando...", key: "update" });
      let response = await StudentJobService.deleteStudentJobStatus(stR);
      message.success("Trabajo Eliminado", 3);
      if (response.data?.success) {
        await updateData([getUserProjects]);
      } else {
        throw new Error(response.data?.description);
      }
      message.success({ content: "Actualizado", key: "update", duration: 3 });
      setIsModalDeleteStudentJobVisible(false);
      setStudentJobTarget(null);
    } catch (e) {
      message.error({ content: e.message, key: "update", duration: 5 });
    }
  };

  const cancelDeleteStudentJob = () => {
    setIsModalDeleteStudentJobVisible(false);
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

  const getUPs = useCallback(
    async (id) => {
      //message.loading({ content: "Actualizando....", key: "updatable" });
      try {
        /* let response = await getUserProjects();
        setUserProjects(response); */
        await updateData([getUserProjects]);
      } catch (e) {
        message.error({
          content: "Hubo un error. " + e.message,
          key: "updatable",
          duration: 5,
        });
      }
    },
    [getUserProjects, updateData]
  );

  return (
    <>
      <Divider>
        <Title level={4}>Miembros</Title>
      </Divider>
      <Row justify="center">
        <Col span={23}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <TeamOutlined />
                  Miembros
                </span>
              }
              key="1"
            >
              <ProjectUserMembers
                list={members}
                showModal={showModal}
                projectId={projectId}
                projectState={projectState}
                currentUser={currentUser}
                GroupLeaderId={GroupLeaderId}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <MailOutlined />
                  Solicitudes
                </span>
              }
              key="2"
            >
              <ProjectUserRequest
                list={requests}
                showModal={showModal}
                projectState={projectState}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SolutionOutlined />
                  Estudiantes
                </span>
              }
              key="3"
            >
              <ProjectUserStudents
                list={students}
                showModal={showModal}
                getData={getUPs}
                projectId={projectId}
                projectState={projectState}
                setStudentJobTarget={setStudentJobTarget}
                showModalUpload={showModalUpload}
                deleteFileStudentJob={deleteFileProduct}
                showModalEditStudentJob={showModalEditStudentJob}
                showModalDeleteStudentJob={showModalDeleteStudentJob}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileSearchOutlined />
                  Investigadores
                </span>
              }
              key="4"
            >
              <ProjectUserResearchers
                list={researchers}
                showModal={showModal}
                projectState={projectState}
                institutionProjects={institutionProjects}
                getData={getUPs}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FrownOutlined />
                  Rechazados/Expulsados
                </span>
              }
              key="5"
            >
              <ProjectUserRejected
                list={rejecteds}
                showModal={showModal}
                projectState={projectState}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <RobotOutlined />
                  Usuarios Sintéticos
                </span>
              }
              key="6"
            >
              <SinteticUser
                projectId={projectId}
                runPromises={async () =>
                  await updateData([getUserProjects, getProject])
                }
                usersList={usersList}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      {isModalUploadVisible && (
        <UploadStudentJob
          repositorySize={repositorySize}
          isVisible={isModalUploadVisible}
          handleOk={handleOkUpload}
          handleCancel={handleCancelUpload}
        />
      )}
      {isModalEditVisible && (
        <RethinkStudentJob
          isModalVisible={isModalEditVisible}
          handleOk={OkEditStudentJob}
          handleCancel={CancelEditStudentJob}
          studentJobSelected={studentJobTarget}
        />
      )}
      {isModalDeleteStudentJobVisible && (
        <Modal
          title={`¿Eliminar Trabajo ${studentJobTarget.titleDocument}?`}
          visible={isModalDeleteStudentJobVisible}
          onOk={okDeleteStudentJob}
          onCancel={cancelDeleteStudentJob}
          okText={"Aceptar"}
          cancelText={"Cancelar"}
        >
          <span>{`Si se elimina el trabajo del estudiante tambien se eliminará su documento.`}</span>
        </Modal>
      )}
      <Modal
        title={infoModal.title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Aceptar"
        cancelText="Cancelar"
        footer={infoModal?.denegate}
      >
        <p>{infoModal.description}</p>
        <br />
        {input ? (
          <Input.TextArea
            {...sharedProps}
            value={reasonText}
            onChange={(e) => {
              setReasonText(e.target.value);
            }}
          />
        ) : null}
      </Modal>
    </>
  );
});

export default ProjectUser;
