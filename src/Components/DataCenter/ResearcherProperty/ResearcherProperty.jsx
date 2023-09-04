import { useEffect, useState, useCallback } from "react";
import {
  Table,
  Row,
  Col,
  Button,
  Typography,
  Input,
  Tooltip,
  DatePicker,
  Tabs,
  message,
} from "antd";
import Projects from "./Projects";
import Products from "./Products";
import DiffusionProducts from "./DiffusionProducts";
import Tutorials from "./Tutorials";
import LoaderSpin from "../../Layouts/Loader/LoaderSpin";
import {
  TeamOutlined,
  MailOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import DataCenterService from "../../../services/DataCenterSerice.js";
const { TabPane } = Tabs;

export default function ResearcherProperty() {
  const [researcherProperty, setResearcherProperty] = useState({
    Products: null,
    Projects: [],
    Tutorials: [],
    DiffusionProducts: {
      communicationalEdu: [],
      media: { radio: [], tv: [], prensa: [], revista: [] },
      socialNetworks: [],
      talks: [],
    },
  });
  const [isLoading, setisLoading] = useState({
    status: "success",
    message: "",
  });

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

  const diffusionFilter = useCallback((diffusionProducts) => {
    let listProducts = {
      communicationalEdu: [],
      media: { radio: [], tv: [], prensa: [], revista: [] },
      socialNetworks: [],
      talks: [],
    };
    diffusionProducts?.forEach((product) => {
      if (
        product?.DiffusionCategory?.firstParentCategory?.name ===
          "Edu_comunicacional" ||
        product?.DiffusionCategory?.firstParentCategory?.secondParentCategory
          ?.name === "Edu_comunicacional" ||
        product?.DiffusionCategory?.firstParentCategory?.secondParentCategory
          ?.thirdParentCategory?.name === "Edu_comunicacional"
      ) {
        listProducts.communicationalEdu.push(product);
      } else if (
        product?.DiffusionCategory?.firstParentCategory?.name ===
          "Redes Sociales" ||
        product?.DiffusionCategory?.firstParentCategory?.secondParentCategory
          ?.name === "Redes Sociales" ||
        product?.DiffusionCategory?.firstParentCategory?.secondParentCategory
          ?.thirdParentCategory?.name === "Redes Sociales"
      ) {
        listProducts.socialNetworks.push(product);
      } else if (
        product?.DiffusionCategory?.firstParentCategory?.name ===
          "Medios de Comunicación" ||
        product?.DiffusionCategory?.firstParentCategory?.secondParentCategory
          ?.name === "Medios de Comunicación" ||
        product?.DiffusionCategory?.firstParentCategory?.secondParentCategory
          ?.thirdParentCategory?.name === "Medios de Comunicación"
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
        product?.DiffusionCategory?.firstParentCategory?.name === "Charlas" ||
        product?.DiffusionCategory?.firstParentCategory?.secondParentCategory
          ?.name === "Charlas" ||
        product?.DiffusionCategory?.firstParentCategory?.secondParentCategory
          ?.thirdParentCategory?.name === "Charlas"
      ) {
        listProducts.talks.push(product);
      } else {
      }
    });
    return listProducts;
  }, []);

  const getData = useCallback(async () => {
    try {
      let {
        data: {
          response: {
            Products = [],
            Projects = [],
            Tutorials = [],
            DiffusionProducts = [],
          },
          success = true,
          description = "",
        },
      } = await DataCenterService.getResearcherProperty();
      if (success) {
        /* console.log("Products", Products);
        console.log("Filteredddd", filterProducts(Products)); */
        console.log("Diffusion", DiffusionProducts);
        let diffusionProducts = diffusionFilter(DiffusionProducts);
        console.log("Mydiffusion",diffusionProducts);
        setResearcherProperty({
          ...researcherProperty,
          Products: filterProducts(Products),
          Projects,
          Tutorials,
          DiffusionProducts: diffusionProducts
        });

        setisLoading({ status: "success", message: "" });
      } else {
        message.warning({
          content: description,
          duration: 5,
          key: "getDataResearcher",
        });
        setisLoading({ status: "error", message: description });
      }
    } catch (error) {
      message.error({
        content: error.message,
        duration: 5,
        key: "getDataResearcher",
      });
      setisLoading({ status: "error", message: error.message });
    }
  }, []);

  useEffect(() => {
    console.log("one time");
    getData();
  }, []);

  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }
  return (
    <Row justify="center">
      <Col
        span={24}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Tabs
          defaultActiveKey="1"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TabPane
            tab={
              <span>
                <TeamOutlined />
                Mis Proyectos
              </span>
            }
            key="1"
          >
            {" "}
            <Projects projects={researcherProperty.Projects} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <MailOutlined />
                Mi Producción
              </span>
            }
            key="2"
          >
            <Products products={researcherProperty?.Products} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <SolutionOutlined />
                Mi Productos de diffusion
              </span>
            }
            key="3"
          >
            <DiffusionProducts
              diffusionProdcuts={researcherProperty?.DiffusionProducts}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <SolutionOutlined />
                Mis tutorias
              </span>
            }
            key="4"
          >
            <Tutorials tutorials={researcherProperty?.Tutorials} />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}
