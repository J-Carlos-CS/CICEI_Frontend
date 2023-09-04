import { useState, useEffect } from "react";
import { Table, Space, Button, Typography, Modal, message } from "antd";
import { Link } from "react-router-dom";
import "./TableGroup.css";
import GroupService from "../../services/GroupService";
const { Title } = Typography;

export default function TableGroup() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stateModal, setStateModal] = useState({ visible: false });
  const [groupTarget, setGroupTarget] = useState({ title: "",id:0 });

  const showModal = (record) => {
    setGroupTarget({ title: record.name, id:record.id });
    setStateModal({
      visible: true,
    });
  };

  const hideModal = () => {
    setStateModal({
      visible: false,
    });
  };

  const onAcept = () => {
    GroupService.deleteGroup(groupTarget.id)
      .then((res) => {
        if(res.data?.success){
          message.success('El grupo fue eliminado.',3);
          getGroups();
          hideModal();
        } else {
          message.error('No se pudo eliminar el grupo, intente nuevamente.');
        }
      })
      .catch((e) => {
        //console.log(e.message);
        message.error('Hubo un error en el servidor al intentar borrar el grupo.');
      });
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (text) => <span style={{color:'#1890FF'}}>{text}</span>,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Encargado",
      dataIndex: "User",
      key: "User",
      render: (user) => user? user?.firstName + " " + user?.lastName : "Sin Líder",
    },
    {
      title: "Acciones",
      key: "action",
      width: "60px",
      render: (text, record) => (
        <Space size="small">
          <Link to={"/group/view/" + record.id}>
            <Button type="link" size={"small"}>
              Ver
            </Button>
          </Link>
          <Link to={"/group/form/" + record.id}>
            <Button type="link" size={"small"}>
              Editar
            </Button>
          </Link>
          <Button type="link" size={"small"} onClick={() => showModal(record)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  const getGroups = () => {
    GroupService.getGroups()
      .then((response) => {
        setData(response.data.response);
        setIsLoading(false);
      })
      .catch((e) => {
        //console.log(e.message);
      });
  };

  useEffect(() => {
    getGroups();
  }, []);
  return (
    <>
      <Title className="title-group">Grupos</Title>
      <div className="div-container">
        <Link to="/group/form">
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              float: "right",
            }}
          >
            + Crear Grupo
          </Button>
        </Link>
        <Table
          rowKey="id"
          className="table-group"
          pagination={{ position: ["none", "bottomCenter"] }}
          columns={columns}
          dataSource={data}
          loading={isLoading}
          size="middle"
        />
      </div>
      <Modal
        title={`Eliminar el Grupo '${groupTarget.title}'`}
        visible={stateModal.visible}
        onOk={onAcept}
        onCancel={hideModal}
        okText="Aceptar"
        cancelText="Cancelar"
      >
        <p>¿Esta seguro que desea eliminar el grupo?</p>
      </Modal>
    </>
  );
}
