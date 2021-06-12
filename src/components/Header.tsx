import React from "react";
import {
  Button,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { useAuth } from "../hooks/auth";
const Header: React.FC = () => {
  const { signOut, user } = useAuth();
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">
        <img src="logo192.png" alt="Logomarca" width="50" height="50" />
      </Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href={`/pessoa-fisica/${user.idpessoa_fisica}`}>
            Pessoa Física
          </Nav.Link>
          <Nav.Link href="/usuario">Usuário</Nav.Link>
          <Nav.Link href="/vendas">Vendas</Nav.Link>
          <Nav.Link href="/produtos">Produtos</Nav.Link>
          <Nav.Link href="/pdv">PDV</Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse
        id="basic-navbar-nav"
        style={{
          flexDirection: "row-reverse",
          paddingRight: "40px",
        }}
      >
        <Nav
          style={{
            backgroundColor: "#dc3545",
            borderRadius: ".25rem",
            border: "1 solid transparent",
            color: "#fff",
          }}
        >
          <Nav.Link onClick={() => signOut()} href="/">
            Sair
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default Header;
