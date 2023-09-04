import { useState, useEffect, useCallback, useRef } from "react";
import { Row, Col, Tabs, message, Select } from "antd";
import ProductService from "../../services/ProductService.js";
import ProjectService from "../../services/ProjectService.js";
import ProjectsReport from "./ProjectsReport.jsx";
import ReportStudent from "./ReportStudent";
import Production from "./Production";
import LoaderSpin from "../Layouts/Loader/LoaderSpin";
import { useSelector } from "react-redux";
import { selectUser } from "./../../Auth/userReducer";
import ResearcherProperty from "./ResearcherProperty/ResearcherProperty";

import {
  TeamOutlined,
  MailOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
//const { Title } = Typography;

export default function DataCenter() {
  const globalUserAuthenticated = useSelector(selectUser);
  const { current: globalUser } = useRef(globalUserAuthenticated);
  const [products, setProducts] = useState({
    currentProducts: null,
    groupProducts: null,
    ownProducts: null,
  });
  const [projects, setProjects] = useState({
    currentProjects: [],
    groupProjects: [],
    ownProjects: [],
  });
  const [isLoading, setIsLoading] = useState({
    status: "loading",
    message: "",
  });

  const [updateDataTable, setUpdateDataTable] = useState(true);

  const filterProducts = useCallback((products) => {
    let articles = [];
    let books = [];
    let reports = [];
    products.forEach((product) => {
      if (product?.TypeArticle) {
        articles.push(product);
      } else if (product?.TypeBook) {
        books.push(product);
      } else if (
        product?.TypeProduct?.name === "Informe técnico de investigación"
      ) {
        reports.push(product);
      }
    });
    return {
      articles,
      books,
      reports,
    };
  }, []);

  const getProducts = useCallback(() => {
    return new Promise((resolve, reject) => {
      ProductService.getProductsDataCenter()
        .then((res) => {
          if (res.data?.success) {
            let { groupProducts = [], ownProducts = [] } = res.data.response;

            let groupProductsState = filterProducts(groupProducts);
            console.log("productsFilterd", groupProductsState);
            let ownProductsState = filterProducts(ownProducts);
            let currentProductsState = [];
            switch (globalUser.rolName) {
              case "Administrador":
                currentProductsState = groupProductsState;
                break;
              case "Investigador":
                currentProductsState = ownProductsState;
                break;
              case "Asociado":
                currentProductsState = ownProductsState;
                break;

              default:
                break;
            }

            let productsState = {
              currentProducts: currentProductsState || null,
              groupProducts: groupProductsState || null,
              ownProducts: ownProductsState || null,
            };
            resolve(productsState);
            /* let response = {
              articles: data.filter((a) => a.TypeArticle),
              books: data.filter((b) => b.TypeBook),
              reports: data.filter(
                (r) =>
                  r.TypeProduct?.name === "Informe técnico de investigación"
              ),
            }; */
          } else {
            resolve({
              currentProducts: null,
              groupProducts: null,
              ownProducts: null,
            });
          }
        })
        .catch((e) => {
          //console.log("error", e.message);
          reject({ status: "error", message: e.message });
        });
    });
  }, []);

  const getProjects = useCallback(() => {
    console.log("projectsData");
    return new Promise((resolve, reject) => {
      ProjectService.getProjectDataCenter()
        .then((res) => {
          if (res.data?.success) {
            let { groupProjects = [], ownProjects = [] } = res?.data?.response;

            let currentProjectsState = [];

            switch (globalUser.rolName) {
              case "Administrador":
                currentProjectsState = groupProjects;
                break;
              case "CICEI":
                currentProjectsState = ownProjects;
                break;
              case "Asociado":
                currentProjectsState = ownProjects;
                break;

              default:
                break;
            }
            resolve({
              currentProjects: currentProjectsState,
              groupProjects: groupProjects,
              ownProjects: ownProjects,
            });
          } else {
            resolve({
              currentProjects: [],
              groupProjects: [],
              ownProjects: [],
            });
          }
        })
        .catch((e) => {
          //console.log("error", e.message);
          reject({ status: "error", message: e.message });
        });
    });
  }, []);

  const getData = useCallback(() => {
    //console.log("callData");
    let promises = [getProducts(), getProjects()];
    Promise.allSettled(promises).then((results) => {
      let statusRequests = { status: "success", message: "" };
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          statusRequests = result?.reason || {
            status: "error",
            message: "Desconocido",
          };
        } else {
          console.log("value", result.value);
          switch (index) {
            case 0:
              setProducts(result.value);
              break;
            case 1:
              setProjects(result.value);
              break;
            default:
              break;
          }
        }
      });
      setIsLoading(statusRequests);
    });
  }, [getProducts, getProjects]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    switch (value) {
      case "Group":
        setProducts({ ...products, currentProducts: products.groupProducts });
        setProjects({ ...projects, currentProjects: projects.groupProjects });
        setUpdateDataTable(!updateDataTable);
        break;
      case "Researcher":
        setProducts({ ...products, currentProducts: products.ownProducts });
        setProjects({ ...projects, currentProjects: projects.ownProjects });
        setUpdateDataTable(!updateDataTable);
        break;
      default:
        setProducts({ ...products, currentProducts: products.ownProducts });
        setProjects({ ...projects, currentProjects: projects.ownProjects });
        setUpdateDataTable(!updateDataTable);
        break;
    }
  };

  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }

  return (
    <>
      <Row justify="center">
        {globalUser.leaderGroup === true ? (
          <Col
            span={23}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h1>Seleccione el tipo de proyectos desea ver:</h1>

            <Select
              defaultValue="Researcher"
              style={{ width: 300 }}
              onChange={handleChange}
            >
              <Select.Option value="Group">Proyectos de mi Grupo</Select.Option>
              <Select.Option value="Researcher">
                Proyectos donde soy encargado
              </Select.Option>
            </Select>
          </Col>
        ) : null}
        <Col
          span={23}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tabs
            defaultActiveKey="1"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            destroyInactiveTabPane={true}
          >
            <TabPane
              tab={
                <span>
                  <TeamOutlined />
                  Proyectos SNGPI
                </span>
              }
              key="1"
            >
              {projects?.currentProjects.length > 0 && (
                <ProjectsReport
                  projects={projects?.currentProjects}
                  toogleUpdate={updateDataTable}
                />
              )}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <MailOutlined />
                  Producción
                </span>
              }
              key="2"
            >
              <Production
                products={products?.currentProducts}
                toogleUpdate={updateDataTable}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SolutionOutlined />
                  Informe
                </span>
              }
              key="3"
            >
              {projects?.currentProjects.length > 0 && (
                <ReportStudent
                  projects={projects?.currentProjects}
                  toogleUpdate={updateDataTable}
                />
              )}
            </TabPane>
            {globalUser?.rolName !== "Administrador" && (
              <TabPane
                tab={
                  <span>
                    <SolutionOutlined />
                    Mis Datos
                  </span>
                }
                key="4"
              >
                <ResearcherProperty />
              </TabPane>
            )}
          </Tabs>
        </Col>
      </Row>
    </>
  );
}
