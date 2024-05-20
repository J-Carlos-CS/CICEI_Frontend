import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "theme";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { selectUser } from "Auth/userReducer";
import Dashboard from "scenes/dashboard";
import Layout from "scenes/layout";
import Categorias from "scenes/Categorias";
import Reactivos from "scenes/Reactivos";
import Login from "scenes/login";
import Proyecto from "scenes/Proyecto";
import Unidades from "scenes/Unidades";
import Equipos from "scenes/Equipos";
import DetalleEquipos from "scenes/Detalle_Equipos";
// import Manuales from "scenes/Manuales";
import Usuario from "scenes/Usuario";
import Guias from "scenes/Guias";
import Tutor from "scenes/Tutor";
import Solicitud from "scenes/Solicitud";
import SolicitudView from "scenes/SolicitudView";
import SolicitudAprobadasView from "scenes/SolicitudAprobada";
import SolicitudRechazadasView from "scenes/SolicitudRechazado";
import UsuarioPerfil from "scenes/UsuarioPerfil";
import SolicitudEntregada from "scenes/solicitudEntregada";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const user = useSelector(selectUser);
  const isLogged = user;
  const adminLab = user && user.rol === "Administrador";
  const tutor = user && user.rol === "Tutor";

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/solicitud/entregada" element={<SolicitudEntregada />} />
          {isLogged ? (
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/inicio" replace />} />
              <Route path="/inicio" element={<Dashboard />} />
              {adminLab && (
                <>
                  <Route path="/categorias" element={<Categorias />} />
                  <Route path="/reactivos" element={<Reactivos />} />
                  <Route path="/equipos" element={<Equipos />} />
                  <Route path="/proyecto" element={<Proyecto />} />
                  <Route path="/proyeto/detalle" element={<DetalleEquipos />} />
                  <Route path="/unidades" element={<Unidades />} />
                  {/* <Route path="/manuales" element={<Manuales />} /> */}
                  <Route path="/usuarios" element={<Usuario />} />
                </>
              )}
              {(tutor || adminLab) && (
                <>
                  <Route path="/tutor" element={<Tutor />} />
                </>
              )}
              <Route path="/pendientes" element={<SolicitudView />} />
              <Route path="/aprobadas" element={<SolicitudAprobadasView />} />
              <Route path="/guias" element={<Guias />} />
              <Route path="/solicitud" element={<Solicitud />} />
              <Route path="/negadas" element={<SolicitudRechazadasView />} />
              <Route path="/perfil" element={<UsuarioPerfil />} />
            </Route>
          ) : undefined}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
