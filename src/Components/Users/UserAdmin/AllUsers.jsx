import { Button, Col, Row, Table, Modal, message, Input } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import UserForm from "./UserForm";
import UserService from "../../../services/UserService";
const getColumns = (
  handleExcludeUser,
  setUserTarget,
  setIsModalEditVisible
) => {
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
          <Button
            type="link"
            onClick={() => {
              setUserTarget(record);
              setIsModalEditVisible(true);
            }}
          >
            Editar
          </Button>
          <Button
            type="link"
            onClick={() => {
              handleExcludeUser(record);
            }}
          >
            Excluir
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

export default function AllUsers({ list = [], getUsers, setuserList }) {
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [userTarget, setUserTarget] = useState(null);
  const [filter, setFilter] = useState({ filterText: "" });
  const excludeUser = (user) => {
    message.loading({ content: "Actualizando...", key: "update" });
    UserService.excludeUser(user)
      .then(async (res) => {
        if (res.data?.response) {
          try {
            message.success("Usuario agregado", 3);
            await runPromises([getUsers], [setuserList]);
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

  const handleExcludeUser = (user) => {
    //console.log("user", user);
    Modal.confirm({
      title: `¿Excluir del sistema a ${
        user?.firstName + " " + user?.lastName
      }?`,
      okText: "Aceptar",
      cancelText: "Cancel",
      onOk: async () => {
        await excludeUser(user);
      },
      onCancel: () => {},
    });
  };

  const handleEditUser = (user) => {
    message.loading({ content: "Actualizando...", key: "update" });
    UserService.editUser(user)
      .then(async (res) => {
        if (res.data?.success) {
          try {
            message.success("Usuario editado", 3);
            await runPromises([getUsers], [setuserList]);
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            setUserTarget(null);
            setIsModalEditVisible(false);
          } catch (e) {
            message.error({
              content: e.message,
              key: "update",
              duration: 4,
            });
          }
        } else {
          message.error({
            content: res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        message.error({ content: e.message, key: "update", duration: 5 });
      });
  };

  const handleCancel = () => {
    setUserTarget(null);
    setIsModalEditVisible(false);
  };


  const onChangeInputFilter = (value) => {
    setFilter({ filterText: value.target.value });
  };

  const getDataFilter = (myList,myFilter) => {
    if(myFilter.filterText !== ""){
      return myList.filter(u => {
        if(`${u?.firstName} ${u?.lastName}`?.toLowerCase().indexOf(myFilter?.filterText.toLowerCase()) >= 0 ||
            u?.email?.toLowerCase().indexOf(myFilter?.filterText.toLowerCase()) >= 0
        ){
          return true;
        }else{
          return false;
        }
      });
    }else {
      return list;
    }
  };

  return (
    <>
      <Row justify="center" gutter={[0, 24]}>
        <Col
          xs={{ span: 6, offset: 1 }}
          sm={4}
          md={{ span: 6, offset: 4 }}
          lg={{ span: 6, offset: 4 }}
          xl={{ span: 6, offset: 4 }}
          style={{ display: "flex", justifyContent: "start" }}
        >
          <Input
            allowClear
            placeholder="Buscador por nombre o email"
            onChange={onChangeInputFilter}
          />
        </Col>
        <Col
          xs={{ span: 6, offset: 11 }}
          sm={4}
          md={{ span: 6, offset: 8 }}
          lg={{ span: 6, offset: 8 }}
          xl={{ span: 6, offset: 8 }}
        >
          <div>
            <Button type="primary" size="small">
              <Link to="/invitation-users">Enviar invitaciones</Link>
            </Button>
          </div>
        </Col>
        <Col span={23}>
          <Table
            columns={getColumns(
              handleExcludeUser,
              setUserTarget,
              setIsModalEditVisible
            )}
            dataSource={getDataFilter(list,filter)}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
      {isModalEditVisible && (
        <UserForm
          user={userTarget}
          isVisible={isModalEditVisible}
          handleOk={handleEditUser}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
}
