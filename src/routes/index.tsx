import React from "react";
import { Switch } from "react-router-dom";

import Index from "../pages/index";

import Pdv from "../pages/pdv";
import PessoaFisica from "../pages/pessoaFisica";
import PessoaJuridica from "../pages/pessoaJuridica";
import Produtos from "../pages/produtos";
import EntradaProduto from "../pages/entradaProduto";
import Usuario from "../pages/usuario";

import Route from "./Route";

const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Index} />
    <Route path="/pessoa-fisica/:id?" component={PessoaFisica} isPrivate />
    <Route path="/pessoa-juridica/:id?" component={PessoaJuridica} isPrivate />
    <Route path="/pdv" component={Pdv} isPrivate />
    <Route path="/produtos/:id?" component={Produtos} isPrivate />
    <Route path="/usuario/:id?" component={Usuario} isPrivate />
    <Route path="/entrada-produto" component={EntradaProduto} isPrivate />
  </Switch>
);

export default Routes;
