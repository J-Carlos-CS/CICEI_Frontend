import React from "react";
import { Table, Button } from "antd";
import XLSXGenerator from "../XLSXGenerator";
const columns = [
  {
    title: "Tipo de Trabajo",
    dataIndex: "typeStudentJob",
    key: "typeStudentJob",
    render: (text, record) => <span>{record?.TypeInvestigation?.name}</span>,
  },
  {
    title: "Título",
    dataIndex: "title",
    key: "title",
    render: (text, record) => <span>{record?.titleDocument}</span>,
  },
  {
    title: "Estudiante",
    dataIndex: "student",
    key: "student",
    render: (text, record) =>
      `${record?.UserProject?.User?.firstName} ${record?.UserProject?.User?.lastName}`,
  },
  {
    title: "Semestre inicio",
    dataIndex: "semesterStart",
    key: "semesterStart",
    render: (text, record) =>
      `${record?.SemesterStart?.name}-${record?.SemesterStart?.year}`,
  },
  {
    title: "Semestre final",
    dataIndex: "semesterEnd",
    key: "semesterEnd",
    render: (text, record) => {
      return record?.SemesterEnd
        ? `${record?.SemesterEnd?.name}-${record?.SemesterEnd?.year}`
        : "Pendiente de Defensa";
    },
  },
  {
    title: "Carrera",
    dataIndex: "career",
    key: "career",
    render: (text, record) => `${record?.Career?.name}`,
  },
  {
    title: "Grado Académico",
    dataIndex: "grade",
    key: "grade",
    render: (text, record) => `${record?.Grade?.name} ${record?.grade}`,
  },
  {
    title: "Institución",
    dataIndex: "institution",
    key: "institution",
    render: (text, record) => `${record?.Institution?.name}`,
  },
];
export default function Tutorials({ tutorials = [] }) {
  const exportStudentJobs = () => {
    XLSXGenerator.studentJobsXLSX(tutorials);
  };
  return (
    <>
      <Button type="primary" onClick={exportStudentJobs}>
        Exportar a Excel
      </Button>
      <Table rowKey="id" columns={columns} dataSource={tutorials} />
    </>
  );
}
