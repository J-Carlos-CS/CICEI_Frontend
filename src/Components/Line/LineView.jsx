import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Row, Col, Divider, Typography, Card, message, Button } from "antd";
import { useSelector } from "react-redux";
import { selectUser } from "../../Auth/userReducer";
import LineService from "../../services/LineService";
import LoaderSpin from "../Layouts/Loader/LoaderSpin";
const { Title, Text } = Typography;

export default function LineView() {
  const userSesion = useSelector(selectUser);
  const history = useHistory();
  const params = useParams();
  const lineId = params.id || null;
  const [line, setLine] = useState(null);
  const [isLoading, setisLoading] = useState({
    status: "loading",
    message: "",
  });

  useEffect(() => {
    if (lineId) {
      getLine(lineId);
    }
  }, [lineId]);

  const getLine = (id) => {
    LineService.getLineByIdForView(id)
      .then((res) => {
        if (res.data?.success) {
          const lineData = res.data?.response;
          setLine({
            ...lineData,
            LineProjects: lineData.LineProjects.filter((lp) => {
              return lp.status === true && lp.Project.status === true;
            }),
          });
          setisLoading({ status: "success", message: res.data?.description });
        } else {
          message.error(res.data?.description, 3);
          setisLoading({ status: "error", message: res.data?.description });
        }
      })
      .catch((e) => {
        console.log(e.message);
        message.error(
          "Hubo un error en el servidor al intentar obtener la línea.",
          3
        );
        setisLoading({ status: "error", message: e.message });
      });
  };

  if (isLoading.status === "loading" || isLoading.status === "error") {
    return <LoaderSpin isLoading={isLoading} />;
  }

  return (
    <>
      <Row align="center" style={{ marginTop: "25px" }}>
        <Col
          xs={{ span: 20 }}
          sm={{ span: 16 }}
          md={{ span: 16 }}
          lg={{ span: 16 }}
          xl={{ span: 16 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Title>{line?.name}</Title>
        </Col>
      </Row>
      <Divider>
        <Title level={4}>Descripción</Title>
      </Divider>
      <Row align="center" style={{ marginTop: "25px" }}>
        <Col span={20} style={{ display: "flex", justifyContent: "center" }}>
          <Text italic>{line?.description}</Text>
        </Col>
        <Col span={20} style={{ display: "flex", justifyContent: "center" }}>
          <Text italic>
            <b>{`Code: ${line?.code}`}</b>
          </Text>
        </Col>
      </Row>

      <Row align="center" style={{ marginTop: "25px" }}>
        <Col span={20}>
          <Divider>
            <Title level={4}>Proyectos</Title>
          </Divider>
        </Col>
      </Row>

      {userSesion.rolName === "Administrador" ||
      userSesion.id === line?.Group?.userId ? (
        <>
          <Row align="center" style={{ marginTop: "25px" }}>
            <Col
              span={20}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <Button
                type="primary"
                onClick={() => {
                  history.push(
                    `/project/form?lineId=${line.id}&&groupId=${line.Group?.id}`
                  );
                }}
              >
                +Crear Proyecto
              </Button>
            </Col>
          </Row>
        </>
      ) : null}

      <Row
        align="center"
        style={{ marginTop: "25px", marginBottom: "25px" }}
        gutter={[24, 32]}
      >
        {line.LineProjects.map((lp) => (
          <Col
            key={lp.id}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 7 }}
            xl={{ span: 7 }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              style={{ width: "300px", borderRadius: "5px" }}
              onClick={() => {
                history.push(`/project/view/${lp.Project.id}`);
              }}
            >
              <p>
                <b>{lp.Project.title}</b>
              </p>
              <p>{lp.Project.code}</p>
              <p>{lp.Project.descritption}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
