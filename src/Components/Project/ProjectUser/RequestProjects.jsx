import { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Button,
  Modal,
  message,
  Empty,
} from "antd";
import UserProjectService from "../../../services/UserProjectService.js";
import { useHistory } from "react-router";
const { Text } = Typography;

const ButtonDeleteRequest = ({ userProject, setuserProject, showModal }) => {
  return (
    <>
      <Button
        danger
        onClick={() => {
          setuserProject(userProject);
          showModal();
        }}
      >
        Eliminar Solicitud
      </Button>
    </>
  );
};

export default function RequestProjects({ list = [], getData }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userProjectTarget, setuserProjectTarget] = useState(null);
  const history = useHistory();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    unsubscribe();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const unsubscribe = () => {
    UserProjectService.unsubscribeUserProject(userProjectTarget)
      .then((res) => {
        if (res.data?.success) {
          message.success("Solicitud eliminada.");
          getData();
          setIsModalVisible(false);
        } else {
          message.error("No se pudo eliminar la solicitud");
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error("Hubo un error. " + e.message, 5);
      });
  };

  return (
    <>
      {list.length > 0 ? (
        <Row align="start" style={{ marginTop: "1.5em" }}>
          <Col>
            <Text>Solicitaste unirte a estos proyectos:</Text>
          </Col>
        </Row>
      ) : (
        <Row align="center" style={{ marginTop: "1.5em" }}>
          <Col>
            <Empty
              imageStyle={{
                height: 60,
              }}
              description={
                <span>No tienes ninguna solicitud a algun proyecto.</span>
              }
            ></Empty>
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]} align="center">
        {list.map((l) => (
          <Col key={l.id} xs={20} sm={10} md={10} lg={10} xl={10}>
            <Card
              title={l.Project.code}
              bordered={false}
              actions={[
                <ButtonDeleteRequest
                  userProject={l}
                  setuserProject={setuserProjectTarget}
                  showModal={showModal}
                />,
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    history.push(`/project/view/${l.Project?.id}`);
                  }}
                >
                  Ir al Proyecto
                </Button>,
              ]}
            >
              {l.Project.title}
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="¿Eliminar solicitud?"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{`¿Deseas elimina tu solicitud al proyecto "${userProjectTarget?.Project?.title}"?`}</p>
      </Modal>
    </>
  );
}
