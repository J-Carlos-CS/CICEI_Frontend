import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Table,
  Row,
  Col,
  Button,
  Typography,
  Input,
  Tooltip,
  DatePicker,
} from "antd";
import SelectColumnsModal from "./SelectColumnsModal";
import XLSXGenerator from "./XLSXGenerator";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;

function compareDates(dateOneString, dateTwoString) {
  let dateOne = new Date(dateOneString);
  let dateTwo = new Date(dateTwoString);
  if (
    dateOne.toString() === "Invalid Date" ||
    dateTwo.toString() === "Invalid Date"
  ) {
    return -1;
  }
  if (dateOne.getFullYear() > dateTwo.getFullYear()) {
    return -1;
  } else if (dateOne.getFullYear() < dateTwo.getFullYear()) {
    return 1;
  } else {
    if (dateOne.getMonth() > dateTwo.getMonth()) {
      return -1;
    } else if (dateOne.getMonth() < dateTwo.getMonth()) {
      return 1;
    } else {
      return 0;
    }
  }
}

const columns = [
  /*   {
    title: "N°.",
    dataIndex: "index",
    key: "index",
    render: (text, record) => <span>{record.id}</span>,
  }, */
  {
    title: "Investigador",
    dataIndex: "careerId",
    key: "careerId",
    render: (text, record) => {
      let career = [];
      let userProjectMain =
        record.UserProjects?.filter((up) => up.isMain) || null;
      career.push(userProjectMain[0]?.User?.SystemRol?.name || "");
      career.push(userProjectMain[0]?.User?.Career?.name || "");
      career.join("//");
      return <span>{career}</span>;
    },
  },
  {
    title: "Docente",
    dataIndex: "userId",
    key: "userId",
    render: (text, record) => {
      let userProjectMain =
        record.UserProjects?.filter((up) => up.isMain)[0]?.User || null;
      let name =
        (userProjectMain?.firstName || "") +
        " " +
        (userProjectMain?.lastName || "");
      return <span>{name}</span>;
    },
  },
  {
    title: "Investigación",
    dataIndex: "title",
    key: "title",
    render: (text, record) => record.title || "",
  },
  {
    title: "Línea",
    key: "lineId",
    dataIndex: "lineId",
    render: (text, record) => {
      let lineInstitutional = record.LineProjects?.filter(
        (lp) => lp.Line?.isInstitutional
      )
        .map((lp) => lp.Line?.name)
        .join(", ");
      return <span>{lineInstitutional}</span>;
    },
  },
  {
    title: "Institución Financiadora",
    dataIndex: "financiers",
    key: "financiers",
    render: (text, record) => {
      let institutionProject = record.InstitutionProjects?.filter(
        (ip) => ip.isFinancier
      )
        .map((ip) => ip.Institution?.name)
        .join(", ");
      return <span>{institutionProject || "Fondos propios"}</span>;
    },
  },
  {
    title: "Organizaciones",
    dataIndex: "institutions",
    key: "institutions",
    render: (text, record) => {
      let institutionProject = record?.InstitutionProjects?.filter(
        (ip) => !ip?.isFinancier
      )
        .map((ip) => ip?.Institution?.name)
        .join(", ");
      return <span>{institutionProject || ""}</span>;
    },
  },
  {
    title: "Fecha inicio",
    dataIndex: "startDate",
    key: "startDate",
    render: (text, record) => {
      let startDate = new Date(record.startDate || null);
      startDate.setMinutes(
        startDate.getMinutes() + new Date().getTimezoneOffset()
      );

      startDate = startDate.toLocaleDateString("es");
      return <span>{startDate}</span>;
    },
  },
  {
    title: "Fecha final",
    dataIndex: "endDate",
    key: "endDate",
    render: (text, record) => {
      let endDate = new Date(record.endDate || null);
      endDate.setMinutes(endDate.getMinutes() + new Date().getTimezoneOffset());
      endDate = endDate.toLocaleDateString("es");
      return <span>{endDate}</span>;
    },
  },
  {
    title: "Descripción",
    dataIndex: "description",
    key: "description",
    render: (text, record) => <span>{record.description || ""}</span>,
  },
  {
    title: "Productos",
    dataIndex: "products",
    key: "products",
    render: (text, record) => {
      let products = record.Products?.filter((p) => p.status).map((p) => ({
        id: p.id,
        type: p.TypeProduct?.name,
        title: p.title,
        stateProgress: p.FileProducts.length > 0 ? "Terminado" : "En progreso",
      }));
      let userProject = record.UserProjects?.filter(
        (up) => up.acceptance === "Aceptado" || up.acceptance === "Rechazado"
      );
      userProject.forEach((up) => {
        if (up.StudentJobs.length > 0) {
          let jobs = up.StudentJobs?.filter(
            (sj) =>
              sj.status &&
              (sj.Progress?.stateProgress === "Terminado" ||
                sj.Progress?.stateProgress === "En progreso")
          ).map((sj) => ({
            id: sj?.id,
            type: sj?.TypeInvestigation?.name || "",
            title: sj?.titleDocument || "",
            stateProgress: sj.Progress.stateProgress,
          }));
          products = [...products, ...jobs];
        }
      });
      return (
        <div>
          {products.map((p, index) => {
            return (
              <div key={index}>
                {/* <strong>{"(" + p.stateProgress + ")"}</strong> */}
                <strong style={{ fontStyle: "italic" }}>{p.type + ": "}</strong>
                {p.title + "."}
                <br />
              </div>
            );
          })}
        </div>
      );
    },
  },
];

let listColumnsExport = [
  "N°.",
  "Investigación",
  "Carrera",
  "Docente",
  "Línea",
  "Institución Financiadora",
  "Organizaciones",
  "Fecha inicio",
  "Fecha final",
  "Descripción",
  "Productos",
];

export default function ProjectsReport({ projects = [],toogleUpdate }) {
  console.log("projects", projects);
  const { current: myColumns } = useRef(columns);
  const [isModalSelectColumns, setIsModalSelectColumns] = useState(false);
  const [filter, setFilter] = useState({
    date: "",
    input: "",
  });

  const [dateFilter, setDateFilter] = useState("");
  const [inputFilter, setInputFilter] = useState("");
  const [data, setData] = useState(projects);

  const applyFilters = useCallback(() => {
    let filteredProjects = projects;
    if (filter?.input !== "") {
      filteredProjects = projects.filter((record) => {
        if (
          record?.title
            ?.toLowerCase()
            .indexOf(filter?.input?.toLocaleLowerCase()) >= 0
        ) {
          return true;
        }
        return false;
      });
    }

    if (filter?.date !== "") {
      filteredProjects = filteredProjects.map((project) => {
        let filteredProducts = project?.Products?.filter((product) => {
          if (compareDates(product?.date?.toString(), filter?.date) >= 0) {
            return true;
          } else {
            return false;
          }
        });
        return { ...project, Products: filteredProducts };
      });
    }
    setData(filteredProjects);
  }, [filter,toogleUpdate]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const onChangeInputSearch = (e) => {
    //setFilter({ ...filter, search: e?.target?.value });
    setInputFilter(e?.target?.value || "");
  };
  const onChangeDate = (date, dateString) => {
    //console.log("date", date?._d?.toString());
    //setFilter({ ...filter, date: date?._d ? date?._d?.toString() : "" });
    setDateFilter(date?._d ? date?._d?.toString() : "");
  };

  const onModifyFilter = () => {
    setFilter({ date: dateFilter || "", input: inputFilter || "" });
  };

  const getExcel = (columnsSelected) => {
    //console.log('col',columnsSelected);
    XLSXGenerator.projectReportXLSX(data, columnsSelected);
  };
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
        Informe de Proyectos
      </Title>
      <Row>
        <Col
          span={23}
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
          }}
        >
          <Button
            type={"primary"}
            onClick={() => {
              //getExcel();
              setIsModalSelectColumns(true);
            }}
          >
            Exportar en EXCEL
          </Button>
        </Col>
      </Row>
      <Row style={{ margin: "1em 0" }}>
        <Col span={24} style={{ display: "flex", alignItems: "end" }}>
          <div>
            <p style={{ marginBottom: "0em" }}>Buscar por nombre:</p>
            <Input
              placeholder="Buscar..."
              onChange={onChangeInputSearch}
              style={{ width: "250px" }}
              prefix={<SearchOutlined className="site-form-item-icon" />}
              suffix={
                <Tooltip title="Extra information">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </div>
          <div style={{ marginLeft: "2em" }}>
            <p style={{ marginBottom: "0em" }}>Productos al:</p>
            <DatePicker
              onChange={onChangeDate}
              picker="month"
              placeholder="Seleccionar mes"
            />
          </div>
          <div
            style={{ marginLeft: "2em", display: "flex", alignItems: "end" }}
          >
            <Button type="primary" onClick={onModifyFilter}>
              Aplicar filtros
            </Button>
          </div>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={myColumns}
        dataSource={data}
        /* summary={(currentData)=>{
                console.log('current',currentData)
                return null;}} */
      />
      {isModalSelectColumns && (
        <SelectColumnsModal
          isVisible={isModalSelectColumns}
          handleOkOperation={getExcel}
          handleCancel={() => {
            setIsModalSelectColumns(false);
          }}
          listColums={listColumnsExport}
        />
      )}
    </>
  );
}
