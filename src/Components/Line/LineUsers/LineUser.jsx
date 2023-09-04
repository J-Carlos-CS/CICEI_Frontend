import { useState, useEffect } from "react";
import LineService from "../../../services/LineService.js";
import LoaderSpin from "../../Layouts/Loader/LoaderSpin";
/* import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/userReducer"; */
import { useHistory } from "react-router";
import {
  Typography,
  Row,
  Col,
  Modal,
  Button,
  message,
  Card,
  Tooltip
} from "antd";
import { EyeOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function LineUser() {
  //const userSesion = useSelector(selectUser);
  const [lineTarget, setLineTarget] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const history = useHistory();
  const [isLoading, setisLoading] = useState({
    status: "loading",
    message: "",
  });
  const [lineList, setLineList] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setDeleting(true);
    LineService.deleteLine(lineTarget.id)
      .then((res) => {
        if (res.data?.success) {
          message.success("Línea eliminada.", 5);
          setIsModalVisible(false);
          getLines();
        } else {
            message.error(res.data?.description,5);
        }
        setDeleting(false);
      })
      .catch((e) => {
        console.log(e.message);
        message.error(e.message, 5);
        setDeleting(false);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getLines = () => {
    LineService.getLinesByOwnerId()
      .then((res) => {
        if (res.data?.success) {
          setLineList(res.data?.response);
          setisLoading({status:"success", message:""});
        } else {
          message.error("No se pudo obtener las líneas");
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error("Hubo un error en el servidor." + e.message, 5);
        setisLoading({ status: "error", message: e.message });
      });
  };

  useEffect(() => {
    getLines();
  }, []);

  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }

  return (
    <>
      <Row align="start">
        <Col>
          <Text>Estas son las líneas de tus grupos:</Text>
        </Col>
      </Row>
      <Row align="end" gutter={[16, 16]}>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              history.push("/line-users/form");
            }}
          >
            +Crear Línea
          </Button>
        </Col>
      </Row>
      {lineList.length > 0 ? (
        <Row gutter={[16, 16]} align="center">
          {lineList.map((line) => (
            <Col key={line.id} xs={20} sm={10} md={10} lg={10} xl={10}>
              <Card
                title={`Code: ${line.code}`}
                bordered={false}
                actions={[
                  <Tooltip title="Ver Línea" color="blue" key="blue">
                    <EyeOutlined
                      key="view-project"
                      onClick={() => {
                        history.push(`/line/view/${line.id}`);
                      }}
                    />
                  </Tooltip>,
                  <Tooltip title="Editar Línea" color="blue" key="blue">
                    <FormOutlined
                      key="view-project"
                      onClick={() => {
                        history.push(`/line-users/form/${line.id}`);
                      }}
                    />
                  </Tooltip>,
                  <Tooltip title="Eliminar Línea" color="blue" key="blue">
                    <DeleteOutlined
                      key="view-project"
                      onClick={() => {
                        setLineTarget(line);
                        showModal();
                      }}
                    />
                  </Tooltip>,
                ]}
              >
                <p>{`Nombre: ${line.name}`}</p>
                <p>{`Descripción: ${line.description}`}</p>
                <p>{`Grupo: ${line.groupName}`}</p>
                <p>{`Code Grupo: ${line.codeGroup}`}</p>

              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row align="center">
          <Col>No tienes líneas registradas.</Col>
        </Row>
      )}
      <Modal
        title={`¿Desea eliminar el grupo "${lineTarget?.name}"?`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancelar"
        okText="Eliminar Línea"
        confirmLoading={deleting}
      >
        <p>Para poder eliminar la línea ningún Proyecto debe estar asociado.</p>
      </Modal>
    </>
  );
}
