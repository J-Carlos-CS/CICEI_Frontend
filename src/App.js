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
              <Route path="/" element={<Navigate to= "/dashboard" replace /> }/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/proyectos" element={<Proyects/>}/>
              <Route path="/categorias" element={<Categorys/>}/>
              
              
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>


    
    </div>
  );
}

export default App;
