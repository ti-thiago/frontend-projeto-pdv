import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./index.css";
import { Col, Container, Row } from "react-bootstrap";
import { useAuth } from "../hooks/auth";
import { useToast } from "../hooks/toast";
const Index: React.FC = () => {
  const { addToast } = useToast();
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { signIn } = useAuth();
  function validateForm() {
    return userName.length > 0 && password.length > 0;
  }

  async function handleSubmit(event: any) {
    event.preventDefault();

    try {
      await signIn({ nome_usuario: userName, senha: password });
      // const result = await api.post("/", {
      //   nome_usuario: userName,
      //   senha: password,
      // });
      // localStorage.setItem("@PdvUser", JSON.stringify(result.data));
      // history.push("/pessoa-fisica");
    } catch (err) {
      let msg;
      if (err.response && err.response.data && err.response.data.err)
        msg = err.response.data.err;
      else if (err.response.data) msg = err.response.data;
      else msg = err.message.err;
      if (typeof msg === "object") {
        msg = msg.msg;
      }
      console.log(err, err.response.data);
      addToast({
        title: "Erro",
        message: `${msg}`,
      });
    }
  }

  // async function getData() {
  //   try {
  //     const result = await api.get("/");
  //   } catch (err) {
  //     console.log(err);
  //     alert(`Ocorreu um erro ao fazer login ${err.message}`);
  //   }
  // }
  // React.useEffect(() => {
  //   getData();
  // }, []);

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
              <Col xl={4}>
                <Form.Group controlId="email">
                  <Form.Label>Nome de Usu??rio</Form.Label>
                  <Form.Control
                    placeholder="Digite o usu??rio"
                    autoFocus
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-center mt-2">
              <Col xl={4}>
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
            <Row className="justify-content-center mt-2">
              <Col xl={4}>
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
