import React from "react";
import { Table, Container, Form, Col, Row, Button } from "react-bootstrap";
import Header from "../components/Header";
import api from "../services/api";

function handleRenderTable(arrayProds: any) {
  return (
    <Container className="mt-4">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Cód. Produto</th>
            <th>Nome produto</th>
            <th>Quantidade</th>
            <th>Valor unitário</th>
            <th>Valor desconto</th>
            <th>Valor líquido</th>
          </tr>
        </thead>

        <tbody>
          {arrayProds.map((pdt: any, idx: number) => (
            <tr
              onClick={(ev) => {
                console.log(ev);
                arrayProds.splice(idx, 1);
              }}
            >
              <td>{pdt.idproduto}</td>
              <td>{pdt.desc_produto}</td>
              <td>{pdt.qtd}</td>
              <td>{pdt.preco_venda}</td>
              <td>{pdt.vlDesc}</td>
              <td>{pdt.vlLiq}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

const Produtos: React.FC = () => {
  const [produtos, setProdutos] = React.useState<any>([]);
  async function getData() {
    try {
      const resp = await api.get("/produtos");

      setProdutos(resp.data);
    } catch (err) {
      alert(`Não foi possível obter os produtos ${err.message}`);
    }
  }

  React.useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Header />
      <Container>
        <Form>
          <h3>Produtos</h3>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={2} className="mr-2">
              <Form.Label>Código</Form.Label>
              <Form.Control placeholder="Código" />
            </Col>
            <Col xl={8} style={{ marginLeft: "50px" }}>
              <Form.Label>Nota Fiscal</Form.Label>
              <Form.Control disabled />
            </Col>
          </Form.Row>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={2} className="mr-2">
              <Form.Label>Código</Form.Label>
              <Form.Control placeholder="Código" />
            </Col>
            <Col xl={8} style={{ marginLeft: "50px" }}>
              <Form.Label>Razão Social</Form.Label>
              <Form.Control disabled />
            </Col>
          </Form.Row>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={2} className="mr-2">
              <Form.Label>Código</Form.Label>
              <Form.Control placeholder="Código" />
            </Col>
            <Col xl={8} style={{ marginLeft: "50px" }}>
              <Form.Label>Nome Pessoa</Form.Label>
              <Form.Control disabled />
            </Col>
          </Form.Row>
          <Form.Row
            style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
          >
            <Col xl={2} className="mr-2">
              <Form.Label>Código</Form.Label>
              <Form.Control placeholder="Código" disabled />
            </Col>
            <Col xl={4} style={{ marginLeft: "50px" }}>
              <Form.Label>Nome produto</Form.Label>
              <Form.Control />
            </Col>
            <Col xl={1} style={{ marginLeft: "10px" }}>
              <Form.Label>Quantidade</Form.Label>
              <Form.Control />
            </Col>
            <Col xl={1} style={{ marginLeft: "10px" }}>
              <Form.Label>Valor unitário</Form.Label>
              <Form.Control />
            </Col>
            <Col xl={1} style={{ marginLeft: "10px" }}>
              <Form.Label>Valor Bruto</Form.Label>
              <Form.Control />
            </Col>
            <Col xl={1} style={{ marginLeft: "10px" }}>
              <Form.Label>Valor Desconto</Form.Label>
              <Form.Control />
            </Col>
            <Col xl={1} style={{ marginLeft: "10px" }}>
              <Form.Label>Valor Líquido</Form.Label>
              <Form.Control />
            </Col>
          </Form.Row>
          {/* {handleRenderTable()} */}
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={2}>
              <Form.Label>Valor Bruto</Form.Label>
              <Form.Control />
            </Col>
            <Col xl={2} style={{ marginLeft: "10px" }}>
              <Form.Label>Desconto</Form.Label>
              <Form.Control />
            </Col>
            <Col xl={2} style={{ marginLeft: "10px" }}>
              <Form.Label>Valor líquido</Form.Label>
              <Form.Control />
            </Col>
          </Form.Row>
          {/* <Form.Row>
            <Form.Group
              as={Col}
              controlId="formGridState"
              style={{ marginLeft: "10px" }}
            >
              <Form.Label>UF</Form.Label>
              <Form.Control as="select" defaultValue="GO">
                <option>GO</option>
                <option>MT</option>
                <option>SP</option>
                <option>PR</option>
              </Form.Control>
            </Form.Group>
          </Form.Row> */}

          <Container>
            <Row className="mt-2 p-0">
              <Col xl={2}>
                <Button
                  style={{ marginRight: 10 }}
                  variant="success"
                  type="submit"
                >
                  Enviar
                </Button>

                <Button
                  onClick={() => window.location.reload()}
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
export default Produtos;
