import React from "react";
import { Row, Col, Image } from "antd";
import { useSelector } from "react-redux";
/* import { useSelector, useDispatch } from "react-redux";
import { selectTheme, changetheme } from "../../../Auth/themeReducer"; */
import { useThemeSwitcher } from "react-css-theme-switcher";
import { selectCenterInformation } from "../../../Auth/centerInformationReducer";

export default function Home() {
  const { currentTheme } = useThemeSwitcher();
  const laa=useSelector(selectCenterInformation);
  return (
    <>
    {console.log("userCenterInformation",laa)}
      <Row align="center" style={{ marginTop: "4em", marginLeft:"1em", marginRight:"1em" }}>
        <Col
          xs={{ span: 14, offset: 0 }}
          sm={{ span: 14, offset: 0 }}
          md={{ span: 14, offset: 0 }}
          lg={{ span: 12, offset: 0 }}
          xl={{ span: 12, offset: 0 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: "100%" }}
            src={`${process.env.PUBLIC_URL}/ucbnacional.png`}
            preview={false}
          />
        </Col>
        <Col
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
          }}
          xs={{ span: 14, offset: 0 }}
          sm={{ span: 14, offset: 0 }}
          md={{ span: 14, offset: 0 }}
          lg={{ span: 10, offset: 0 }}
          xl={{ span: 10, offset: 0 }}
        >
          {currentTheme === "dark" ? (
            <Image
              style={{ width: "80%" }}
              src={`${process.env.PUBLIC_URL}/LogoCiceiVertical.png`}
              preview={false}
            />
          ) : (
            <Image
              style={{ width: "80%" }}
              src={`${process.env.PUBLIC_URL}/LogoCiceiGreenVertical.png`}
              preview={false}
            />
          )}
        </Col>
      </Row>
    </>
  );
}
