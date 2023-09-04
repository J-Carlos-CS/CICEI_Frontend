import { useContext, useState, useEffect, useCallback } from "react";
import { Modal, Row, Col, Card, Button, Empty, message } from "antd";
import {
  DiffusionContext,
  ProjectContext,
  ActivityContext,
  UserProjectContext,
} from "./Contexts/ContextProjectUsers";
import DiffusionProductService from "../../../services/DiffusionProductService";
import DiffusionForm from "./DiffusionProductForm";
function CardsProductDiffusion({
  productsDiffusion = [],
  actionList = false,
  onEdit = () => {},
  onDelete = () => {},
}) {
  return (
    <>
      {productsDiffusion.length > 0
        ? productsDiffusion.map((productDiffusion) => {
            let actionListButtons = [
              <Button
                type="link"
                onClick={() => {
                  onEdit(productDiffusion);
                }}
              >
                Editar
              </Button>,
              <Button
                type="link"
                onClick={() => {
                  onDelete(productDiffusion);
                }}
              >
                Eliminar
              </Button>,
            ];
            return (
              <Col
                key={productDiffusion.id}
                xs={20}
                sm={10}
                md={10}
                lg={10}
                xl={10}
              >
                <Card
                  title={productDiffusion?.DiffusionCategory?.name}
                  bordered={false}
                  actions={actionList ? actionListButtons : []}
                >
                  <Attributes diffusionProduct={productDiffusion} />
                  <div>
                    <b>Autores: </b>
                    {productDiffusion.DiffusionAuthors?.map((da) => {
                      return `${da.User?.firstName} ${da.User?.lastName} `;
                    }).join(", ")}
                  </div>
                </Card>
              </Col>
            );
          })
        : null}
    </>
  );
}
function attributesDiffusionProduct(diffusionProduct) {
  let parentCategory =
    diffusionProduct?.DiffusionCategory?.firstParentCategory?.name;
  let category = diffusionProduct?.DiffusionCategory?.name;

  let listAttributes = [];
  switch (parentCategory) {
    case "Edu_comunicacional":
      listAttributes = ["title", "target", "publicTarget"];
      if (category === "Videos") {
        listAttributes.push("duration");
      }
      break;
    case "Redes Sociales":
      listAttributes = [
        "description",
        "target",
        "publicTarget",
        "url",
        "socialNetworks",
      ];
      if (category === "Reels" || category === "Video") {
        listAttributes.push("duration");
      }

      break;
    case "Radio":
      listAttributes = ["title", "resume", "target", "publicTarget"];
      if (
        category === "Socio drama" ||
        category === "Cuña" ||
        category === "Jingle"
      ) {
        listAttributes.push("duration");
      }

      if (
        category === "Cuña" ||
        category === "Jingle" ||
        category === "Radio novela"
      ) {
        listAttributes.push("radioTransmiter");
      }

      if (category === "Radio novela") {
        listAttributes.push("episodes");
      }
      break;
    case "TV":
      listAttributes = [
        "title",
        "resume",
        "target",
        "publicTarget",
        "tvChannels",
        "duration",
      ];
      break;
    case "Prensa":
      listAttributes = [
        "title",
        "resume",
        "target",
        "publicTarget",
        "newsPaper",
      ];
      break;
    case "Revista":
      listAttributes = [
        "title",
        "resume",
        "target",
        "publicTarget",
        "newsPaper",
      ];
      break;
    case "Charlas":
      listAttributes = ["title", "resume"];
      if (
        category === "Talleres" ||
        category === "Conferencia" ||
        category === "Congreso"
      ) {
        listAttributes.push("workshopLeaders");
        listAttributes.push("target");
        listAttributes.push("publicTarget");
        listAttributes.push("newsPaper");
      }
      if (category === "Ponencia") {
        listAttributes.push("event");
        listAttributes.push("place");
        listAttributes.push("date");
      }
      break;

    default:
      break;
  }

  return listAttributes;
}
function Attributes({ diffusionProduct }) {
  let listAttributes = attributesDiffusionProduct(diffusionProduct);
  let namingAttribute = {
    title: "Título",
    target: "Objetivo",
    publicTarget: "Público objetivo",
    description: "Descripción",
    url: "Página",
    socialNetworks: "Redes sociales",
    duration: "Duración",
    resume: "Resumen",
    radioTransmiter: "Estación de Radio",
    episodes: "N° Episodios",
    tvChannels: "Canales TV",
    newsPaper: "Periodico",
    workshopLeaders: "Panelistas",
    event: "Evento",
    place: "Lugar",
    date: "Fecha",
  };

  function stringAttributeValue(attribute, attributeValue) {
    try {
      let stringAttribute = "";
      let objectAttribute = null;
      if (attribute === "date") {
        let date = new Date(attributeValue);
        stringAttribute = `${date.getMonth() + 1}/${date.getFullYear()}`;
      } else {
        objectAttribute = JSON.parse(attributeValue);
      }

      switch (attribute) {
        case "socialNetworks":
          if (Array.isArray(objectAttribute)) {
            stringAttribute = objectAttribute
              .map(
                (propsAttribute) =>
                  `${propsAttribute?.name} - ${propsAttribute?.linkSocialNetwork}`
              )
              .join(", ");
          } else {
            stringAttribute = "Sin redes sociales";
          }
          break;
        case "duration":
          if (Array.isArray(objectAttribute)) {
            stringAttribute = "Sin duración";
          } else {
            stringAttribute = `${objectAttribute?.hours}h ${objectAttribute?.minutes}m`;
          }
          break;
        case "episodes":
          if (Array.isArray(objectAttribute)) {
            stringAttribute = objectAttribute.length;
          } else {
            stringAttribute = "0";
          }
          break;
        case "tvChannels":
          if (Array.isArray(objectAttribute)) {
            stringAttribute = objectAttribute
              .map(
                (propsAttribute) =>
                  `${propsAttribute?.name} - ${propsAttribute?.country}`
              )
              .join(", ");
          } else {
            stringAttribute = "Ninguna";
          }
          break;
        case "workshopLeaders":
          if (Array.isArray(objectAttribute)) {
            stringAttribute = objectAttribute
              .map(
                (propsAttribute) =>
                  `${propsAttribute?.name} - ${propsAttribute?.gradeId} ${propsAttribute?.grade} - ${propsAttribute.country}`
              )
              .join(", ");
          } else {
            stringAttribute = "Ninguna";
          }
          break;

        default:
          break;
      }
      return stringAttribute;
    } catch (error) {
      return attributeValue;
    }
  }
  return (
    <>
      {listAttributes.map((attribute) => (
        <div key={attribute}>
          <b>{namingAttribute[attribute]}: </b>
          {diffusionProduct[attribute]
            ? stringAttributeValue(attribute, diffusionProduct[attribute])
            : "Sin información."}
        </div>
      ))}
    </>
  );
}

export default function DiffusionProducts({ isProjectActive = false }) {
  const { diffusionProducts, getDiffusionProducts } =
    useContext(DiffusionContext);
  const [allDiffusionProducts, setAllDiffusionProducts] = useState({
    myDiffusionProducts: [],
    otherDiffusion: [],
  });
  const [isOpenModalForm, setIsOpenModalForm] = useState(false);
  const [diffusionSelected, setDiffusionSelected] = useState(null);
  const { userProjects } = useContext(UserProjectContext);
  const { currentUser, projectData } = useContext(ProjectContext);
  const { activities } = useContext(ActivityContext);

  useEffect(() => {
    console.log("render");
    if (diffusionProducts.length > 0) {
      let myDiffusionProducts = [];
      let otherDiffusion = [];
      for (let product of diffusionProducts) {
        if (
          product?.DiffusionAuthors?.some(
            (diffusionAuthor) =>
              diffusionAuthor.userId === currentUser?.User?.id &&
              diffusionAuthor.isMain
          )
        ) {
          myDiffusionProducts.push(product);
        } else {
          otherDiffusion.push(product);
        }
      }
      setAllDiffusionProducts({
        otherDiffusion,
        myDiffusionProducts,
      });
    }
  }, [diffusionProducts]);

  /*  const onCloseModalForm = ({ state = "false" }) => {
    setIsOpenModalForm(false);
    setDiffusionSelected(null);
  }; */

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

  const onCloseModalForm = async (action = { state: "close" }) => {
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
    setDiffusionSelected(null);
    setIsOpenModalForm(false);
  };

  const showModalForm = () => {
    setIsOpenModalForm(true);
  };
  const deleteDiffusion = async (id) => {
    try {
      message.loading({ content: "Procesando...", key: "delete", duration: 3 });
      let {
        data: { success, description },
      } = await DiffusionProductService.deleteDiffusionProduct(id);
      if (success) {
        message.success({
          content: "Producto eliminado",
          key: "delete",
          duration: 3,
        });
        onCloseModalForm({ state: "success" });
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
  const onDelete = (diffusionProduct) => {
    console.log("Diffusion To delete", diffusionProduct);
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
        deleteDiffusion(diffusionProduct?.id || 0);
      },
      onCancel: () => {},
      okText: "Aceptar",
      cancelText: "Cancelar",
    });
  };

  const onEdit = (diffusionProduct) => {
    setDiffusionSelected(diffusionProduct);
    setIsOpenModalForm(true);
  };
  return (
    <>
      {diffusionProducts.length === 0 && (
        <Empty
          imageStyle={{
            height: 60,
          }}
          description={
            <span>El proyecto aun no tiene publicaciones de difusión.</span>
          }
        ></Empty>
      )}
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
        <CardsProductDiffusion
          productsDiffusion={allDiffusionProducts?.myDiffusionProducts}
          actionList={true}
          onDelete={onDelete}
          onEdit={onEdit}
        />
        <CardsProductDiffusion
          productsDiffusion={allDiffusionProducts?.otherDiffusion}
        />
      </Row>
      {isOpenModalForm && (
        <DiffusionForm
          productSelected={diffusionSelected}
          onCloseForm={onCloseModalForm}
          activities={activities.userActivities}
          userList={userProjects?.members}
          projectId={projectData?.id}
          linesInstitutional={projectData?.LinesInstitutional}
        />
      )}
    </>
  );
}
