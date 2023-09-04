import { useState, useEffect } from "react";
import { Table, Row, Col, Typography, Tooltip, Input, message } from "antd";
import LineService from "../../../services/LineService";
import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectCenterInformation } from "../../../Auth/centerInformationReducer";
const { Title } = Typography;

export default function Information() {
  const [groups, setGroups] = useState([]);
  const [linesUCB, setLinesUCB] = useState([]);
  const centerData=useSelector(selectCenterInformation).centerInformation;
  const getAllLines = async () => {
    try {
      let {
        data: { response, success = false, description = "" },
      } = await LineService.getAllLines();
      if (success) {
        console.log(response)
        setGroups(response?.Groups || []);
        setLinesUCB(response?.LinesUCB || []);
      } else {
        message.warning("Algo salio mal." + description, 4);
      }
    } catch (error) {
      message.error("Error. " + error.message, 4);
    }
  };
  const columns = [
    {
      title: "Grupos "+centerData.acronym,
      dataIndex: "id",
      key: "group",
      render: (text, record) => <span>{record?.name}</span>,
    },
    {
      title: "Líneas "+centerData.acronym,
      dataIndex: "lines",
      key: "lines",
      render: (text, record) => {
        let lines = record?.Lines?.map((line) => (
          <p key={line?.id}>{line?.name}</p>
        ));
        return <> {lines}</>;
      },
    },
  ];
  const columnsUCB = [
      {
        title: "Líneas "+ centerData.Campus.name,
        dataIndex: "id",
        key: "line",
        render: (text, record) => <span>{record?.name}</span>,
      },
     
    ];
  useEffect(() => {
    getAllLines();
  }, []);

  return (
    <>
      <Title
        level={3}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Líneas {centerData.acronym}
      </Title>
      <Row>
        <Col span={20} offset={2}>
          <Table rowKey="id" columns={columns} dataSource={groups} />
        </Col>
      </Row>
      <Title
        level={3}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Líneas {centerData.Campus.name}
      </Title>
      <Row>
        <Col span={20} offset={2}>
          <Table rowKey="id" columns={columnsUCB} dataSource={linesUCB} />
        </Col>
      </Row>
    </>
  );
}
