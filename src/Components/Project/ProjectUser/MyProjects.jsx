import { useState } from "react";
import { Typography, Row, Col, Card, Empty, Tag, Button, Input } from "antd";
//import { EyeOutlined, ControlOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import "./MyProjects.css";
const { Search } = Input;

const { Text } = Typography;

/* <Tooltip title="Ver proyecto" color="blue" key="blue">
        <EyeOutlined
          key="view-project"
          onClick={() => {
            history.push(`/project/view/${userProject?.Project?.id}`);
          }}
        />{" "}
      </Tooltip> */

/*   <Tooltip title="Administrar proyecto" color="blue" key="blue">
          <ControlOutlined
            key="view-project"
            onClick={() => {
              history.push(`/project-panel/${userProject.Project?.id}`);
            }}
          />
        </Tooltip> */

export default function MyProjects({ list = [] }) {
  //console.log("liisss", list);
  let history = useHistory();
  const [filter, setFilter] = useState("");

  const onSearch = (value) => {
    setFilter(value?.target?.value);
  };
  const projectsFilter = () => {
    if (filter === "") {
      return list;
    } else {
      return list.filter(
        (userProject) =>
          userProject?.Project?.title
            ?.toLowerCase()
            ?.indexOf(filter.toLocaleLowerCase()) >= 0
      );
    }
  };

  const actionList = (userProject) => {
    let list = [];
    list.push(
      <Button
        type="primary"
        ghost
        onClick={() => {
          history.push(`/project/viewforuser/${userProject.projectId}`);
        }}
      >
        Ir al proyecto
      </Button>
    );
    if (userProject?.isMain) {
      list.push(
        <Button
          type="primary"
          ghost
          onClick={() => {
            history.push(`/project-panel/${userProject.projectId}`);
          }}
        >
          Administrar
        </Button>
      );
    }
    return list;
  };
  return (
    <>
      {list.length > 0 ? (
        <Row align="start" style={{ marginTop: "1.5em" }}>
          <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
            <Search
              placeholder="Buscar proyecto"
              //onSearch={onSearch}
              style={{
                width: "60vw",
              }}
              onChange={onSearch}
            />
          </Col>
          <Col span={24}>
            <Text>Eres miembro en estos Proyectos:</Text>
          </Col>
        </Row>
      ) : (
        <Row align="center" style={{ marginTop: "1.5em" }}>
          <Col>
            <Empty
              imageStyle={{
                height: 60,
              }}
              description={<span>Aun no pertences a ningun proyecto.</span>}
            ></Empty>
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]} align="center">
        {projectsFilter()?.map((l) => (
          <Col key={l.id} xs={20} sm={10} md={10} lg={10} xl={10}>
            <Card
              title={`Code: ${l.Project?.code}`}
              bordered={false}
              actions={actionList(l)}
            >
              <div>
                <b>Proyecto: </b>
                {l.Project?.title}
              </div>
              {l.Project?.state ? (
                <div>
                  <b>Estado: </b>
                  Activo
                </div>
              ) : (
                <div>
                  <b>Estado: </b>
                  <Tag color="gold">Finalizado</Tag>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
