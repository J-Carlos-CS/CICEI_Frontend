import React, { useState, useContext, useCallback } from "react";
import {
  ProjectContext,
  ActivityContext,
  UserProjectContext,
  ProductContext,
} from "./Contexts/ContextProjectUsers";
import ProductService from "../../../services/ProductService";
import ProjectProductForm from "./ProjectProductForm";
import ChangeProgressModal from "../ProjectAdminv2/ProjectProduct/ChangeProgressModal";
import UploadProduct from "../ProjectAdminv2/ProjectProduct/UploadProduct";
import FileService from "../../../services/FileService";
import { WarningOutlined } from "@ant-design/icons";
import {
  Col,
  Card,
  Row,
  Button,
  Typography,
  Modal,
  message,
  Empty,
} from "antd";
const { Title } = Typography;

/* const runPromises = async (listPromises, listSetters) => {
  if (
    listPromises.length > 0 &&
    listSetters.length > 0 &&
    listPromises.length === listSetters.length
  ) {
    let promises = listPromises.map((f) => f());
    try {
      let results = await Promise.allSettled(promises);
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          message.error("Error al actualizar. " + result.reason, 5);
        } else {
          listSetters[index](result.value);
        }
      });
    } catch (e) {
      console.log(e.message);
      message.error("Error. " + e.message, 5);
    }
  } else {
    console.log("Proceso denegado");
  }
}; */

export default function ProjectProducts({
  //list = [],
  //currentUser,
  //project = null,
  //getProductsByProject,
  //setProducts,
  //activities,
  //userProjects,
  isProjectActive,
  //repositorySize,
  //setRepositorySize,
  //getActivities,
  //setActivities,
}) {
  //let { id: userSesionId } = userSesion;
  const { products: list = [], getProductsByProject } =
    useContext(ProductContext);
  const { userProjects } = useContext(UserProjectContext);
  const { currentUser, repositorySize, setRepositorySize, projectData } =
    useContext(ProjectContext);
  const { getActivities, activities } = useContext(ActivityContext);
  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [isChangeModalVisible, setIsChangeModalVisible] = useState(false);
  const [productTarget, setProductTarget] = useState(null);
  const [isModalUploadVisible, setIsModalUploadVisible] = useState(false);
  let products = {
    otherProducts: list.filter(
      (p) => p.Activity?.userId !== currentUser?.User?.id
    ),
    myProducts: list.filter(
      (p) => p.Activity?.userId === currentUser?.User?.id
    ),
  };

  //console.log("products", products);
  const showModalForm = () => {
    setIsModalFormVisible(true);
  };
  /*   const hadleOkForm = () => {
    getProductsByProject(project.id)
      .then((res) => {
        setProductTarget(null);
        setIsModalFormVisible(false);
        //setAllProducts(res);
        setProducts(res);
      })
      .catch((e) => {
        console.log(e);
        message.error("Hubo un error. " + e.message);
      });
  }; */
  const handleCancelForm = () => {
    setProductTarget(null);
    setIsModalFormVisible(false);
  };

  /* const showModalChange = () => {
      setIsChangeModalVisible(true);
    }; */
  const handleOkChange = async () => {
    /* getProductsByProject(project.id)
      .then((res) => {
        setProductTarget(null);
        setIsChangeModalVisible(false);
        //setAllProducts(res);
        setProducts(res);
      })
      .catch((e) => {
        console.log(e);
        message.error("Hubo un error. " + e.message);
      }); */
    try {
      await updateData([getProductsByProject]);
      setProductTarget(null);
      setIsChangeModalVisible(false);
    } catch (error) {
      message.error({ content: error.message, duration: 5, key: "updateData" });
    }
  };
  const handleCancelChange = () => {
    setProductTarget(null);
    setIsChangeModalVisible(false);
  };

  const showModalDelete = () => {
    setIsModalDeleteVisible(true);
  };
  const handleOkDelete = () => {
    message.loading({ content: "Actualizando...", key: "update" });
    ProductService.deleteProduct(productTarget.id)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Producto eliminado.", 4);
          try {
            /* await runPromises(
              [getProductsByProject, getActivities],
              [setProducts, setActivities]
            ); */
            await updateData([getProductsByProject, getActivities]);
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            setIsModalDeleteVisible(false);
            setProductTarget(null);
          } catch (e) {
            message.error({
              content: "Hubo un error. " + e.message,
              key: "update",
              duration: 5,
            });
          }
        } else {
          message.error({
            content: "Hubo un error. " + res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        console.log("error.", e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };
  const handleCancelDelete = () => {
    setProductTarget(null);
    setIsModalDeleteVisible(false);
  };

  const updateProduct = (product, setRequesting) => {
    message.loading({
      content: "Realizando peticion espere...",
      key: "update",
    });
    ProductService.updateProduct(product)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Producto actualizado.", 4);
          try {
            //await runPromises([getProductsByProject], [setProducts]);
            await updateData([getProductsByProject]);

            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            setIsModalFormVisible(false);
            setProductTarget(null);
          } catch (e) {
            message.error({
              content: "Hubo un error. " + e.message,
              key: "update",
              duration: 5,
            });
          }
        } else {
          setRequesting(false);
          message.error({
            content: "Hubo un error. " + res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        setRequesting(false);
        console.log("error.", e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };

  const createProduct = (product, setRequesting) => {
    message.loading({
      content: "Realizando peticion espere...",
      key: "update",
    });
    ProductService.registerProduct(product)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Producto registrado.", 4);
          try {
            //await runPromises([getProductsByProject], [setProducts]);
            await updateData([getProductsByProject]);

            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            setIsModalFormVisible(false);
            setProductTarget(null);
          } catch (e) {
            message.error({
              content: "Hubo un error. " + e.message,
              key: "update",
              duration: 5,
            });
          }
        } else {
          setRequesting(false);
          message.error({
            content: "Hubo un error. " + res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        setRequesting(false);
        console.log("error.", e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };

  const handleOkForm = (product, create, setRequesting) => {
    if (create) {
      createProduct(product, setRequesting);
    } else {
      updateProduct(product, setRequesting);
    }
  };

  const handleOkUpload = async (fileList = [], config) => {
    const formData = new FormData();
    formData.append("myretrofileapp", fileList[0]?.originFileObj);
    formData.append("productId", productTarget?.id || 0);
    formData.append("projectId", productTarget?.projectId || 0);
    message.loading({
      content: "Realizando operaciones espere...",
      key: "update",
    });
    try {
      let res = await FileService.postProduct(formData, config);
      if (res.data?.success) {
        let newSize = parseFloat(res.data?.response?.size);
        setRepositorySize((e) => ({ maxSize: e.maxSize, size: newSize }));
        message.success("Archivo guardado.", 3);
        /* await runPromises(
          [getProductsByProject, getActivities],
          [setProducts, setActivities]
        ); */
        await updateData([getProductsByProject, getActivities]);

        message.success({
          content: "Actualizado",
          key: "update",
          duration: 3,
        });
        setIsModalUploadVisible(false);
        setProductTarget(null);
      } else {
        throw new Error(res.data?.description);
      }
    } catch (e) {
      message.error({ content: e.message, key: "update", duration: 5 });
      throw new Error(e.message);
    }
    /* FileService.postProduct(formData)
      .then(async (res) => {
        if (res.data?.success) {
          let newSize = parseFloat(res.data?.response?.size);
          setRepositorySize((e) => ({ maxSize: e.maxSize, size: newSize }));
          message.success("Archivo guardado.", 3);
          try {
            await runPromises(
              [getProductsByProject, getActivities],
              [setProducts, setActivities]
            );
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            setIsModalUploadVisible(false);
            setProductTarget(null);
          } catch (e) {
            message.error({
              content: "Hubo un error. " + e.message,
              key: "update",
              duration: 5,
            });
          }
        } else {
          message.error({
            content:
              "Algo salio mal al guardar el archivo. " + res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        console.log("error", e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 5,
        });
      }); */
  };

  const handleCancelUpload = () => {
    setIsModalUploadVisible(false);
    setProductTarget(null);
  };

  const updateData = useCallback(async (promisesArray) => {
    if (promisesArray?.length > 0) {
      let promises = promisesArray.map((functionUpdater) => functionUpdater());
      try {
        await Promise.allSettled(promises);
      } catch (error) {
        message.error({
          content: "Algo salio mal al actualizar la información del proyecto.",
          duration: 5,
          key: "payloads",
        });
      }
    } else {
      message.error({
        content: "Lista de actualización vacia.",
        duration: 5,
        key: "payloads",
      });
    }
  }, []);

  return (
    <>
      {list.length === 0 && (
        <Empty
          imageStyle={{
            height: 60,
          }}
          description={<span>El proyecto aun no tiene publicaciones.</span>}
        ></Empty>
      )}
      {products.myProducts.length > 0 ? (
        <Title
          level={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Mis Publicaciones
        </Title>
      ) : null}
      {currentUser.isMember && currentUser.rolName !== "Estudiante" ? (
        <Row style={{ marginTop: "1em", marginBottom: "1em" }}>
          <Col
            span={23}
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            {isProjectActive ? (
              <Button
                type="primary"
                onClick={() => {
                  showModalForm();
                }}
              >
                +Registrar un Producto
              </Button>
            ) : null}
          </Col>
        </Row>
      ) : null}
      <Row
        gutter={[16, 16]}
        align="center"
        style={{ marginTop: "1em", marginBottom: "1em" }}
      >
        {products.myProducts.length > 0
          ? products.myProducts.map((p) => {
              let actionList = [
                <Button
                  type="link"
                  onClick={() => {
                    setProductTarget(p);
                    showModalForm();
                  }}
                >
                  Editar
                </Button>,
                <Button
                  type="link"
                  onClick={() => {
                    setProductTarget(p);
                    showModalDelete();
                  }}
                >
                  Eliminar
                </Button>,
              ];
              if (p.FileProducts?.length === 0) {
                actionList.push(
                  <Button
                    type="link"
                    onClick={() => {
                      setProductTarget(p);
                      setIsModalUploadVisible(true);
                    }}
                  >
                    Subir Archivo
                  </Button>
                );
              }
              return (
                <Col key={p.id} xs={20} sm={10} md={10} lg={10} xl={10}>
                  <Card
                    title={p.title}
                    bordered={false}
                    actions={isProjectActive ? actionList : []}
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
                      <b>Autores: </b>
                      {p.Authors?.map((a) => {
                        return `${a.User?.firstName} ${a.User?.lastName} `;
                      }).join(", ")}
                    </div>
                    {/*  <div>
                        <b>Estado: </b>
                        {p.Progress?.stateProgress || "Pendiente"}
                      </div>
                      <div>
                        <b>Progreso: </b>
                        {(p.progress ? p.progress : "0") + "%"}
                      </div> */}
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
            })
          : null}
      </Row>

      {products.otherProducts.length > 0 ? (
        <Title
          level={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Publicaciones
        </Title>
      ) : null}
      <Row gutter={[16, 16]} align="center">
        {products.otherProducts.length > 0
          ? products.otherProducts.map((p) => {
              return (
                <Col key={p.id} xs={20} sm={10} md={10} lg={10} xl={10}>
                  <Card title={p.title} bordered={false} actions={[]}>
                    <div>
                      <b>Tipo de Publicación: </b>
                      {p.TypeProduct?.name}
                    </div>
                    <div>
                      <b>Título de Trabajo: </b>
                      {p.title}
                    </div>
                    <div>
                      <b>Autores: </b>
                      {p.Authors?.map((a) => {
                        return `${a.User?.firstName} ${a.User?.lastName} `;
                      }).join(", ")}
                    </div>
                    {/*   <div>
                        <b>Estado: </b>
                        {p.Progress?.stateProgress || "Pendiente"}
                      </div>
                      <div>
                        <b>Progreso: </b>
                        {(p.progress ? p.progress : "0") + "%"}
                      </div> */}
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
            })
          : null}
      </Row>
      {isModalDeleteVisible ? (
        <Modal
          title={"Eliminar Producto"}
          visible={isModalDeleteVisible}
          onOk={handleOkDelete}
          onCancel={handleCancelDelete}
          okText="Aceptar"
          cancelText="Cancelar"
          width={1000}
        >
          <>
            {productTarget?.FileProducts?.length > 0 && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <WarningOutlined
                    style={{
                      color: "yellow",
                      fontSize: "24px",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      width: "50px",
                      height: "50px",
                      background: "black",
                      borderRadius: "50%",
                    }}
                  />
                  <strong>
                    Este producto tiene un documento/archivo registrado
                  </strong>
                </div>

                <br />
                <strong>
                  Este producto tiene documento/archivo registrado, si se
                  elimina tambien se eliminará el documento/archivo.
                </strong>
              </>
            )}
            <p>
              ¿Esta seguro de eliminar el{" "}
              <strong>{productTarget?.TypeProduct?.name}</strong> con título{" "}
              <strong>{productTarget?.title}</strong>?
            </p>
          </>
        </Modal>
      ) : null}
      {isModalFormVisible ? (
        <ProjectProductForm
          isModalVisible={isModalFormVisible}
          handleOk={handleOkForm}
          handleCancel={handleCancelForm}
          productTarget={productTarget}
          userList={userProjects.members}
          LinesInstitutional={projectData?.LinesInstitutional}
          projectId={projectData?.id}
          userSesion={currentUser}
          activities={activities.userActivities}
        />
      ) : null}
      {isChangeModalVisible ? (
        <ChangeProgressModal
          isModalVisible={isChangeModalVisible}
          handleOk={handleOkChange}
          handleCancel={handleCancelChange}
          productTarget={productTarget}
        />
      ) : null}
      {isModalUploadVisible && (
        <UploadProduct
          repositorySize={repositorySize}
          isVisible={isModalUploadVisible}
          handleOk={handleOkUpload}
          handleCancel={handleCancelUpload}
          productTarget={productTarget}
        />
      )}
    </>
  );
}
