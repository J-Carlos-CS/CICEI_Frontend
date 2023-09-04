import React from "react";
import { Table, Tabs, Button } from "antd";
import XLSXGenerator from "../XLSXGenerator";
const { TabPane } = Tabs;

const columns_Edu_Comunicational = [
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
      let durationObj = record?.duration ? JSON.parse(record?.duration) : null;
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
    render: (text, record) => <span>{record?.Line?.name || "Sin línea"}</span>,
  },
];

const columns_Talks = [
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
    title: "Talleristas",
    dataIndex: "workshopLeaders",
    width: "400px",
    key: "workshopLeaders",
    render: (text, record) => {
      try {
        let workshopLeadersObj = record?.workshopLeaders
          ? JSON.parse(record?.workshopLeaders)
          : "";
        let workshopLeaders = [];
        if (
          typeof workshopLeadersObj === "object" &&
          workshopLeadersObj.length > 0
        ) {
          workshopLeaders = workshopLeadersObj.map((talker, index) => (
            <div key={index}>
              <div>{`Nombre: ${talker.name}`}</div>
              <div>{`Grado Académico: ${talker.gradeId} ${talker.grade}`}</div>
              <div>{`Pais: ${talker.country}`}</div>
              <br />
            </div>
          ));
        }
        return workshopLeaders?.length > 0 ? workshopLeaders : "";
      } catch (error) {
        return "Error con los tarreristas";
      }
    },
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
    dataIndex: "newsPaper",
    width: "150px",
    key: "newspaper",
    render: (text, record) => <span>{record?.newsPaper || ""}</span>,
  },
  {
    title: "Línea UCB",
    dataIndex: "line",
    width: "150px",
    key: "line",
    render: (text, record) => <span>{record?.Line?.name || "Sin línea"}</span>,
  },
];

const columns_Socials = [
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
      let durationObj = record?.duration ? JSON.parse(record?.duration) : null;
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
    render: (text, record) => <span>{record?.Line?.name || "Sin línea"}</span>,
  },
];
const columns_Comunication_Radio = [
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
    render: (text, record) => <span>{record?.resume || ""}</span>,
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
      let durationObj = record?.duration ? JSON.parse(record?.duration) : null;
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
    width: "300px",
    key: "episodes",
    render: (text, record) => {
      try {
        let episodesObj = record?.episodes ? JSON.parse(record?.episodes) : [];
        let episodes = [];
        if (typeof episodesObj === "object" && episodesObj.length > 0) {
          episodes = episodesObj.map((episode, index) => (
            <div key={index}>
              <div>{`Nombre: ${episode?.name}`}</div>
              <div>{`Duración: ${episode?.hours}h:${episode?.minutes}m`}</div>
              <br />
            </div>
          ));
          return episodes;
        } else {
          return "";
        }
      } catch (error) {
        console.log("error", error.message);
        return "";
      }
    },
  },
  {
    title: "Línea UCB",
    dataIndex: "line",
    width: "150px",
    key: "line",
    render: (text, record) => <span>{record?.Line?.name || "Sin línea"}</span>,
  },
];

const columns_Comunication_TV = [
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
      let durationObj = record?.duration ? JSON.parse(record?.duration) : null;
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
    render: (text, record) => {
      try {
        let tvChannelsObj = record?.tvChannels
          ? JSON.parse(record?.tvChannels)
          : [];
        let tvChannels = [];
        if (typeof tvChannelsObj === "object" && tvChannelsObj.length > 0) {
          tvChannels = tvChannelsObj.map((channel, index) => {
            return (
              <div key={index}>
                <div>{`Canal: ${channel?.name}`}</div>
                <div>{`Pais: ${channel?.country}`}</div>
                <br/>
              </div>
            );
          });
          return tvChannels;
        } else {
          return "";
        }
      } catch (error) {
        console.log("error", error.message);
        return "";
      }
    },
  },
  {
    title: "Línea UCB",
    dataIndex: "line",
    width: "150px",
    key: "line",
    render: (text, record) => <span>{record?.Line?.name || "Sin línea"}</span>,
  },
];

const columns_Comunication_RevistaPrensa = [
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
    dataIndex: "resume",
    width: "150px",
    key: "resume",
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
    render: (text, record) => <span>{record?.Line?.name || "Sin línea"}</span>,
  },
];

export default function DiffusionProducts({
  /* diffusionProdcuts: {
    communicationalEdu = [],
    //media: { radio = [], tv = [], prensa = [], revista = [] },
    socialNetworks = [],
    talks = [],
  }, */ diffusionProdcuts,
}) {
  const exportStudentJobs = () => {
    XLSXGenerator.myDiffusionProducts(diffusionProdcuts);
  };
  return (
    <>
      <Button type="primary" onClick={exportStudentJobs}>
        Exportar a Excel
      </Button>
      <h2>Edu Comunicacional</h2>
      <Table
        rowKey="id"
        columns={columns_Edu_Comunicational}
        dataSource={diffusionProdcuts?.communicationalEdu}
      />
      <h2>Charlas</h2>

      <Table
        rowKey="id"
        columns={columns_Talks}
        dataSource={diffusionProdcuts?.talks}
      />
      <h2>Redes Sociales</h2>

      <Table
        rowKey="id"
        columns={columns_Socials}
        dataSource={diffusionProdcuts?.socialNetworks}
      />
      <h2>Medios de Comunicación</h2>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Radio" key="1">
          <Table
            rowKey="id"
            columns={columns_Comunication_Radio}
            dataSource={diffusionProdcuts?.media?.radio}
          />
        </TabPane>
        <TabPane tab="TV" key="2">
          <Table
            rowKey="id"
            columns={columns_Comunication_TV}
            dataSource={diffusionProdcuts?.media?.tv}
          />
        </TabPane>
        <TabPane tab="Prensa" key="3">
          <Table
            rowKey="id"
            columns={columns_Comunication_RevistaPrensa}
            dataSource={diffusionProdcuts?.media?.prensa}
          />
        </TabPane>
        <TabPane tab="Revista" key="4">
          <Table
            rowKey="id"
            columns={columns_Comunication_RevistaPrensa}
            dataSource={diffusionProdcuts?.media?.revista}
          />
        </TabPane>
      </Tabs>
    </>
  );
}
