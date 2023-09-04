import { useContext, useCallback } from "react";
import { Row, Col, Space, Button, Table, Tag, message } from "antd";
import { useHistory } from "react-router";
import { useState } from "react";
import ModalChangeRole from "./ModalChangeRole";
import ModalInvitation from "./ModalInvitation";
import { UserContext, ProjectContext } from "../Contexts/AdminProjectContexts";
import ModalDirectAgregation from "./ModalDirectAgregation";

const getColumns = (
  showModal,
  projectState,
  currentUser,
  GroupLeaderId,
  setUserSelected,
  setIsModalVisible
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
      title: "Rol",
      dataIndex: "systemRol",
      key: "systemRol",
      render: (text, record) => (
        <>
          <span>{record?.SystemRol?.name || "Sin rol"}</span>
          {record.isMain ? (
            <Tag color={"yellow"} key={"yellow"}>
              LÍDER
            </Tag>
          ) : null}
        </>
      ),
    },
  ];

  if (projectState) {
    cols.push({
      title: "Acciones",
      key: "action",
      render: (text, record) => (
        <Space size="small">
          {!record.isMain &&
          record?.SystemRol?.name !== "Estudiante" &&
          record?.SystemRol?.name !== "Consultor" &&
          !record?.User?.sintetic &&
          (GroupLeaderId === currentUser.id ||
            currentUser?.rolName === "Administrador") ? (
            <Button
              type="link"
              onClick={() => {
                showModal(record, 3);
              }}
            >
              Hacer Líder
            </Button>
          ) : null}
          {currentUser?.id !== record?.User?.id ? (
            <Button
              type="link"
              onClick={() => {
                showModal(record, 2);
              }}
            >
              Suspender
            </Button>
          ) : null}
          {currentUser?.id !== record?.User?.id ? (
            <Button
              type="link"
              onClick={() => {
                showModal(record, 8);
              }}
            >
              Eliminar
            </Button>
          ) : null}
          <Button
            type="link"
            onClick={() => {
              //showModal(record, 8);
              console.log("record", record);
              setUserSelected(record); //Ponle el valor de record en userSelected
              setIsModalVisible(true);
            }}
          >
            Editar Rol
          </Button>
        </Space>
      ),
    });
  }
  return cols;
};

export default function ProjectUserMembers({
  list,
  showModal,
  projectId,
  projectState = true,
  currentUser,
  GroupLeaderId,
}) {
  //console.log("currentUser", currentUser);
  const { userProjects, getUserProjects } = useContext(UserContext);
  const { getProject, userSesion } = useContext(ProjectContext);
  //console.log('userPro', userProjects);
  const history = useHistory();
  const [showModalInvitation, setShowModalInvitation] = useState(false);
  const onCloseModalInvitation = () => {
    setShowModalInvitation(false);
  };
  const [userSelected, setUserSelected] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModalDirectAgregation, setShowModalDirectAgregation] =
    useState(false);

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

  const closeModal = async ({ success = false }) => {
    try {
      if (success) {
        message.loading({
          content: "Actualizando...",
          duration: 5,
          key: "update",
        });
        //await getUserProjects();
        await updateData([getUserProjects, getProject]);
        message.success({
          content: "Actualizado",
          duration: 3,
          key: "update",
        });
        setIsModalVisible(false);
      } else {
        setIsModalVisible(false);
      }
    } catch (error) {
      message.error({
        content: "Error. " + error.message,
        duration: 5,
        key: "update ",
      });
    }
  };

  const onCloseModalAgregation = async ({ success = false }) => {
    try {
      if (success) {
        message.loading({
          content: "Actualizando...",
          duration: 5,
          key: "update",
        });
        //await getUserProjects();
        await updateData([getUserProjects, getProject]);
        message.success({
          content: "Actualizado",
          duration: 3,
          key: "update",
        });
        setShowModalDirectAgregation(false);
      } else {
        setShowModalDirectAgregation(false);
      }
    } catch (error) {
      message.error({
        content: "Error. " + error.message,
        duration: 5,
        key: "update ",
      });
    }
  };
  return (
    <>
      <Row justify="center" gutter={[0, 24]}>
        {/* <Col
          xs={{ span: 6, offset: 1 }}
          sm={{ span: 6, offset: 1 }}
          md={{ span: 6, offset: 4 }}
          lg={{ span: 6, offset: 4 }}
          xl={{ span: 6, offset: 4 }}
        ></Col> */}
        <Col
          xs={{ span: 17, offset: 5 }}
          sm={{ span: 17, offset: 5 }}
          md={{ span: 17, offset: 5 }}
          lg={{ span: 12, offset: 12 }}
          xl={{ span: 10, offset: 14 }}
        >
          {projectState ? (
            <>
              <Button
                type="primary"
                onClick={() => {
                  history.push("/invitation-project/" + projectId);
                }}
              >
                + Enviar invitación (No registrado)
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setShowModalInvitation(true);
                }}
              >
                + Invitar a alguien ya registrado
              </Button>
              {userSesion?.rolName === "Administrador" && (
                <Button
                  type="primary"
                  onClick={() => {
                    setShowModalDirectAgregation(true);
                  }}
                >
                  + Agregar directamente
                </Button>
              )}
            </>
          ) : null}
        </Col>
        <Col span={24}>
          <Table
            columns={getColumns(
              showModal,
              projectState,
              currentUser,
              GroupLeaderId,
              setUserSelected,
              setIsModalVisible
            )}
            dataSource={list}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
      {showModalInvitation && (
        <ModalInvitation
          onClose={onCloseModalInvitation}
          projectId={projectId}
        />
      )}
      {isModalVisible && (
        <ModalChangeRole
          userSelected={userSelected}
          onCloseModal={closeModal}
          isMainSelected={userProjects?.members?.some(
            (userProject) =>
              userProject?.isMain && userProject?.id === userSelected?.id
          )}
        />
      )}
      {showModalDirectAgregation && (
        <ModalDirectAgregation
          onClose={onCloseModalAgregation}
          projectId={projectId}
        />
      )}
    </>
  );
}
