import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./index.css";
import { Col, Container, Row } from "react-bootstrap";
import api from "../services/api";
const Index: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }
  React.useEffect(() => {
    async function getData() {
      try {
        const x = await api.get("/");
        console.log(x);
      } catch (err) {
        alert(`Ocorreu um erro ao obter os dados ${err.message}`);
      }
    }
    getData();
  }, []);
  async function handleSubmit(event: any) {
    event.preventDefault();

    try {
      await api.post("/", { email, senha: password });
    } catch (err) {
      alert(`Ocorreu um erro ao fazer login ${err.message}`);
    }
  }

  return (
    <>
      <section className="card-blank">
        <Container>
          <Row className="justify-content-center">
            <Col>
              <h3 style={{ textAlign: "center" }}>
                Seja bem vindo ao sistema PDV
              </h3>
            </Col>
          </Row>
        </Container>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Row className="justify-content-center ">
              <Col md={{ span: 3, offset: 3 }}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    placeholder="Digite o usuário"
                    autoFocus
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-center ">
              <Col xl={12}>
                <Form.Group controlId="password">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    placeholder="Digite a senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-center ">
              <Col xl={12}>
                <Button type="submit" disabled={!validateForm()}>
                  Login
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </section>
    </>
  );
};
export default Index;
