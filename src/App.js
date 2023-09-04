import "./App.css";
import { useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import GroupForm from "./Components/Group/GroupForm";
import TableGroup from "./Components/Group/TableGroup";
import GroupView from "./Components/Group/GroupView.jsx";
import LineView from "./Components/Line/LineView.jsx";
import TableLine from "./Components/Line/TableLine.jsx";
import ModalForm from "./Components/Line/LineForm.jsx";
import TableProject from "./Components/Project/TableProject";
import ProjectForm from "./Components/Project/ProjectForm.jsx";
//import ProjectAdmin from "./Components/Project/ProjectAdmin/ProjectAdmin.jsx";
//import ProjectViewUser from "./Components/Project/ProjectViewForUsers/ProjectViewUser.jsx";
//import ProjectView from "./Components/Project/ProjectView/ProjectView.jsx";
import ProjectsUser from "./Components/Project/ProjectUser/ProjectsUser.jsx";
import InvitationRequest from "./Components/Users/InvitationRequest.jsx";
import ProjectInvitation from "./Components/Project/ProjectAdminv2/ProjectInvitation.jsx";

//import ComponentTest from "./Components/ComponentTest/ComponentTest.jsx";

import GroupUser from "./Components/Group/GroupUsers/GroupUser.jsx";
import LineUser from "./Components/Line/LineUsers/LineUser.jsx";
import LineUserForm from "./Components/Line/LineUsers/LineUserForm.jsx";

import UserAdmin from "./Components/Users/UserAdmin/UserAdmin.jsx";

import Profile from "./Components/Layouts/Profile/Profile.jsx";

import News from "./Components/News/News.jsx";

import DataCenter from "./Components/DataCenter/DataCenter.jsx";

import BaseInformation from "./Components/Information/BaseInformation.jsx";

//import PicturesWall from "./Components/Group/uploadImage";
//import BreadcrumbC from './Components/Layouts/Breadcrumb/BreadcrumbC.jsx';
import Register from "./Components/Layouts/Register/Register";
//import Profile from "./Components/Profile/Profile.jsx";
import SiderPage from "./Components/Layouts/Sider/SiderPage.jsx";
import Home from "./Components/Layouts/Home/Home.jsx";
import Login from "./Components/Layouts/Login/Login";
import HeaderPage from "./Components/Layouts/Header/HeaderPage.jsx";
import PrivateRoute from "./Components/Layouts/PrivateRoute/PrivateRoute.jsx";
import PageNotFound from "./Components/Layouts/PageNotFound/PageNotFound.jsx";
import EmailForm from "./Components/Layouts/ResetPassword/EmailForm.jsx";
import ResetPasswordForm from "./Components/Layouts/ResetPassword/ResetPasswordForm.jsx";
import Information from "./Components/Layouts/Information/Information";
//import Testrequest from "./Components/Layouts/Testrequest.jsx";
import ProjectAdminV2 from "./Components/Project/ProjectAdminv2/ProjectAdmin";
import ProjectViewForUsersV2 from "./Components/Project/ProjectViewForUsersV2/ProjectViewUser";
import GantActivities from "./Components/Project/ProjectAdminv2/ProjectActivity/GantActivities";
import DirectInvitation from "./Components/Users/DirectInvitation";
import CenterTable from "./Components/Center/CenterTable";
import CenterForm from "./Components/Center/Form/CenterForm";
import CenterDetail from "./Components/Center/Details/CenterDetail";
import Events from "./Components/CalendarEvents/Events.jsx";
import CampusTable from "./Components/Campus/CampusTable";

import Reactivos from "./Components/Reactivos/ReactivoTable";

import PrivateRouteWrapper from "./Components/Wrapper/PrivateRouteWrapper";

import UserService from "./services/UserService";
import { useSelector, useDispatch } from "react-redux";
import { selectTheme } from "./Auth/themeReducer";
import { selectUser, updateToken } from "./Auth/userReducer";

import { ThemeSwitcherProvider } from "react-css-theme-switcher";

import { Layout } from "antd";

import ComponentTest from "./Components/ComponentTest/ComponentTest.jsx";

const { Content } = Layout;

function App() {
  const dispatch = useDispatch();
  const globalUser = useSelector(selectUser);
  const { current: user } = useRef(globalUser);
  const currentTheme = useSelector(selectTheme);
  useEffect(() => {
    console.log("Main Effect");
    if (user) {
      let usertoken = UserService.decodeJWT(user.token);
      dispatch(updateToken(usertoken));
    }
  }, [user, dispatch]);

  const themes = {
    dark: `${process.env.PUBLIC_URL}/dark-theme-min.css`,
    default: `${process.env.PUBLIC_URL}/default-theme-min.css`,
  };

  const basename = process.env.REACT_APP_BASENAME || null;

  return (
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={currentTheme.theme}>
      <BrowserRouter basename={basename}>
        <Layout
          style={{
            Height: "100vh",
          }}>
          <SiderPage />
          <Content
            style={{
              height: "100vh",
              //backgroundColor: "white",
              overflow: "auto",
            }}>
            <HeaderPage />
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/testcomponent" component={ComponentTest} />

              {/* <Route exact path="/tester" component={Testrequest} /> */}
              <PrivateRoute exact path="/reactivo" component={Reactivos} roles={["Administrador"]} />
              <PrivateRoute exact path="/events" component={Events} roles={["Administrador"]} />
              <PrivateRoute
                exact
                path="/home"
                component={Home}
                roles={["Administrador", "Investigador", "Asociado", "Estudiante", "Consultor", "DirectorNacional"]}
              />
              <PrivateRoute
                exact
                path="/information"
                component={Information}
                roles={["Administrador", "Investigador", "Asociado", "Estudiante", "Consultor"]}
              />
              <PrivateRoute exact path="/group" component={TableGroup} roles={["Administrador", "DirectorNacional"]} />
              <PrivateRoute exact path="/group/form" component={GroupForm} roles={["Administrador", "Investigador"]} />
              <PrivateRoute exact path="/group/view/:id" component={GroupView} roles={["Administrador", "Investigador"]} />
              <PrivateRoute exact path="/group/form/:id" component={GroupForm} roles={["Administrador", "Investigador"]} />
              <PrivateRoute exact path="/line" component={TableLine} roles={["Administrador"]} />
              <PrivateRoute exact path="/line/form" component={ModalForm} roles={["Administrador", "Investigador"]} />
              <PrivateRoute exact path="/line/form/:id" component={ModalForm} roles={["Administrador", "Investigador"]} />
              <PrivateRoute exact path="/line/view/:id" component={LineView} roles={["Administrador", "Investigador", "Asociado"]} />
              <PrivateRoute exact path="/project" component={TableProject} roles={["Administrador"]} />
              <PrivateRoute exact path="/project/form" component={ProjectForm} roles={["Administrador", "Investigador", "Asociado", "Consultor"]} />
              {/*  <PrivateRoute
                exact
                path="/project/view/:id"
                component={ProjectViewUser}
                roles={[
                  "Administrador",
                  "CICEI",
                  "Asociado",
                  "Estudiante",
                  "Consultor",
                ]}
              /> */}
              {/*  <PrivateRoute
                exact
                path="/project/viewforuser/:id"
                component={ProjectViewUser}
                roles={[
                  "Administrador",
                  "CICEI",
                  "Asociado",
                  "Consultor",
                  "Estudiante",
                ]}
              /> */}
              <PrivateRoute
                exact
                path="/project/viewforuser/:id"
                component={ProjectViewForUsersV2}
                roles={["Administrador", "Investigador", "Asociado", "Consultor", "Estudiante"]}
              />

              {/* <PrivateRoute
                exact
                path="/project-panel/:id"
                component={ProjectAdmin}
                roles={[
                  "Administrador",
                  "CICEI",
                  "Asociado",
                  "Consultor",
                  "Consultor",
                ]}
              /> */}
              <PrivateRoute
                exact
                path="/project-panel/:id"
                component={ProjectAdminV2}
                roles={["Administrador", "Investigador", "Asociado", "Consultor", "Consultor"]}
              />
              <PrivateRoute
                exact
                path="/project-users"
                component={ProjectsUser}
                roles={["Administrador", "Investigador", "Asociado", "Estudiante", "Consultor"]}
              />
              <PrivateRoute exact path="/users" component={UserAdmin} roles={["Administrador"]} />
              <PrivateRoute exact path="/invitation-users" component={InvitationRequest} roles={["Administrador"]} />
              <PrivateRoute
                exact
                path="/invitation-project/:id"
                component={ProjectInvitation}
                roles={["Administrador", "Investigador", "Asociado", "Consultor"]}
              />
              <PrivateRoute exact path="/group-users" component={GroupUser} roles={["Investigador", "Asociado", "Consultor", "Consultor"]} />
              <PrivateRoute exact path="/group-users/form/:id" component={GroupForm} roles={["Investigador", "Asociado", "Consultor"]} />
              <PrivateRoute exact path="/group-users/form" component={GroupForm} roles={["Investigador", "Asociado", "Consultor"]} />
              <PrivateRoute exact path="/line-users" component={LineUser} roles={["Investigador", "Asociado", "Consultor"]} />
              <PrivateRoute exact path="/line-users/form" component={LineUserForm} roles={["Investigador", "Asociado", "Consultor"]} />
              <PrivateRoute exact path="/line-users/form/:id" component={LineUserForm} roles={["Investigador", "Asociado", "Consultor"]} />

              <PrivateRoute exact path="/gant" component={GantActivities} roles={["Administrador", "Asociado", "Consultor"]} />

              <PrivateRoute exact path="/news" component={News} roles={["Administrador", "Investigador", "Asociado", "Consultor", "Estudiante"]} />
              <PrivateRoute exact path="/datacenter" component={DataCenter} roles={["Administrador", "Investigador", "Asociado", "Consultor"]} />

              <PrivateRoute exact path="/baseinfo" component={BaseInformation} roles={["Administrador"]} />

              {/*   <PrivateRoute
                exact
                path="/componenttest"
                component={ComponentTest}
                roles={["Administrador"]}
              /> */}

              <PrivateRoute
                exact
                path="/profile/:id"
                component={Profile}
                roles={["Administrador", "Investigador", "Asociado", "Consultor", "Estudiante", "DirectorNacional"]}
              />
              <Route exact path="/email-reset-password" component={EmailForm} />
              <Route exact path="/reset-password" component={ResetPasswordForm} />
              <Route exact path="/direct-invitation-to-project" component={DirectInvitation} />
              <PrivateRoute exact path="/centerTable" component={CenterTable} roles={["Administrador", "DirectorNacional"]} />
              <PrivateRoute exact path="/center/form" component={CenterForm} roles={["Administrador", "DirectorNacional"]} />
              <PrivateRoute exact path="/center/form/:id" component={CenterForm} roles={["Administrador", "DirectorNacional"]} />
              <PrivateRoute exact path="/center/detail/:id" component={CenterDetail} roles={["Administrador", "DirectorNacional"]}></PrivateRoute>
              <PrivateRoute exact path="/campus" component={CampusTable} roles={["Coordinator", "DirectorNacional", "Administrador"]} />
              <Route component={PageNotFound} />
            </Switch>
          </Content>
        </Layout>
      </BrowserRouter>
    </ThemeSwitcherProvider>
  );
}

export default App;
