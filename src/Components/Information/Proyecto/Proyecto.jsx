import { useState } from "react";
import { Table, Space, Button, message, Modal, Tag } from "antd";
import ProyectosModalForm from "./ProyectosModalForm";
import Proyecto from "../../../services/Proyecto.service";
import { PlusCircleOutlined } from "@ant-design/icons";
const getColumns = (setProyectoTarget, showModalForm, showModalDelete) => {
  return [
    {
      title: "Proyecto",
      dataIndex: "proyecto",
      key: "proyecto",
      width: "100px",
      render: (text, record) => <span>{record.proyecto}</span>,
      fixed: "left",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      width: "100px",
      render: (text, record) => (
        <span>
          <Tag color={"green"} key={record.id}>
            {record.estado.toString().toUpperCase()}
          </Tag>
        </span>
      ),
      fixed: "left",
    },
    {
      title: "Acciones",
      key: "action",
      width: "150px",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setProyectoTarget(record);
              showModalForm();
            }}>
            Editar
          </Button>
          <Button
            type="link"
            onClick={() => {
              setProyectoTarget(record);
              showModalDelete();
            }}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];
};
export default function Proyectos({ list = [], getData, setProyectos }) {
  const [proyectoTarget, setProyectoTarget] = useState(null);
  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const showModalDelete = () => {
    setIsModalDeleteVisible(true);
  };
  const handleOkDelete = () => {
    Proyecto.deleteProyecto(proyectoTarget.id)
      .then((res) => {
        if (res.data?.success) {
          message.success("Tipo de producto eliminado.", 3);
          getData()
            .then((res) => {
              handleCancelDelete();
              setProyectos(res);
            })
            .catch((e) => {
              console.log("error", e.message);
              message.error("No se pudo obtener la lista de Tipo de productos.", 5);
            });
        } else {
          message.error("No se pudo eliminar la proyecto. " + res.data?.description, 5);
        }
      })
      .catch((e) => {
        console.log("error.", e.message);
        message.error("Hubo un error. " + e.message, 5);
      });
  };

  const handleCancelDelete = () => {
    setProyectoTarget(null);
    setIsModalDeleteVisible(false);
  };

  const showModalForm = () => {
    setIsModalFormVisible(true);
  };
  const handleOkForm = () => {
    getData()
      .then((res) => {
        setProyectoTarget(null);
        setIsModalFormVisible(false);
        setProyectos(res);
      })
      .catch((e) => {
        console.log("error", e.message);
        message.error("No se pudo obtener la lista de Tipo de productos.", 5);
      });
  };

  const handleCancelForm = () => {
    setProyectoTarget(null);
    setIsModalFormVisible(false);
  };
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          showModalForm();
        }}
        style={{ marginBottom: "1em" }}>
        <PlusCircleOutlined />
        Agregar Proyecto
      </Button>
      <Table
        columns={getColumns(setProyectoTarget, showModalForm, showModalDelete)}
        dataSource={list}
        rowKey="id"
        scroll={{ x: "max-content", y: 750 }}
        pagination={{ showSizeChanger: true }}
      />
      {isModalFormVisible ? (
        <ProyectosModalForm isModalVisible={isModalFormVisible} handleOk={handleOkForm} handleCancel={handleCancelForm} proyectoTarget={proyectoTarget} />
      ) : null}
      {isModalDeleteVisible ? (
        <Modal
          visible={isModalDeleteVisible}
          title="Eliminar Proyecto"
          onOk={handleOkDelete}
          onCancel={handleCancelDelete}
          okText="Aceptar"
          cancelText="Cancelar">
          <p>
            ¿Desea eliminar el Proyecto: <strong>{proyectoTarget?.proyecto}</strong>?
          </p>
        </Modal>
      ) : null}
    </>
  );
}
