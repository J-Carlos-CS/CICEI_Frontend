import PrivateRoute from "../Layouts/PrivateRoute/PrivateRoute";
import Home from "../Layouts/Home/Home";
import { useState } from "react";


export default function PrivateRouteWrapper(){

    const [listComponent,setListComponenet]=useState([<PrivateRoute
      exact
      path="/home"
      component={Home}
      roles={[
        "Administrador",
        "Investigador",
        "Asociado",
        "Estudiante",
        "Consultor",
        "DirectorNacional"
      ]}
    />])


    function ListComponentForAdministrator() {
        return listComponent;
    }

    function ListComponentForEachRol() {
        return ListComponentForAdministrator()
    }

    return (
      ListComponentForEachRol()
    )
}