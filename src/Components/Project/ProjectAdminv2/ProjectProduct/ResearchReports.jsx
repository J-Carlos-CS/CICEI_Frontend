import React from "react";
import { Space, Button, Table, Col, Row } from "antd";
const url_api = process.env.REACT_APP_API_URL;
const getColumns = (
  institutionsProject,
  setproductTarget,
  showModalForm,
  showModalDelete,
  showModalChangeProgress,
  projectState,
  showModalUpload,
  deleteFileProduct
) => {
  let cols = [
    {
      title: "Título",
      dataIndex: "title",
      width: "150px",
      key: "title",
      render: (text, record) => <span>{record.title || ""}</span>,
    },
    {
      title: "Autores",
      dataIndex: "authors",
      key: "authors",
      width: "100px",
      render: (text, record) => {
        let authorList = record.Authors?.map(
          (author) => author.User?.firstName + " " + author.User?.lastName
        );
        authorList = authorList.toString();

        let component = <span>{authorList}</span>;
        return component;
      },
    },
    {
      title: "Línea UCB",
      dataIndex: "line",
      width: "150px",
      key: "line",
      render: (text, record) => <span>{record.Line?.name || "Sin línea"}</span>,
    },
    {
      title: "Institución Financiadora",
      dataIndex: "institutionId",
      width: "150px",
      key: "institutionId",
      render: (text, record) => {
        let institutionList = institutionsProject.filter(
          (ip) => ip.isFinancier
        );
        institutionList = institutionList.map((ip) => ip.Institution?.name);
        institutionList = institutionList.toString();

        let component = <span>{institutionList}</span>;
        return component;
      },
    },
    {
      title: "Acciones sobre Archivo",
      dataIndex: "file",
      width: "150px",
      key: "file",
      render: (text, record) => {
        return (
          <>
            {record.FileProducts?.length > 0 ? (
              <>
                <a
                  href={`${url_api}/file/downloadproductrestrictfile/fileProduct/${
                    record.FileProducts[0]?.id || 0
                  }/repositoryfile?name=${
                    record.FileProducts[0]?.name || "naranjas"
                  }`}
                >
                  Descargar archivo
                </a>
                <Button
                  type="link"
                  onClick={() => {
                    //setproductTarget(record);
                    deleteFileProduct(record);
                  }}
                >
                  Eliminar
                </Button>
              </>
            ) : (
              <Button
                type="link"
                onClick={() => {
                  setproductTarget(record);
                  showModalUpload();
                }}
              >
                Subir archivo
              </Button>
            )}
          </>
        );
      },
    },
    /*  {
      title: "Progreso",
      dataIndex: "progress",
      width: "150px",
      key: "progress",
      render: (text, record) => {
        return (
          <>
            <Tag color="gold">
              {record.Progress?.stateProgress || "Pendiente"}
            </Tag>
            <Tag color="lime">{(record.progress || 0) + "%"}</Tag>
          </>
        );
      },
    }, */
  ];

  if (projectState) {
    cols.push({
      title: "Acciones",
      key: "action",
      width: "150px",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setproductTarget(record);
              showModalForm(true);
            }}
          >
            Editar
          </Button>
          <Button
            type="link"
            onClick={() => {
              setproductTarget(record);
              showModalDelete();
            }}
          >
            Eliminar
          </Button>
          {/* <Button
            type="link"
            onClick={() => {
              setproductTarget(record);
              showModalChangeProgress();
            }}
          >
            Editar Estado
          </Button> */}
        </Space>
      ),
    });
  }
  return cols;
};

export default function ResearchReports({
  list = [],
  InstitutionProjects,
  setproductTarget,
  showModalForm,
  showModalDelete,
  showModalChangeProgress,
  projectState = true,
  showModalUpload,
  deleteFileProduct,
}) {
  return (
    <Row justify="center" gutter={[0, 24]}>
      <Col
        xs={{ span: 6, offset: 1 }}
        sm={4}
        md={{ span: 6, offset: 4 }}
        lg={{ span: 6, offset: 4 }}
        xl={{ span: 6, offset: 4 }}
      ></Col>
      <Col
        xs={{ span: 6, offset: 11 }}
        sm={4}
        md={{ span: 6, offset: 8 }}
        lg={{ span: 6, offset: 8 }}
        xl={{ span: 6, offset: 8 }}
      >
        {/*   <Button
      type="primary"
      onClick={() => {
      }}
    >
      + Añadir Producto
    </Button> */}
      </Col>
      <Col span={24}>
        <Table
          columns={getColumns(
            InstitutionProjects,
            setproductTarget,
            showModalForm,
            showModalDelete,
            showModalChangeProgress,
            projectState,
            showModalUpload,
            deleteFileProduct
          )}
          dataSource={list}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Col>
    </Row>
  );
}
