import { useState } from "react";
import { Typography, Row, Col, Card, Empty, Button, Input } from "antd";
import { useHistory } from "react-router";
const { Search } = Input;
const { Text } = Typography;

export default function OtherProjects({ list = [] }) {
  //console.log("list", list);
  let history = useHistory();
  const [filter, setFilter] = useState("");
  const getActions = (p) => {
    let actionList = [];
    actionList.push(
      <Button
        type="primary"
        ghost
        onClick={() => {
          history.push(`/project/viewforuser/${p.id}`);
        }}
      >
        Ir al proyecto
      </Button>
    );
    if (p.state === false) {
      actionList.push(<span>Proyecto Finalizado</span>);
    }

    return actionList;
  };
  const onSearch = (value) => {
    setFilter(value?.target?.value);
  };
  const projectsFilter = () => {
    if (filter === "") {
      return list;
    } else {
      return list.filter(
        (project) =>
          project?.title?.toLowerCase()?.indexOf(filter.toLocaleLowerCase()) >=
          0
      );
    }
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
            <Text>Estos son otros proyectos a los que no pertences:</Text>
          </Col>
        </Row>
      ) : (
        <Row align="center" style={{ marginTop: "1.5em" }}>
          <Col span={24}>
            <Empty
              imageStyle={{
                height: 60,
              }}
              description={<span>No existen otros proyectos.</span>}
            ></Empty>
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]} align="center">
        {projectsFilter()?.map((p) => (
          <Col key={p.id} xs={20} sm={10} md={10} lg={10} xl={10}>
            <Card title={p.code} bordered={false} actions={getActions(p)}>
              {p.title}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
