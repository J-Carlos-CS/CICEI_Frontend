import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "theme";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/reactivos" element={<Reactives />} />
              <Route path="/equipos" element={<Equipos />} />
              <Route path="/proyecto" element={<Proyecto />} />
              <Route path="/proyeto/detalle" element={<DetalleEquipos />} />
              <Route path="/unidades" element={<Unidades roles={["Administrador", "Investigador", "Asociado", "Estudiante", "Consultor", "DirectorNacional"]} />} />
              <Route path="/manuales" element={<Manuales />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
