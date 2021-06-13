import React from "react";
import {
  FormControl,
  InputGroup,
  Form,
  Col,
  Container,
  Table,
  Button,
  Row,
} from "react-bootstrap";
import Header from "../components/Header";
import api from "../services/api";
import { useAuth } from "../hooks/auth";
import { useToast } from "../hooks/toast";

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

const Pdv: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [arrayProducts, setArrayProducts] = React.useState<any>([]);
  const [idxProduct, setIdxProduct] = React.useState<any>(0);
  const [produtos, setProdutos] = React.useState<any>([]);

  const [qtd, setQtd] = React.useState<any>(1);
  const [descValPdt, setDescValPdt] = React.useState<any>(0);

  const [descValNota, setDescValNota] = React.useState<any>(0);
  const [valTotalNota, setvalTotalNota] = React.useState<any>(0);
  const [valPago, setValPago] = React.useState<any>(0);
  const [valTroco, setValTroco] = React.useState<any>(0);

  const vlTotalRef = React.useRef<any>();
  const vlDescontoRef = React.useRef<any>();
  async function getData() {
    try {
      const resp = await api.get("/produtos");

      let arrayFiltered = resp.data;

      arrayFiltered.unshift({
        idproduto: 0,
        desc_produto: "Selecione",
        preco_venda: 0.0,
      });

      setProdutos(arrayFiltered);
    } catch (err) {
      addToast({
        title: "Erro",
        message: `Ocorreu um erro ao obter os dados ${err.message}`,
      });
    }
  }

  React.useEffect(() => {
    getData();
  }, []);

  function handleRenderProductData() {
    return (
      <Form.Row
        style={{ display: "flex", flexDirection: "row" }}
        className="mt-3"
      >
        <Col xl={1}>
          <Form.Label>Quantidade</Form.Label>
          <Form.Control
            value={qtd}
            onChange={(ev) => setQtd(ev.target.value)}
          />
        </Col>
        <Col xl={1} style={{ marginLeft: "10px", marginRight: "10px" }}>
          <Form.Label>Valor unitário</Form.Label>
          <Form.Control
            onChange={(ev) => {}}
            value={produtos[idxProduct].preco_venda}
            disabled
          />
        </Col>
        <Col xl={1} style={{ marginRight: "10px" }}>
          <Form.Label>Valor desconto</Form.Label>
          <Form.Control
            ref={vlDescontoRef}
            value={descValPdt}
            onChange={(ev) => setDescValPdt(ev.target.value)}
          />
        </Col>
        <Col xl={1} style={{ marginRight: "10px" }}>
          <Form.Label>Valor Total</Form.Label>
          <Form.Control
            ref={vlTotalRef}
            value={qtd * produtos[idxProduct].preco_venda - descValPdt}
            disabled
          />
        </Col>
        <Col xl={2} style={{ paddingTop: "32px", marginRight: "-70px" }}>
          <Button
            onClick={(ev) => {
              if (produtos[idxProduct].desc_produto === "Selecione") return;

              let newArray = {
                ...produtos[idxProduct],
                vlLiq: vlTotalRef.current.value,
                vlDesc: descValPdt,
                qtd: qtd,
              };

              setvalTotalNota(
                (prev: any) =>
                  parseFloat(vlTotalRef.current.value) + parseFloat(prev)
              );
              setDescValNota(
                (prev: any) => parseFloat(prev) + parseFloat(descValPdt)
              );

              setArrayProducts((prev: any) => {
                return [...prev, newArray];
              });

              setQtd(1);
              setDescValPdt(0);
            }}
            variant="success"
          >
            Adicionar Item
          </Button>
        </Col>
        <Col xl={1} style={{ paddingTop: "33px" }}>
          <Button
            onClick={async (ev) => {
              await setvalTotalNota((prev: any) => {
                if (arrayProducts.length)
                  return (
                    parseFloat(prev) -
                    parseFloat(arrayProducts[arrayProducts.length - 1].vlLiq)
                  );
                return parseFloat(prev) - parseFloat(prev);
              });
              await setDescValNota((prev: any) => {
                if (arrayProducts.length) {
                  return (
                    parseFloat(prev) -
                    parseFloat(arrayProducts[arrayProducts.length - 1].vlDesc)
                  );
                }
                return parseFloat(prev) - parseFloat(prev);
              });
              arrayProducts.pop();
              setArrayProducts([...arrayProducts]);
            }}
            variant="danger"
          >
            Excluir Item
          </Button>
        </Col>
      </Form.Row>
    );
  }

  React.useEffect(() => {
    if (arrayProducts.length) arrayProducts.forEach((val: any) => {});
  }, [arrayProducts]);

  const handleSubmit = React.useCallback(async () => {
    let obj = {
      idpessoa_fisica: user.idpessoa_fisica,
      idpessoa_juridica: user.idpessoa_juridica,
      valor_bruto: valTotalNota,
      valor_desconto: descValNota,
      valor_liquido: valTotalNota,
    };

    let objMov = {
      identrada_produto: null,
      idvenda: null,
    };
    try {
      await api.post("/venda", obj);
      addToast({ title: "Sucesso", message: "Dados enviados com sucesso" });
    } catch (err) {
      addToast({
        title: "Erro",
        message: `Ocorreu um erro ao confirmar ${err.message}`,
      });
    }
  }, [descValNota, user.idpessoa_fisica, user.idpessoa_juridica, valTotalNota]);

  return (
    <>
      <Header />
      <Container>
        {produtos && produtos.length && (
          <>
            <h3>PDV</h3>
            <Form>
              <Form.Row style={{ display: "flex", flexDirection: "row" }}>
                <Col xl={1} style={{ marginRight: "10px" }}>
                  <Form.Label>Código</Form.Label>
                  <Form.Control disabled />
                </Col>
                <Col xl={5}>
                  <Form.Label>Produto</Form.Label>
                  <Form.Control
                    onChange={(ev) => {}}
                    value={
                      produtos[idxProduct].desc_produto === "Selecione"
                        ? ""
                        : `${qtd} X ${produtos[idxProduct].desc_produto}`
                    }
                  />
                </Col>
              </Form.Row>

              <Form.Group as={Col} controlId="productCode" className="mt-3">
                <Form.Label>Cód. Produto</Form.Label>
                <Col xl={6}>
                  <Form.Control
                    as="select"
                    onChange={(ev) => {
                      let idx = ev.target.value;
                      setIdxProduct(ev.target.value);
                    }}
                  >
                    {produtos ? (
                      produtos.map((produto: any, idx: number) => (
                        <option key={produto.idproduto} value={idx}>
                          {produto.desc_produto}
                        </option>
                      ))
                    ) : (
                      <option>Sem produtos</option>
                    )}
                  </Form.Control>
                </Col>
              </Form.Group>
              {handleRenderProductData()}
              {handleRenderTable(arrayProducts)}
              <Form.Row style={{ display: "flex", flexDirection: "row" }}>
                <Col xl={1} style={{ marginRight: "50px" }}>
                  <Form.Label>Desconto</Form.Label>
                  <Form.Control
                    onChange={(ev) => {}}
                    value={descValNota.toFixed(2) || 0}
                    disabled
                  />
                </Col>
                <Col xl={1} style={{ marginRight: "50px" }}>
                  <Form.Label>Valor Líquido</Form.Label>
                  <Form.Control
                    onChange={(ev) => {}}
                    value={valTotalNota.toFixed(2) || 0}
                    disabled
                  />
                </Col>
                <Col xl={1} style={{ marginRight: "50px" }}>
                  <Form.Label>Valor Pago</Form.Label>
                  <Form.Control
                    onChange={(ev) => {
                      setValPago(ev.target.value);
                      setValTroco(
                        () =>
                          parseFloat(ev.target.value) - parseFloat(valTotalNota)
                      );
                    }}
                  />
                </Col>
                <Col xl={1}>
                  <Form.Label>Troco</Form.Label>
                  <Form.Control
                    onChange={(ev) => {}}
                    value={valTroco.toFixed(2) || 0}
                    disabled
                  />
                </Col>
              </Form.Row>
            </Form>
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
          </>
        )}
      </Container>
    </>
  );
};
export default Pdv;
