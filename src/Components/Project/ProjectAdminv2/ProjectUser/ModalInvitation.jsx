import { useEffect, useCallback, useState } from "react";
import { Modal, Table, message, Space, Button, Input } from "antd";
import UserService from "../../../../services/UserService";
const { Search } = Input;

const getColumns = (onInviteModal) => {
  let cols = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {(record?.firstName || "Sin") +
            " " +
            (record?.lastName || "identidad")}
        </span>
      ),
      fixed: "left",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (text, record) => <span>{record?.SystemRol?.name}</span>,
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => {
        return record?.invited ? (
          <span>Invitado</span>
        ) : (
          <Space size="small">
            <Button
              type="link"
              onClick={() => {
                onInviteModal(record);
              }}
            >
              +Invitar
            </Button>
          </Space>
        );
      },
    },
  ];

  return cols;
};

export default function ModalInvitation({ onClose, projectId = 0 }) {
  const [userToInvite, setUserToInvite] = useState([]);
  const [filter, setFilter] = useState("");

  const onSearch = (value) => {
    setFilter(value?.target?.value);
  };
  const usersFilter = () => {
    if (filter === "") {
      return userToInvite;
    } else {
      return userToInvite?.filter(
        (user) =>
          `${user?.firstName} ${user?.lastName}`
            ?.toLowerCase()
            ?.indexOf(filter?.toLocaleLowerCase()) >= 0
      );
    }
  };
  const getUserToInvite = useCallback(async (projectId) => {
    try {
      let {
        data: { response, description, success },
      } = await UserService.getUsertoinvite(projectId);
      if (success) {
        let list = response.map((user) => {
          return {
            ...user,
            invited: false,
          };
        });
        console.log("list", list);
        setUserToInvite(list);
      } else {
        message.warning({ content: description, key: "get", duration: 4 });
      }
    } catch (error) {
      message.error("Error. " + error.message, 4);
    }
  }, []);

  const sendInvitation = async (args = { email: "", projectId: 0 }) => {
    try {
      message.loading({
        content: "Enviando invitación...",
        key: "send",
      });
      console.log('args',args);
      let {
        data: { response, description, success },
      } = await UserService.sendDirectInvitation(args);
      if (success) {
        /* let indexUSer = userToInvite?.findIndex(
          (user) => user.email === args.email
        ); */
        /*  console.log("index", indexUSer);
        let newUserToInvite = [];
        if (indexUSer >= 0) {
          newUserToInvite = userToInvite;
          newUserToInvite[indexUSer].invited = true;
        } */
        //console.log("response", response);
        message.success({
          content: "Invitación enviada",
          duration: 3,
          key: "send",
        });
        setUserToInvite(
          userToInvite.map((user) => {
            return {
              ...user,
              invited: user?.invited ? true : user.email === args.email,
            };
          })
        );
      } else {
        message.warning({ content: description, key: "send", duration: 5 });
      }
    } catch (error) {
      message.error("Error. " + error.message, 5);
    }
  };

  useEffect(() => {
    if (projectId) {
      getUserToInvite(projectId);
    }
  }, [getUserToInvite, projectId]);
  const onInviteModal = (user) => {
    Modal.confirm({
      title: `¿Enviar invitación a ${user?.firstName + " " + user?.lastName}? `,
      content: (
        <span>
          Se enviará la invitación a <strong>{user?.email}</strong>
        </span>
      ),
      okText: "Enviar",
      cancelText: "Cancelar",
      onOk: () => {
        sendInvitation({ email: user?.email, projectId: projectId });
      },
    });
  };
  return (
    <Modal
      title={"Invitar a alguien del sistema"}
      visible={true}
      onOk={() => {
        onClose();
      }}
      onCancel={() => {
        onClose();
      }}
      okText="Acpetar"
      cancelText="Cancelar"
    >
      {/* <Col span={24} style={{ display: "flex", justifyContent: "center" }}> */}
      <Search
        placeholder="Buscar investigador"
        //onSearch={onSearch}
        style={{
          width: "100%",
        }}
        onChange={onSearch}
      />
      {/* </Col> */}
      <Table
        rowKey="id"
        dataSource={usersFilter()}
        columns={getColumns(onInviteModal)}
      />
    </Modal>
  );
}
