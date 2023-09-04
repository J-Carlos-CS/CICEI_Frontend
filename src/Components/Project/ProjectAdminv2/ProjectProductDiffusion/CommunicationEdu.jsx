import React from "react";
import { Button, Table, Col, Row, Space } from "antd";
const url_api = process.env.REACT_APP_API_URL;

const getColumns = (
  projectState,
  onSelectProductToEdit,
  onSelectProductToDelete,
  onSelectToUpload,
  onSelectFileProductToDelete
) => {
  let cols = [
    {
      title: "Tipo de Producto",
      dataIndex: "typeCategory",
      key: "typeCategory",
      width: "100px",
      render: (text, record) => <span>{record?.DiffusionCategory?.name}</span>,
      fixed: "left",
    },
    {
      title: "Autores",
      dataIndex: "authors",
      key: "authors",
      width: "100px",
      render: (text, record) => {
        let authorList =
          record?.DiffusionAuthors?.map(
            (author) => author.User?.firstName + " " + author.User?.lastName
          ) || [];
        authorList = authorList.join(", ");

        let component = <span>{authorList}</span>;
        return component;
      },
    },
    {
      title: "Título",
      dataIndex: "title",
      width: "150px",
      key: "title",
      render: (text, record) => <span>{record?.title || ""}</span>,
    },
    {
      title: "Objetivo",
      dataIndex: "target",
      width: "150px",
      key: "target",
      render: (text, record) => <span>{record?.target || ""}</span>,
    },
    {
      title: "Público Objetivo",
      dataIndex: "publicTarget",
      width: "150px",
      key: "publicTarget",
      render: (text, record) => <span>{record?.publicTarget || ""}</span>,
    },
    {
      title: "Duración",
      dataIndex: "duration",
      width: "150px",
      key: "duration",
      render: (text, record) => {
        let durationObj = record?.duration
          ? JSON.parse(record?.duration)
          : null;
        let component =
          typeof durationObj === "object" &&
          durationObj?.hours &&
          durationObj?.minutes ? (
            <span>{`${durationObj?.hours}h:${durationObj?.minutes}m`}</span>
          ) : (
            <span>Sin duración</span>
          );
        return component;
      },
    },
    {
      title: "Línea UCB",
      dataIndex: "line",
      width: "150px",
      key: "line",
      render: (text, record) => (
        <span>{record?.Line?.name || "Sin línea"}</span>
      ),
    },
    {
      title: "Acciones sobre Archivo",
      dataIndex: "file",
      width: "150px",
      key: "file",
      render: (text, record) => {
        return (
          <>
            {record.DiffusionFiles?.length > 0 ? (
              <>
                <a
                  href={`${url_api}/file/diffusionproductrestrictfile/fileProduct/${
                    record.DiffusionFiles[0]?.id || 0
                  }/repositoryfile?name=${
                    record.DiffusionFiles[0]?.name || "naranjas"
                  }`}
                >
                  Descargar archivo
                </a>
                <Button
                  type="link"
                  onClick={() => {
                    onSelectFileProductToDelete(record);
                  }}
                >
                  Eliminar
                </Button>
              </>
            ) : (
              <Button
                type="link"
                onClick={() => {
                  onSelectToUpload(record);
                }}
              >
                Subir archivo
              </Button>
            )}
          </>
        );
      },
    },
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
              onSelectProductToEdit(record);
            }}
          >
            Editar
          </Button>
          <Button
            type="link"
            onClick={() => {
              onSelectProductToDelete(record)
            }}
          >
            Eliminar
          </Button>
          {/* <Button
            type="link"
            onClick={() => {
              onSelectProductToDelete(record);
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

export default function CommunicationEdu({
  list = [],
  projectState = true,
  onSelectProductToEdit,
  onSelectProductToDelete,
  onSelectToUpload,
  onSelectFileProductToDelete
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
        {/* <Button type="primary" onClick={() => {}}>
          + Añadir Producto
        </Button> */}
      </Col>
      <Col span={24}>
        <Table
          columns={getColumns(
            projectState,
            onSelectProductToEdit,
            onSelectProductToDelete,
            onSelectToUpload,
            onSelectFileProductToDelete
          )}
          dataSource={list}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Col>
    </Row>
  );
}
