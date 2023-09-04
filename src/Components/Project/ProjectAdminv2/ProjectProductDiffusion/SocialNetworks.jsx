import React from "react";
import { Button, Table, Col, Row, Space } from "antd";
const url_api = process.env.REACT_APP_API_URL;

const getColumns = (
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
      title: "Contenido Principal",
      dataIndex: "description",
      width: "150px",
      key: "description",
      render: (text, record) => <span>{record?.description || ""}</span>,
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
      title: "Url Pagina",
      dataIndex: "url",
      width: "150px",
      key: "url",
      render: (text, record) => <span>{record?.url || ""}</span>,
    },
    {
      title: "Redes Sociales",
      dataIndex: "socialNetworks",
      width: "150px",
      key: "socialNetworks",
      render: (text, record) => {
        let SocialNetworksObj = record?.socialNetworks
          ? JSON.parse(record?.socialNetworks)
          : null;
        let component =
          typeof SocialNetworksObj === "object" &&
          SocialNetworksObj?.length > 0 ? (
            SocialNetworksObj.map((socialNetwork) => (
              <p
                key={`${socialNetwork?.name}${socialNetwork?.linkSocialNetwork}`}
              >{`${socialNetwork?.name} - ${socialNetwork?.linkSocialNetwork}`}</p>
            ))
          ) : (
            <span>Sin redes.</span>
          );
        return component;
      },
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
          durationObj?.hours >= 0 &&
          durationObj?.minutes >= 0 ? (
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
  if (/* projectState */ true) {
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
              onSelectProductToDelete(record);
            }}
          >
            Eliminar
          </Button>
          {/*  <Button type="link" onClick={() => {setproductTarget(record);showModalChangeProgress()}}>
            Editar Estado
          </Button> */}
        </Space>
      ),
    });
  }
  return cols;
};

export default function SocialNetworks({
  list = [],
  onSelectProductToEdit,
  onSelectProductToDelete,
  onSelectToUpload,
  onSelectFileProductToDelete,
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
