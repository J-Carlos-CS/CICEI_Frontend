import { useState, useEffect, useCallback, useRef } from "react";
import { Typography, Row, Col, Divider, Tabs } from "antd";
import {
  AuditOutlined,
  FileSearchOutlined,
  ClusterOutlined,
  BookOutlined,
} from "@ant-design/icons";
import MyProjects from "./MyProjects";
import OtherProjects from "./OtherProjects";
import RequestProjects from "./RequestProjects";
import ProjectsGroupLeader from "./ProjectsGroupLeader";
import Tutorials from "./Tutorials";
import MyJobs from "./MyJobs";
import LoaderSpin from "../../../Components/Layouts/Loader/LoaderSpin";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/userReducer.js";

import UserProjectService from "../../../services/UserProjectService.js";
import ProjectService from "../../../services/ProjectService.js";
import ProductService from "../../../services/ProductService";
import StudentJobService from "../../../services/StudentJobService";
import MyPublications from "./MyPublications";
const { Title } = Typography;
const { TabPane } = Tabs;

export default function ProjectsUser() {
  const isMounted = useRef(false);
  const userSesion = useSelector(selectUser);
  const [userProjects, setuserProjects] = useState({
    projectsGroupsLeader: [],
    Member: [],
    Pending: [],
    ProjectsUserNotIn: [],
    Jobs: [],
    products: [],
  });
  const [tutorials, setTutorials] = useState([]);
  const [isLoading, setisLoading] = useState({
    status: "loading",
    message: "",
  });

  const getTutorias = useCallback((axiosToken) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { success, response: payload },
        } = await StudentJobService.getTutorials(axiosToken);
        if (success) {
          resolve(payload);
        } else {
          reject({
            status: "error",
            message: "No se pudo obtener la lista de tutorias.",
          });
        }
      } catch (error) {
        reject({
          status: "error",
          message: "No se pudo obtener la lista de publicaciones.",
        });
      }
    });
  }, []);

  const getProductsByUserP = useCallback((userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { success, response: payload },
        } = await ProductService.getProductsByUserId(userId);
        if (success) {
          resolve({ products: payload });
        } else {
          resolve({ products: [] });
        }
      } catch (error) {
        reject({
          status: "error",
          message: "No se pudo obtener la lista de publicaciones.",
        });
      }
    });
  }, []);

  const getUserProject = useCallback((userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { success, response: payload, description },
        } = await UserProjectService.getProjectsByUserId(userId);
        if (success) {
          let response = payload.filter((e) => e.status === true);
          let MemberDistintc = [];
          response
            .filter((up) => up.acceptance === "Aceptado")
            .map((up) => {
              if (MemberDistintc.every((md) => md.projectId !== up.projectId)) {
                MemberDistintc.push(up);
              }
              return up;
            });
          let data = {
            Pending: response.filter((up) => up.acceptance === "Pendiente"),
            Member: MemberDistintc,
            Jobs: response.filter((up) => up.StudentJobs?.length > 0),
          };
          resolve(data);
        } else {
          reject({ status: "error", message: description });
        }
      } catch (e) {
        throw new Error({ status: "error", message: e.message });
      }
    });
  }, []);

  const getProjectsUserNotIn = useCallback((userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { success, response: payload, description },
        } = await ProjectService.getProjectsThatUserNotIn(userId);
        if (success) {
          let data = { ProjectsUserNotIn: payload };
          resolve(data);
        } else {
          reject({ status: "error", message: description });
        }
      } catch (e) {
        reject({ status: "error", message: e.message });
      }
    });
  }, []);

  const getProjectsGroupsLeader = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { success, response: payload, description },
        } = await ProjectService.getProjecstByOwnerGroup();
        if (success) {
          let data = { projectsGroupsLeader: payload };
          resolve(data);
        } else {
          reject({ status: "error", message: description });
        }
      } catch (e) {
        reject({ status: "error", message: e.message });
      }
    });
  }, []);
  const getData = useCallback(async () => {
    if (userSesion.id) {
      const promises = [
        getUserProject(userSesion.id),
        getProjectsGroupsLeader(),
        getProjectsUserNotIn(userSesion.id),
        getProductsByUserP(userSesion.id),
        getTutorias(),
      ];
      try {
        let isLoadingStatus = { status: "success", message: "" };
        let data = null;
        let results = await Promise.allSettled(promises);
        results.forEach((result, index) => {
          console.log(result);
          if (result.status === "rejected") {
            isLoadingStatus = result?.reason || {
              status: "error",
              message: "Algo salio mal",
            };
          }
          if (index === 4 && isMounted.current === true) {
            setTutorials(result.value);
          } else {
            data = { ...data, ...result.value };
          }
        });
        if(isMounted.current === true){
          console.log('Montado alter');
          setuserProjects({ ...data });
          setisLoading(isLoadingStatus);
        }
      } catch (error) {
        
      }
    }
  }, [
    getUserProject,
    getProjectsGroupsLeader,
    getProjectsUserNotIn,
    getProductsByUserP,
    getTutorias,
    userSesion.id
  ]);

  useEffect(() => {
    isMounted.current = true;
    //const axiosToken = axios.CancelToken.source();
    getData();
    return () => {
      //axiosToken.cancel();
      isMounted.current=false;
    }
  }, [getData]);


  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }
  return (
    <>
      <Divider>
        <Title level={4}>Proyectos</Title>
      </Divider>
      <Row justify="center">
        <Col span={22}>
          <Tabs defaultActiveKey="1" centered>
            {userSesion.rolName !== "Estudiante" &&
            (userProjects?.projectsGroupsLeader?.length > 0 ||
              userSesion.leaderGroup) ? (
              <TabPane
                tab={
                  <span>
                    <BookOutlined /> Proyectos/Grupos
                  </span>
                }
                key="1"
              >
                <ProjectsGroupLeader
                  list={userProjects?.projectsGroupsLeader}
                  getProjectsGroupsLeader={getProjectsGroupsLeader}
                  setuserProjects={setuserProjects}
                />
              </TabPane>
            ) : null}
            <TabPane
              tab={
                <span>
                  <BookOutlined /> Mis Proyectos
                </span>
              }
              key="2"
            >
              <MyProjects list={userProjects?.Member} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileSearchOutlined />Mis Solicitudes
                </span>
              }
              key="3"
            >
              <RequestProjects list={userProjects?.Pending} getData={getData} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ClusterOutlined />
                  Otros Proyectos
                </span>
              }
              key="4"
            >
              <OtherProjects list={userProjects?.ProjectsUserNotIn} />
            </TabPane>
            {userProjects?.Jobs?.length > 0 ? (
              <TabPane
                tab={
                  <span>
                    <AuditOutlined />
                    Mis trabajos
                  </span>
                }
                key="5"
              >
                <MyJobs list={userProjects?.Jobs} getData={getData} />
              </TabPane>
            ) : null}

            <TabPane
              tab={
                <span>
                  <AuditOutlined />
                  Mis Publicaciones
                </span>
              }
              key="6"
            >
              <MyPublications
                list={userProjects?.products}
                getProductsByUserP={getProductsByUserP}
                setuserProjects={setuserProjects}
                userSesion={userSesion}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <AuditOutlined />
                  Mis Tutorias
                </span>
              }
              key="7"
            >
              <Tutorials list={tutorials} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
}
