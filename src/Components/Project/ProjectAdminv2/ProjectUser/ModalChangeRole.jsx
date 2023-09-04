import React, { useState, useEffect } from "react";
import { Modal, Button, message } from "antd";
import SystemRolService from "../../../../services/SystemRolService.js";
import UserProjectService from "../../../../services/UserProjectService.js";
import { Select } from "antd";
const { Option } = Select;

export default function ModalChangeRole({
  userSelected,
  onCloseModal,
  isMainSelected = false,
}) {
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState(0);
  const [requesting, setRequesting] = useState(false);
  const handleOk = async () => {
    setRequesting(true);
    try {
      if (userSelected && roleId) {
        message.loading({ content: "Procesando...", duration: 4, key: "haha" });
        let {
          data: { response = null, description = "", success = false },
        } = await UserProjectService.updateRole({
          userProjectId: userSelected?.id,
          roleId,
        });
        if (success) {
          message.success({
            content: "Rol editado",
            duration: 3,
            key: "haha",
          });
          onCloseModal({ success: true });
        } else {
          message.warning({
            content: "Algo salio mal" + description,
            duration: 5,
            key: "haha",
          });
          setRequesting(false);
        }
      } else {
        message.warning({
          content: "Información insuficiente",
          duration: 5,
          key: "haha",
        });
        setRequesting(false);
      }
    } catch (error) {
      message.error({ content: error.message, duration: 5, key: "haha" });
    }
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setRoleId(parseInt(value));
  };

  const getRoles = async () => {
    try {
      let {
        data: { response = [], success = false, description = "" },
      } = await SystemRolService.getRoles();
      if (success) {
        let rolesFiltered = response?.filter(
          (role) =>
            role?.name !== "Administrador" &&
            role?.name !== "Supervisor" &&
            role?.name !== userSelected?.SystemRol?.name
        );

        isMainSelected &&
          (rolesFiltered = rolesFiltered?.filter(
            (role) =>
              role?.name !== "Estudiante" &&
              role?.name !== "Consultor" &&
              isMainSelected
          ));
        setRoles(rolesFiltered);
      } else {
        message.warning({ content: description, duration: 5, key: "chancho" });
      }
    } catch (error) {
      message.error({ content: error.message, duration: 5, key: "chancho" });
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <Modal
      title="Cambiar Rol"
      visible={true}
      //onOk={handleOk}
      onCancel={onCloseModal}
      /* okText="Aceptar"
      cancelText="Cancelar" */
      footer={
        <>
          <Button onClick={onCloseModal}>Cancelar</Button>
          <Button type="primary" disabled={requesting} onClick={handleOk}>
            Aceptar
          </Button>
        </>
      }
    >
      <div>
        <p>
          <strong>Nombre:</strong>
          {` ${userSelected?.User?.firstName || "Sin"} ${
            userSelected?.User?.lastName || "Identidad"
          }`}
        </p>
        <p>
          <strong>Rol actual:</strong>
          {` ${userSelected?.SystemRol?.name}`}
        </p>
      </div>
      <div>
        <h3 style={{ textAlign: "center" }}>Seleccione el nuevo rol</h3>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Select
          style={{
            width: 120,
          }}
          onChange={handleChange}
        >
          {roles?.map((role) => (
            <Option value={role?.id} key={role?.id}>
              {role?.name}
            </Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
}
