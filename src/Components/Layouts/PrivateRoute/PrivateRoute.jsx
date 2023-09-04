import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "./../../../Auth/userReducer";

export default function PrivateRoute({
  component: Component,
  roles,
  ...restProps
}) {
  const user = useSelector(selectUser);
  return (
    <Route
    {...restProps}
    render={(props) => {
      if (!user) {
        return (
          <Redirect
          to={{ pathname: "/", state: { from: props.location } }}
          />
          );
        }
        if (roles && roles.indexOf(user.rolName) === -1) {
          //console.log("evento")
          return <Redirect to={{ pathname: "/" }} />;
        }

        return <Component {...props} />;
      }}
    />
  );
}
