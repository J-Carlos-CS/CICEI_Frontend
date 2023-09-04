import { Input, Table, Space, Button, message } from "antd";
import ModalFormSinteticUser from "./FormSinteticUser";
import ModalInvite from "./ModalInviteUser";
import { useState, useRef, useEffect } from "react";
import UserService from "../../../../services/UserService";
const { Search } = Input;

const getColumns = (setShowModalInvite, userId) => {
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
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space size="small">
          <Button
            type="link"
            onClick={() => {
              userId.current = record.id;
              setShowModalInvite(true);
            }}
          >
            Agregar
          </Button>
        </Space>
      ),
    },
  ];

  return cols;
};

export default function SinteticUser({ projectId, runPromises, usersList }) {
  const [sinteticUsers, setSinteticUsers] = useState([]);
  const [showModalForm, setShowModalForm] = useState(false);
  const [showModalInvite, setShowModalInvite] = useState(false);
  const [filter, setfilter] = useState("all");
  let userId = useRef(0);

  //console.log("usersList", usersList);

  const onCloseForm = async (action, closer) => {
    if (action.success) {
      message.success({
        content: action.message || "Operación realizada con éxito",
        key: "create",
        duration: 3,
      });
      closer(false);
      await runPromises();
    } else {
      message.error({
        content: action.message || "Error al realizar la operación",
        key: "create",
        duration: 3,
      });
    }
  };

  const getSintetics = async () => {
    try {
      let {
        data: { response = null, success = false, description = "" },
      } = await UserService.getAllSintetics();
      console.log("response", response);
      if (success) {
        if (response?.length > 0) {
          let userToInvite = response?.filter((userSearched) => {
            if (
              usersList?.members.some(
                (member) => member.userId === userSearched.id
              ) ||
              usersList?.members.some(
                (member) => member.userId === userSearched.id
              ) ||
              usersList?.rejecteds.some(
                (member) => member.userId === userSearched.id
              ) ||
              usersList?.researchers.some(
                (member) => member.userId === userSearched.id
              ) ||
              usersList?.students.some(
                (member) => member.userId === userSearched.id
              )
            ) {
              return false;
            }
            return true;
          });
          console.log("usersToInvite", userToInvite);
          setSinteticUsers(userToInvite);
        } else {
          message.warning({
            content: "No se encontraron usuarios sinteticos.",
            duration: 5,
            key: "sintetic",
          });
        }
      } else {
        message.warning({ content: description, duration: 5, key: "sintetic" });
      }
    } catch (error) {
      message.warning({ content: error.message, duration: 5, key: "sintetic" });
    }
  };
  useEffect(() => {
    getSintetics();
  }, []);

  const onSearch = async (value) => {
    let text = value.toString();
    if (value.toString() === "") {
      text = "all";
    }
    setfilter(text);
  };
const onChange = (event) => {
  console.log("valores", event?.target?.value);
  let text = event?.target?.value.toString();
  if (text.toString() === "") {
    text = "all";
  }
  setfilter(text);
}
  const getFilteredSinteticUser = () => {
    try {
      let resultsSearch = sinteticUsers?.filter((sinteticUser) => {
        if (
          `${sinteticUser?.firstName} ${sinteticUser?.lastName}`.toLowerCase().indexOf(
            filter.toString().toLowerCase()
          ) >= 0 ||
          filter === "all"
        ) {
          return true;
        } else {
          return false;
        }
      });
      return resultsSearch;
    } catch (e) {
      console.log("error", e.message);
    }
  };

  const handleShowModalForm = () => {
    setShowModalForm(true);
  };
  return (
    <>
      <Button onClick={handleShowModalForm} type="primary">
        Agregar usuario sintéticos 
      </Button>
      <Search
        placeholder="Ingrese el nombre del usuario"
        //onSearch={onSearch}
        onChange={onChange}
        /* enterButton */
      />
      <br />
      <Table
        rowKey="id"
        columns={getColumns(setShowModalInvite, userId)}
        dataSource={getFilteredSinteticUser()}
        //scroll={{ x: "max-content" }}
      />
      {showModalForm && (
        <ModalFormSinteticUser
          setShowModalForm={setShowModalForm}
          projectId={projectId}
          onCloseForm={onCloseForm}
        />
      )}
      {showModalInvite && (
        <ModalInvite
          setShowModalForm={setShowModalInvite}
          projectId={projectId}
          onCloseForm={onCloseForm}
          userId={userId.current}
        />
      )}
    </>
  );
}
