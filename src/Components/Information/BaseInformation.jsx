import { useEffect, useState } from "react";
import { Col, message, Row, Tabs } from "antd";
import Categorias from "./Categoria/Categoria";
import Categoria from "../../services/Categoria.service.js";
import LoaderSpin from "../Layouts/Loader/LoaderSpin";
import Proyecto from "../../services/Proyecto.service";
import Proyectos from "./Proyecto/Proyecto";

const { TabPane } = Tabs;

const getCategoria = () => {
  return new Promise((resolve, reject) => {
    Categoria.getCategorias()
      .then((res) => {
        resolve(res.data.response);
      })
      .catch((e) => {
        message.error("Hubo un error. " + e.message);
        console.log("error.", e.message);
        reject({ status: "error", message: "Hubo un error. " + e.message });
      });
  });
};
const getProyecto = () => {
  return new Promise((resolve, reject) => {
    Proyecto.getProyectos()
      .then((res) => {
        resolve(res.data.response);
      })
      .catch((e) => {
        message.error("Hubo un error. " + e.message);
        console.log("error.", e.message);
        reject({ status: "error", message: "Hubo un error. " + e.message });
      });
  });
};

export default function BaseInformation() {
  const [categorias, setCategorias] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [isLoading, setIsLoading] = useState({
    status: "loading",
    message: "",
  });
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let isLoadingStatus = { status: "success", message: "" };
    let promises = [getCategoria(), getProyecto()];
    Promise.allSettled(promises).then((results) => {
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          switch (index) {
            case 0:
              setCategorias(result.value || []);
              break;
            case 1:
              setProyectos(result.value || []);
              break;
            default:
              break;
          }
        }
      });
    });
    setIsLoading(isLoadingStatus);
  };

  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }
  return (
    <>
      <Row justify="center">
        <Col span={23}>
          <Tabs defaultActiveKey="10" destroyInactiveTabPane={true}>
            <TabPane tab={<span>Categoria</span>} key="1">
              <Categorias list={categorias} getData={getCategoria} setCategorias={setCategorias} />
            </TabPane>
            <TabPane tab={<span>Proyecto</span>} key="2">
              <Proyectos list={proyectos} getData={getProyecto} setProyectos={setProyectos} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
}
