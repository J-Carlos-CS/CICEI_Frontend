import { useEffect, useState } from "react";
import { Modal, Table, message, Space, Button, Input } from "antd";
import UserProjectService from "../../../../services/UserProjectService";
const { Search } = Input;

const getColumns = (onModalConfirm) => {
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
      render: (text, record) => (
        <span>{`${record?.SystemRol?.name} ${
          record?.sintetic ? "(Sintético)" : ""
        }`}</span>
      ),
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
            {!record?.agregated ? (
              <Button
                type="link"
                onClick={() => {
                  onModalConfirm(record);
                }}
              >
                +Agregar
              </Button>
            ) : (
              "Agregado"
            )}
          </Space>
        );
      },
    },
  ];

  return cols;
};

export default function ModalDirectAgregation({ onClose, projectId = 0 }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [agregations, setAgregations] = useState(false);
  //const [showModalConfirm, setShowModalConfirm] = useState(false);

  const agregateUser = async (data, user) => {
    try {
      let {
        data: { response = null, success = false, description = "" },
      } = await UserProjectService.agregateUserToProjects(data);
      if (success) {
        message.success({
          content: "Usuario agregado",
          duration: 5,
          key: "agregate",
        });
        let userupdated = users.map((userUpdate) => {
          return {
            ...userUpdate,
            agregated: user?.id === userUpdate?.id || userUpdate.agregated,
          };
        });
        setUsers(userupdated);
        setAgregations(true);
      } else {
        message.warning({
          content: description,
          duration: 5,
          key: "agregate",
        });
      }
    } catch (error) {
      message.error({
        content: "Error. " + error.message,
        duration: 5,
        key: "agregate",
      });
    }
  };
  const onModalConfirm = (user) => {
    Modal.confirm({
      title: `¿Agregar a ${user?.firstName} ${user?.lastName}? `,
      content: (
        <div>
          <div>{`Se agregará al usuario ${
            user?.sintetic ? "(Sintético)" : ""
          } ${user?.firstName} ${user?.lastName} al proyecto.`}</div>
        </div>
      ),
      okText: "Agregar",
      cancelText: "Cancelar",
      onOk: () => {
        agregateUser({ id: user?.id, projectId: projectId }, user);
      },
    });
  };
  const getUserFiltered = () => {
    let usersFiltered = users;
    if (search !== "") {
      usersFiltered = usersFiltered.filter((usertoagregate) => {
        if (
          `${usertoagregate?.firstName} ${usertoagregate?.lastName}`
            .toLowerCase()
            .indexOf(search?.toLowerCase()) >= 0
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    return usersFiltered;
  };

  const getUsersToDirectAgregation = async () => {
    try {
      let {
        data: { response = [], success = false, description = "" },
      } = await UserProjectService.getUsersToDirectAgregation(projectId);
      if (success) {
        let userstoagregate = response.map((usertoagregate) => {
          return {
            ...usertoagregate,
            agregated: false,
          };
        });
        setUsers(userstoagregate);
      } else {
        message.warn({
          content: description,
          duration: 5,
          key: "getagregation",
        });
      }
    } catch (error) {
      message.error({
        content: "Error. " + error.message,
        duration: 5,
        key: "getagregation",
      });
    }
  };

  const onSearch = (value) => {
    console.log("value", value);
    setSearch(value || "");
  };
  useEffect(() => {
    getUsersToDirectAgregation();
  }, []);

  return (
    <Modal
      visible={true}
      title="Agregar directamente"
      cancelText="Cerrar"
      onCancel={() => {
        onClose({ success: agregations });
      }}
      footer={null}
    >
      <Search
        placeholder="Buscar investigador"
        onSearch={onSearch}
        style={{
          width: "100%",
        }}
        onChange={() => {}}
      />
      {/* </Col> */}
      <Table
        rowKey="id"
        dataSource={getUserFiltered()}
        columns={getColumns(onModalConfirm)}
      />
    </Modal>
  );
}
