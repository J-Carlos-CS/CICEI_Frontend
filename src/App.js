import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "theme";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { selectUser } from "Auth/userReducer";
import Dashboard from "scenes/dashboard";
import Layout from "scenes/layout";
import Categorias from "scenes/Categorias";
import Reactives from "scenes/Reactivos";
import Login from "scenes/login";
import Proyecto from "scenes/Proyecto";
import Unidades from "scenes/Unidades";
import Equipos from "scenes/Equipos";
import DetalleEquipos from "scenes/Detalle_Equipos";
import Manuales from "scenes/Manuales";
import Usuario from "scenes/Usuario";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLogged = user;
  const adminLab = user && user.rol === "Admin";
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />
          {isLogged ? (
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/inicio" element={<Dashboard />} />
              {adminLab && (
                <>
                  <Route path="/categorias" element={<Categorias />} />
                  <Route path="/reactivos" element={<Reactives />} />
                  <Route path="/equipos" element={<Equipos />} />
                  <Route path="/proyecto" element={<Proyecto />} />
                  <Route path="/proyeto/detalle" element={<DetalleEquipos />} />
                  <Route path="/unidades" element={<Unidades roles={["Administrador", "Investigador", "Asociado", "Estudiante", "Consultor", "DirectorNacional"]} />} />
                  <Route path="/manuales" element={<Manuales />} />
                  <Route path="/usuarios" element={<Usuario />} />
                </>
              )}
            </Route>
          ) : undefined}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
