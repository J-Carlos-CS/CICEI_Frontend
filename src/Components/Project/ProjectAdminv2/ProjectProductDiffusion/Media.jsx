import React from "react";
import { Button, Table, Col, Row, Tabs, Modal, Space } from "antd";
import {
  BookOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
const url_api = process.env.REACT_APP_API_URL;
const { TabPane } = Tabs;

const viewModalTvChannels = (listString, title = "") => {
  let tvChannels = JSON.parse(listString);
  if (typeof tvChannels === "object" && tvChannels?.length > 0) {
    Modal.info({
      title: title,
      content: (
        <div style={{ maxHeight: "10em", overflowY: "auto" }}>
          {tvChannels.map((tvChannel) => (
            <div>
              <p>
                <strong>{tvChannel?.name || ""}</strong> -{" "}
                <span>{tvChannel?.country || ""}</span>
              </p>
            </div>
          ))}
        </div>
      ),
      onOk() {},
    });
  }
};
const viewModalEpisodes = (listString, title = "") => {
  let episodes = JSON.parse(listString);
  if (typeof episodes === "object" && episodes?.length > 0) {
    Modal.info({
      title: title,
      content: (
        <div style={{ maxHeight: "10em", overflowY: "auto" }}>
          {episodes.map((episode) => (
            <div>
              <p>
                <strong>{episode?.name || ""}</strong> -{" "}
                <span>
                  {episode?.hours}h-{episode?.minutes}m
                </span>
              </p>
            </div>
          ))}
        </div>
      ),
      onOk() {},
    });
  }
};

const getColumnsRadio = (
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
      title: "Resumen contenido",
      dataIndex: "workshopLeaders",
      width: "150px",
      key: "workshopLeaders",
      render: (text, record) => <span>{record?.target || ""}</span>,
    },
    {
      title: "Objetivo",
      dataIndex: "Target",
      width: "150px",
      key: "Target",
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
      title: "Estación de Transmisión",
      dataIndex: "stationTransmiter",
      width: "150px",
      key: "stationTransmiter",
      render: (text, record) => {
        return record?.radioTransmiter ? (
          <span>{record?.radioTransmiter}</span>
        ) : (
          <span>No se transmite.</span>
        );
      },
    },
    {
      title: "Episodios",
      dataIndex: "episodes",
      width: "150px",
      key: "episodes",
      render: (text, record) => {
        return record?.episodes ? (
          <Button
            type="link"
            onClick={() => {
              viewModalEpisodes(record?.episodes, "Episodios");
            }}
          >
            Ver
          </Button>
        ) : (
          <span>Sin episodios</span>
        );
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
            {record?.DiffusionFiles?.length > 0 ? (
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

const getColumnsTv = (
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
      title: "Resumen contenido",
      dataIndex: "workshopLeaders",
      width: "150px",
      key: "workshopLeaders",
      render: (text, record) => <span>{record?.target || ""}</span>,
    },
    {
      title: "Objetivo",
      dataIndex: "Target",
      width: "150px",
      key: "Target",
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
      title: "Canal de Transmisión",
      dataIndex: "tvChannels",
      width: "150px",
      key: "tvChannels",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            viewModalTvChannels(record?.tvChannels, "Canales de Televisión");
          }}
        >
          Ver
        </Button>
      ),
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
            {record?.DiffusionFiles?.length > 0 ? (
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
const getColumnsPrensaRevista = (
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
      title: "Resumen contenido",
      dataIndex: "workshopLeaders",
      width: "150px",
      key: "workshopLeaders",
      render: (text, record) => <span>{record?.target || ""}</span>,
    },
    {
      title: "Objetivo",
      dataIndex: "Target",
      width: "150px",
      key: "Target",
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
      title: "Periódico",
      dataIndex: "newspaper",
      width: "150px",
      key: "newspaper",
      render: (text, record) => <span>{record?.newsPaper || ""}</span>,
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
            {record?.DiffusionFiles?.length > 0 ? (
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
export default function Media({
  productsMedia = null,
  onSelectProductToEdit,
  onSelectProductToDelete,
  onSelectToUpload,
  onSelectFileProductToDelete,
}) {
  console.log("novela", productsMedia);
  return (
    <Row justify="start">
      <Col span={24}>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <FileProtectOutlined /> Radio
              </span>
            }
            key="1"
          >
            <Table
              columns={getColumnsRadio(
                onSelectProductToEdit,
                onSelectProductToDelete,
                onSelectToUpload,
                onSelectFileProductToDelete
              )}
              dataSource={productsMedia?.radio}
              rowKey="id"
              scroll={{ x: "max-content" }}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <BookOutlined /> Tv
              </span>
            }
            key="2"
          >
            <Table
              columns={getColumnsTv(
                onSelectProductToEdit,
                onSelectProductToDelete,
                onSelectToUpload,
                onSelectFileProductToDelete
              )}
              dataSource={productsMedia?.tv}
              rowKey="id"
              scroll={{ x: "max-content" }}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <FileSearchOutlined /> Prensa
              </span>
            }
            key="3"
          >
            <Table
              columns={getColumnsPrensaRevista(
                onSelectProductToEdit,
                onSelectProductToDelete,
                onSelectToUpload,
                onSelectFileProductToDelete
              )}
              dataSource={productsMedia?.prensa}
              rowKey="id"
              scroll={{ x: "max-content" }}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <FileSearchOutlined /> Revista
              </span>
            }
            key="4"
          >
            <Table
              columns={getColumnsPrensaRevista(
                onSelectProductToEdit,
                onSelectProductToDelete,
                onSelectToUpload,
                onSelectFileProductToDelete
              )}
              dataSource={productsMedia?.revista}
              rowKey="id"
              scroll={{ x: "max-content" }}
            />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}
