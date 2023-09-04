import React, { useState } from "react";
import { Row, Col, Typography, Card, Button, Input } from "antd";
import { useHistory } from "react-router";

const { Title } = Typography;

export default function Tutorials({ list = [] }) {
  const history = useHistory();
  const [filter, setFilter] = useState({ filterText: "" });
  const getProjectTutorials = (myTutorials, myFilter) => {
    let listProjects = [];
    /*
        {
        id:projectid,
        name: nameProject,
        code: codeProject,
        StudentJobs:[{}]
        }
        */
    myTutorials.forEach((tutorial) => {
      let pos = 0;
      let isProject = listProjects.some((project, index) => {
        if (project.id === tutorial.UserProject.Project.id) {
          pos = index;
          return true;
        } else {
          return false;
        }
      });

      if (isProject) {
        listProjects[pos].StudentJobs.push(tutorial);
      } else {
        let myProject = {
          id: tutorial.UserProject.Project.id,
          name: tutorial.UserProject.Project.title,
          code: tutorial.UserProject.Project.code,
          StudentJobs: [],
        };
        myProject.StudentJobs.push(tutorial);
        listProjects.push(myProject);
      }
    });

    if(myFilter?.filterText !== ""){
        return listProjects.filter(p => {
            if(`${p.code}-${p.name}`.toLowerCase().indexOf(myFilter?.filterText.toLowerCase()) >= 0){
                return true;
            } else {
                return false;
            }
        })
    } else {
        return listProjects;
    }
  };

  const onSearch = (value) => {
    setFilter({ filterText: value.target.value });
  };

  return (
    <Row align="center" style={{ marginBottom: "2em" }}>
      <Col span={14} style={{ display: "flex", justifyContent: "center" }}>
        <Input
          placeholder="Buscador por proyecto"
          /* onSearch={onSearch} */ onChange={onSearch}
        />
      </Col>
      <Col span={24}>
        {getProjectTutorials(list, filter).map((p) => {
          return (
            <Row align="center" key={p.id} style={{ marginTop: "2em" }}>
              <Col span={24}>
                <Title level={3}>{p.code + "-" + p.name}</Title>
                <Row gutter={[16, 16]} align="center">
                  {p.StudentJobs.map((sj) => {
                    return (
                      <Col key={sj.id} xs={20} sm={10} md={10} lg={10} xl={10}>
                        <Card
                          title={sj.TypeInvestigation?.name}
                          bordered={false}
                          actions={[
                            <Button
                              type="link"
                              onClick={() => {
                                history.push(`/project/viewforuser/${p.id}`);
                              }}
                            >
                              Ir al proyecto
                            </Button>,
                          ]}
                        >
                          <div>
                            <b>Titulo: </b>
                            {sj.titleDocument}
                          </div>
                          <div>
                            <b>Estudiante: </b>
                            {sj.UserProject?.User?.firstName +
                              " " +
                              sj.UserProject?.User?.lastName}
                          </div>
                          <div>
                            <b>Estado: </b>
                            {sj.Progress?.stateProgress}
                          </div>
                          <div>
                            <b>Semestre inicio: </b>
                            {sj.SemesterStart?.name +
                              "-" +
                              sj.SemesterStart?.year}
                          </div>
                          <div>
                            <b>Semestre fin: </b>
                            {sj.SemesterEnd
                              ? sj.SemesterEnd?.name +
                                "-" +
                                sj.SemesterEnd?.year
                              : "Pendiente de Defensa"}
                          </div>
                          <div>
                            <b>Aceptado?: </b>
                            {sj.acceptance}
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
          );
        })}
      </Col>
    </Row>
  );
}
