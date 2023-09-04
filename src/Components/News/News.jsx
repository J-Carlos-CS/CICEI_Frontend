import { useState, useEffect, useCallback } from "react";
import { Typography, Row, Col, Tabs, message } from "antd";
import { ContactsOutlined, ContainerOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectUser } from "../../Auth/userReducer";
import NewsService from "../../services/NewsService.js";
import AllNews from "./AllNews";
import MyNews from "./MyNews";
import NewsPending from './NewsPending';
import LoaderSpin from "../Layouts/Loader/LoaderSpin";
//import Moment from "moment";
const { Title } = Typography;
const { TabPane } = Tabs;

export default function News() {
  const user = useSelector(selectUser);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState({
    status: "loading",
    message: "",
  });
  const getNews = useCallback(() => {
    return new Promise((resolve, reject) => {
      NewsService.getNews()
        .then((res) => {
          if (res.data?.success) {
           /*  let sortNews = res.data.response.sort(
              (a, b) =>
                new Moment(b.date).format("YYYYMMDD") -
                new Moment(a.date).format("YYYYMMDD")
            ); */
            resolve({
              all: res.data.response.filter(n=> n.acceptance === "Aceptado"),
              myNews: res.data.response.filter((n) => n.userId === user.id),
              newsPending: res.data.response.filter(n=> n.acceptance === "Pendiente")
            });
          } else {
            reject({
              status: "error",
              message: "Hubo un error. " + res.data?.description ,
            });
          }
        })
        .catch((e) => {
          //console.log("error.", e.message);
          //message.error("Hubo un error. " + "alokado", 5);
          reject({ status: "error", message: "Hubo un error. " + e.message });
        });
    });
  }, [user.id]);

  const getData = useCallback(() => {
    let promises = [getNews()];

    Promise.allSettled(promises)
      .then((results) => {
        let statusRequests = { status: "success", message: "" };
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            statusRequests = result.reason;
            //console.log('estatus',statusRequests);
            message.error("Hubo un error. ", 5);
          } else {
            switch (index) {
              case 0:
                setNews(result.value);
                break;
              default:
                break;
            }
          }
        });
        setIsLoading(statusRequests);
      })
      .catch((e) => {
        console.log("error", e.message);
      });
  }, [getNews]);

  useEffect(() => {
    getData();
    return () => {
    }
  }, [getData]);

  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }

  return (
    <>
      <Row justify="center">
        <Col
          span={18}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title level={2}>Noticias</Title>
        </Col>
      </Row>

      <Row justify="center">
        <Col span={24}>
          <Tabs defaultActiveKey="1" centered destroyInactiveTabPane={true}>
            <TabPane
              tab={
                <span>
                  <ContainerOutlined /> Noticias
                </span>
              }
              key="1"
            >
              <AllNews list={news?.all} />
            </TabPane>
            {user.rolName !== "Estudiante" && (
              <TabPane
                tab={
                  <span>
                    <ContactsOutlined /> Mis Noticias
                  </span>
                }
                key="2"
              >
                <MyNews
                  setNews={setNews}
                  getNews={getNews}
                  userId={user?.id}
                  list={news?.myNews}
                />
              </TabPane>
            )}
            {user.rolName === "Administrador" && (
              <TabPane
                tab={
                  <span>
                    <ContactsOutlined /> Noticias pendientes
                  </span>
                }
                key="3"
              >
                <NewsPending
                  getNews={getNews}
                  setNews={setNews}
                  userId={user?.id}
                  list={news?.newsPending}
                />
              </TabPane>
            )}
          </Tabs>
        </Col>
      </Row>
    </>
  );
}
