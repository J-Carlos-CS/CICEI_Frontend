import { useState } from "react";
import { Typography, Row, Col, Divider, Button } from "antd";
import ReactHtmlParser from "react-html-parser";
import "./News.css";
const { Title, Text, Paragraph } = Typography;

const MyCardParagraph = ({ oneNew = null }) => {
  console.log("new", oneNew);
  const [ellipsis, setellipsis] = useState(true);
  let date = new Date(oneNew?.date);
  date.setMinutes(date.getMinutes() + new Date().getTimezoneOffset());
  date =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
 /*  const htmlDecode = (input) => {
    var e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }; */
  /*  htmlDecode(input){
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    } */
  return (
    <>
      <Col className="my-own-card-news" xs={24} sm={24} md={18} lg={18} xl={18}>
        <Text style={{ display: "flex", justifyContent: "center" }}>
          {date}
        </Text>
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
           <div>{ReactHtmlParser(oneNew?.content)}</div>
          {/*  <div dangerouslySetInnerHTML={{ __html: oneNew?.content }} /> */}
          {/* <div
            dangerouslySetInnerHTML={{
              __html: htmlDecode(oneNew?.content),
            }}
          />{" "} */}
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
        <Text
          style={{
            margin: "10px 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Autor:{" "}
          <strong>
            {oneNew?.User?.firstName + " " + oneNew?.User?.lastName}
          </strong>
        </Text>
      </Col>
    </>
  );
};

export default function AllNews({ list = [] }) {
  return (
    <Row gutter={[16, 16]} justify="space-around">
      {list.map((n) => (
        <MyCardParagraph key={n.id} oneNew={n} />
      ))}
    </Row>
  );
}
