import { useState, useEffect } from "react";
import { Table, Space, Button, Typography, Modal, message } from "antd";
import { Link } from "react-router-dom";
import LineService from "../../services/LineService";
import "./TableLine.css";
import LineChangeGroup from "./LineChangeGroup";
import {selectCenterInformation} from "../../Auth/centerInformationReducer"
import { useSelector } from "react-redux";
const { Title } = Typography;

export default function TableLine() {
  const [data, setData] = useState([]);
  const centerData= useSelector(selectCenterInformation)?.centerInformation;
  const [isLoading, setIsLoading] = useState(true);
  const [stateModal, setStateModal] = useState({ visible: false });
  const [lineTarget, setLineTarget] = useState({ title: "", id: 0 });
  const [isModalChangeGroupVisible, setIsModalChangeGroupVisible] =
    useState(false);
  const showModal = (record) => {
    setLineTarget({ title: record.name, id: record.id });
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
    LineService.deleteLine(lineTarget.id)
      .then((res) => {
        if (res.data?.success) {
          message.success("La Línea fue eliminada.", 3);
          getLines();
          hideModal();
        } else {
          message.error("No se pudo eliminar la línea, intente nuevamente.", 3);
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error(
          "Hubo un error en el servidor al intentar borrar el grupo.",
          3
        );
      });
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (text) => <span style={{ color: "#1890FF" }}>{text}</span>,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Grupo",
      dataIndex: "Group",
      key: "Group",
      render: (group) => (group ? group.name : "Línea de la Universidad"),
    },
    {
      title: "Acciones",
      key: "action",
      width: "60px",
      render: (text, record) => (
        <Space size="small">
          <Link to={"/line/view/" + record.id}>
            <Button type="link" size={"small"}>
              Ver
            </Button>
          </Link>
          <Link to={"/line/form/" + record.id}>
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

  const getLines = () => {
    LineService.getLines()
      .then((response) => {
        if(response.data.success){
          setData(response.data.response);
        }else {
          message.error("Algo salio mal al obtener las líneas.");
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  useEffect(() => {
    getLines();
  }, []);

  const handleOkModal = (data) => {
    console.log("dataLine", data);
    message.loading({content:"Actualizando...",key:"update"});
    LineService.changeLinesGroup(data)
      .then(res=>{
        if(res.data?.success){
          message.success({content:"Líneas actualizadas",key:"update", duration: 3});
          getLines();
        }else {
          message.error({content:res.data?.description,key:"update",duration:4});
        }
      })
      .catch((e) => {
        message.error({content:e.message,key:"update",duration:4});
      });
  };

  const handleCancelModal = () => {
    setIsModalChangeGroupVisible(false);
  };
  return (
    <>
      <Title className="title-group">{`Líneas ${centerData.acronym}`}</Title>
      <div className="div-container">
        <Link to="/line/form">
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              float: "right",
            }}
          >
            + Crear Línea
          </Button>
        </Link>
        <Button
          type="primary"
          style={{
            marginBottom: 16,
            float: "right",
          }}
          onClick={() => {
            setIsModalChangeGroupVisible(true);
          }}
        >
          Mover Líneas de Grupo
        </Button>
        <Table
          rowKey="id"
          className="table-group"
          pagination={{ position: ["none", "bottomCenter"] }}
          columns={columns}
          dataSource={data || []}
          loading={isLoading}
          size="middle"
        />
      </div>
      <Modal
        title={`Eliminar Línea '${lineTarget.title}'`}
        visible={stateModal.visible}
        onOk={onAcept}
        onCancel={hideModal}
        okText="Aceptar"
        cancelText="Cancelar"
      >
        <p>¿Esta seguro que desea eliminar la línea?</p>
      </Modal>
      {isModalChangeGroupVisible && (
        <LineChangeGroup
          lines={data}
          isVisible={isModalChangeGroupVisible}
          handleOk={handleOkModal}
          handleCancel={handleCancelModal}
        />
      )}
    </>
  );
}
