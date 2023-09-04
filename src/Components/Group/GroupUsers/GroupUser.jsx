import { useState, useEffect,useRef } from "react";
import {
  Typography,
  Row,
  Col,
  Modal,
  message,
  Card,
  Tooltip,
} from "antd";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/userReducer";
import GroupService from "../../../services/GroupService.js";
import LoaderSpin from "../../../Components/Layouts/Loader/LoaderSpin";
import { useHistory } from "react-router";
import { EyeOutlined, FormOutlined } from "@ant-design/icons";
const { Text } = Typography;
export default function GroupUser() {
  const [isLoading, setisLoading] = useState({
    status: "loading",
    message: "",
  });
  const history = useHistory();
  const [groupList, setgroupList] = useState([]);
  const globalUser = useSelector(selectUser);
  const {current:userSesion} = useRef(globalUser);
//  const [groupTarget, setGroupTarget] = useState(null);
  let groupTarget = null
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
 /*  const showModal = () => {
    setIsModalVisible(true);
  }; */

  const handleOk = () => {
    setDeleting(true);
    GroupService.deleteGroup(groupTarget.id)
      .then((res) => {
        if (res.data?.success) {
          message.success("Grupo eliminado.", 5);
          setIsModalVisible(false);
          getGroups(userSesion.id);
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

  useEffect(() => {
    getGroups(userSesion.id);
  }, [userSesion.id]);

  const getGroups = (id) => {
    GroupService.getGroupsByOwnerId(id)
      .then((res) => {
        if (res.data?.success) {
          setgroupList(res.data.response);
          setisLoading({ status: "success", message: "" });
        } else {
          message.error(
            "Hubo un error al tratar de obetener la lista de grupos."
          );
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error(
          "Hubo un error en elservidor al tratar de obetener la lista de grupos."
        );
      });
  };

  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }

  return (
    <>
      <Row align="start">
        <Col>
          <Text>Eres encargado de los siguientes grupos:</Text>
        </Col>
      </Row>
     {/*  <Row align="end" gutter={[16, 16]}>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              history.push("/group-users/form");
            }}
          >
            +Crear Grupo
          </Button>
        </Col>
      </Row> */}
      {groupList.length > 0 ? (
        <Row gutter={[16, 16]} align="center">
          {groupList.map((group) => (
            <Col key={group.id} xs={20} sm={10} md={10} lg={10} xl={10}>
              <Card
                title={`Code: ${group.code}`}
                bordered={false}
                actions={[
                  <Tooltip title="Ver Grupo" color="blue" key="blue">
                    <EyeOutlined
                      key="view-project"
                      onClick={() => {
                        history.push(`/group/view/${group.id}`);
                      }}
                    />
                  </Tooltip>,
                  <Tooltip title="Editar Grupo" color="blue" key="blue">
                    <FormOutlined
                      key="view-project"
                      onClick={() => {
                        history.push(`/group-users/form/${group.id}`);
                      }}
                    />
                  </Tooltip>,
                 /*  <Tooltip title="Eliminar Grupo" color="blue" key="blue">
                    <DeleteOutlined
                      key="view-project"
                      onClick={() => {
                        setGroupTarget(group);
                        showModal();
                      }}
                    />
                  </Tooltip>, */
                ]}
              >
                <p>{`Nombre: ${group.name}`}</p>
                <p>{`Descripción: ${group.description}`}</p>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row align="center">
          <Col>No eres encargado en ningun Grupo todavia.</Col>
        </Row>
      )}

      <Modal
        title={`¿Desea eliminar el grupo "${groupTarget?.name}"?`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancelar"
        okText="Eliminar grupo"
        confirmLoading={deleting}
      >
        <p>Para poder eliminar el grupo ninguna línea debe estar asociada.</p>
      </Modal>
    </>
  );
}
