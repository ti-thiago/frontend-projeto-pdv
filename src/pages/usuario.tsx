import React from "react";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import Header from "../components/Header";
import api from "../services/api";
import { useToast } from "../hooks/toast";

const Usuario: React.FC = () => {
  const { addToast } = useToast();
  const [nomeUsuario, setNomeUsuario] = React.useState("");
  const [pessoaFisica, setPessoaFisica] = React.useState<any>([]);
  const [idxPessoa, setIdxPessoa] = React.useState(0);
  const [senhaUsuario, setSenhaUsuario] = React.useState("");

  async function getData() {
    try {
      const resp = await api.get("/pessoaFisica");
      setPessoaFisica(resp.data);
      console.log(resp.data);
    } catch (err) {
      let msg;
      if (err.response && err.response.data && err.response.data.err)
        msg = err.response.data.err;
      else if (err.response.data) msg = err.response.data;
      else msg = err.message.err;
      if (typeof msg === "object") {
        msg = msg.msg;
      }
      addToast({
        title: "Erro",
        message: `${msg}`,
      });
    }
  }
  React.useEffect(() => {
    getData();
  }, []);

  const handleSubmit = React.useCallback(async () => {
    let data: any = {};

    data.idpessoa_fisica = pessoaFisica[idxPessoa].idpessoa_fisica;
    data.nome_usuario = nomeUsuario;
    data.senha = senhaUsuario;
    try {
      const resp = await api.post("/user", data);

      alert(`${resp.data}`);
    } catch (err) {
      let msg;
      if (err.response && err.response.data && err.response.data.err)
        msg = err.response.data.err;
      else if (err.response.data) msg = err.response.data;
      else msg = err.message.err;
      if (typeof msg === "object") {
        msg = msg.msg;
      }
      addToast({
        title: "Erro",
        message: `Ocorreu um erro ao cadastrar usuário ${msg}`,
      });
    }
  }, [addToast, idxPessoa, nomeUsuario, pessoaFisica, senhaUsuario]);

  return (
    <>
      <Header />
      <Container>
        <h3>Cadastro Novo Usuário</h3>
        <Form>
          <Form.Row>
            <Col xl={1}>
              <Form.Label>Código</Form.Label>
              <Form.Control disabled />
            </Col>
          </Form.Row>
          {pessoaFisica && pessoaFisica.length && (
            <Form.Row>
              <Row className="mt-3">
                <Form.Group as={Col} controlId="productCode" className="mt-3">
                  <Col xl={2}>
                    <Form.Label>Cód. Pessoa</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={(ev) => {
                        let idx = ev.target.value;
                        setIdxPessoa(parseInt(idx));
                      }}
                    >
                      {pessoaFisica ? (
                        pessoaFisica.map((pessoaFisica: any, idx: number) => (
                          <option
                            key={pessoaFisica.idpessoa_fisica}
                            value={idx}
                          >
                            {pessoaFisica.idpessoa_fisica}
                          </option>
                        ))
                      ) : (
                        <option>Sem Pessoa Fisica</option>
                      )}
                    </Form.Control>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      value={
                        pessoaFisica && pessoaFisica[idxPessoa].nome
                          ? pessoaFisica[idxPessoa].nome
                          : ""
                      }
                      disabled
                    />
                  </Col>
                </Form.Group>
              </Row>
            </Form.Row>
          )}

          <Form.Row>
            <Row className="mt-3">
              <Col xl={3} style={{ marginRight: "10px" }}>
                <Form.Label>Nome Usuário</Form.Label>
                <Form.Control
                  onChange={(ev) => setNomeUsuario(ev.target.value)}
                  value={nomeUsuario}
                />
              </Col>
              <Col xl={3} style={{ marginRight: "10px" }}>
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  required
                  onChange={(ev) => setSenhaUsuario(ev.target.value)}
                  value={senhaUsuario}
                />
              </Col>
            </Row>
          </Form.Row>
          <Container>
            <Row>
              <Col xl={1} style={{ paddingTop: "33px", marginRight: "10px" }}>
                <Button
                  onClick={(ev) => {
                    handleSubmit();
                  }}
                  variant="success"
                >
                  +Confirmar
                </Button>
              </Col>
              <Col xl={1} style={{ paddingTop: "33px" }}>
                <Button
                  onClick={(ev) => {
                    window.location.reload();
                  }}
                  variant="danger"
                >
                  Cancelar
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Container>
    </>
  );
};
export default Usuario;
