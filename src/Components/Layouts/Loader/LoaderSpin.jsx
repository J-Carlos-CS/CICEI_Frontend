import React from "react";
import {
  Typography,
  Row,
  Col
} from "antd";
import { Spin } from "antd";
import { LoadingOutlined, ExclamationCircleTwoTone } from "@ant-design/icons";
const { Title } = Typography;
//loading, success, error
export default function LoaderSpin({ isLoading:{status,message} }) {
  const antIcon = <LoadingOutlined style={{ fontSize: 74 }} spin />;
  return (
    <>
      {status === "loading" ? (
        <>
          <Row style={{ margin: "100px" }} justify="center">
            <Col>
              <Spin indicator={antIcon} />
            </Col>
          </Row>
          <Row style={{ margin: "100px" }} justify="center">
            <Col>
              <Title>Obteniendo información</Title>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row style={{ margin: "100px" }} justify="center">
            <Col>
              <ExclamationCircleTwoTone style={{ fontSize: 74 }} />
            </Col>
          </Row>
          <Row style={{ margin: "30px" }} justify="center">
            <Col>
              <Title>Algo inesperado sucedió.</Title>
            </Col>
          </Row>
          <Row style={{ marginTop: "30px" }} justify="center">
            <Col>
              <Title level={3}>Descripción del problema:</Title>
            </Col>
          </Row>
          <Row style={{ margin: "10px" }} justify="center">
          <Col>
            <span>{message}</span>
          </Col>
        </Row>
        </>
      )}
    </>
  );
}
