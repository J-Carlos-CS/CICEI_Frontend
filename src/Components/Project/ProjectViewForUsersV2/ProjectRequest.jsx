import React, { useState, useContext, useCallback } from "react";
import {
  ProjectContext,
  UserProjectContext,
} from "./Contexts/ContextProjectUsers";
import { Row, Col, Button, message, Modal, Typography } from "antd";
import RequestProjectForm from "./RequestProjectForm";
import UserProjectService from "../../../services/UserProjectService";
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

export default function ProjectRequest({
  /* currentUser = {
    User: null,
    rolName: "",
    permission: true,
    isMember: false,
    requesting: false,
    userProjectId: 0,
  }, */
  //projectData = { id: 0, title: "" },
  /* getUserProjects,
  setUserProjects, */
  isOwner,
  isProjectActive,
}) {
  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const {
    currentUser = {
      User: null,
      rolName: "",
      permission: true,
      isMember: false,
      requesting: false,
      userProjectId: 0,
    },
    projectData = { id: 0, title: "" },
  } = useContext(ProjectContext);
  const { getUserProjects } = useContext(UserProjectContext);
  const handleOkSubscribe = (userProject, setRequesting) => {
    message.loading({
      content: "Realizando peticion espere...",
      key: "update",
    });
    UserProjectService.subscribeUserProject(userProject)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Solicitud enviada con exito", 3);
          try {
            //await runPromises([getUserProjects], [setUserProjects]);
            await updateData([getUserProjects]);
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            setIsModalFormVisible(false);
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
        console.log(e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };

  const unsubscribeToProject = (userProjectId) => {
    message.loading({
      content: "Realizando peticion espere...",
      key: "update",
    });
    UserProjectService.unsubscribeUserProject({ id: userProjectId })
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Solicitud eliminada.");
          try {
            //await runPromises([getUserProjects], [setUserProjects]);
            await updateData([getUserProjects]);
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            setIsModalFormVisible(false);
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
        console.log(e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };

  const handleUnsubscribeToProject = (userProjectId) => {
    Modal.confirm({
      title: "¿Eliminar solicitud?",
      onOk: async () => {
        await unsubscribeToProject(userProjectId);
      },
      onCancel: () => {},
      content: (
        <p>{`¿Deseas elimina tu solicitud al proyecto "${projectData.title}"?`}</p>
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

  return isProjectActive ? (
    <>
      <Row align="center">
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {currentUser.isMember ? (
            "Eres miembro"
          ) : currentUser.requesting ? (
            "Solicitud pendiente"
          ) : (
            <Button
              type="primary"
              onClick={() => {
                setIsModalFormVisible(true);
              }}
            >
              Solicitar Unirse
            </Button>
          )}
        </Col>
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {currentUser.isMember &&
          currentUser.rolName === "Estudiante" &&
          !currentUser.requesting ? (
            <Button
              type="primary"
              onClick={() => {
                setIsModalFormVisible(true);
              }}
            >
              Registrar otro trabajo
            </Button>
          ) : !currentUser.isMember && currentUser.requesting ? (
            "Solicitud de trabajo pendiente "
          ) : (
            ""
          )}
        </Col>
        {!currentUser.isMember && currentUser.requesting ? (
          <Col
            span={24}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1.5em",
            }}
          >
            <Button
              danger
              onClick={() => {
                handleUnsubscribeToProject(currentUser.userProjectId);
              }}
            >
              Ya no deseo ser parte
            </Button>
          </Col>
        ) : null}
      </Row>
      {isModalFormVisible && (
        <RequestProjectForm
          isModalVisible={isModalFormVisible}
          userSesion={currentUser.User}
          project={projectData}
          setIsModalVisible={setIsModalFormVisible}
          isOwner={isOwner}
          handleOkSubscribe={handleOkSubscribe}
        />
      )}
    </>
  ) : (
    <Row align="center">
      <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
        <Text>Proyecto Finalizado</Text>
      </Col>
    </Row>
  );
}
