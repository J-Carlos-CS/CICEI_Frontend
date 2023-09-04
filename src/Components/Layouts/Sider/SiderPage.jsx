import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser, selectViewBar } from "../../../Auth/userReducer";
import { selectTheme, changetheme } from "../../../Auth/themeReducer";
import {
  UserOutlined,
  UsergroupAddOutlined,
  NodeExpandOutlined,
  FundProjectionScreenOutlined,
  UserSwitchOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  CarryOutOutlined,
  UploadOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { Layout, Menu, PageHeader, Switch as Switchy, Image, Row } from "antd";
import { useHistory, useLocation, Link } from "react-router-dom";
import { PositionCache } from "@fullcalendar/react";
const { Sider } = Layout;
const { SubMenu } = Menu;

export default function HeaderPage() {
  const location = useLocation().pathname;
  const history = useHistory();
  const user = useSelector(selectUser);
  let viewBar = useSelector(selectViewBar);
  const currentTheme = useSelector(selectTheme);
  const dispatch = useDispatch();
  const [current, setCurrent] = useState("");
  const [collapsed, setCollapsed] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(currentTheme.theme === "dark");
  const {
    switcher,
    /* currentTheme: otherCurrentTheme,
    status, */
    themes,
  } = useThemeSwitcher();
  const toggleTheme = (isChecked) => {
    setIsDarkMode(isChecked);
    dispatch(changetheme(isChecked));
    switcher({ theme: isChecked ? themes.dark : themes.default });
  };
  const children = [
    {
      key: "subKey1",
      dataIndex: "subKey1",
      label: "subKey1",
    },
    {
      key: "subKey2",
      dataIndex: "subKey2",
      label: "subKey2",
    },
  ];
  const handleClick = (e) => {
    switch (e.key) {
      case "campus":
        setCurrent("campus");
        history.push("/campus");
        break;
      case "centers":
        setCurrent("centers");
        history.push("/centerTable");
        break;
      case "information":
        setCurrent("information");
        history.push("/information");
        break;
      case "events":
        setCurrent("events");
        history.push("/events");
        break;
      case "datacenter":
        setCurrent("datacenter");
        history.push("/datacenter");
        break;
      case "groups":
        setCurrent("groups");
        if (user.rolName === "Asociado" || user.rolName === "Investigador" || user.rolName === "Consultor") {
          history.push("/group-users");
        } else {
          history.push("/group");
        }
        break;
      case "lines":
        setCurrent("lines");
        if (user.rolName !== "Administrador") {
          history.push("/line-users");
        } else {
          history.push("/line");
        }
        break;
      case "projects":
        setCurrent("projects");
        if (user.rolName !== "Administrador") {
          history.push("/project-users");
        } else {
          history.push("/project");
        }
        break;
      case "users":
        setCurrent("users");
        history.push("/users");
        break;
      case "profile":
        setCurrent("profile");
        history.push("/profile/" + user.id);
        break;
      case "news":
        setCurrent("news");
        history.push("/news");
        break;
      case "baseInfo":
        setCurrent("baseinfo");
        history.push("/baseinfo");
        break;
      case "reactivos":
        setCurrent("reactivos");
        history.push("/reactivo");
        break;
      case "logout":
        dispatch(logout());
        break;
      default:
        history.push("/");
    }
  };
  useEffect(() => {
    console.log(viewBar, "assd");
  }, [viewBar]);
  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          visibility: viewBar,
        }}>
        {user ? (
          <>
            <Menu theme="dark" onClick={handleClick} selectedKeys={[current]} mode="inline">
              {console.log("viewBar ==", viewBar)}
              <Image
                preview={false}
                style={{ width: "100%", padding: "2vh" }}
                src={`${process.env.PUBLIC_URL}/LogoCicei.png`}
                onClick={() => {
                  setCurrent("");
                  history.push("/home");
                }}
              />
              <Row>
                <Switchy checked={isDarkMode} onChange={toggleTheme} />
              </Row>
              {(user.rolName === "CoordinatorOfInstitute" || user.rolName === "Administrador") && (
                <Menu.Item key={"campus"} icon={<ProfileOutlined />}>
                  <Link to="/campus" replace>
                    Sedes
                  </Link>
                </Menu.Item>
              )}
              {(user.rolName === "Administrador" || user.rolName === "DirectorNacional") && (
                <Menu.Item key="centers" icon={<ProfileOutlined />}>
                  <Link to="/centerTable" replace>
                    Centros
                  </Link>
                </Menu.Item>
              )}
              {(user.rolName === "Administrador" || user.rolName === "DirectorNacional") && (
                <Menu.Item key="reactivos" icon={<ExperimentOutlined />}>
                  <Link to="/reactivos" replace>
                    Reactivos
                  </Link>
                </Menu.Item>
              )}
              {(user.rolName === "Administrador" || user.leaderGroup) && (
                <Menu.Item key="events" icon={<CarryOutOutlined />}>
                  <Link to="/events" replace>
                    Eventos
                  </Link>
                </Menu.Item>
              )}
              {(user.rolName === "Administrador" || user.leaderGroup || user.rolName === "Investigador") && (
                <Menu.Item key="datacenter" icon={<UploadOutlined />}>
                  <Link to="/datacenter" replace>
                    Exportar
                  </Link>
                </Menu.Item>
              )}
              {user.rolName !== "DirectorNacional" && (
                <Menu.Item key="information" icon={<ProfileOutlined />}>
                  <Link to="/information" replace>
                    Información
                  </Link>
                </Menu.Item>
              )}
              {user.rolName !== "DirectorNacional" && (
                <Menu.Item key="news" icon={<ProfileOutlined />}>
                  <Link to="/news" replace>
                    Noticias
                  </Link>
                </Menu.Item>
              )}

              {(((user.rolName === "Investigador" || user.rolName === "Asociado" || user.rolName === "Consultor") && user.leaderGroup) ||
                user.rolName === "Administrador") && (
                <Menu.Item key="groups" icon={<UsergroupAddOutlined />}>
                  Grupos
                </Menu.Item>
              )}

              {(((user.rolName === "Investigador" || user.rolName === "Asociado" || user.rolName === "Consultor") && user.leaderGroup) ||
                user.rolName === "Administrador") && (
                <Menu.Item key="lines" icon={<NodeExpandOutlined />}>
                  Líneas
                </Menu.Item>
              )}
              {user.rolName !== "DirectorNacional" && (
                <Menu.Item key="projects" icon={<FundProjectionScreenOutlined />}>
                  Proyectos
                </Menu.Item>
              )}
              {user.rolName === "Administrador" && (
                <Menu.Item key="users" icon={<UserSwitchOutlined />}>
                  Usuarios
                </Menu.Item>
              )}
              {user.rolName === "Administrador" && (
                <Menu.Item key="baseInfo" icon={<ReconciliationOutlined />}>
                  Informacion Base
                </Menu.Item>
              )}
              <SubMenu key="SubMenu" icon={<UserOutlined />} title={user ? user.firstName + " " + user.lastName : "Usuario no logeado"}>
                <Menu.Item key="profile">Ver mi perfil</Menu.Item>
                <Menu.Item key="logout">Salir</Menu.Item>
              </SubMenu>
              {<Menu.Item key={"spaceForSider"}></Menu.Item>}
            </Menu>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "10vw",
                justifyContent: "center",
                alignItems: "center",
              }}></div>
          </>
        ) : null}
      </Sider>
    </>
  );
}
