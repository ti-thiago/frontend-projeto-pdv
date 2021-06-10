import React from "react";
import { Switch, BrowserRouter, Redirect } from "react-router-dom";
import Route from "./Route";
import Index from "../pages/index";
import Vendas from "../pages/vendas";
import Pdv from "../pages/pdv";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Index} />
      <Route path="/vendas" component={Vendas} isPrivate />
      <Route path="/pdv" component={Pdv} isPrivate />
    </Switch>
  );
};

export default Routes;
