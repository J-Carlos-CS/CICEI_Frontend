import { useState } from "react";
import { Table, Space, Button, message, Modal, Tag } from "antd";
import CategoriasModalForm from "./CategoriasModalForm";
import Categoria from "../../../services/Categoria.service";
import { PlusCircleOutlined } from "@ant-design/icons";
const getColumns = (setCategoriaTarget, showModalForm, showModalDelete) => {
  return [
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      width: "100px",
      render: (text, record) => <span>{record.categoria}</span>,
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
              setCategoriaTarget(record);
              showModalForm();
            }}>
            Editar
          </Button>
          <Button
            type="link"
            onClick={() => {
              setCategoriaTarget(record);
              showModalDelete();
            }}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];
};
export default function Categorias({ list = [], getData, setCategorias }) {
  const [categoriaTarget, setCategoriaTarget] = useState(null);
  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const showModalDelete = () => {
    setIsModalDeleteVisible(true);
  };
  const handleOkDelete = () => {
    Categoria.deleteCategoria(categoriaTarget.id)
      .then((res) => {
        if (res.data?.success) {
          message.success("Tipo de producto eliminado.", 3);
          getData()
            .then((res) => {
              handleCancelDelete();
              setCategorias(res);
            })
            .catch((e) => {
              console.log("error", e.message);
              message.error("No se pudo obtener la lista de Tipo de productos.", 5);
            });
        } else {
          message.error("No se pudo eliminar la categoria. " + res.data?.description, 5);
        }
      })
      .catch((e) => {
        console.log("error.", e.message);
        message.error("Hubo un error. " + e.message, 5);
      });
  };

  const handleCancelDelete = () => {
    setCategoriaTarget(null);
    setIsModalDeleteVisible(false);
  };

  const showModalForm = () => {
    setIsModalFormVisible(true);
  };
  const handleOkForm = () => {
    getData()
      .then((res) => {
        setCategoriaTarget(null);
        setIsModalFormVisible(false);
        setCategorias(res);
      })
      .catch((e) => {
        console.log("error", e.message);
        message.error("No se pudo obtener la lista de Tipo de productos.", 5);
      });
  };

  const handleCancelForm = () => {
    setCategoriaTarget(null);
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
        Agregar Categoria
      </Button>
      <Table
        columns={getColumns(setCategoriaTarget, showModalForm, showModalDelete)}
        dataSource={list}
        rowKey="id"
        scroll={{ x: "max-content", y: 750 }}
        pagination={{ showSizeChanger: true }}
      />
      {isModalFormVisible ? (
        <CategoriasModalForm isModalVisible={isModalFormVisible} handleOk={handleOkForm} handleCancel={handleCancelForm} categoriaTarget={categoriaTarget} />
      ) : null}
      {isModalDeleteVisible ? (
        <Modal
          visible={isModalDeleteVisible}
          title="Eliminar Categoria"
          onOk={handleOkDelete}
          onCancel={handleCancelDelete}
          okText="Aceptar"
          cancelText="Cancelar">
          <p>
            ¿Desea eliminar la Categoria: <strong>{categoriaTarget?.categoria}</strong>?
          </p>
        </Modal>
      ) : null}
    </>
  );
}
