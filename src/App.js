import { CssBaseline,ThemeProvider} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "theme";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes , Navigate} from "react-router-dom";

import Proyects from "scenes/proyects";
import Dashboard from "scenes/dashboard"
import Layout from "scenes/layout"
import Categorys from "scenes/categories"
import Reactives from "scenes/reactives"
import Equipment from "scenes/equipment"
function App() {
  const mode = useSelector((state) => state.global.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)),[mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Routes>
            <Route element={<Layout/>}>
              <Route path="/" element={<Navigate to= "/login" replace /> }/>
              <Route path="/login" element={<Dashboard/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/proyectos" element={<Proyects/>}/>
              <Route path="/categorias" element={<Categorys/>}/>
              <Route path="/reactivos" element={<Reactives/>}/>
              <Route path="/equipos" element={<Equipment/>}/>
              
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>


    
    </div>
  );
}

export default App;
