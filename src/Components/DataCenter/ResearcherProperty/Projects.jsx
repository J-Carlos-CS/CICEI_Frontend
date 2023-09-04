import React from "react";
import { Table, Button } from "antd";
import XLSXGenerator from '../XLSXGenerator.js';
const columns = [
  {
    title: "Título",
    dataIndex: "title",
    key: "title",
    render: (text, record) => <span>{record?.title}</span>,
  },
  {
    title: "Miembros",
    dataIndex: "members",
    key: "members",
    render: (text, record) => {
      let leader = "";
      let members = [];
      for (let userProject of record?.UserProjects) {
        if (userProject?.isMain) {
          leader = `${userProject?.User?.firstName} ${userProject?.User?.lastName}`;
        } else {
          members.push(
            `${userProject?.User?.firstName} ${userProject?.User?.lastName}`
          );
        }
      }
      return (
        <>
          <strong>{leader}</strong>
          {members?.map((member, index) => (
            <div key={index}>{member}</div>
          ))}
        </>
      );
    },
  },
  {
    title: "Fecha inicio",
    dataIndex: "startDate",
    key: "startDateId",
    render: (text, record) => {
      let date = new Date(record?.startDate);
      return date.toLocaleDateString("es-es");
    },
  },
  {
    title: "Fecha final",
    dataIndex: "endDate",
    key: "endDateId",
    render: (text, record) => {
      let date = new Date(record?.endDate);
      return date.toLocaleDateString("es-es");
    },
  },
];
export default function ProjectsInvolved({ projects = [] }) {
  const exportMyProjcts = () => {
    XLSXGenerator.myProjectsXLSX(projects);
  };
  return (
    <>
      <Button type="primary" onClick={exportMyProjcts}>
        Exportar a Excel
      </Button>
      <Table rowKey="id" columns={columns} dataSource={projects} />
    </>
  );
}
