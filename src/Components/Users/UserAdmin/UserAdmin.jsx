import { useState, useEffect, useCallback } from "react";
import UserService from "../../../services/UserService.js";
import LoaderSpin from "../../Layouts/Loader/LoaderSpin";
import AllUsers from "./AllUsers";
import Students from "./Students";
import Ciceis from "./Ciceis";
import Associated from "./Associated";
import Consultants from "./Consultants";
import Excludes from "./Excludes";
import Sintetics from "./Sintetics.jsx";
import { Row, Col, Divider, Tabs, Typography, message } from "antd";
import {
  TeamOutlined,
  MailOutlined,
  SolutionOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;

export default function UserAdmin() {
  const [userList, setuserList] = useState({});
  const [isLoading, setisLoading] = useState({
    status: "loading",
    message: "",
  });

  const getUsers = useCallback(() => {
    return new Promise((resolve, reject) => {
      UserService.getUsersForAdmin()
        .then((res) => {
          if (res.data?.success) {
            let data = res.data?.response;
            let allUsers = data.filter(
              (u) => u.SystemRol.name !== "Administrador" && u.SystemRol.name !== "DirectorNacional" && u.state === true
            );
            let students = data.filter(
              (u) => u.SystemRol.name === "Estudiante" && u.state === true
            );
            let ciceis = data.filter(
              (u) => u.SystemRol.name === "Investigador" && u.state === true
            );
            let asociados = data.filter(
              (u) => u.SystemRol.name === "Asociado" && u.state === true
            );
            let consultores = data.filter(
              (u) => u.SystemRol.name === "Consultor" && u.state === true
            );
            let excludes = data.filter((u) => u.state === false);
            let sintetics = data.filter(
              (u) =>
                u.state === true && u.status === true && u.sintetic === true
            );
            resolve({
              allUsers,
              students,
              ciceis,
              asociados,
              consultores,
              excludes,
              sintetics,
            });
          } else {
            reject({ status: "error", message: res.data?.response });
          }
        })
        .catch((e) => {
          reject({ status: "error", message: e.message });
        });
    });
  }, []);
  const runPromises_Sincro = useCallback(async () => {
    try {
      message.loading({
        content: "Actualizando...",
        key: "update",
        duration: 3,
      });
      let users = await getUsers();
      message.success({
        content: "Actualizado",
        key: "update",
        duration: 3,
      });
      setuserList(users);
    } catch (error) {
      message.error({
        content: "Error. " + error.message,
        key: "update",
        duration: 3,
      });
    }
  }, [getUsers]);

  const getData = useCallback(() => {
    let promises = [getUsers()];
    Promise.allSettled(promises).then((results) => {
      let statusRequests = { status: "success", message: "" };
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          statusRequests = result.reason || {
            status: "error",
            message: "Error desconocido",
          };
        } else {
          switch (index) {
            case 0:
              setuserList(result.value);
              break;
            default:
              break;
          }
        }
      });
      setisLoading(statusRequests);
    });
  }, [getUsers]);

  useEffect(() => {
    getData();
  }, [getData]);

  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }
  return (
    <>
      <Divider>
        <Title level={4}>Usuarios</Title>
      </Divider>
      <Row justify="center">
        <Col span={23}>
          <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
            <TabPane
              tab={
                <span>
                  <TeamOutlined />
                  Todos
                </span>
              }
              key="1"
            >
              <AllUsers
                list={userList.allUsers}
                getUsers={getUsers}
                setuserList={setuserList}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <MailOutlined />
                  Estudiantes
                </span>
              }
              key="2"
            >
              <Students list={userList.students} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SolutionOutlined />
                  Investigadores
                </span>
              }
              key="3"
            >
              <Ciceis list={userList.ciceis} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileSearchOutlined />
                  Asociados
                </span>
              }
              key="4"
            >
              <Associated list={userList.asociados} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileSearchOutlined />
                  Consultores
                </span>
              }
              key="5"
            >
              <Consultants list={userList.consultores} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileSearchOutlined />
                  Sintéticos
                </span>
              }
              key="6"
            >
              <Sintetics
                list={userList.sintetics}
                runPromises={runPromises_Sincro}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileSearchOutlined />
                  Excluidos
                </span>
              }
              key="7"
            >
              <Excludes
                list={userList.excludes}
                getUsers={getUsers}
                setuserList={setuserList}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
}
