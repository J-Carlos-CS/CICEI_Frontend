import { useState } from "react";
import { Button, Col, Row, Table, message, Input } from "antd";
import UserSinteticForm from "./UserSinteticForm";
import SincroUsers from "./SincroUsers";
const getColumns = (setSinteticSelected, setShowModal, setShowModalSincro) => {
  return [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: "100px",
      render: (text, record) => (
        <span>{record?.firstName + " " + record?.lastName}</span>
      ),
      fixed: "left",
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
              setSinteticSelected(record);
              setShowModal(true);
            }}
          >
            Editar
          </Button>
          <Button
            type="link"
            onClick={() => {
              setSinteticSelected(record);
              setShowModalSincro(true);
            }}
          >
            Sincronizar Usuarios
          </Button>
        </>
      ),
    },
  ];
};

export default function Sintetics({ list = [], runPromises }) {
  const [filter, setFilter] = useState({ filterText: "" });
  const [showModal, setShowModal] = useState(false);
  const [showModalSincro, setShowModalSincro] = useState(false);
  const [sinteticSelected, setSinteticSelected] = useState(null);
  console.log("listUser", list);
  const onChangeInputFilter = (value) => {
    setFilter({ filterText: value.target.value });
  };

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

  const onCloseModal_Sincro = async (action = { state: "close" }) => {
    if (action.state === "success") {
      setShowModalSincro(false);
      setSinteticSelected(null);
      await runPromises();
    } else {
      setShowModalSincro(false);
      setSinteticSelected(null);
    }
  };

  const onCancelForm = () => {
    setSinteticSelected(null);
    setShowModal(false);
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
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setShowModal(true);
              }}
            >
              + Crear usuario sintético
            </Button>
          </div>
        </Col>
        <Col span={23}>
          <Table
            columns={getColumns(
              setSinteticSelected,
              setShowModal,
              setShowModalSincro
            )}
            //dataSource={getDataFilter(list, filter)}
            //dataSource={list}
            dataSource={list}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
      {showModal && (
        <UserSinteticForm
          sinteticSelected={sinteticSelected}
          setShowModalForm={setShowModal}
          onCloseForm={onCloseForm}
          onCancelForm={onCancelForm}
        />
      )}
      {showModalSincro && (
        <SincroUsers
          onCloseModal={onCloseModal_Sincro}
          sinteticSelected={sinteticSelected}
        />
      )}
    </>
  );
}
