import * as ExcelJS from "exceljs";
import * as FileSaver from "file-saver";

const articlesRows = (articles = []) => {
  let rows = articles.map((record) => {
    return {
      typeArticleId: record.TypeArticle?.name,
      author:
        record.Authors?.map(
          (a) => a.User?.firstName + " " + a.User?.lastName
        ).join(", ") || "",
      title: record.title || "",
      lineId:
        record.Project?.LineProjects?.filter((lp) => lp.Line?.isInstitutional)
          .map((lp) => lp.Line?.name)
          .join(", ") || "",
      journal: record.journal || "",
      publisherId: record.Publisher?.name || "",
      observation: record.observation || "",
    };
  });
  return rows;
};

const formatRowsStudentJobs = (data) => {
  let rows = data.map((record) => {
    return {
      typeStudentJob: record?.TypeInvestigation?.name,
      title: record?.titleDocument,
      student: `${record?.UserProject?.User?.firstName} ${record?.UserProject?.User?.lastName}`,
      semesterStart: `${record?.SemesterStart?.name}-${record?.SemesterStart?.year}`,
      semesterEnd: record?.SemesterEnd
        ? `${record?.SemesterEnd?.name}-${record?.SemesterEnd?.year}`
        : "Pendiente de Defensa",
      career: record?.Career?.name,
      grade: `${record?.Grade?.name} ${record?.grade}`,
      institution: record?.Institution?.name,
    };
  });
  return rows;
};

const formatProjectRows = (data) => {
  const transformDate = (dateToTransform) => {
    let date = new Date(dateToTransform);
    return date.toLocaleDateString("es-es");
  };
  let rows = data.map((record) => {
    return {
      title: record?.title,
      members: (() => {
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
        members.unshift(leader);
        return members.join(", ");
      })(),
      startDate: transformDate(record?.startDate),
      endDate: transformDate(record?.endDate),
    };
  });
  return rows;
};

const formatEdu_ComunicationalRows = (data) => {
  const getAuthors = (record) => {
    let authorList =
      record?.DiffusionAuthors?.map(
        (author) => author.User?.firstName + " " + author.User?.lastName
      ) || [];
    authorList = authorList.join(", ");
    return authorList;
  };

  const getDuration = (record) => {
    let durationObj = record?.duration ? JSON.parse(record?.duration) : null;
    let durationString =
      typeof durationObj === "object" &&
      durationObj?.hours &&
      durationObj?.minutes
        ? `${durationObj?.hours}h:${durationObj?.minutes}m`
        : "Sin duración";
    return durationString;
  };

  let rows = data.map((record) => {
    return {
      typeCategory: record?.DiffusionCategory?.name,
      authors: getAuthors(record),
      title: record?.title,
      target: record?.target,
      publicTarget: record?.publicTarget,
      duration: getDuration(record),
      line: record?.Line?.name,
    };
  });
  return rows;
};
const formatMyTalks = (data) => {
  const getAuthors = (record) => {
    let authors = [];
    record?.DiffusionAuthors.forEach((author) => {
      if (author.isMain) {
        authors.unshift(`${author?.User?.firstName} ${author?.User?.lastName}`);
      } else {
        authors.push(`${author?.User?.firstName} ${author?.User?.lastName}`);
      }
    });
    return authors.join(", ");
  };

  const getWorkshopLeaders = (record) => {
    try {
      let workshopLeadersObj = record?.workshopLeaders
        ? JSON.parse(record?.workshopLeaders)
        : "";
      let workshopLeaders = [];
      if (
        typeof workshopLeadersObj === "object" &&
        workshopLeadersObj.length > 0
      ) {
        workshopLeaders = workshopLeadersObj.map(
          (talker) =>
            `Nombre: ${talker.name} \nGrado Académico: ${talker.gradeId} ${talker.grade} \nPais: ${talker.country} \n\n`
        );
      }
      return workshopLeaders?.length > 0 ? workshopLeaders.join("") : "";
    } catch (error) {
      return "Error con los tarreristas";
    }
  };

  let rows = data.map((record) => {
    return {
      typeCategory: record?.DiffusionCategory?.name,
      authors: getAuthors(record),
      title: record?.title,
      workshopLeaders: getWorkshopLeaders(record),
      target: record?.target,
      publicTarget: record?.publicTarget,
      newsPaper: record?.newsPaper,
      line: record?.Line?.name,
    };
  });
  return rows;
};

const formatMySocialMedia = (data) => {
  const getAuthors = (record) => {
    let authors = [];
    record?.DiffusionAuthors.forEach((author) => {
      if (author.isMain) {
        authors.unshift(`${author?.User?.firstName} ${author?.User?.lastName}`);
      } else {
        authors.push(`${author?.User?.firstName} ${author?.User?.lastName}`);
      }
    });
    return authors.join(", ");
  };

  const getDuration = (record) => {
    try {
      let durationObj = record?.duration ? JSON.parse(record?.duration) : null;
      let durationString =
        typeof durationObj === "object" &&
        durationObj?.hours &&
        durationObj?.minutes
          ? `${durationObj?.hours}h:${durationObj?.minutes}m`
          : "Sin duración";
      return durationString;
    } catch (error) {
      console.log("error", error.message);
      return "";
    }
  };

  const getSocialNetworks = (record) => {
    try {
      let socialNetworksObj = record?.socialNetworks
        ? JSON.parse(record?.socialNetworks)
        : [];
      let socialNetworks = [];
      if (
        typeof socialNetworksObj === "object" &&
        socialNetworksObj.length > 0
      ) {
        socialNetworks = socialNetworksObj.map(
          (socialNetwork) =>
            `Red Social: ${socialNetwork.name} \n Link: ${socialNetwork.linkSocialNetwork}\n\n`
        );
      }
      return socialNetworks.length > 0 ? socialNetworks.join("") : "";
    } catch (error) {
      console.log("error", error.message);
      return "";
    }
  };

  let rows = data.map((record) => {
    return {
      typeCategory: record?.DiffusionCategory?.name,
      authors: getAuthors(record),
      description: record?.description,
      target: record?.target,
      publicTarget: record?.publicTarget,
      url: record?.url,
      socialNetworks: getSocialNetworks(record),
      duration: getDuration(record),
      line: record?.Line?.name,
    };
  });
  return rows;
};

const formatMyComunication_Radio = (data) => {
  /*  { name: "Tipo de Producto" }
  { name: "Autores" }
  { name: "Título" }
  { name: "Resumen contenido" }
  { name: "Objetivo" }
  { name: "Público Objetivo" }
  { name: "Duración" }
  { name: "Estación de Transmisión" }
  { name: "Episodios" }
  { name: "Línea UCB" } */
  const getAuthors = (record) => {
    let authors = [];
    record?.DiffusionAuthors.forEach((author) => {
      if (author.isMain) {
        authors.unshift(`${author?.User?.firstName} ${author?.User?.lastName}`);
      } else {
        authors.push(`${author?.User?.firstName} ${author?.User?.lastName}`);
      }
    });
    return authors.join(", ");
  };
  const getDuration = (record) => {
    try {
      let durationObj = record?.duration ? JSON.parse(record?.duration) : null;
      let durationString =
        typeof durationObj === "object" &&
        durationObj?.hours &&
        durationObj?.minutes
          ? `${durationObj?.hours}h:${durationObj?.minutes}m`
          : "Sin duración";
      return durationString;
    } catch (error) {
      console.log("error", error.message);
      return "";
    }
  };
  const getEpisodes = (record) => {
    try {
      let episodesObj = record?.episodes ? JSON.parse(record?.episodes) : [];
      let episodes = [];
      if (typeof episodesObj === "object" && episodesObj.length > 0) {
        episodesObj.forEach((episode) => {
          episodes.push(
            `Nombre: ${episode?.name}\nDuración:${episode?.hours}h:${episode?.minutes}m\n\n`
          );
        });
        return episodes.join("");
      } else {
        return "";
      }
    } catch (error) {
      console.log("error", error.message);
      return "";
    }
  };
  let rows = data.map((record) => {
    return [
      record?.DiffusionCategory?.name,
      getAuthors(record),
      record?.title,
      record?.resume,
      record?.target,
      record?.publicTarget,
      getDuration(record),
      record?.radioTransmiter ? record?.radioTransmiter : "No se transmite",
      getEpisodes(record),
      record?.Line?.name,
    ];
  });
  return rows;
};

const formatMyComunication_TV = (data) => {
  /*   { name: "Tipo de Producto" }
  { name: "Autores" }
  { name: "Título" }
  { name: "Resumen contenido" }
  { name: "Objetivo" }
  { name: "Público Objetivo" }
  { name: "Duración" }
  { name: "Canal de Transmisión" }
  { name: "Línea UCB" } */
  const getAuthors = (record) => {
    let authors = [];
    record?.DiffusionAuthors.forEach((author) => {
      if (author.isMain) {
        authors.unshift(`${author?.User?.firstName} ${author?.User?.lastName}`);
      } else {
        authors.push(`${author?.User?.firstName} ${author?.User?.lastName}`);
      }
    });
    return authors.join(", ");
  };
  const getDuration = (record) => {
    try {
      let durationObj = record?.duration ? JSON.parse(record?.duration) : null;
      let durationString =
        typeof durationObj === "object" &&
        durationObj?.hours &&
        durationObj?.minutes
          ? `${durationObj?.hours}h:${durationObj?.minutes}m`
          : "Sin duración";
      return durationString;
    } catch (error) {
      console.log("error", error.message);
      return "";
    }
  };
  const getChannels = (record) => {
    try {
      let tvChannelsObj = record?.tvChannels
        ? JSON.parse(record?.tvChannels)
        : [];
      let tvChannels = [];
      if (typeof tvChannelsObj === "object" && tvChannelsObj.length > 0) {
        tvChannelsObj.forEach((channel) => {
          tvChannels.push(
            `Canal: ${channel?.name}\nPais:${channel?.country}\n\n`
          );
        });
        return tvChannels.join("");
      } else {
        return "";
      }
    } catch (error) {
      console.log("error", error.message);
      return "";
    }
  };
  let rows = data.map((record) => {
    return [
      record?.DiffusionCategory?.name,
      getAuthors(record),
      record?.title,
      record?.resume,
      record?.target,
      record?.publicTarget,
      getDuration(record),
      getChannels(record),
      record?.Line?.name,
    ];
  });
  return rows?.length > 0 ? rows : [];
};

const formatMyComunication_PresaRevista = (data) => {
  /*  { name: "Tipo de Producto" }
  { name: "Autores" }
  { name: "Título" }
  { name: "Resumen contenido" }
  { name: "Objetivo" }
  { name: "Público Objetivo" }
  { name: "Periódico" }
  { name: "Línea UCB" } */
  const getAuthors = (record) => {
    let authors = [];
    record?.DiffusionAuthors.forEach((author) => {
      if (author.isMain) {
        authors.unshift(`${author?.User?.firstName} ${author?.User?.lastName}`);
      } else {
        authors.push(`${author?.User?.firstName} ${author?.User?.lastName}`);
      }
    });
    return authors.join(", ");
  };
  let rows = data.map((record) => {
    return [
      record?.DiffusionCategory?.name,
      getAuthors(record),
      record?.title,
      record?.resume,
      record?.target,
      record?.publicTarget,
      record?.newsPaper,
      record?.Line?.name,
    ];
  });
  return rows?.length > 0 ? rows : [];
};
const articlesXLSX = (sheet, data) => {
  sheet.columns = [
    {
      header: "Tipo de Artículos científicos",
      key: "typeArticleId",
      width: 50,
    },
    { header: "Autor(es)", key: "author", width: 50 },
    { header: "Título", key: "title", width: 50 },
    { header: "Línea de Inves. UCB", key: "lineId", width: 50 },
    { header: "Revista", key: "journal", width: 50 },
    { header: "Institución/Editorial", key: "publisherId", width: 50 },
    { header: "Observaciones", key: "observation", width: 50 },
  ];

  let totalColumns = sheet.columns.length;
  let rows = articlesRows(data);
  let totalRows = rows.length;
  let offset = 4;
  rows.forEach((row, index) => {
    sheet.addRow({
      typeArticleId: row.typeArticleId,
      author: row.author,
      title: row.title,
      lineId: row.lineId,
      journal: row.journal,
      publisherId: row.publisherId,
      observation: row.observation,
    });
  });
  sheet.duplicateRow(1, offset, true);
  let rowHeader = sheet.getRow(offset + 1); //
  for (let i = 1; i <= totalColumns; i++) {
    let cellHeader = rowHeader.getCell(i);
    cellHeader.style = {
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    cellHeader.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cellHeader.font = {
      name: "Roboto",
      size: 14,
      bold: true,
    };
  }
  for (let i = 1; i <= totalRows; i++) {
    let rowS = sheet.getRow(i + offset + 1);
    rowS.height = 50;
    rowS.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    for (let j = 1; j <= totalColumns; j++) {
      let cellData = rowS.getCell(j);
      cellData.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }

  for (let i = 1; i <= offset; i++) {
    sheet.getRow(i).values = [];
  }

  sheet.mergeCells("C2:D3");
  let cellTitle = sheet.getCell("D3");
  cellTitle.value = "ARTÍCULOS CIENTÍFICOS";
  cellTitle.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  cellTitle.font = {
    name: "Roboto",
    size: 18,
    bold: true,
  };
};

const booksRows = (books = []) => {
  let rows = books.map((record) => {
    return {
      typeBookId: record.TypeBook?.name,
      author:
        record.Authors?.map(
          (a) => a.User?.firstName + " " + a.User?.lastName
        ).join(", ") || "",
      title: record.title || "",
      lineId:
        record.Project?.LineProjects?.filter((lp) => lp.Line?.isInstitutional)
          .map((lp) => lp.Line?.name)
          .join(", ") || "",
      publisherId: record.Publisher?.name || "",
      observation: record.observation || "",
    };
  });
  return rows;
};

const booksXLSX = (sheet, data) => {
  sheet.columns = [
    {
      header: "Tipo de Libro",
      key: "typeBookId",
      width: 50,
    },
    { header: "Autor(es)", key: "author", width: 50 },
    { header: "Título", key: "title", width: 50 },
    { header: "Línea de Inves. UCB", key: "lineId", width: 50 },
    { header: "Institución/Editorial", key: "publisherId", width: 50 },
    { header: "Observaciones", key: "observation", width: 50 },
  ];

  let totalColumns = sheet.columns.length;
  let rows = booksRows(data);
  let totalRows = rows.length;
  let offset = 4;
  rows.forEach((row, index) => {
    sheet.addRow({
      typeBookId: row.typeBookId,
      author: row.author,
      title: row.title,
      lineId: row.lineId,
      publisherId: row.publisherId,
      observation: row.observation,
    });
  });
  sheet.duplicateRow(1, offset, true);
  let rowHeader = sheet.getRow(offset + 1); //
  for (let i = 1; i <= totalColumns; i++) {
    let cellHeader = rowHeader.getCell(i);
    cellHeader.style = {
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    cellHeader.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cellHeader.font = {
      name: "Roboto",
      size: 14,
      bold: true,
    };
  }
  for (let i = 1; i <= totalRows; i++) {
    let rowS = sheet.getRow(i + offset + 1);
    rowS.height = 50;
    rowS.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    for (let j = 1; j <= totalColumns; j++) {
      let cellData = rowS.getCell(j);
      cellData.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }

  for (let i = 1; i <= offset; i++) {
    sheet.getRow(i).values = [];
  }

  sheet.mergeCells("C2:D3");
  let cellTitle = sheet.getCell("D3");
  cellTitle.value = "LIBROS";
  cellTitle.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  cellTitle.font = {
    name: "Roboto",
    size: 18,
    bold: true,
  };
};

const reportsRows = (reports = []) => {
  let rows = reports.map((record) => {
    return {
      projectId: record.Project?.title,
      author:
        record.Authors?.map(
          (a) => a.User?.firstName + " " + a.User?.lastName
        ).join(", ") || "",
      title: record.title || "",
      lineId:
        record.Project?.LineProjects?.filter((lp) => lp.Line?.isInstitutional)
          .map((lp) => lp.Line?.name)
          .join(", ") || "",
      institutionId:
        record.Project?.InstitutionProjects?.filter((ip) => ip.isFinancier)
          .map((ip) => ip.Institution?.name)
          .join(", ") || "",
      observation: record.observation || "",
    };
  });
  return rows;
};

const reportsXLSX = (sheet, data) => {
  sheet.columns = [
    {
      header: "Proyecto",
      key: "projectId",
      width: 50,
    },
    { header: "Autor(es)", key: "author", width: 50 },
    { header: "Título", key: "title", width: 50 },
    { header: "Línea de Inves. UCB", key: "lineId", width: 50 },
    { header: "Institución(Financiadora)", key: "institutionId", width: 50 },
    { header: "Observaciones", key: "observation", width: 50 },
  ];

  let totalColumns = sheet.columns.length;
  let rows = reportsRows(data);
  let totalRows = rows.length;
  let offset = 4;
  rows.forEach((row, index) => {
    sheet.addRow({
      projectId: row.projectId,
      author: row.author,
      title: row.title,
      lineId: row.lineId,
      institutionId: row.institutionId,
      observation: row.observation,
    });
  });
  sheet.duplicateRow(1, offset, true);
  let rowHeader = sheet.getRow(offset + 1); //
  for (let i = 1; i <= totalColumns; i++) {
    let cellHeader = rowHeader.getCell(i);
    cellHeader.style = {
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    cellHeader.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cellHeader.font = {
      name: "Roboto",
      size: 14,
      bold: true,
    };
  }
  for (let i = 1; i <= totalRows; i++) {
    let rowS = sheet.getRow(i + offset + 1);
    rowS.height = 50;
    rowS.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    for (let j = 1; j <= totalColumns; j++) {
      let cellData = rowS.getCell(j);
      cellData.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }

  for (let i = 1; i <= offset; i++) {
    sheet.getRow(i).values = [];
  }

  sheet.mergeCells("C2:D3");
  let cellTitle = sheet.getCell("D3");
  cellTitle.value = "INFORMES TÉCNICOS DE INVESTIGACIÓN";
  cellTitle.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  cellTitle.font = {
    name: "Roboto",
    size: 18,
    bold: true,
  };
};

const projectReportsRows = (projects = []) => {
  let rows = projects.map((record, index) => {
    return {
      index: index + 1,
      careerId: (() => {
        let career = [];
        let userProjectMain =
          record.UserProjects?.filter((up) => up.isMain) || null;
        career.push(userProjectMain[0]?.User?.SystemRol?.name || "");
        career.push(userProjectMain[0]?.User?.Career?.name || "Sin Carrera");
        return career.join("//");
      })(),
      userId: (() => {
        let userProjectMain =
          record.UserProjects?.filter((up) => up.isMain)[0]?.User || null;
        let name =
          (userProjectMain?.firstName || "") +
          " " +
          (userProjectMain?.lastName || "");
        return name;
      })(),
      title: record.title || "",
      lineId: (() => {
        let lineInstitutional = record.LineProjects?.filter(
          (lp) => lp.Line?.isInstitutional
        )
          .map((lp) => lp.Line?.name)
          .join(", ");
        return lineInstitutional;
      })(),
      financiers: (() => {
        let institutionProject = record.InstitutionProjects?.filter(
          (ip) => ip.isFinancier
        )
          .map((ip) => ip.Institution?.name)
          .join(", ");
        return institutionProject || "Fondos propios";
      })(),
      institutions: (() => {
        let institutionProject = record.InstitutionProjects?.filter(
          (ip) => !ip.isFinancier
        )
          .map((ip) => ip.Institution?.name)
          .join(", ");
        return institutionProject || "";
      })(),
      startDate: (() => {
        let startDate = new Date(record.startDate || null);
        startDate.setMinutes(
          startDate.getMinutes() + new Date().getTimezoneOffset()
        );

        startDate = startDate.toLocaleDateString("es");
        return startDate || "";
      })(),
      endDate: (() => {
        let endDate = new Date(record.endDate || null);
        endDate.setMinutes(
          endDate.getMinutes() + new Date().getTimezoneOffset()
        );
        endDate = endDate.toLocaleDateString("es");
        return endDate || "";
      })(),
      description: record.description || "",
      products: "",
    };
  });
  return rows;
};

const editLastCellProjectReports = (
  cell = null,
  record = null,
  lastRow = null
) => {
  let products = record.Products?.filter((p) => p.status).map((p) => ({
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
        type: sj.TypeInvestigation?.name || "",
        title: sj.titleDocument || "",
        stateProgress: sj.Progress.stateProgress,
      }));
      products = [...products, ...jobs];
    }
  });

  let paragraphs = [];
  products.forEach((p) => {
    paragraphs.push({
      font: {
        bold: true,
        size: 12,
        color: { theme: 1 },
        name: "Calibri",
        family: 2,
        scheme: "minor",
      },
      //text: `(${p.stateProgress})${p.type}:`,
      text: `${p.type}:`,
    });
    paragraphs.push({
      font: {
        size: 12,
        color: { theme: 1 },
        name: "Calibri",
        family: 2,
        scheme: "minor",
      },
      text: `${p.title} \n`,
    });
  });
  if (paragraphs.length > 0) {
    cell.value = {
      richText: paragraphs,
    };
    //cell.alignment = { vertical: 'middle', horizontal: 'left' };
    let height = 15 * paragraphs.length;
    lastRow.height = height < 50 ? 50 : height;
  } else {
    lastRow.height = 50;
  }
};

const editCellStudents = (cell = null, record = null, lastRow = null) => {
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
    let paragraphs = [];
    jobs.forEach((job) => {
      paragraphs.push({
        font: {
          bold: true,
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `${job.typeInvestigation}:`,
      });
      paragraphs.push({
        font: {
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `${job.name} \n`,
      });
      paragraphs.push({
        font: {
          bold: true,
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `Autor: `,
      });
      paragraphs.push({
        font: {
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `${job.userName} \n`,
      });

      paragraphs.push({
        font: {
          bold: true,
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `Tutor: `,
      });
      paragraphs.push({
        font: {
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `${job.tutor} \n`,
      });

      paragraphs.push({
        font: {
          bold: true,
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `Institución: `,
      });
      paragraphs.push({
        font: {
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `${job.institutionName} \n`,
      });

      paragraphs.push({
        font: {
          bold: true,
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `Carrera: `,
      });
      paragraphs.push({
        font: {
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `${job.careerName} \n`,
      });

      paragraphs.push({
        font: {
          bold: true,
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `Estado: `,
      });
      paragraphs.push({
        font: {
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `${
          job.isDefended
            ? `Defendida (${job.semesterEnd})`
            : "Pendiente de Defensa"
        } \n`,
      });

      paragraphs.push({
        font: {
          bold: true,
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `\n\n`,
      });
    });
    if (paragraphs.length > 0) {
      cell.value = {
        richText: paragraphs,
      };
      //cell.alignment = { vertical: 'middle', horizontal: 'left' };
      let height = 15 * paragraphs.length;
      lastRow.height = height < 50 ? 50 : height;
    }
  }
};

const editCellMembers = (cell = null, record = null, lastRow = null) => {
  let members = record.UserProjects.filter(
    (up) => up.acceptance === "Aceptado"
  );

  if (members.length > 0) {
    let paragraphs = [];
    members.forEach((member) => {
      paragraphs.push({
        font: {
          bold: true,
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `${member.SystemRol?.name}: `,
      });
      paragraphs.push({
        font: {
          size: 12,
          color: { theme: 1 },
          name: "Calibri",
          family: 2,
          scheme: "minor",
        },
        text: `${member?.User?.firstName + " " + member?.User?.lastName} \n`,
      });
    });
    if (paragraphs.length > 0) {
      cell.value = {
        richText: paragraphs,
      };
      //cell.alignment = { vertical: 'middle', horizontal: 'left' };
      /*  let height = 100 * paragraphs.length;
      lastRow.height = height < 50 ? 50 : height; */
    }
  }
};

const projectReportsXlsx = (sheet, data, columnsSelected) => {
  let columns = [
    {
      header: "N°.",
      key: "index",
      width: 50,
    },
    {
      header: "Investigación",
      key: "title",
      width: 50,
    },
    {
      header: "Carrera",
      key: "careerId",
      width: 50,
    },
    {
      header: "Docente",
      key: "userId",
      width: 50,
    },
    {
      header: "Línea",
      key: "lineId",
      width: 50,
    },
    {
      header: "Institución Financiadora",
      key: "financiers",
      width: 50,
    },
    {
      header: "Organizaciones",
      key: "institutions",
      width: 50,
    },
    {
      header: "Fecha inicio",
      key: "startDate",
      width: 50,
    },
    {
      header: "Fecha final",
      key: "endDate",
      width: 50,
    },
    {
      header: "Descripción",
      key: "description",
      width: 50,
    },
    {
      header: "Productos",
      key: "products",
      width: 50,
    },
  ];

  let finalColumns = [];

  for (let col of columnsSelected) {
    let colSelect = columns.filter((c) => c.header === col);
    if (colSelect.length > 0) {
      finalColumns.push(colSelect[0]);
    }
  }
  //console.log("final", finalColumns);
  sheet.columns = finalColumns;

  //Verificar si la columna especial Products esta presente
  let indexProducts = 0;
  let isColProducts = finalColumns.some((c, index) => {
    if (c.header === "Productos") {
      indexProducts = index;
      return true;
    } else {
      return false;
    }
  });
  indexProducts = indexProducts + 1;
  /* console.log("Is", isColProducts);
  console.log("index", indexProducts); */

  let totalColumns = sheet.columns.length;
  let rows = projectReportsRows(data);
  let totalRows = rows.length;
  let offset = 4;
  rows.forEach((row, index) => {
    sheet.addRow({
      index: index + 1,
      careerId: row.careerId,
      userId: row.userId,
      title: row.title,
      lineId: row.lineId,
      financiers: row.financiers,
      institutions: row.institutions,
      startDate: row.startDate,
      endDate: row.endDate,
      description: row.description,
      products: row.products,
    });
    if (isColProducts) {
      let lastRow = sheet.lastRow;
      let lastCell = lastRow.getCell(indexProducts);
      editLastCellProjectReports(lastCell, data[index], lastRow);
    }
  });

  //formatear celdas
  sheet.duplicateRow(1, offset, true);
  let rowHeader = sheet.getRow(offset + 1);
  //formateand el header
  for (let i = 1; i <= totalColumns; i++) {
    let cellHeader = rowHeader.getCell(i);
    cellHeader.style = {
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    cellHeader.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cellHeader.font = {
      name: "Roboto",
      size: 14,
      bold: true,
    };
  }

  //formateando cada cell
  for (let i = 1; i <= totalRows; i++) {
    let rowS = sheet.getRow(i + offset + 1);
    //rowS.height = 50;
    rowS.alignment = {
      vertical: "middle",
      horizontal: "left",
      wrapText: true,
    };
    for (let j = 1; j <= totalColumns; j++) {
      let cellData = rowS.getCell(j);
      cellData.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }

  //quitando duplicados del header

  for (let i = 1; i <= offset; i++) {
    sheet.getRow(i).values = [];
  }

  sheet.mergeCells("C2:D3");
  let cellTitle = sheet.getCell("D3");
  cellTitle.value = "INFORMES DE PROYECTOS";
  cellTitle.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  cellTitle.font = {
    name: "Roboto",
    size: 18,
    bold: true,
  };
};

/* const testMergeColumns = (sheet) => {
  let row1 = sheet.getRow(4);
  let row2 = sheet.getRow(5);

  row1.height = 50;
  row2.height = 70;
  sheet.mergeCells("C4:D5");
  let cellHeader = sheet.getCell("C4");
  cellHeader.style = {
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  };
  cellHeader.value = "Hello, World!";
  row1.height = 20;

  let cellH5 = sheet.getCell("H7");
  cellH5.value = "daksmdkamsdkmaksdmkamskdmkamsdkmaksdmkamdkmsamdskdmakd";
};
 */
const reportStudentRows = (projects) => {
  let rows = projects.map((record, index) => {
    return {
      index: index + 1,
      group: (() => {
        let textCell = "";
        let lineCicei = record.LineProjects?.filter(
          (lp) => !lp.Line?.isInstitutional
        );
        if (lineCicei.length) {
          textCell = lineCicei[0]?.Line?.Group?.name || "";
        } else {
          textCell = "";
        }
        return textCell;
      })(),
      lineCicei: (() => {
        let textCell = "";
        let lineCicei = record.LineProjects?.filter(
          (lp) => !lp.Line?.isInstitutional
        );
        if (lineCicei.length > 0) {
          textCell = lineCicei[0].Line?.name || "";
        } else {
          textCell = "Sin Línea";
        }
        return textCell;
      })(),
      lineUcb: (() => {
        let textCell = record.LineProjects?.filter(
          (lp) => lp.Line?.isInstitutional
        )
          .map((lp) => lp.Line?.name)
          .join(", ");
        return textCell;
      })(),
      nameProject: record.title,
      leader: (() => {
        let userProjectMain =
          record.UserProjects?.filter((up) => up.isMain)[0]?.User || null;
        let name =
          (userProjectMain?.firstName || "") +
          " " +
          (userProjectMain?.lastName || "");
        return name;
      })(),
      members: "",
      institutions: (() => {
        let textCell = record.InstitutionProjects?.map((ip) => {
          return `${ip.Institution?.name} (${ip.Institution?.shortName})`;
        }).join(", ");
        return textCell;
      })(),
      financier: (() => {
        let textCell = record.InstitutionProjects?.filter(
          (ip) => ip.isFinancier
        )
          .map((ip) => {
            return `${ip.Institution?.name} (${ip.Institution?.shortName})`;
          })
          .join(", ");
        return textCell;
      })(),
      mount: (() => {
        let textCell = record.InstitutionProjects?.filter(
          (ip) => ip.isFinancier
        )
          .map(
            (ip) =>
              `${ip.moneyBudget} ${ip.Currency?.shortName}(${ip.Institution?.shortName})`
          )
          .join(", ");
        return textCell;
      })(),
      startDate: (() => {
        let startDate = new Date(record.startDate || null);
        startDate = startDate.toLocaleDateString("es");
        return startDate;
      })(),
      endDate: (() => {
        let endDate = new Date(record.endDate || null);
        endDate = endDate.toLocaleDateString("es");
        return endDate;
      })(),
      progressPercent: (() => {
        let finishedActivities = record.Activities?.filter(
          (a) => a.Progress?.stateProgress === "Terminado"
        );
        let totalActivities = record.Activities?.length;
        let textCell = Math.round(
          (finishedActivities.length / totalActivities) * 100
        );
        textCell = isNaN(textCell) ? "0%" : textCell + "%";
        return textCell;
      })(),
      products: "",
      students: "",
      description: record.description,
    };
  });
  return rows;
};

const reportStudents = (sheet, data, columnsSelected) => {
  let columns = [
    {
      header: "N°.",
      key: "index",
      width: 10,
    },
    {
      header: "Grupo",
      key: "group",
      width: 50,
    },
    {
      header: "Línea de investigación",
      key: "lineCicei",
      width: 50,
    },
    {
      header: "Línea de investigación UCB",
      key: "lineUcb",
      width: 50,
    },

    {
      header: "Nombre del proyecto",
      key: "nameProject",
      width: 50,
    },
    {
      header: "Responsable del Proyecto",
      key: "leader",
      width: 50,
    },
    {
      header: "Miembros del proyecto",
      key: "members",
      width: 50,
    },
    {
      header: "Instituciones y Sociedades Científicas  participantes",
      key: "institutions",
      width: 50,
    },

    {
      header: "Financiamiento",
      key: "financier",
      width: 50,
    },
    {
      header: "Monto (Moneda)",
      key: "mount",
      width: 50,
    },
    {
      header: "Fecha inicio",
      key: "startDate",
      width: 50,
    },
    {
      header: "Fecha final",
      key: "endDate",
      width: 50,
    },

    {
      header: "% avance del proyecto",
      key: "progressPercent",
      width: 50,
    },
    {
      header: "Productos",
      key: "products",
      width: 50,
    },
    {
      header: "Estudiantes",
      key: "students",
      width: 50,
    },

    {
      header: "Descripción",
      key: "description",
      width: 50,
    },
  ];
  let finalColumns = [];

  for (let col of columnsSelected) {
    let colSelect = columns.filter((c) => c.header === col);
    if (colSelect.length > 0) {
      finalColumns.push(colSelect[0]);
    }
  }
  sheet.columns = finalColumns;
  //Verificar si la columna especial Products esta presente
  let indexProducts = 0;
  let isColProducts = finalColumns.some((c, index) => {
    if (c.header === "Productos") {
      indexProducts = index;
      return true;
    } else {
      return false;
    }
  });
  indexProducts = indexProducts + 1;

  //Verificar si la columna especial Estudiantes esta presente
  let indexStudents = 0;
  let isColStudents = finalColumns.some((c, index) => {
    if (c.header === "Estudiantes") {
      indexStudents = index;
      return true;
    } else {
      return false;
    }
  });
  indexStudents = indexStudents + 1;
  //Verificar si la columna especial Members esta presente
  let indexMembers = 0;
  let isColMembers = finalColumns.some((c, index) => {
    if (c.header === "Miembros del proyecto") {
      indexMembers = index;
      return true;
    } else {
      return false;
    }
  });
  indexMembers = indexMembers + 1;

  let totalColumns = sheet.columns.length;
  let rows = reportStudentRows(data);
  let totalRows = rows.length;
  let offset = 4;
  rows.forEach((row, index) => {
    sheet.addRow({
      ...row,
    });
    let lastRow = sheet.lastRow;
    if (isColProducts) {
      let cellProducts = lastRow.getCell(indexProducts);
      editLastCellProjectReports(cellProducts, data[index], lastRow);
    }
    if (isColStudents) {
      let cellStudents = lastRow.getCell(indexStudents);
      editCellStudents(cellStudents, data[index], lastRow);
    }

    if (isColMembers) {
      let cellMembers = lastRow.getCell(indexMembers);
      editCellMembers(cellMembers, data[index], lastRow);
    }
  });

  //formatear celdas
  sheet.duplicateRow(1, offset, true);
  let rowHeader = sheet.getRow(offset + 1);
  //formateand el header
  for (let i = 1; i <= totalColumns; i++) {
    let cellHeader = rowHeader.getCell(i);
    cellHeader.style = {
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    cellHeader.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cellHeader.font = {
      name: "Roboto",
      size: 14,
      bold: true,
    };
  }

  //formateando cada cell
  for (let i = 1; i <= totalRows; i++) {
    let rowS = sheet.getRow(i + offset + 1);
    //rowS.height = 50;
    rowS.alignment = {
      vertical: "middle",
      horizontal: "left",
      wrapText: true,
    };
    for (let j = 1; j <= totalColumns; j++) {
      let cellData = rowS.getCell(j);
      cellData.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }

  //quitando duplicados del header

  for (let i = 1; i <= offset; i++) {
    sheet.getRow(i).values = [];
  }

  sheet.mergeCells("C2:D3");
  let cellTitle = sheet.getCell("D3");
  cellTitle.value = "INFORMES DE ESTUDIANTES";
  cellTitle.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  cellTitle.font = {
    name: "Roboto",
    size: 18,
    bold: true,
  };
};

const studentJobsGenerator = (sheet, data) => {
  sheet.columns = [
    {
      header: "Tipo de Trabajo",
      key: "typeStudentJob",
      width: 50,
    },
    { header: "Título", key: "title", width: 50 },
    { header: "Estudiante", key: "student", width: 50 },
    { header: "Semestre inicio", key: "semesterStart", width: 50 },
    { header: "Semestre final", key: "semesterEnd", width: 50 },
    { header: "Carrera", key: "career", width: 50 },
    { header: "Grado Académico", key: "grade", width: 50 },
    { header: "Institución", key: "institution", width: 50 },
  ];
  let totalColumns = sheet.columns.length;
  let records = formatRowsStudentJobs(data);
  /*  let offset = 4;
  sheet.duplicateRow(1, offset, true);*/
  let rowHeader = sheet.getRow(/* offset */ 0 + 1);
  for (let i = 1; i <= totalColumns; i++) {
    let cellHeader = rowHeader.getCell(i);
    cellHeader.style = {
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    cellHeader.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cellHeader.font = {
      name: "Roboto",
      size: 14,
      bold: true,
    };
  }
  records.forEach((record) => {
    let row = sheet.addRow({ ...record });
    row.height = 50;
    row.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    for (let j = 1; j <= totalColumns; j++) {
      let cellData = row.getCell(j);
      cellData.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  });
};
const exportMyProjects = (sheet, data) => {
  sheet.columns = [
    {
      header: "Título",
      key: "title",
      width: 50,
    },
    { header: "Miembros", key: "members", width: 50 },
    { header: "Fecha inicio", key: "startDate", width: 50 },
    { header: "Fecha final", key: "endDate", width: 50 },
  ];
  let totalColumns = sheet.columns.length;
  let records = formatProjectRows(data);
  /*  let offset = 4;
  sheet.duplicateRow(1, offset, true);*/
  let rowHeader = sheet.getRow(/* offset */ 0 + 1);
  for (let i = 1; i <= totalColumns; i++) {
    let cellHeader = rowHeader.getCell(i);
    cellHeader.style = {
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    cellHeader.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cellHeader.font = {
      name: "Roboto",
      size: 14,
      bold: true,
    };
  }
  records.forEach((record) => {
    let row = sheet.addRow({ ...record });
    row.height = 50;
    row.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    for (let j = 1; j <= totalColumns; j++) {
      let cellData = row.getCell(j);
      cellData.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  });
};
const exportMyEdu_Comunicational = (sheet, data) => {
  sheet.columns = [
    {
      header: "Tipo de Producto",
      key: "typeCategory",
      width: 50,
    },
    { header: "Autores", key: "authors", width: 50 },
    { header: "Título", key: "title", width: 50 },
    { header: "Objetivo", key: "target", width: 50 },
    { header: "Público Objetivo", key: "publicTarget", width: 50 },
    { header: "Duración", key: "duration", width: 50 },
    { header: "Línea UCB", key: "line", width: 50 },
  ];
  let totalColumns = sheet.columns.length;
  let records = formatEdu_ComunicationalRows(data);
  /*  let offset = 4;
  sheet.duplicateRow(1, offset, true);*/
  let rowHeader = sheet.getRow(/* offset */ 0 + 1);
  for (let i = 1; i <= totalColumns; i++) {
    let cellHeader = rowHeader.getCell(i);
    cellHeader.style = {
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    cellHeader.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cellHeader.font = {
      name: "Roboto",
      size: 14,
      bold: true,
    };
  }
  records.forEach((record) => {
    let row = sheet.addRow({ ...record });
    row.height = 50;
    row.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    for (let j = 1; j <= totalColumns; j++) {
      let cellData = row.getCell(j);
      cellData.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  });
};

const exportMyTalks = (sheet, data) => {
  sheet.columns = [
    {
      header: "Tipo de Producto",
      key: "typeCategory",
      width: 50,
    },
    { header: "Autores", key: "authors", width: 50 },
    { header: "Título", key: "title", width: 50 },
    { header: "Talleristas", key: "workshopLeaders", width: 50 },
    { header: "Objetivo", key: "target", width: 50 },
    { header: "Público Objetivo", key: "publicTarget", width: 50 },
    { header: "Periódico", key: "newsPaper", width: 50 },
    { header: "Línea UCB", key: "line", width: 50 },
  ];

  let totalColumns = sheet.columns.length;
  let records = formatMyTalks(data);
  /*  let offset = 4;
  sheet.duplicateRow(1, offset, true);*/
  let rowHeader = sheet.getRow(/* offset */ 0 + 1);
  for (let i = 1; i <= totalColumns; i++) {
    let cellHeader = rowHeader.getCell(i);
    cellHeader.style = {
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    cellHeader.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cellHeader.font = {
      name: "Roboto",
      size: 14,
      bold: true,
    };
  }
  records.forEach((record) => {
    let row = sheet.addRow({ ...record });
    row.height = 50;
    row.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    for (let j = 1; j <= totalColumns; j++) {
      let cellData = row.getCell(j);
      cellData.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  });
};

const exportMySocialMedia = (sheet, data) => {
  sheet.columns = [
    {
      header: "Tipo de Producto",
      key: "typeCategory",
      width: 50,
    },
    { header: "Autores", key: "authors", width: 50 },
    { header: "Contenido Principal", key: "description", width: 50 },
    { header: "Objetivo", key: "target", width: 50 },
    { header: "Público Objetivo", key: "publicTarget", width: 50 },
    { header: "Url Página", key: "url", width: 50 },
    { header: "Redes Sociales", key: "socialNetworks", width: 50 },
    { header: "Duración", key: "duration", width: 50 },
    { header: "Línea UCB", key: "line", width: 50 },
  ];

  let totalColumns = sheet.columns.length;
  let records = formatMySocialMedia(data);
  /*  let offset = 4;
  sheet.duplicateRow(1, offset, true);*/
  let rowHeader = sheet.getRow(/* offset */ 0 + 1);
  for (let i = 1; i <= totalColumns; i++) {
    let cellHeader = rowHeader.getCell(i);
    cellHeader.style = {
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    cellHeader.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cellHeader.font = {
      name: "Roboto",
      size: 14,
      bold: true,
    };
  }
  records.forEach((record) => {
    let row = sheet.addRow({ ...record });
    row.height = 50;
    row.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    for (let j = 1; j <= totalColumns; j++) {
      let cellData = row.getCell(j);
      cellData.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  });
};

const exportMyComunication_Radio = (sheet, data, offset) => {
  let rowsFormated = formatMyComunication_Radio(data);
  sheet.addTable({
    name: "Radio",
    ref: `A${offset}`,
    headerRow: true,
    displayName: "Radio",
    //totalsRow: true,
    style: {
      theme: null,
      showRowStripes: false,
      showColumnStripes: true,
      width: 150,
    },
    columns: [
      { name: "Tipo de Producto" },
      { name: "Autores" },
      { name: "Título" },
      { name: "Resumen contenido" },
      { name: "Objetivo" },
      { name: "Público Objetivo" },
      { name: "Duración" },
      { name: "Estación de Transmisión" },
      { name: "Episodios" },
      { name: "Línea UCB" },
    ],
    rows: rowsFormated,
  });
  return rowsFormated.length || 0;
};

const exportMyComunication_TV = (sheet, data, offset) => {
  try {
    let rowsFormated = formatMyComunication_TV(data);
    sheet.addTable({
      name: "Radio",
      ref: `A${offset}`,
      headerRow: true,
      displayName: "Radio",
      //totalsRow: true,
      style: {
        theme: null,
        showRowStripes: false,
        showColumnStripes: true,
        width: 150,
      },
      columns: [
        { name: "Tipo de Producto" },
        { name: "Autores" },
        { name: "Título" },
        { name: "Resumen contenido" },
        { name: "Objetivo" },
        { name: "Público Objetivo" },
        { name: "Duración" },
        { name: "Canal de Transmisión" },
        { name: "Línea UCB" },
      ],
      rows: rowsFormated,
    });
    return rowsFormated.length || 0;
  } catch (error) {
    console.log("error", error.message);
    return 0;
  }
};

const exportMyComunication_PresaRevista = (sheet, data, offset) => {
  try {
    let rowsFormated = formatMyComunication_PresaRevista(data);
    sheet.addTable({
      name: "Radio",
      ref: `A${offset}`,
      headerRow: true,
      displayName: "Radio",
      //totalsRow: true,
      style: {
        theme: null,
        showRowStripes: false,
        showColumnStripes: true,
        width: 150,
      },
      columns: [
        { name: "Tipo de Producto" },
        { name: "Autores" },
        { name: "Título" },
        { name: "Resumen contenido" },
        { name: "Objetivo" },
        { name: "Público Objetivo" },
        { name: "Periódico" },
        { name: "Línea UCB" },
      ],
      rows: rowsFormated,
    });
    return rowsFormated.length || 0;
  } catch (error) {
    console.log("error", error.message);
    return 0;
  }
};

const titleTable = (sheet, title, offset) => {
  sheet.mergeCells(`A${offset - 1}:D${offset - 1}`);
  let cell = sheet.getCell(`A${offset - 1}`);
  cell.font = {
    size: 16,
    underline: true,
    bold: true
  };
  cell.value = title.toUpperCase();
};

const exportMyComunication = (sheet, data) => {
  let offset = 4;
  let occupedRows = offset;
  titleTable(sheet, "Radio", occupedRows);
  occupedRows += exportMyComunication_Radio(sheet, data?.radio, occupedRows);
  occupedRows += offset;
  titleTable(sheet, "TV", occupedRows);
  occupedRows += exportMyComunication_TV(sheet, data?.tv, occupedRows);
  occupedRows += offset;
  titleTable(sheet, "Prensa", occupedRows);
  occupedRows += exportMyComunication_PresaRevista(
    sheet,
    data?.prensa,
    occupedRows
  );
  occupedRows += offset;
  titleTable(sheet, "Revista", occupedRows);
  occupedRows += exportMyComunication_PresaRevista(
    sheet,
    data?.revista,
    occupedRows
  );
};

const XLSXGenerator = {
  productsXLSX: (data) => {
    let workbook = new ExcelJS.Workbook();
    const sheetArticles = workbook.addWorksheet("Articulos");
    const sheetBooks = workbook.addWorksheet("Libros");
    const sheetReports = workbook.addWorksheet(
      "Informes técnicos de investigación"
    );

    articlesXLSX(sheetArticles, data?.articles);
    booksXLSX(sheetBooks, data?.books);
    reportsXLSX(sheetReports, data?.reports);
    workbook.xlsx
      .writeBuffer()
      .then((buffer) =>
        FileSaver.saveAs(new Blob([buffer]), `${Date.now()}_feedback.xlsx`)
      )
      .catch((err) => console.log("Error writing excel export", err));
  },
  projectReportXLSX: async (data, columnsSelected) => {
    let workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Informe");
    projectReportsXlsx(sheet, data, columnsSelected);
    workbook.xlsx
      .writeBuffer()
      .then((buffer) =>
        FileSaver.saveAs(new Blob([buffer]), `${Date.now()}_feedback.xlsx`)
      )
      .catch((err) => console.log("Error writing excel export", err));
  },

  reportStudentsXLSX: async (data, columnsSelected) => {
    let workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Informe");
    reportStudents(sheet, data, columnsSelected);
    workbook.xlsx
      .writeBuffer()
      .then((buffer) =>
        FileSaver.saveAs(new Blob([buffer]), `${Date.now()}_feedback.xlsx`)
      )
      .catch((err) => console.log("Error writing excel export", err));
  },

  studentJobsXLSX: async (data) => {
    let workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Trabajos Est.");
    studentJobsGenerator(sheet, data);
    workbook.xlsx
      .writeBuffer()
      .then((buffer) =>
        FileSaver.saveAs(
          new Blob([buffer]),
          `Trabajos de Estudiantes_${Date.now()}.xlsx`
        )
      )
      .catch((err) => console.log("Error writing excel export", err));
  },
  myProjectsXLSX: async (data) => {
    let workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Proyectos.");
    exportMyProjects(sheet, data);
    workbook.xlsx
      .writeBuffer()
      .then((buffer) =>
        FileSaver.saveAs(
          new Blob([buffer]),
          `Trabajos de Estudiantes_${Date.now()}.xlsx`
        )
      )
      .catch((err) => console.log("Error writing excel export", err));
  },
  myDiffusionProducts: async (data) => {
    let workbook = new ExcelJS.Workbook();
     const sheetEdu_Comunicational = workbook.addWorksheet(
      "Edu_Comunicacional."
    );
    const sheetEdu_Talks = workbook.addWorksheet("Charlas.");
    const sheetEdu_SocialMedia = workbook.addWorksheet("Redes Sociales.");
    const sheetComunication = workbook.addWorksheet("Medios de Com.");
    //exportMyProjects(sheet, data);
    exportMyEdu_Comunicational(
      sheetEdu_Comunicational,
      data?.communicationalEdu
    );
    exportMyTalks(sheetEdu_Talks, data?.talks);
    exportMySocialMedia(sheetEdu_SocialMedia, data?.socialNetworks);
    exportMyComunication(sheetComunication, data?.media);
    workbook.xlsx
      .writeBuffer()
      .then((buffer) =>
        FileSaver.saveAs(
          new Blob([buffer]),
          `ProductosDifusion_${Date.now()}.xlsx`
        )
      )
      .catch((err) => console.log("Error writing excel export", err));
  },
};

export default XLSXGenerator;
