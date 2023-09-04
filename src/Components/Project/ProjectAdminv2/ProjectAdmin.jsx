import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Typography,
  Row,
  Col,
  Divider,
  message,
  Tag,
  Button,
  Modal,
} from "antd";
import ProjectUser from "./ProjectUser/ProjectUser";
import ProjectLine from "./ProjectLine/ProjectLines";
import ProjectInsitutions from "./ProjectInstitution/ProjectInsitutions";
import ProjectActivity from "./ProjectActivity/ProjectActivity";
import ProductsDiffusion from "./ProjectProductDiffusion/DiffusionProducts";
import LoaderSpin from "../../Layouts/Loader/LoaderSpin";
import ProjectModalForm from "./ProjectModalForm";
import ProjectProducts from "./ProjectProduct/ProjectProducts";
import ActivityService from "../../../services/ActivityService.js";
import ProjectService from "../../../services/ProjectService.js";
import UserProjectService from "../../../services/UserProjectService";
import ProductService from "../../../services/ProductService";
import DiffusionProductService from "../../../services/DiffusionProductService";
import FileService from "../../../services/FileService";
import { selectUser } from "../../../Auth/userReducer.js";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  ProjectContext,
  UserContext,
  ActivityContext,
  ProductContext,
  LineContext,
  DiffusionProductContext,
} from "./Contexts/AdminProjectContexts";

const { Title, Text } = Typography;

/*
UserSesion is the user contected currently
ProjectData = {
  UserMain,
  Line,
  UsersForActivities,
  LinesInstitutional
}
*/

export default function ProjectAdmin() {
  const params = useParams();
  //const projectId = params.id;
  const { current: projectId } = useRef(params.id);
  const userSesion = useSelector(selectUser);
  const [progress, setProgress] = useState(0);
  const [isAuth, setisAuth] = useState(true);
  const [isModalEditVisible, setisModalEditVisible] = useState(false);
  const [isLoading, setIsLoading] = useState({
    status: "loading",
    message: "",
  });
  const [shutDownModal, setShutDownModal] = useState(false);
  const [repositorySize, setRepositorySize] = useState({ maxSize: 0, size: 0 });
  //const [projectData, setprojectData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [userProjects, setUserProjects] = useState({});
  const [products, setProducts] = useState({
    articles: [],
    books: [],
    reports: [],
  });
  const [diffusionProducts, setDiffusionProducts] = useState({
    communicationalEdu: [],
    media: { radio: [], tv: [], prensa: [], revista: [] },
    socialNetworks: [],
    talks: [],
  });
  const getProducts = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { response = [], success = false, description = "" },
        } = await ProductService.getProductsByProjectId(projectId);
        if (success) {
          if (response?.length >= 0) {
            let data = response;
            setProducts({
              articles: data.filter(
                (product) => product.TypeProduct?.name === "Artículo científico"
              ),
              books: data.filter(
                (product) => product.TypeProduct?.name === "Libro"
              ),
              reports: data.filter(
                (product) =>
                  product.TypeProduct?.name ===
                  "Informe técnico de investigación"
              ),
            });
            resolve(true);
          } else {
            setProducts({
              articles: [],
              books: [],
              reports: [],
            });
            reject(false);
          }
        } else {
          message.error({
            content: description,
            duration: 5,
            key: "getProducts",
          });
          reject(false);
        }
      } catch (error) {
        message.error({
          content: error.message,
          duration: 5,
          key: "getProducts",
        });
        reject(false);
      }
    });
  }, [projectId]);
  const getDiffusionProducts = useCallback(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { response = [], success = "false", description = "" },
        } = await DiffusionProductService.getDiffusionProduct(projectId);
        if (success) {
          let listProducts = {
            communicationalEdu: [],
            media: { radio: [], tv: [], prensa: [], revista: [] },
            socialNetworks: [],
            talks: [],
          };
          response.forEach((product) => {
            if (
              product?.DiffusionCategory?.firstParentCategory?.name ===
                "Edu_comunicacional" ||
              product?.DiffusionCategory?.firstParentCategory
                ?.secondParentCategory?.name === "Edu_comunicacional" ||
              product?.DiffusionCategory?.firstParentCategory
                ?.secondParentCategory?.thirdParentCategory?.name ===
                "Edu_comunicacional"
            ) {
              listProducts.communicationalEdu.push(product);
            } else if (
              product?.DiffusionCategory?.firstParentCategory?.name ===
                "Redes Sociales" ||
              product?.DiffusionCategory?.firstParentCategory
                ?.secondParentCategory?.name === "Redes Sociales" ||
              product?.DiffusionCategory?.firstParentCategory
                ?.secondParentCategory?.thirdParentCategory?.name ===
                "Redes Sociales"
            ) {
              listProducts.socialNetworks.push(product);
            } else if (
              product?.DiffusionCategory?.firstParentCategory?.name ===
                "Medios de Comunicación" ||
              product?.DiffusionCategory?.firstParentCategory
                ?.secondParentCategory?.name === "Medios de Comunicación" ||
              product?.DiffusionCategory?.firstParentCategory
                ?.secondParentCategory?.thirdParentCategory?.name ===
                "Medios de Comunicación"
            ) {
              switch (product?.DiffusionCategory?.firstParentCategory?.name) {
                case "Revista":
                  listProducts?.media?.revista?.push(product);
                  break;
                case "Prensa":
                  listProducts?.media?.prensa?.push(product);
                  break;
                case "Radio":
                  listProducts?.media?.radio?.push(product);
                  break;
                case "TV":
                  listProducts?.media?.tv?.push(product);
                  break;
                default:
                  break;
              }
            } else if (
              product?.DiffusionCategory?.firstParentCategory?.name ===
                "Charlas" ||
              product?.DiffusionCategory?.firstParentCategory
                ?.secondParentCategory?.name === "Charlas" ||
              product?.DiffusionCategory?.firstParentCategory
                ?.secondParentCategory?.thirdParentCategory?.name === "Charlas"
            ) {
              listProducts.talks.push(product);
            } else {
            }
          });
          //console.log("lista de prodyctos", listProducts);
          setDiffusionProducts(listProducts);
          resolve(true);
          //resolve(listProducts);
        } else {
          message.error({
            content: "Error. " + description,
            duration: 5,
            key: "getDiffusionProducts",
          });
          reject(false);
        }
      } catch (error) {
        message.error({
          content: error.message,
          duration: 5,
          key: "getDiffusionProducts",
        });
        reject(false);
      }
    });
  }, [projectId]);

  const getUserProjects = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { response = [], success = false, description = "" },
        } = await UserProjectService.getUserProjectByProjectId(projectId);
        if (success) {
          const data = response;
          const members = data.filter((e) => e.acceptance === "Aceptado");
          const requests = data.filter(
            (e) =>
              e.acceptance === "Pendiente" ||
              e.StudentJobs.filter(
                (sj) =>
                  (sj.acceptance === "Pendiente" ||
                    sj.acceptance === "Repropuesto") &&
                  sj.status === true
              ).length > 0
          );
          const rejecteds = data.filter((e) => e.acceptance === "Rechazado");
          const students = data.filter(
            (e) =>
              (e.acceptance === "Aceptado" || e.acceptance === "Rechazado") &&
              (e.StudentJobs.length > 0 || e.SystemRol.name === "Estudiante")
          );
          const researchers = data.filter(
            (e) =>
              e.acceptance === "Aceptado" &&
              (e.SystemRol.name === "CICEI" ||
                e.SystemRol.name === "Asociado" ||
                e.SystemRol.name === "Consultor")
          );
          setUserProjects({
            members,
            requests,
            rejecteds,
            students,
            researchers,
          });
          resolve(true);
        } else {
          message.error({
            content: "Error. " + description,
            duration: 5,
            key: "getUserProjects",
          });
          reject(false);
        }
      } catch (error) {
        reject(false);
        message.error({
          content: error.message,
          duration: 5,
          key: "getUserProjects",
        });
      }
    });
  }, [projectId]);

  const getProject = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { response = null, success = false, description = "" },
        } = await ProjectService.getProjectByIdForView(projectId);
        if (success) {
          let projectData = response;
          projectData = {
            ...projectData,
            UserMain:
              projectData.UserProjects?.find((up) => up.isMain === true) ||
              null,
            LineMain:
              projectData.LineProjects?.find((lp) => lp.isMain === true) ||
              null,
            UsersForActivities: projectData.UserProjects?.filter(
              (up) => up.status === true && up.acceptance === "Aceptado"
            ),
            LinesInstitutional:
              projectData.LineProjects?.filter(
                (lp) => lp.Line?.isInstitutional
              ).map((lp) => lp.Line) || [],
          };
          let myMaxSize = parseFloat(projectData.maxSize);
          let mySize = parseFloat(projectData.size);
          setRepositorySize({ maxSize: myMaxSize, size: mySize });
          projectData = {
            ...projectData,
            GroupLeaderId: projectData.LineMain?.Line?.Group?.userId || 0,
          };

          if (
            userSesion.rolName !== "Administrador" &&
            projectData.UserMain?.userId !== userSesion.id &&
            projectData.LineMain?.Line?.Group?.userId !== userSesion.id
          ) {
            setisAuth(false);
          } else {
            setisAuth(true);
          }
          setProjectData(projectData);
          resolve(true);
        } else {
          message.error({
            content: "Error. " + description,
            duration: 5,
            key: "getProject",
          });
        }
      } catch (error) {
        message.error({
          content: error.message,
          duration: 5,
          key: "getProject",
        });
      }
    });
  }, [userSesion, projectId]);

  const getActivities = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          data: { response = [], description = "", success = false },
        } = await ActivityService.getActivityByProjectId(projectId);
        if (success) {
          let totalActivities = response.filter(
            (activity) => activity.status === true
          );
          let activitiesFinished = totalActivities.filter(
            (activity) => activity.Progress?.stateProgress === "Terminado"
          );
          activitiesFinished =
            (activitiesFinished.length * 100) / totalActivities.length;
          setProgress(activitiesFinished);
          setActivities(response);
          //console.log("FetchACtividades", res.data?.response);
          resolve(true);
        } else {
          message.error({
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
  }, [projectId]);

  const getData = useCallback(async () => {
    let promises = [
      getProject(),
      getActivities(),
      getUserProjects(),
      getProducts(),
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
    getProducts,
    getDiffusionProducts,
  ]);

  useEffect(() => {
    if (projectId) {
      //getProject(projectId);
      getData();
      //getProject(projectId);
      //getActivities(projectId);
    }
  }, [projectId, getData]);

  const refreshProjectData = useCallback(() => {
    getProject(projectId);
    getActivities(projectId);
    //getProduct
  }, [getProject, projectId, getActivities]);

  const valueUserContext = useMemo(() => {
    return {
      userProjects,
      setUserProjects,
      getUserProjects,
    };
  }, [userProjects, setUserProjects, getUserProjects]);

  const valueActivityContext = useMemo(() => {
    return { getActivities, setActivities, activities };
  }, [getActivities, setActivities, activities]);
  const valueProductContext = useMemo(() => {
    return {
      products,
      getProducts,
      setProducts,
    };
  }, [getProducts, setProducts, products]);
  const valueDiffusionProductContext = useMemo(() => {
    return { diffusionProducts, setDiffusionProducts, getDiffusionProducts };
  }, [diffusionProducts, setDiffusionProducts, getDiffusionProducts]);
  const valueProjectContext = useMemo(() => {
    return {
      projectData,
      repositorySize,
      getProject,
      refreshProjectData,
      setRepositorySize,
      setProjectData,
      userSesion,
    };
  }, [
    projectData,
    repositorySize,
    getProject,
    refreshProjectData,
    setRepositorySize,
    setProjectData,
    userSesion,
  ]);
  if (!isAuth) {
    return (
      <LoaderSpin
        isLoading={{
          status: "error",
          message: "El proyecto no te pertenece para administrarlo.",
        }}
      />
    );
  }

  const handleOk = () => {
    getProject(projectId);
    setisModalEditVisible(false);
  };

  const handleCancel = () => {
    setisModalEditVisible(false);
  };

  const onOkShutDownModal = () => {
    let projectR = { id: projectData.id };
    ProjectService.changeState(projectR)
      .then((res) => {
        if (res.data?.success) {
          setProjectData({ ...projectData, state: res.data?.response?.state });
          setShutDownModal(false);
        } else {
          message.error(
            "No se pudo actualizar el proyecto. " + res.data?.description,
            5
          );
        }
      })
      .catch((e) => {
        message.error("Hubo un erorr. " + e.message, 5);
        console.log("error", e.message);
      });
  };

  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }

  const googleDriveFolder = () => {
    message.loading({ content: "Buscando Carpeta...", key: "update" });
    if (projectData?.folderId) {
      message.success({ content: "Abriendo...", key: "update", duration: 3 });
      window.open(
        `https://drive.google.com/drive/folders/${projectData?.folderId}`
      );
    } else {
      FileService.createFolderProject({ id: projectData?.id })
        .then((res) => {
          if (res.data?.success) {
            message.success({
              content: "Abriendo...",
              key: "update",
              duration: 3,
            });
            window.open(
              `https://drive.google.com/drive/folders/${res.data?.response?.fileID}`
            );
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
    }
  };

  return (
    <div>
      <Row justify="center">
        <Col>
          <Title>{projectData?.title || ""}</Title>
        </Col>
      </Row>
      <Divider>
        <Title level={4}>Descripción</Title>
      </Divider>
      <Row justify="center">
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Text italic style={{ display: "flex", justifyContent: "center" }}>
            {projectData?.description || ""}
          </Text>
          <br />
          <Text strong style={{ display: "flex", justifyContent: "center" }}>
            {"Líder: "}
            <Tag color="cyan">{`${projectData?.User?.firstName} ${projectData?.User?.lastName}`}</Tag>
          </Text>
          <Text strong style={{ display: "flex", justifyContent: "center" }}>
            {"Fecha inicio y final del Proyecto: "}
            <Tag color="cyan">
              {new Date(projectData?.startDate).toLocaleDateString("es")}
            </Tag>
            <span>- </span>
            <Tag color="cyan">
              {new Date(projectData?.endDate).toLocaleDateString("es")}
            </Tag>
          </Text>
          <Text strong style={{ display: "flex", justifyContent: "center" }}>
            {"Code: "}
            <Tag color="cyan">{projectData?.code}</Tag>
          </Text>
          <Text strong style={{ display: "flex", justifyContent: "center" }}>
            {"Progreso: "}
            <Tag color="cyan">{Math.round(progress) + "%"}</Tag>
          </Text>
          <Text strong style={{ display: "flex", justifyContent: "center" }}>
            {"Máximo espacio repositorio: "}
            <Tag color="cyan">{repositorySize.maxSize + "MB"}</Tag>
          </Text>
          <Text strong style={{ display: "flex", justifyContent: "center" }}>
            {"Espacio usado repositorio: "}
            <Tag color="cyan">{repositorySize.size + "MB"}</Tag>
          </Text>
        </Col>

        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          {projectData?.state ? (
            <Button
              type="primary"
              style={{ marginTop: "1em" }}
              onClick={() => {
                setisModalEditVisible(true);
              }}
            >
              Editar
            </Button>
          ) : null}
        </Col>
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5em",
          }}
        >
          <Button
            type="primary"
            ghost
            onClick={() => {
              googleDriveFolder();
            }}
          >
            Abrir Google drive
          </Button>
        </Col>
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          {projectData?.state ? (
            <Button
              type="primary"
              style={{ marginTop: "1em" }}
              onClick={() => {
                setShutDownModal(true);
              }}
            >
              Cerrar Proyecto
            </Button>
          ) : (
            <Button
              type="primary"
              style={{ marginTop: "1em" }}
              onClick={() => {
                setShutDownModal(true);
              }}
            >
              Abrir Proyecto
            </Button>
          )}
        </Col>
      </Row>
      <ProjectContext.Provider value={valueProjectContext}>
        <UserContext.Provider value={valueUserContext}>
          <ActivityContext.Provider value={valueActivityContext}>
            <ProductContext.Provider value={valueProductContext}>
              <DiffusionProductContext.Provider
                value={valueDiffusionProductContext}
              >
                <ProjectUser projectId={projectId} />
                <ProjectActivity projectId={projectId} />
                <ProjectProducts projectId={projectId} />
                <ProductsDiffusion />
                <ProjectLine
                  projectId={projectId}
                  projectState={projectData?.state}
                />
              </DiffusionProductContext.Provider>
            </ProductContext.Provider>
          </ActivityContext.Provider>
        </UserContext.Provider>
      </ProjectContext.Provider>

      <ProjectInsitutions projectId={projectId}/>

      {isModalEditVisible ? (
        <ProjectModalForm
          isModalVisible={isModalEditVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          id={projectData.id}
          title={projectData.title}
          description={projectData.description}
          startDate={projectData.startDate}
          endDate={projectData.endDate}
          ProjectService={ProjectService}
          userMainId={projectData.UserMain?.userId}
          groupLeaderId={projectData.LineMain?.Line?.Group?.userId}
          userSesion={userSesion}
        />
      ) : null}
      {shutDownModal ? (
        <Modal
          visible={shutDownModal}
          title={
            projectData?.state
              ? "¿Desea dar por terminado el Proyecto?"
              : "¿Desea volver a abrir el proyecto?"
          }
          onOk={() => {
            onOkShutDownModal();
          }}
          onCancel={() => {
            setShutDownModal(false);
          }}
          okText="Aceptar"
          cancelText="Cancelar"
        >
          {projectData?.state ? (
            <>
              <span>
                Si cierra el proyecto ya no podra hacer cambios y tampoco se
                podra unir otros estudiantes y investigadores.
              </span>
              <br />
              {Math.round(progress) < 100 ? (
                <span>
                  <strong>
                    ¡El proyecto no ha alcanzado el 100% de progreso!
                  </strong>
                </span>
              ) : null}
            </>
          ) : (
            <span>Si abre el proyecto se habilitaran todas las funciones.</span>
          )}
        </Modal>
      ) : null}
    </div>
  );
}
