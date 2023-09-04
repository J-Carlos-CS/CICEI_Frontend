import React, { useState, useContext, useCallback } from "react";
import {
  Row,
  Col,
  Divider,
  Tabs,
  Typography,
  message,
  Button,
  Modal,
} from "antd";
import DiffusionProductService from "../../../../services/DiffusionProductService";
import Talks from "./Talks";
import Media from "./Media";
import CommunicationEdu from "./CommunicationEdu";
import SocialNetworks from "./SocialNetworks";
import DiffusionFormModal from "./DiffusionProductForm";
import UploadDiffusionProduct from "./UploadDiffusionProduct";
import {
  BookOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import {
  DiffusionProductContext,
  ProjectContext,
  ActivityContext,
} from "../Contexts/AdminProjectContexts";
import FileService from "../../../../services/FileService";
const { Title } = Typography;
const { TabPane } = Tabs;
const DiffusionProducts = React.memo(function () {
  const [showFormModal, setShowFormModal] = useState(false);
  const [productSelected, setProductSelected] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { diffusionProducts, setDiffusionProducts, getDiffusionProducts } =
    useContext(DiffusionProductContext);
  const {
    projectData: {
      state: projectState,
      UsersForActivities,
      id: projectId,
      LinesInstitutional,
    },
    repositorySize,
    setRepositorySize,
  } = useContext(ProjectContext);
  const { activities, getActivities } = useContext(ActivityContext);
  const deleteProduct = async (productId) => {
    try {
      message.loading({ content: "Procesando...", key: "delete", duration: 3 });
      let {
        data: { success, description },
      } = await DiffusionProductService.deleteDiffusionProduct(productId);
      if (success) {
        message.success({
          content: "Producto eliminado",
          key: "delete",
          duration: 3,
        });
        onCloseForm({ state: "success" });
      } else {
        message.warning({
          content: "Error. " + description,
          key: "delete",
          duration: 5,
        });
      }
    } catch (error) {
      message.error("Error. " + error.message, 4);
    }
  };
  const deleteFileProduct = async (productFileId) => {
    /*  console.log("ID", productFileId);
    console.log("projectId", projectData.id); */
    try {
      message.loading({ content: "Eliminando...", duration: 4, key: "delete" });
      let {
        data: { success, response, description },
      } = await FileService.deleteFileDiffusionProduct(
        productFileId,
        projectId
      );

      if (success) {
        message.success({
          content: "Documento eliminado.",
          key: "delete",
          duration: 3,
        });
        let newSize = parseFloat(response?.size);
        setRepositorySize((e) => ({ maxSize: e.maxSize, size: newSize }));
        onCloseForm({ state: "success" });
      } else {
        message.warning({
          content: "No se pudo eliminar el documento. " + description,
          key: "delete",
          duration: 3,
        });
      }
    } catch (error) {
      message.error({
        content: "Error. " + error.message,
        key: "delete",
        duration: 5,
      });
    }
  };
  const onSelectProductToEdit = (product) => {
    console.log("product", product);
    setProductSelected(product);
    setShowFormModal(true);
  };

  const onSelectToUpload = (product) => {
    setProductSelected(product);
    setShowUploadModal(true);
  };

  const onSelectProductToDelete = (product) => {
    Modal.confirm({
      title: "Eliminar producto.",
      content: (
        <div>
          <p>
            <strong>Nota: </strong>Si eliminas el producto sera imposible
            recuperar la información y el documento asociado a el.
          </p>
        </div>
      ),
      onOk: () => {
        deleteProduct(product.id);
      },
      onCancel: () => {},
      okText: "Aceptar",
      cancelText: "Cancelar",
    });
  };
  const onSelectFileProductToDelete = (product) => {
    Modal.confirm({
      title: "Eliminar archivo del producto.",
      content: (
        <div>
          <p>¿Estás seguro de eliminar el documento del producto?</p>
          <p>
            <strong>Nota: </strong>Si eliminas el documento del producto sera
            imposible recuperarlo.
          </p>
        </div>
      ),
      onOk: () => {
        deleteFileProduct(product?.DiffusionFiles[0]?.id || 0);
      },
      onCancel: () => {},
      okText: "Aceptar",
      cancelText: "Cancelar",
    });
  };
  const onCloseUploadForm = async (action = { state: "close" }) => {
    if (action.state === "success") {
      try {
        message.loading({
          content: "Actualizando...",
          key: "update",
          duration: 3,
        });
        await updateData([getDiffusionProducts]);

      } catch (error) {
        message.error({
          content: "Error. " + error.message,
          key: "update",
          duration: 5,
        });
      }
    }
    setProductSelected(null);
    setShowUploadModal(false);
  };
  const onCloseForm = async (action = { state: "close" }) => {
    if (action.state === "success") {
      try {
        message.loading({
          content: "Actualizando...",
          key: "update",
          duration: 3,
        });
        await updateData([getDiffusionProducts]);
        message.success({
          content: "Actualizado.",
          key: "update",
          duration: 3,
        });
      } catch (error) {
        message.error({
          content: "Error. " + error.message,
          key: "update",
          duration: 5,
        });
      }
    }
    setProductSelected(null);
    setShowFormModal(false);
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
        <Title level={4}>Productos de Difusión</Title>
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
          <Button
            onClick={() => {
              setShowFormModal(true);
            }}
            type="primary"
          >
            +Registrar producto
          </Button>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={18}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <FileProtectOutlined /> Educación Comunicacional
                </span>
              }
              key="1"
            >
              <CommunicationEdu
                list={diffusionProducts?.communicationalEdu}
                projectState={projectState}
                onSelectProductToEdit={onSelectProductToEdit}
                onSelectProductToDelete={onSelectProductToDelete}
                onSelectToUpload={onSelectToUpload}
                onSelectFileProductToDelete={onSelectFileProductToDelete}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <BookOutlined /> Redes Sociales
                </span>
              }
              key="2"
            >
              <SocialNetworks
                list={diffusionProducts?.socialNetworks}
                projectState={projectState}
                onSelectProductToEdit={onSelectProductToEdit}
                onSelectProductToDelete={onSelectProductToDelete}
                onSelectToUpload={onSelectToUpload}
                onSelectFileProductToDelete={onSelectFileProductToDelete}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileSearchOutlined /> Medios de Comunicación
                </span>
              }
              key="3"
            >
              <Media
                productsMedia={diffusionProducts?.media}
                projectState={projectState}
                onSelectProductToEdit={onSelectProductToEdit}
                onSelectProductToDelete={onSelectProductToDelete}
                onSelectToUpload={onSelectToUpload}
                onSelectFileProductToDelete={onSelectFileProductToDelete}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileSearchOutlined /> Charlas
                </span>
              }
              key="4"
            >
              <Talks
                list={diffusionProducts?.talks}
                projectState={projectState}
                onSelectProductToEdit={onSelectProductToEdit}
                onSelectProductToDelete={onSelectProductToDelete}
                onSelectToUpload={onSelectToUpload}
                onSelectFileProductToDelete={onSelectFileProductToDelete}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      {showFormModal ? (
        <DiffusionFormModal
          productSelected={productSelected}
          onCloseForm={onCloseForm}
          activities={activities}
          userList={UsersForActivities}
          projectId={projectId}
          linesInstitutional={LinesInstitutional}
        />
      ) : null}
      {showUploadModal ? (
        <UploadDiffusionProduct
          onClose={onCloseUploadForm}
          productTarget={productSelected}
          repositorySize={repositorySize}
          setRepositorySize={setRepositorySize}
        />
      ) : null}
    </>
  );
});
export default DiffusionProducts;
