import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Row,
  Col,
  Divider,
  Typography,
  message,
  Card,
  Empty,
  Avatar,
} from "antd";
import LoaderSpin from "../../Layouts/Loader/LoaderSpin";
import ProjectStudentJobs from "./ProjectStudentJobs";
import ProjectRequest from "./ProjectRequest";
import ProjectActivity from "./ProjectActivity";
import ProjectProducts from "./ProjectProducts";
import ProjectService from "../../../services/ProjectService.js";
import UserProjectService from "../../../services/UserProjectService";
import ActivityService from "../../../services/ActivityService";
import ProductService from "../../../services/ProductService";
import DiffusionProductService from "../../../services/DiffusionProductService";
import { useParams, useHistory } from "react-router";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/userReducer.js";
import { UserOutlined } from "@ant-design/icons";
import {
  ProjectContext,
  ActivityContext,
  ProductContext,
  UserProjectContext,
  DiffusionContext,
} from "./Contexts/ContextProjectUsers";
import DiffusionProducts from "./DiffusionProducts";
const { Title, Text } = Typography;
/*
userSesion -> es la cuenta activa global en el sistema
currentUser -> es la informacion de UserSesion pero con mas detalles sobre el proyecto
y su relacion con el.
*/
export default function ProjectViewUser() {
  const history = useHistory();
  const params = useParams();
  let projectId = params.id || 0;
  const [currentUser, setCurrentUser] = useState({
    User: null,
    rolName: "",
    permission: true,
    isMember: false,
    requesting: false,
    userProjectId: 0,
  });
  const [isOwner, setIsOwner] = useState(false);
  const [userProjects, setUserProjects] = useState({
    all: [],
    members: [],
    requests: [],
    rejecteds: [],
    students: [],
    researchers: [],
  });
  const [activities, setActivities] = useState({
    userActivities: [],
    otherActivities: [],
  });
  const [products, setProducts] = useState([]);
  const [diffusionProducts, setDiffusionProducts] = useState([]);
  //const [project, setProject] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [isProjectActive, setIsProjectActive] = useState(true);
  const globalUser = useSelector(selectUser);
  const { current: userSesion } = useRef(globalUser);
  const [isLoading, setIsLoading] = useState({
    status: "loading",
    message: "",
  });
  useEffect(() => {
    if (globalUser) {
      console.log("globaluser", globalUser);
    }
  }, [globalUser]);

  const getUserProjects = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { response = null, success = false, description = "" },
        } = await UserProjectService.getUserProjectByProjectId(projectId);
        if (success) {
          const userProjects = response;
          //console.log("userProject", data);
          let indexCurrentUser = 0;
          let isMember = false;
          const members = userProjects?.filter((userProject, index) => {
            if (userSesion?.id === userProject?.User?.id) {
              indexCurrentUser = index;
              isMember = true;
            }
            if (userProject?.acceptance === "Aceptado") {
              return true;
            } else {
              return false;
            }
          });
          const requests = userProjects?.filter(
            (userProject) =>
              userProject?.acceptance === "Pendiente" ||
              userProject?.StudentJobs.filter(
                (sj) =>
                  (sj.acceptance === "Pendiente" ||
                    sj.acceptance === "Repropuesto") &&
                  sj.status === true
              ).length > 0
          );
          const rejecteds = userProjects?.filter(
            (userProject) => userProject?.acceptance === "Rechazado"
          );
          const students = userProjects?.filter(
            (userProject) =>
              userProject?.acceptance === "Aceptado" &&
              userProject?.SystemRol.name === "Estudiante"
          );
          const researchers = userProjects?.filter(
            (userProject) =>
              userProject?.acceptance === "Aceptado" &&
              (userProject?.SystemRol.name === "CICEI" ||
                userProject?.SystemRol.name === "Asociado" ||
                userProject?.SystemRol.name === "Consultor")
          );
          let userObj = {
            User: null,
            rolName: "",
            permission: true,
            isMember: false,
            requesting: false,
            userProjectId: 0,
          };

          if (isMember) {
            let userProjectInArray = userProjects[indexCurrentUser];
            //console.log("userRejectd", userProjectInArray);
            let currentUserinArray = userProjectInArray?.User;
            userObj.User = {
              id: currentUserinArray.id,
              firstName: currentUserinArray.firstName,
              lastName: currentUserinArray.lastName,
              rolName: userProjectInArray.SystemRol?.name,
              systemRolId: userProjectInArray.SystemRol?.id,
            };
            userObj.rolName = userProjectInArray?.SystemRol?.name || "";
            userObj.isMember =
              userProjectInArray?.acceptance === "Aceptado" ? true : false;
            userObj.requesting =
              userProjectInArray?.acceptance === "Pendiente" ||
              userProjectInArray?.StudentJobs?.some(
                (sj) =>
                  sj.acceptance === "Pendiente" ||
                  sj.acceptance === "Repropuesto" ||
                  sj.acceptance === "Rechazado"
              );
            userObj.userProjectId = userProjectInArray.id;
            userObj.permission =
              userProjectInArray?.acceptance === "Rechazado" ? false : true;

            //console.log("indexUser", userObj);
          } else {
            userObj.User = userSesion;
            userObj.rolName = userSesion.rolName || "";
            userObj.isMember = false;
            userObj.requesting = false;
            userObj.userProjectId = 0;
          }

          setCurrentUser(userObj);
          setUserProjects({
            all: userProjects,
            members,
            requests,
            rejecteds,
            students,
            researchers,
          });
          resolve(true);
        } else {
          message.warn({
            content: "Error. " + description,
            duration: 5,
            key: "getUserProjects",
          });
          reject(false);
        }
      } catch (error) {
        message.error({
          content: error.message,
          duration: 5,
          key: "getUserProjects",
        });
        reject(false);
      }
    });
  }, [projectId, userSesion]);

  const getActivities = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: {
            response: Activities = [],
            success = false,
            description = "",
          },
        } = await ActivityService.getActivityByProjectId(projectId);
        if (success) {
          let userActivities = Activities?.filter(
            (ua) => ua.User?.id === userSesion.id
          );
          let otherActivities = Activities?.filter(
            (ua) => ua.User?.id !== userSesion.id
          );
          setActivities({ userActivities, otherActivities });
          resolve(true);
        } else {
          message.warn({
            content: "Error. " + description,
            duration: 5,
            key: "getActivities",
          });
          reject(false);
        }
      } catch (error) {
        message.error({
          content: error.message,
          duration: 5,
          key: "getActivities",
        });
        reject(false);
      }
    });
  }, [projectId, userSesion.id]);

  const getProductsByProject = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { response = null, success = false, description = "" },
        } = await ProductService.getProductsByProjectId(projectId);
        if (success) {
          setProducts(response);
          resolve(true);
        } else {
          message.error({
            content: "Error. " + description,
            key: "getP",
            duration: 5,
          });
          reject(false);
        }
      } catch (error) {
        message.error({ content: error.message, key: "getP", duration: 5 });
        reject(false);
      }
    });
  }, [projectId]);
  const [repositorySize, setRepositorySize] = useState({ maxSize: 0, size: 0 });
  const getProject = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: {
            response: ProjectData = null,
            success = false,
            description = "",
          },
        } = await ProjectService.getProjectByIdForView(projectId);
        if (success) {
          let isUserOwner = ProjectData?.LineProjects?.some(
            (lp) => lp?.Line?.Group?.userId === userSesion.id
          );
          let LinesInstitutional = ProjectData?.LineProjects?.filter(
            (lp) => lp.Line?.isInstitutional
          ).map((lp) => lp.Line);
          setIsOwner(isUserOwner);
          setIsProjectActive(ProjectData?.state);
          let myMaxSize = parseFloat(ProjectData?.maxSize);
          let mySize = parseFloat(ProjectData?.size);
          setRepositorySize({ maxSize: myMaxSize, size: mySize });
          setProjectData({
            ...ProjectData,
            LinesInstitutional,
          });
          resolve(true);
        } else {
          message.warn({
            content: "Error. " + description,
            key: "getProject",
            duration: 5,
          });
          reject(false);
        }
      } catch (error) {
        message.error({
          content: error.message,
          duration: 5,
          key: "getProject",
        });
        reject(false);
      }
    });
  }, [projectId, userSesion.id]);

  const getDiffusionProducts = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { response = null, success = false, description = "" },
        } = await DiffusionProductService.getDiffusionProduct(projectId);
        if (success) {
          //console.log("response", response);
          setDiffusionProducts(response);
          resolve(true);
        } else {
          message.warn({
            content: "Error. " + description,
            key: "getDiffusions",
            duration: 5,
          });
          reject(false);
        }
      } catch (error) {
        message.error({
          content: error.message,
          duration: 5,
          key: "getDiffusions",
        });
        reject(false);
      }
    });
  }, [projectId]);

  /*  const getData = useCallback(() => {
    let promises = [
      getProject(),
      getUserProjects(),
      getActivities(),
      getProductsByProject(),
    ];
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
              setProject({ ...result.value });
              break;
            case 1:
              setUserProjects(result.value);
              break;
            case 2:
              setActivities(result.value);
              break;
            case 3:
              setProducts(result.value);
              break;
            default:
              break;
          }
        }
      });
      setIsLoading(statusRequests);
    });
  }, [getProject, getUserProjects, getActivities, getProductsByProject]); */
  /*   const [counter, setCounter] = useState(0);
   */
  const getData = useCallback(async () => {
    let promises = [
      getProject(),
      getUserProjects(),
      getActivities(),
      getProductsByProject(),
      getDiffusionProducts(),
    ];
    try {
      let responses = await Promise.allSettled(promises);
      if (responses.some((result) => result.status === "rejected")) {
        setIsLoading({
          status: "error",
          message: "Probablemente error de red",
        });
      } else {
        setIsLoading({
          status: "success",
          message: "",
        });
      }
    } catch (error) {
      message.error({
        content: "Algo salio mal al cargar la información del proyecto.",
        duration: 5,
        key: "payloads",
      });
    }
  }, [
    getProject,
    getUserProjects,
    getActivities,
    getProductsByProject,
    getDiffusionProducts,
  ]);

  useEffect(() => {
    console.log("rerendering");
    if (projectId) {
      console.log("Doble");
      getData();
    }
  }, [projectId, getData]);

  const valueProjectContext = useMemo(() => {
    return {
      currentUser,
      projectData,
      repositorySize,
      setRepositorySize,
    };
  }, [currentUser, projectData, repositorySize, setRepositorySize]);
  const valueUserProjectContext = useMemo(() => {
    return { getUserProjects, userProjects };
  }, [getUserProjects, userProjects]);
  const valueActivityContext = useMemo(() => {
    return {
      getActivities,
      activities,
    };
  }, [getActivities, activities]);
  const valueProductContext = useMemo(() => {
    return { getProductsByProject, products };
  }, [getProductsByProject, products]);

  const valueDiffusionContext = useMemo(() => {
    return {
      getDiffusionProducts,
      diffusionProducts,
    };
  }, [getDiffusionProducts, diffusionProducts]);
  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }
  return currentUser?.permission ? (
    <>
      <Row align="center" style={{ marginTop: "25px" }}>
        <Col
          xs={{ span: 20 }}
          sm={{ span: 16 }}
          md={{ span: 16 }}
          lg={{ span: 16 }}
          xl={{ span: 16 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Title>{projectData?.title}</Title>
        </Col>
      </Row>
      <Divider>
        <Title level={4}>Descripción</Title>
      </Divider>
      <Row align="center" style={{ marginTop: "25px" }}>
        <Col span={20} style={{ display: "flex", justifyContent: "center" }}>
          <Text italic>{projectData?.description}</Text>
        </Col>
      </Row>
      {projectData?.User ? (
        <>
          <Divider>
            <Title level={4}>Líder</Title>
          </Divider>
          <Row align="center" style={{ marginTop: "25px" }} gutter={[24, 32]}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 7 }}
              xl={{ span: 7 }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                style={{ width: "300px" }}
                onClick={() => {
                  history.push(`/profile/${projectData?.User?.id}`);
                }}
              >
                <Card.Meta
                  avatar={
                    projectData?.User?.picture ? (
                      <Avatar
                        src={`https://drive.google.com/uc?export=download&id=${projectData?.User?.picture}`}
                      />
                    ) : (
                      <UserOutlined />
                    )

                    //
                  }
                  title={`${projectData?.User?.firstName} ${projectData?.User?.lastName}`}
                  description={projectData?.User?.grade}
                />
              </Card>
            </Col>
          </Row>
        </>
      ) : null}
      <ProjectContext.Provider value={valueProjectContext}>
        <UserProjectContext.Provider value={valueUserProjectContext}>
          <ActivityContext.Provider value={valueActivityContext}>
            <ProductContext.Provider value={valueProductContext}>
              <DiffusionContext.Provider value={valueDiffusionContext}>
                <Divider />
                <ProjectRequest
                  isOwner={isOwner}
                  isProjectActive={isProjectActive}
                />
                <Divider>
                  <Title level={4}>Trabajos</Title>
                </Divider>
                <ProjectStudentJobs isProjectActive={isProjectActive} />
                <Divider>
                  <Title level={4}>Actividades del Proyecto</Title>
                </Divider>
                <ProjectActivity
                  projectId={projectId}
                  isProjectActive={isProjectActive}
                />
                <Divider>
                  <Title level={4}>Publicaciones del Proyecto</Title>
                </Divider>
                <ProjectProducts isProjectActive={isProjectActive} />
                <Divider>
                  <Title level={4}>
                    Publicaciones de Difusión del Proyecto
                  </Title>
                </Divider>
                <DiffusionProducts isProjectActive={isProjectActive} />
              </DiffusionContext.Provider>
            </ProductContext.Provider>
          </ActivityContext.Provider>
        </UserProjectContext.Provider>
      </ProjectContext.Provider>
      <Divider>
        <Title level={4}>Integrantes</Title>
      </Divider>
      <Row align="center" style={{ marginTop: "25px", marginBottom: "25px" }}>
        {userProjects?.members?.map((up) => (
          <Col
            key={up.id}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 7 }}
            xl={{ span: 7 }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
            }}
          >
            <Card style={{ width: "300px", borderRadius: "5px" }}>
              <p
                onClick={() => {
                  history.push(`/profile/${up.userId}`);
                }}
              >
                <b>{`${up.User.firstName} ${up.User.lastName}`}</b>
              </p>
              <p>
                {up.SystemRol?.name === "Estudiante"
                  ? "Estudiante"
                  : "Investigador"}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
      <Divider>
        <Title level={4}>Instituciones</Title>
      </Divider>
      <Row align="center" style={{ marginTop: "25px", marginBottom: "25px" }}>
        {projectData?.InstitutionProjects?.map((ip) => (
          <Col
            key={ip.id}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 7 }}
            xl={{ span: 7 }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
            }}
          >
            <Card style={{ width: "300px", borderRadius: "5px" }}>
              <p>
                <b>{`${ip.Institution?.name}`}</b>
              </p>
              <p>{ip.Institution?.country}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  ) : (
    <Row align="center">
      <Col span={23} style={{ display: "flex", justifyContent: "center" }}>
        <Empty
          description={
            "Lo sentimos no puedes visualizar este proyecto, comunícate con el jefe de proyecto para saber que está sucediendo."
          }
        />
      </Col>
    </Row>
  );
}
