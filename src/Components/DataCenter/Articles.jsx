import { useState, useRef } from "react";
import { Table, Typography } from "antd";
//import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
const { Title } = Typography;

const columns = [
  {
    title: "Tipo de Artículos científicos",
    dataIndex: "typeArticleId",
    key: "typeArticleId",
    render: (text, record) => <span>{record.TypeArticle?.name}</span>,
  },
  {
    title: "Autor(es)",
    dataIndex: "author",
    key: "author",
    render: (text, record) => {
      let authors = record.Authors?.map(
        (a) => a.User?.firstName + " " + a.User?.lastName
      ).join(", ");
      return <span>{authors}</span>;
    },
  },
  {
    title: "Título",
    dataIndex: "title",
    key: "title",
    render: (text, record) => record.title || "",
  },
  {
    title: "Línea de Inves. UCB",
    key: "lineId",
    dataIndex: "lineId",
    render: (text, record) => {
      let lineInstitutional = record.Project?.LineProjects?.filter(
        (lp) => lp.Line?.isInstitutional
      )
        .map((lp) => lp.Line?.name)
        .join(", ");
      return <span>{lineInstitutional}</span>;
    },
  },
  {
    title: "Revista",
    dataIndex: "journal",
    key: "journal",
    render: (text, record) => <span>{record.journal || ""}</span>,
  },
  {
    title: "Institución/Editorial",
    dataIndex: "publisherId",
    key: "publisherId",
    render: (text, record) => <span>{record.Publisher?.name || ""}</span>,
  },
  {
    title: "Observaciones",
    dataIndex: "observation",
    key: "observation",
    render: (text, record) => <span>{record.observation || ""}</span>,
  },
];

export default function Articles({ list = [] }) {
  const { current: myColumns } = useRef(columns);
  const [filter, setFilter] = useState({
    year: new Date().getFullYear(),
    search: "",
  });
  // const [data, setData] = useState([]);

  /*   const applyFilters = useCallback(
    () => {
      let listFiltered = list.filter(
        (l) => new Date(l.date).getFullYear() === filter.year
      );
      listFiltered = list.filter((record) => {
        let authors = record.Authors?.map(
          (a) => a.User?.firstName + " " + a.User?.lastName
        ).join(", ");
        if (filter?.search !== "") {
          if (
            authors.toLowerCase().indexOf(filter?.search?.toLocaleLowerCase()) >=
            0
          ) {
            return true;
          }
          if (
            record.title
              ?.toLowerCase()
              .indexOf(filter?.search?.toLocaleLowerCase()) >= 0
          ) {
            return true;
          }
          let lineInstitutional = record.Project?.LineProjects?.filter(
            (lp) => lp.Line?.isInstitutional
          )
            .map((lp) => lp.Line?.name)
            .join(", ");
          if (
            lineInstitutional
              ?.toLowerCase()
              .indexOf(filter?.search?.toLocaleLowerCase()) >= 0
          ) {
            return true;
          }
  
          if (
            record.journal
              ?.toLowerCase()
              .indexOf(filter?.search?.toLocaleLowerCase()) >= 0
          ) {
            return true;
          }
  
          if (
            record.Publisher?.name
              ?.toLowerCase()
              .indexOf(filter?.search?.toLocaleLowerCase()) >= 0
          ) {
            return true;
          }
        } else {
          return true;
        }
        return false;
      });
      setDataProducts(listFiltered);
      setData(listFiltered);
    },
    [filter,list,setDataProducts],
  ); */

  /*   useEffect(() => {
    applyFilters();
  }, [applyFilters]); */

  /*   const onChangeInputSearch = (e) => {
    setFilter({ ...filter, search: e.target.value });
  }; */
  return (
    <>
      <Title
        level={3}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Artículos
      </Title>
      {/* <Row style={{ margin: "1em 0" }}>
        <Col span={7}>
          <Input
            placeholder="Buscar..."
            onChange={onChangeInputSearch}
            prefix={<SearchOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Extra information">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
        </Col>
      </Row> */}

      <Table
        rowKey="id"
        columns={myColumns}
        dataSource={list}
        /* summary={(currentData)=>{
                console.log('current',currentData)
                return null;}} */
      />
    </>
  );
}
