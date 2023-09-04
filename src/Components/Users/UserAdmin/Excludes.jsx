import React from "react";
import { Col, Row, Table, Button, Modal, message } from "antd";
import UserService from "../../../services/UserService";
const getColumns = (handleAgregateUser) => {
  return [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: "100px",
      render: (text, record) => (
        <span>{record.firstName + " " + record.lastName}</span>
      ),
      fixed: "left",
    },
    {
      title: "Correo electrónico",
      dataIndex: "email",
      width: "150px",
      key: "email",
      render: (text, record) => <span>{record.email}</span>,
    },
    {
      title: "Grado Académico",
      dataIndex: "grade",
      width: "150px",
      key: "grade",
      render: (text, record) => <span>{record.grade}</span>,
    },
    {
      title: "Rol",
      dataIndex: "role",
      width: "150px",
      key: "role",
      render: (text, record) => <span>{record.SystemRol?.name}</span>,
    },
    {
      title: "Acciones",
      key: "action",
      width: "150px",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => {handleAgregateUser(record)}}>
            Agregar al sistema
          </Button>
        </>
      ),
    },
  ];
};

const runPromises = async (listPromises, listSetters) => {
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
  };

export default function Excludes({ list = [], getUsers, setuserList }) {
  const agregateUser = (user) => {
    message.loading({ content: "Actualizando...", key: "update" });
    UserService.agregateUser(user)
      .then(async (res) => {
        if (res.data?.response) {
          try {
              message.success("Usuario agregado",3);
              await runPromises([getUsers],[setuserList]);
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
          } catch (e) {
            message.error({
              content: e.message,
              key: "update",
              duration: 4,
            });
          }
        } else {
          message.warning({
            content: res.data?.description,
            key: "update",
            duration: 4,
          });
        }
      })
      .catch((e) => {
        message.error({
          content: e.message,
          key: "update",
          duration: 4,
        });
      });
  };

  const handleAgregateUser = (user) => {
    Modal.confirm({
      title: `¿Agregar a ${user?.firstName + " " + user?.lastName}?`,
      okText: "Aceptar",
      cancelText: "Cancel",
      onOk: async () => {await agregateUser(user)},
      onCancel: () => {},
    });
  };
  return (
    <>
      <Row justify="center" gutter={[0, 24]}>
        <Col span={18}>
          <Table
            columns={getColumns(handleAgregateUser)}
            dataSource={list}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
    </>
  );
}
