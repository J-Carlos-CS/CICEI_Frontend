import { useState } from "react";
import { Typography, Row, Col, Card, Button, Tag, message, Input } from "antd";
import { useHistory } from "react-router";
import ProjectChangeLine from "./../ProjectChangeLine";
import LineService from "../../../services/LineService";
const { Text } = Typography;
const { Search } = Input;

export default function ProjectsGroupLeader({
  list = [],
  getProjectsGroupsLeader,
  setuserProjects,
}) {
 // console.log("mylist", list);
  let history = useHistory();
  const [isModalChangeLineVisible, setIsModalChangeLineVisible] =
    useState(false);
  const [filter, setFilter] = useState("");

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
  const handleOkChange = (data) => {
    message.loading({ content: "Actualizando", key: "update" });
    LineService.changeLineProjects(data)
      .then(async (res) => {
        if (res.data?.success) {
          try {
            message.success("Proyectos actualizados");
            let response = await getProjectsGroupsLeader();
            //console.log("myResponse", response);
            setuserProjects((stt) => {
              return { ...stt, ...response };
            });
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
            setIsModalChangeLineVisible(false);
          } catch (e) {
            message.error({ content: e.message, key: "update", duration: 4 });
          }
        } else {
          message.error({
            content: res.data?.description,
            key: "update",
            duration: 5,
          });
        }
      })
      .catch((e) => {
        message.error({ content: e.message, key: "update", duration: 5 });
      });
  };

  const handleCancelChange = () => {
    setIsModalChangeLineVisible(false);
  };

  return (
    <>
      <Row align="start" gutter={[16, 16]} style={{ marginBottom: "1em" }}>
        <Col>
          <Text>
            Estos proyectos pertenecen a las líneas de tus grupos (No
            necesariamente eres miembro de estos proyectos pero puedes
            administrarlos):
          </Text>
        </Col>
      </Row>
      <Row align="center" style={{ marginBottom: "25px" }}>
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
              history.push(`/project/form`);
            }}
          >
            +Crear Proyecto
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setIsModalChangeLineVisible(true);
            }}
          >
            Mover Proyecto de Línea
          </Button>
        </Col>
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5em",
          }}
        >
          <Search
            placeholder="Buscar proyecto"
            //onSearch={onSearch}
            style={{
              width: "60vw",
            }}
            onChange={onSearch}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} align="center">
        {projectsFilter().map((l) => (
          <Col key={l.id} xs={20} sm={10} md={10} lg={10} xl={10}>
            <Card
              title={`Code: ${l.code}`}
              bordered={false}
              actions={[
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    history.push(`/project/viewforuser/${l.id}`);
                  }}
                >
                  Ir al proyecto
                </Button>,
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    history.push(`/project-panel/${l.id}`);
                  }}
                >
                  Administrar proyecto
                </Button>,
              ]}
            >
              <div>
                <b>Proyecto: </b>
                {l.title}
              </div>
              <div>
                <b>Línea: </b>
                {l.lineName}
              </div>
              <div>
                <b>Grupo: </b>
                {l.groupName}
              </div>
              {l.state ? (
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
        {isModalChangeLineVisible && (
          <ProjectChangeLine
            isVisible={isModalChangeLineVisible}
            handleCancel={handleCancelChange}
            handleOk={handleOkChange}
            projects={list}
          />
        )}
      </Row>
    </>
  );
}
