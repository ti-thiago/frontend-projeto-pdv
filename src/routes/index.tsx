import React from "react";
import { Switch } from "react-router-dom";

import Index from "../pages/index";
import Vendas from "../pages/vendas";
import Pdv from "../pages/pdv";
import PessoaFisica from "../pages/pessoaFisica";
import Produtos from "../pages/produtos";
import Usuario from "../pages/usuario";

import Route from "./Route";

const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Index} />
    <Route path="/pessoa-fisica/:id?" component={PessoaFisica} isPrivate />
    <Route path="/vendas" component={Vendas} isPrivate />
    <Route path="/pdv" component={Pdv} isPrivate />
    <Route path="/produtos" component={Produtos} isPrivate />
    <Route path="/usuario" component={Usuario} isPrivate />
  </Switch>
);

export default Routes;
