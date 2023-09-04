import { useState, useCallback, useEffect } from "react";
import XLSXGenerator from "./XLSXGenerator";
import SelectColumnsModal from "./SelectColumnsModal";
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
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import compareDates from "../../utils/CompareDate";
const { Title } = Typography;

const columns = [
  /*  {
    title: "N°.",
    dataIndex: "index",
    key: "index",
    width: 50,
    render: (text, record) => <span>{record.id}</span>,
  }, */
  {
    title: "Grupo",
    dataIndex: "group",
    key: "group",
    width: 150,
    render: (text, record) => {
      let textCell = "";
      let lineCicei = record.LineProjects?.filter(
        (lp) => !lp.Line?.isInstitutional
      );
      if (lineCicei.length) {
        textCell = lineCicei[0]?.Line?.Group?.name || "";
      } else {
        textCell = "";
      }
      return <span>{textCell}</span>;
    },
  },
  {
    title: "Línea de investigación",
    dataIndex: "lineCicei",
    key: "lineCicei",
    width: 150,
    render: (text, record) => {
      let textCell = "";
      let lineCicei = record.LineProjects?.filter(
        (lp) => !lp.Line?.isInstitutional
      );
      if (lineCicei.length > 0) {
        textCell = lineCicei[0].Line?.name || "";
      } else {
        textCell = "Sin Línea";
      }
      return <span>{textCell}</span>;
    },
  },
  {
    title: "Línea de investigación UCB",
    key: "lineUcb",
    dataIndex: "lineUcb",
    width: 150,
    render: (text, record) => {
      let textCell = record.LineProjects?.filter(
        (lp) => lp.Line?.isInstitutional
      )
        .map((lp) => lp.Line?.name)
        .join(", ");
      return <span>{textCell}</span>;
    },
  },

  {
    title: "Nombre del proyecto",
    dataIndex: "nameProject",
    key: "nameProject",
    width: 150,

    render: (text, record) => record.title || "",
  },
  {
    title: "Responsable del Proyecto",
    dataIndex: "leader",
    key: "leader",
    width: 150,

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
    title: "Miembros del proyecto",
    dataIndex: "members",
    key: "members",
    width: 250,

    render: (text, record) => {
      let members = record.UserProjects.filter(
        (up) => up.acceptance === "Aceptado"
      );
      return (
        <>
          {members.map((member, index) => {
            return (
              <span key={index}>
                <strong>{`${member.SystemRol?.name}:`}</strong>
                <span>
                  {member?.User?.firstName + " " + member?.User?.lastName}
                </span>
                <br />
              </span>
            );
          })}
        </>
      );
    },
  },
  {
    title: "Instituciones y Sociedades Científicas  participantes",
    dataIndex: "institutions",
    key: "institutions",
    width: 200,
    render: (text, record) => {
      let textCell = record.InstitutionProjects?.map((ip) => {
        return `${ip.Institution?.name} (${ip.Institution?.shortName})`;
      }).join(", ");
      return <span>{textCell}</span>;
    },
  },

  {
    title: "Financiamiento",
    dataIndex: "financier",
    key: "financier",
    width: 200,
    render: (text, record) => {
      let textCell = record.InstitutionProjects?.filter((ip) => ip.isFinancier)
        .map((ip) => {
          return `${ip.Institution?.name} (${ip.Institution?.shortName})`;
        })
        .join(", ");
      return <span>{textCell}</span>;
    },
  },
  {
    title: "Monto (Moneda)",
    dataIndex: "mount",
    key: "mount",
    width: 200,
    render: (text, record) => {
      let textCell = record.InstitutionProjects?.filter((ip) => ip.isFinancier)
        .map(
          (ip) =>
            `${ip.moneyBudget} ${ip.Currency?.shortName}(${ip.Institution?.shortName})`
        )
        .join(", ");
      return <span>{textCell}</span>;
    },
  },
  {
    title: "Fecha inicio",
    dataIndex: "startDate",
    key: "startDate",
    width: 100,
    render: (text, record) => {
      let startDate = new Date(record.startDate || null);
      /*   startDate.setMinutes(
        startDate.getMinutes() + new Date().getTimezoneOffset()
      );
 */
      startDate = startDate.toLocaleDateString("es");
      return <span>{startDate}</span>;
    },
  },
  {
    title: "Fecha final",
    dataIndex: "endDate",
    key: "endDate",
    width: 100,
    render: (text, record) => {
      let endDate = new Date(record.endDate || null);
      //endDate.setMinutes(endDate.getMinutes() + new Date().getTimezoneOffset());
      endDate = endDate.toLocaleDateString("es");
      return <span>{endDate}</span>;
    },
  },

  {
    title: "% avance del proyecto",
    dataIndex: "progressPercent",
    key: "progressPercent",
    width: 100,
    render: (text, record) => {
      let finishedActivities = record.Activities?.filter(
        (a) => a.Progress?.stateProgress === "Terminado"
      );
      let totalActivities = record.Activities?.length;
      let textCell = Math.round(
        (finishedActivities.length / totalActivities) * 100
      );
      textCell = isNaN(textCell) ? "0%" : textCell + "%";
      return <span>{textCell}</span>;
    },
  },
  {
    title: "Productos",
    dataIndex: "products",
    key: "products",
    width: 250,

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
            id: sj.id,
            type: sj.TypeInvestigation?.name || "",
            title: sj.titleDocument || "",
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
               {/*  <strong>{"(" + p.stateProgress + ")"}</strong> */}
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
  {
    title: "Estudiantes",
    dataIndex: "students",
    key: "students",
    width: 250,

    render: (text, record) => {
      let jobs = [];
      if (record.UserProjects.length > 0) {
        for (let up of record.UserProjects) {
          if (up.StudentJobs?.length > 0) {
            for (let sj of up.StudentJobs) {
              if (
                (sj.TypeInvestigation?.name === "Proyecto de Grado" ||
                  sj.TypeInvestigation?.name === "Tesis de Grado" ||
                  sj.TypeInvestigation?.name === "Pasantia" ||
                  sj.TypeInvestigation?.name === "Magíster" ||
                  sj.TypeInvestigation?.name === "Doctorado") &&
                sj.acceptance === "Aceptado"
              ) {
                let job = {
                  userName: `${up.User?.firstName} ${up.User?.lastName}`,
                  name: sj.titleDocument,
                  typeInvestigation: sj.TypeInvestigation?.name,
                  tutor: `${sj.Tutor?.firstName} ${sj.Tutor?.lastName}`,
                  isDefended:
                    sj.Progress?.stateProgress === "Terminado" ? true : false,
                  semesterEnd: `${sj.SemesterEnd?.name}-${sj.SemesterEnd?.year}`,
                  institutionName: sj.Institution?.name,
                  careerName: sj.Career?.name,
                };
                jobs.push(job);
              }
            }
          }
        }
      }

      if (jobs.length > 0) {
        return jobs.map((job, index) => (
          <div key={index}>
            <strong>{`${job.typeInvestigation}:`}</strong>
            <span>{job.name}</span>
            <br />
            <strong>{`Autor: `}</strong>
            <span>{job.userName}</span>
            <br />
            <strong>{`Tutor: `}</strong>
            <span>{job.tutor}</span>
            <br />
            <strong>{`Institución: `}</strong>
            <span>{job.institutionName}</span>
            <br />
            <strong>{`Carrera: `}</strong>
            <span>{job.careerName}</span>
            <br />
            <strong>{`Estado: `}</strong>
            {job.isDefended ? (
              <>
                <span>{`Defendida (${job.semesterEnd})`}</span>
                <br />
              </>
            ) : (
              <>
                <span>{"Pendiente de Defensa"}</span>
                <br />
              </>
            )}
            <br />
            <br />
          </div>
        ));
      } else {
        return <span></span>;
      }
    },
  },

  {
    title: "Descripción",
    dataIndex: "description",
    key: "description",
    width: 150,

    render: (text, record) => <span>{record.description || ""}</span>,
  },
];

let listColumnsExport = [
  "N°.",
  "Grupo",
  "Línea de investigación",
  "Línea de investigación UCB",
  "Nombre del proyecto",
  "Responsable del Proyecto",
  "Miembros del proyecto",
  "Instituciones y Sociedades Científicas  participantes",
  "Financiamiento",
  "Monto (Moneda)",
  "Fecha inicio",
  "Fecha final",
  "% avance del proyecto",
  "Productos",
  "Estudiantes",
  "Descripción",
];

export default function ReportStudent({ projects = [], toogleUpdate }) {
  //const [myColumns, setcolumns] = useState(columns);
  //const {current:myColumns} = useRef(columns)

  const [isModalSelectColumns, setIsModalSelectColumns] = useState(false);
  const [filter, setFilter] = useState({
    date: "",
    input: "",
  });

  const [dateFilter, setDateFilter] = useState("");
  const [inputFilter, setInputFilter] = useState("");
  const [data, setData] = useState(projects);
  const getExcel = (columnsSelected) => {
    //console.log("col", columnsSelected);
    XLSXGenerator.reportStudentsXLSX(data, columnsSelected);
  };

  /*  const applyFilters = useCallback(() => {
    setData(projects);
  }, [projects]);

  useEffect(() => {
    applyFilters();
  }, []); */
  const applyFilters = useCallback(() => {
    /*  let listFiltered = projects;
    listFiltered = projects.filter((record) => {
      if (filter?.search !== "") {
        if (
          record.title
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
    setData(listFiltered); */
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
  }, [filter, toogleUpdate]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  /* const onChangeInputSearch = (e) => {
    setFilter((state) => ({ ...state, search: e.target.value }));
  }; */

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

      <Row align="center">
        <Col span={23} style={{ overflow: "auto" }}></Col>
      </Row>
      <div style={{ width: "90vw", overflow: "auto" }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          scroll={{ x: "max-content" }}
          //scroll={{ x: 1500 }}

          /* summary={(currentData)=>{
                console.log('current',currentData)
                return null;}} */
        />
      </div>

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
