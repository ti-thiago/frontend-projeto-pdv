import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../hooks/auth";
const Header: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">
        <img src="logo192.png" alt="Logomarca" width="50" height="50" />
      </Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/usuario">Usuário</Nav.Link>
          <Nav.Link href="/pessoa-fisica">Pessoa Física</Nav.Link>
          <Nav.Link href="/pessoa-juridica">Empresas</Nav.Link>
          <Nav.Link href="/produtos">Produtos</Nav.Link>
          <Nav.Link href="/entrada-produto">Entrada Produtos</Nav.Link>
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
