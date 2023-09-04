import { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Divider,
  message,
  Button,
  Modal,
  Tag,
} from "antd";
import NewsService from "../../services/NewsService.js";
import "./News.css";
const { Title, Text, Paragraph } = Typography;

const MyCardParagraph = ({
  oneNew = null,
  onAccept,
  onReject,
  /*  setIsModalFormVisible,
  setnewsTarget,
  setisModalDeleteVisible, */
}) => {
  const [ellipsis, setellipsis] = useState(true);
  let date = new Date(oneNew?.date);
  date.setMinutes(date.getMinutes() + new Date().getTimezoneOffset());
  date =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return (
    <>
      <Col className="my-own-card-news" xs={24} sm={24} md={18} lg={18} xl={18}>
        <Tag
          color={oneNew?.acceptance === "Aceptado" ? "green" : "yellow"}
          style={{ marginTop: "5px", marginBottom: "5px" }}
        >
          {oneNew?.acceptance === "Aceptado"
            ? "Publicada"
            : oneNew?.acceptance === "Pendiente"
            ? "En estado de Aprobación"
            : "Rechazada"}
        </Tag>
        <br />
        <Text>{date}</Text>
        <Title level={2} style={{ margin: "10px 0" }}>
          {oneNew?.title}
        </Title>
        <Divider style={{ margin: "5px 0" }} />
        <Paragraph
          ellipsis={
            ellipsis
              ? {
                  rows: 5,
                  expandable: false,
                  symbol: "mostras mas",
                }
              : false
          }
          style={
            !ellipsis
              ? {
                  minHeight: "200px",
                  maxHeight: "350px",
                  overflow: "auto",
                  fontSize: "20px",
                }
              : {
                  fontSize: "20px",
                }
          }
        >
          {oneNew?.content}
        </Paragraph>
        <Button
          type="link"
          onClick={() => {
            setellipsis(!ellipsis);
          }}
        >
          {ellipsis ? "mostrar mas" : "mostrar menos"}
        </Button>
        <Divider style={{ margin: "5px 0" }} />
        <Text style={{ margin: "10px 0" }}>
          Autor:{" "}
          <strong>
            {oneNew?.User?.firstName + " " + oneNew?.User?.firstName}
          </strong>
        </Text>
        <div style={{ marginBottom: "1em" }}>
          <Button
            type="primary"
            onClick={() => {
              Modal.confirm({
                title: "¿Publicar noticia?",
                content: (
                  <>
                    <p>Noticia: </p>
                    <strong>{oneNew?.title}</strong>
                  </>
                ),
                onOk: async () => {
                   await onAccept(oneNew);
                },
                onCancel:  () => {},
                okText: "Publicar",
                cancelText: "Cancelar",
              });
              /*  setnewsTarget(oneNew);
              setIsModalFormVisible(true); */
            }}
          >
            Publicar
          </Button>
          <Button
            type="danger"
            onClick={() => {
              Modal.confirm({
                title: "¿Rechazar noticia?",
                content: (
                  <>
                    <p>Noticia: </p>
                    <strong>{oneNew?.title}</strong>
                  </>
                ),
                onOk:async () => {
                    await onReject(oneNew);
                },
                onCancel: () => {},
                okText: "Rechazar",
                cancelText: "Cancelar",
              });
              /* setnewsTarget(oneNew);
              setisModalDeleteVisible(true); */
            }}
          >
            Rechazar
          </Button>
        </div>
      </Col>
    </>
  );
};

export default function MyNews({ getNews, setNews, userId = 0, list = [] }) {
  /* const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [isModalDeleteVisible, setisModalDeleteVisible] = useState(false); */
  //const [newsTarget, setnewsTarget] = useState(null);

  /* const handleOkForm = () => {
    setnewsTarget(null);
    getNews();
    setIsModalFormVisible(false);
  };

  const handleCancelForm = () => {
    setnewsTarget(null);
    setIsModalFormVisible(false);
  }; */

  /* const handleOkDelete = () => {
    NewsService.deleteNew(newsTarget.id)
      .then((res) => {
        if (res.data.success) {
          message.success("Noticia eliminada.", 3);
          setnewsTarget(null);
          setisModalDeleteVisible(false);
          getNews();
        } else {
          message.error(res.data.description, 5);
        }
      })
      .catch((e) => {
        console.log("error", e.message);
        message.error("Hubo un error. " + e.message, 5);
      });
  }; */

  /*  const handleCancelDelete = () => {
    setnewsTarget(null);
    setisModalDeleteVisible(false);
  }; */

  const updateNews = async () => {
    try {
      let response = await getNews();
      setNews(response);
    } catch (e) {
      message.error({
        content: "No se pudo actualizar la lista de noticias",
        key: "update",
        duration: 4,
      });
    }
  };

  const onAccept = (myNew) => {
    let newR = {
      id: myNew.id,
      acceptance: "Aceptado",
    };
    message.loading({ content: "Actualizando...", key: "update" });
    NewsService.changeState(newR)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Noticia publicada", 3);
          await updateNews();
          message.success({
            content: "Actualizado",
            key: "update",
            duration: 5,
          });
        } else {
          message.error({
            content: "Hubo un error. " + res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        console.log("error", e.message);
        message.error({
          content: "Error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };

  const onReject = (myNew) => {
    let newR = {
      id: myNew.id,
      acceptance: "Rechazado",
    };
    message.loading({ content: "Actualizando...", key: "update" });
    NewsService.changeState(newR)
      .then(async (res) => {
        if (res.data?.success) {
          message.success("Noticia rechazada", 3);
          await updateNews();
          message.success({
            content: "Actualizado",
            key: "update",
            duration: 5,
          });
        } else {
          message.error({
            content: "Hubo un error. " + res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        console.log("error", e.message);
        message.error({
          content: "Error. " + e.message,
          key: "update",
          duration: 5,
        });
      });
  };
  return (
    <>
      <Row justify="center" gutter={[0, 24]}>
        <Col
          style={{ display: "flex", justifyContent: "flex-end" }}
          xs={{ span: 22 }}
          sm={{ span: 22 }}
          md={{ span: 22 }}
          lg={{ span: 22 }}
          xl={{ span: 22 }}
        >
          {/* <Button
            type="primary"
            onClick={() => {
              setIsModalFormVisible(true);
            }}
          >
            Registrar nueva noticia
          </Button> */}
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "1em" }}>
        {list.map((n) => (
          <MyCardParagraph
            key={n.id}
            oneNew={n}
            //setIsModalFormVisible={setIsModalFormVisible}
            // setnewsTarget={setnewsTarget}
            // setisModalDeleteVisible={setisModalDeleteVisible}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))}
      </Row>
      {/*   {isModalFormVisible && (
        <NewsForm
          isModalVisible={isModalFormVisible}
          handleOk={handleOkForm}
          handleCancel={handleCancelForm}
          userId={userId}
          newsTarget={newsTarget}
        />
      )}
      {isModalDeleteVisible && (
        <Modal
          title={`¿Desea eliminar la noticia?`}
          visible={isModalDeleteVisible}
          onOk={handleOkDelete}
          okText="Aceptar"
          cancelText="Cancelar"
          onCancel={handleCancelDelete}
        >
          <p>
            {`¿Desea eliminar la noticia con título: `}
            <strong>{newsTarget?.title}</strong>?
          </p>
        </Modal>
      )} */}
    </>
  );
}
