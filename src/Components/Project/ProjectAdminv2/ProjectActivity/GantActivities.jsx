import { Row, Col } from "antd";
import Chart from "react-google-charts";

export default function GantActivities({ list = [], datesProject }) {
  console.log("listact", list);
  let height = list.length * 50 + 120;
  let dataList = [];
  const dataGantt = (activities) => {
    let data = [];
    let totalActivities = activities.length;
    let activitiesFinished = 0;
    activities.forEach((activity) => {
      let startDate = new Date(activity.startDate);
      let endDate = new Date(activity.endDate);
      let currentDate = new Date();
      startDate.setMinutes(
        startDate.getMinutes() + new Date().getTimezoneOffset()
      );
      endDate.setMinutes(endDate.getMinutes() + new Date().getTimezoneOffset());
      currentDate.setMinutes(
        endDate.getMinutes() + new Date().getTimezoneOffset()
      );
      let color = "";
      let percent = activity.progress || 10;

      if (activity.Progress?.stateProgress === "Terminado") {
        activitiesFinished = activitiesFinished + 1;
      }

      if (
        activity.Progress?.stateProgress === "Pendiente" &&
        endDate < currentDate
      ) {
        color = "Pendiente,Atrasada";
      }

      color = `${activity.User?.firstName} ${activity.User?.lastName}`;
      data.push([
        activity.id?.toString(),
        activity.name,
        color,
        startDate,
        endDate,
        null,
        percent,
        null,
      ]);
    });

    let currentPercetnProject = (activitiesFinished / totalActivities) * 100;
    currentPercetnProject = parseFloat(currentPercetnProject.toFixed(3));
    /*  console.log('currentPercetnProject',currentPercetnProject);
console.log('typeof', typeof(currentPercetnProject)); */
    let projectActivityMajor = [
      "120",
      "Proyecto",
      "En Progreso",
      new Date(datesProject[0]),
      new Date(datesProject[1]),
      null,
      Math.round(currentPercetnProject),
      null,
    ];
    data.unshift(projectActivityMajor);
    data.unshift([
      { type: "string", label: "Task ID" },
      { type: "string", label: "Task Name" },
      { type: "string", label: "Resource" },
      { type: "date", label: "Start Date" },
      { type: "date", label: "End Date" },
      { type: "number", label: "Duration" },
      { type: "number", label: "Percent Complete" },
      { type: "string", label: "Dependencies" },
    ]);
    dataList = data;
  };

  dataGantt(list);
  return (
    <Row
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Col span={22}>
        <Chart
          width={"100%"}
          height={height + "px"}
          chartType="Gantt"
          loader={<div>Loading Chart</div>}
          chartLanguage={"es"}
          data={dataList}
          rootProps={{ "data-testid": "2" }}
        />
      </Col>
    </Row>
  );
}
