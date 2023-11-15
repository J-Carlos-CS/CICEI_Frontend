import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "theme";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Dashboard from "scenes/dashboard";
import Layout from "scenes/layout";
import Categorys from "scenes/Categorias";
import Reactives from "scenes/Reactivos";
import Equipment from "scenes/equipment";
import Login from "scenes/login";
import Proyecto from "scenes/Proyecto";
import Unidades from "scenes/Unidades";
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
              <Route path="/categorias" element={<Categorys />} />
              <Route path="/reactivos" element={<Reactives />} />
              <Route path="/equipos" element={<Equipment />} />
              <Route path="/proyecto" element={<Proyecto />} />
              <Route path="/unidades" element={<Unidades />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
