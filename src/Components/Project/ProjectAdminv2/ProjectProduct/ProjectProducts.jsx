import React, { useState, useCallback, useContext } from "react";
import {
  Row,
  Col,
  Divider,
  Tabs,
  Typography,
  message,
  Modal,
  Button,
} from "antd";
import {
  BookOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import Books from "./Books";
import ResearchReports from "./ResearchReports";
import ProductFormModal from "./ProductFormModal";
import Articles from "./Articles";
import UploadProduct from "./UploadProduct";
import ProductService from "../../../../services/ProductService.js";
import ChangeProgressModal from "./ChangeProgressModal";
import FileService from "../../../../services/FileService";
/* import * as FileSaver from "file-saver"; */
import {
  ActivityContext,
  ProjectContext,
  ProductContext,
} from "../Contexts/AdminProjectContexts";
const { Title } = Typography;
const { TabPane } = Tabs;

const ProjectProducts = React.memo(function ({
  //repositorySize,
  //setRepositorySize,
  //userSesion,
  projectId,
  //UsersForActivities,
  //LinesInstitutional,
  //InstitutionProjects,
  //projectState = true,
  //activities = [],
  //getActivities,
  //setActivities,
  //getProducts,
  //setProducts,
  //products,
}) {
  const {
    activities = [],
    getActivities,
    setActivities,
  } = useContext(ActivityContext);
  const {
    repositorySize,
    setRepositorySize,
    userSesion,
    projectData: {
      UsersForActivities,
      LinesInstitutional,
      InstitutionProjects,
      state: projectState = true,
    },
  } = useContext(ProjectContext);
  const { getProducts, setProducts, products } = useContext(ProductContext);
  let { articles, books, reports } = products;
  //console.log("productss", products);
  const [isModalUploadVisible, setIsModalUploadVisible] = useState(false);
  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [isModalDeleteVisible, setisModalDeleteVisible] = useState(false);
  const [isModalChangeProgressVisible, setIsModalChangeProgressVisible] =
    useState(false);
  const [productTarget, setproductTarget] = useState(null);

  /*   const runPromises = async (listPromises, listSetters) => {
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

  const handleCancel = () => {
    setproductTarget(null);
    setIsModalFormVisible(false);
  };

  const showModalForm = () => {
    setIsModalFormVisible(true);
  };

  const handleOkForm = async () => {
    setIsModalFormVisible(false);
    setproductTarget(null);
    try {
      /*   await runPromises(
        [getProducts, getActivities],
        [setProducts, setActivities]
      ); */
      await updateData([getProducts, getActivities]);
    } catch (e) {
      message.error({ content: "Hubo un error. " + e.message, duration: 5 });
    }
  };

  const handleCancelDelete = () => {
    setproductTarget(null);
    setisModalDeleteVisible(false);
  };

  const showModalDelete = () => {
    setisModalDeleteVisible(true);
  };

  const showModalChangeProgress = () => {
    setIsModalChangeProgressVisible(true);
  };

  const handleOkChangeModal = () => {
    setIsModalChangeProgressVisible(false);
    setproductTarget(null);
    getProducts(projectId);
  };

  const handleCancelChangeModal = () => {
    setIsModalChangeProgressVisible(false);
    setproductTarget(null);
  };

  const handleOkDelete = () => {
    message.loading({ content: "Actualizando...", key: "update" });
    ProductService.deleteProduct(productTarget.id)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Producto eliminado.", 4);
          setisModalDeleteVisible(false);
          setproductTarget(null);
          /* await runPromises(
            [getProducts, getActivities],
            [setProducts, setActivities]
          ); */
          await updateData([getProducts, getActivities]);

          message.success({
            content: "Actualizado",
            key: "update",
            duration: 3,
          });
        } else {
          message.error({
            content: "No fue posible eliminar el producto.",
            key: "update",
            duration: 4,
          });
        }
      })
      .catch((e) => {
        console.log("error", e.message);
        message.error({
          content: "Hubo un error. " + e.message,
          key: "update",
          duration: 4,
        });
      });
  };

  const showModalUpload = useCallback(() => {
    setIsModalUploadVisible(true);
  }, []);

  /*   const myProm = () => {
    return new Promise((resolve, reject) => {
      try {

        FileSaver.saveAs(
          "http://localhost:4000/api/file/download",
          "Myrar.rar"
        );
        console.log("prev");
        resolve(true);
      } catch (e) {
        reject(false);
      }
    });
  }; */

  const handleOkUpload = async (fileList = [], config) => {
    /*    console.log("myFile", fileList);
    console.log("producttarget", productTarget); */
    const formData = new FormData();
    formData.append("myretrofileapp", fileList[0]?.originFileObj);
    formData.append("productId", productTarget?.id || 0);
    formData.append("projectId", productTarget?.projectId || 0);
    message.loading({
      content: "Realizando operaciones espere...",
      key: "update",
    });
    /*  try{
      let response = await FileService.testFile(formData,config);
      if(response.data?.success){
        alert("resulto");
      }else {
        throw new Error(response.data?.description);
      }
    }catch(e){
      message.error({content:e.message, key:"update",duration:5});
    } */

    try {
      let res = await FileService.postProduct(formData, config);
      if (res.data?.success) {
        let newSize = parseFloat(res.data?.response?.size);
        setRepositorySize((e) => ({ maxSize: e.maxSize, size: newSize }));
        message.success("Archivo guardado.", 3);
        /* await runPromises(
          [getProducts, getActivities],
          [setProducts, setActivities]
        ); */
        await updateData([getProducts, getActivities]);

        message.success({
          content: "Actualizado",
          key: "update",
          duration: 3,
        });
        setIsModalUploadVisible(false);
        setproductTarget(null);
      } else {
        throw new Error(res.data?.description);
      }
    } catch (e) {
      message.error({ content: e.message, key: "update", duration: 5 });
      throw new Error(e.message);
    }
    /*  FileService.postProduct(formData)
      .then(async (res) => {
        if (res.data?.success) {
          let newSize = parseFloat(res.data?.response?.size);
          setRepositorySize((e) => ({ maxSize: e.maxSize, size: newSize }));
          message.success("Archivo guardado.", 3);
          try {
            await runPromises(
              [getProducts, getActivities],
              [setProducts, setActivities]
            );
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            setIsModalUploadVisible(false);
            setproductTarget(null);
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
    setproductTarget(null);
  };

  const deleteFileProductRequest = (id, projectId) => {
    FileService.deleteFileProduct(id, projectId)
      .then(async (res) => {
        if (res.data?.success) {
          //console.log("succes delete", res.data.response);
          let newSize = parseFloat(res.data?.response?.size);
          setRepositorySize((e) => ({ maxSize: e.maxSize, size: newSize }));
          message.success("Archivo eliminado.", 3);
          try {
            /* await runPromises(
              [getProducts, getActivities],
              [setProducts, setActivities]
            ); */
            await updateData([getProducts, getActivities]);

            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            /* setIsModalUploadVisible(false);
          setproductTarget(false); */
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
              "Algo salio mal al eliminar el archivo. " + res.data?.description,
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
      });
  };

  const deleteFileProduct = (product) => {
    //console.log("myprod", product);

    Modal.confirm({
      title: "¿Desea eliminar el archivo?",
      content: `Si procede sera imposible recuperar la información.`,
      onOk: () => {
        deleteFileProductRequest(
          product.FileProducts[0]?.id || 0,
          product.projectId || 0
        );
      },
      onCancel: () => {},
      okText: "Acpetar",
      cancelText: "Cancelar",
    });
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
      <Divider>
        <Title level={4}>Productos</Title>
      </Divider>
      <Row justify="center" gutter={[0, 24]}>
        <Col
          xs={{ span: 6, offset: 1 }}
          sm={4}
          md={{ span: 6, offset: 4 }}
          lg={{ span: 6, offset: 4 }}
          xl={{ span: 6, offset: 4 }}
        ></Col>
        <Col
          xs={{ span: 6, offset: 11 }}
          sm={4}
          md={{ span: 6, offset: 8 }}
          lg={{ span: 6, offset: 8 }}
          xl={{ span: 6, offset: 8 }}
        >
          {projectState ? (
            <Button
              type="primary"
              onClick={() => {
                setIsModalFormVisible(!isModalFormVisible);
              }}
            >
              + Añadir Producto
            </Button>
          ) : null}
        </Col>
      </Row>
      <Row justify="center">
        <Col span={18}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <FileProtectOutlined /> Artículos Científicos
                </span>
              }
              key="1"
            >
              <Articles
                list={articles.filter((p) =>
                  activities.some((a) => a.id === p.Activity?.id)
                )}
                setproductTarget={setproductTarget}
                showModalForm={showModalForm}
                showModalDelete={showModalDelete}
                showModalChangeProgress={showModalChangeProgress}
                projectState={projectState}
                showModalUpload={showModalUpload}
                deleteFileProduct={deleteFileProduct}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <BookOutlined /> Libros
                </span>
              }
              key="2"
            >
              <Books
                list={books.filter((p) =>
                  activities.some((a) => a.id === p.Activity?.id)
                )}
                setproductTarget={setproductTarget}
                showModalForm={showModalForm}
                showModalDelete={showModalDelete}
                showModalChangeProgress={showModalChangeProgress}
                projectState={projectState}
                showModalUpload={showModalUpload}
                deleteFileProduct={deleteFileProduct}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileSearchOutlined /> Informes técnicos de investigación
                </span>
              }
              key="3"
            >
              <ResearchReports
                list={reports.filter((r) =>
                  activities.some((a) => a.id === r.Activity?.id)
                )}
                InstitutionProjects={InstitutionProjects}
                setproductTarget={setproductTarget}
                showModalForm={showModalForm}
                showModalDelete={showModalDelete}
                showModalChangeProgress={showModalChangeProgress}
                projectState={projectState}
                showModalUpload={showModalUpload}
                deleteFileProduct={deleteFileProduct}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      {isModalFormVisible ? (
        <ProductFormModal
          isModalVisible={isModalFormVisible}
          projectId={projectId}
          handleOk={handleOkForm}
          handleCancel={handleCancel}
          userList={UsersForActivities}
          LinesInstitutional={LinesInstitutional}
          productTarget={productTarget}
          activities={activities}
        />
      ) : null}
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
          <p>
            ¿Esta seguro de eliminar el{" "}
            <strong>{productTarget?.TypeProduct?.name}</strong> con título{" "}
            <strong>{productTarget?.title}</strong>?
          </p>
        </Modal>
      ) : null}

      {isModalChangeProgressVisible ? (
        <ChangeProgressModal
          isModalVisible={isModalChangeProgressVisible}
          handleOk={handleOkChangeModal}
          handleCancel={handleCancelChangeModal}
          productTarget={productTarget}
          showModalChangeProgress={showModalChangeProgress}
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
});

export default ProjectProducts;
