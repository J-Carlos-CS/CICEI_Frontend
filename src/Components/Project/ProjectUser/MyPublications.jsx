import { useState } from "react";
import {
  Col,
  Card,
  Row,
  Button,
  //message,
  Empty,
  Typography,
  Input,
} from "antd";
//import ChangeProgressModal from "../ProjectAdmin/ProjectProduct/ChangeProgressModal";
import { useHistory } from "react-router";
const { Title } = Typography;
export default function MyPublications({
  list = [],
  getProductsByUserP,
  setuserProjects,
  userSesion,
}) {
  const history = useHistory();
  /* const [isModalChangeVisible, setIsModalChangeVisible] = useState(false);
  const [productTarget, setProductTarget] = useState(null); */
  const [filter, setFilter] = useState({ filterText: "" });

 /*  const showModalChange = () => {
    setIsModalChangeVisible(true);
  };
  const handleOkChange = () => {
    getProductsByUserP(userSesion.id)
      .then((res) => {
        setuserProjects((state) => ({ ...state, ...res }));
        setProductTarget(null);
        setIsModalChangeVisible(false);
      })
      .catch((e) => {
        message.error("Hubo un error. " + e.message, 5);
      });
  }; */
 /*  const handleCancelChange = () => {
    setProductTarget(null);
    setIsModalChangeVisible(false);
  }; */

  const getProjectProducts = (myProducts, myFilter) => {
    let listProjects = [];
    /*
{
  id:projectid,
  name: nameProject,
  code: codeProject,
  Products:[{}]
}
*/
    myProducts.forEach((product) => {
      let pos = 0;
      let isProject = listProjects.some((project, index) => {
        if (project.id === product.Project.id) {
          pos = index;
          return true;
        } else {
          return false;
        }
      });

      if (isProject) {
        listProjects[pos].Products.push(product);
      } else {
        let myProject = {
          id: product.Project.id,
          name: product.Project.title,
          code: product.Project.code,
          Products: [],
        };
        myProject.Products.push(product);
        listProjects.push(myProject);
      }
    });

    if (myFilter?.filterText !== "") {
      return listProjects.filter((p) => {
        if (
          `${p.code}-${p.name}`.toLowerCase().indexOf(myFilter?.filterText.toLowerCase()) >= 0
        ) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      return listProjects;
    }
  };

  const onSearch = (value) => {
    setFilter({ filterText: value.target.value });
  };

  return list.length === 0 ? (
    <Row align="center">
      <Col span={23} style={{ display: "flex", justifyContent: "center" }}>
        <Empty description="Aun no tienes Publicaciones" />
      </Col>
    </Row>
  ) : (
    <>
      <Row align="center" style={{ marginBottom: "2em" }}>
        <Col span={14} style={{ display: "flex", justifyContent: "center" }}>
          <Input placeholder="Buscador por proyecto" onChange={onSearch} />
        </Col>
        <Col span={24}>
          {getProjectProducts(list,filter).map((p) => {
            return (
              <Row align="center" key={p.id} style={{ marginTop: "2em" }}>
                <Col span={24}>
                  <Title level={3}>{p.code + "-" + p.name}</Title>
                  <Row gutter={[16, 16]} align="center">
                    {p.Products.map((p) => {
                      return (
                        <Col key={p.id} xs={20} sm={10} md={10} lg={10} xl={10}>
                          <Card
                            title={p.title}
                            bordered={false}
                            actions={[
                              <Button
                                type="link"
                                onClick={() => {
                                  history.push(`/project/viewforuser/${p.Project.id}`);
                                }}
                              >
                                Ir al proyecto
                              </Button>,
                            ]}
                          >
                            <div>
                              <b>Tipo de Publicación: </b>
                              {p.TypeProduct?.name}
                            </div>
                            <div>
                              <b>Título de Trabajo: </b>
                              {p.title}
                            </div>
                            <div>
                              <b>Proyecto: </b>
                              {p.Project?.title}
                            </div>
                            <div>
                              <b>Estado: </b>
                              {p.Progress?.stateProgress || "Pendiente"}
                            </div>
                            <div>
                              <b>Progreso: </b>
                              {(p.progress ? p.progress : "0") + "%"}
                            </div>
                            {p.TypeProduct?.name === "Libro" ? (
                              <>
                                <div>
                                  <b>Tipo de Libro: </b>
                                  {p.TypeBook?.name}
                                </div>
                                <div>
                                  <b>Editorial: </b>
                                  {p.Publisher?.name}
                                </div>
                              </>
                            ) : null}
                            {p.TypeProduct?.name === "Artículo científico" ? (
                              <>
                                <div>
                                  <b>Tipo de Artículo: </b>
                                  {p.TypeArticle?.name}
                                </div>
                                <div>
                                  <b>Editorial: </b>
                                  {p.Publisher?.name}
                                </div>
                                <div>
                                  <b>Revista: </b>
                                  {p.journal}
                                </div>
                              </>
                            ) : null}
                            <div>
                              <b>Observaciones: </b>
                              {p.observation}
                            </div>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
              </Row>
            );
          })}
        </Col>
      </Row>
     {/*  {isModalChangeVisible ? (
        <ChangeProgressModal
          isModalVisible={isModalChangeVisible}
          handleOk={handleOkChange}
          handleCancel={handleCancelChange}
          productTarget={productTarget}
        />
      ) : null} */}
    </>
  );
}
