import React from "react";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import Header from "../components/Header";
import api from "../services/api";
import { useToast } from "../hooks/toast";

const Produtos: React.FC = () => {
  const { addToast } = useToast();
  const [produtos, setProdutos] = React.useState<any>([]);
  const [idxProduto, setIdxProduto] = React.useState<any>();
  const [codBarras, setCodBarras] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [unMed, setUnMed] = React.useState("");
  const [estoque, setEstoque] = React.useState("");

  const handleSubmit = React.useCallback(
    async (ev: any) => {
      ev.preventDefault();
      try {
        let obj = {
          cod_barras: codBarras,
          desc_produto: desc,
          preco_venda: price,
          unidade_medida: unMed,
          observacao: estoque,
        };

        let resp;
        let msg = "Produto cadastrado com sucesso";
        if (idxProduto) {
          resp = await api.put(
            `/produtos/${produtos[idxProduto].idproduto}`,
            obj
          );
          msg = "Produto atualizado com sucesso";
        } else {
          resp = await api.post("/produtos", obj);
        }

        addToast({
          title: "Sucesso",
          message: `${msg}`,
        });
        window.location.reload();
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
          message: `Ocorreu um erro ao enviar os produtos ${msg}`,
        });
      }
    },
    [addToast, codBarras, desc, estoque, idxProduto, price, produtos, unMed]
  );

  async function getDataProducts(id?: any) {
    let data = "";
    try {
      if (id) {
        data = id;
        const resp = await api.get(`/produtos/${data}`);
        setDesc(resp.data.desc_produto);
        setCodBarras(resp.data.cod_barras);
        setPrice(resp.data.preco_venda);
        setUnMed(resp.data.unidade_medida);
        setEstoque(resp.data.observacao);
      } else {
        const resp = await api.get(`/produtos/`);
        let arrayFiltered = resp.data;
        arrayFiltered.unshift({ idproduto: "", desc_produto: "Selecione" });

        setProdutos(arrayFiltered);
      }
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
        message: `Ocorreu um erro ao obter os produtos ${msg}`,
      });
    }
  }
  async function handleDelete() {
    try {
      if (!idxProduto) return;
      await api.delete(`/produtos/${produtos[idxProduto].idproduto}`);
      addToast({
        title: "Sucesso",
        message: `Produto deletado com sucesso`,
      });
      window.location.reload();
    } catch (err) {
      let msg;
      if (
        err.response &&
        err.response.data &&
        err.response.data.err &&
        err.response.data.err.includes("parent row")
      )
        msg = "Produto ja possui movimentação, impossível excluir!";
      else if (err.response && err.response.data && err.response.data.err)
        msg = err.response.data.err;
      else if (err.response.data) msg = err.response.data;
      else msg = err.message.err;
      if (typeof msg === "object") {
        msg = msg.msg;
      }
      addToast({
        title: "Erro",
        message: `Ocorreu um erro ao deletar o produto: ${msg}`,
      });
    }
  }

  React.useEffect(() => {
    getDataProducts();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Form onSubmit={handleSubmit}>
          <h3>Produtos</h3>
          <Form.Row>
            <Col xl={6}>
              <Form.Group
                as={Col}
                controlId="formGridState"
                style={{ marginBottom: "30px" }}
              >
                <Form.Label>Selecione o Produto</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={0}
                  onChange={async (ev: any) => {
                    await getDataProducts(produtos[ev.target.value].idproduto);
                    await setIdxProduto(ev.target.value);
                  }}
                >
                  {produtos ? (
                    produtos.map((produto: any, idx: any) => (
                      <option key={produto.desc_produto} value={idx}>
                        {produto.desc_produto}
                      </option>
                    ))
                  ) : (
                    <option>Sem produtos</option>
                  )}
                </Form.Control>
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={2}>
              <Form.Label>Código</Form.Label>
              <Form.Control
                disabled
                value={
                  produtos &&
                  produtos.length &&
                  idxProduto &&
                  produtos[idxProduto].idproduto
                }
              />
            </Col>
            <Col xl={6} style={{ marginLeft: "10px" }}>
              <Form.Label>Cód. barras</Form.Label>
              <Form.Control
                maxLength={10}
                value={codBarras}
                onChange={(ev) => setCodBarras(ev.target.value)}
              />
            </Col>
          </Form.Row>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={8}>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                value={desc}
                required
                onChange={(ev) => setDesc(ev.target.value)}
              />
            </Col>
          </Form.Row>

          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={2}>
              <Form.Label>Preço de venda</Form.Label>
              <Form.Control
                value={price}
                required
                onChange={(ev) => setPrice(ev.target.value)}
              />
            </Col>
            <Col xl={2} style={{ marginLeft: "10px" }}>
              <Form.Label>Unidade de medida</Form.Label>
              <Form.Control
                value={unMed}
                required
                maxLength={3}
                onChange={(ev) => setUnMed(ev.target.value)}
              />
            </Col>
            <Col xl={2} style={{ marginLeft: "10px" }}>
              <Form.Label>Estoque atual</Form.Label>
              <Form.Control
                value={estoque}
                onChange={(ev) => setEstoque(ev.target.value)}
              />
            </Col>
          </Form.Row>

          <Container>
            <Row className="mt-2 p-0">
              <Col xl={6}>
                <Button
                  style={{ marginRight: 10 }}
                  variant="success"
                  type="submit"
                >
                  Enviar
                </Button>

                <Button
                  style={{ marginRight: 10 }}
                  onClick={() => window.location.reload()}
                  variant="primary"
                >
                  Novo
                </Button>
                <Button
                  onClick={async () => {
                    await handleDelete();
                  }}
                  variant="danger"
                >
                  Deletar
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
