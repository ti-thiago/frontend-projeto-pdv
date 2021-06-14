import React from "react";
import api from "../services/api";
import { useToast } from "../hooks/toast";
import Header from "../components/Header";
import { Table, Container, Form, Col, Row, Button } from "react-bootstrap";

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

const EntradaProduto: React.FC = () => {
  const { addToast } = useToast();
  const [arrayProducts, setArrayProducts] = React.useState<any>([]);

  const [idxProduct, setIdxProduct] = React.useState<any>(0);
  const [idPessoaFisica, setIdPessoaFisica] = React.useState<any>(0);
  const [idPessoaJuridica, setIdPessoaJuridica] = React.useState<any>(0);
  const [produtos, setProdutos] = React.useState<any>([]);
  const [pessoaFisicaArray, setPessoaFisicaArray] = React.useState<any>([]);
  const [pessoaJuridicaArray, setPessoaJuridicaArray] = React.useState<any>([]);

  const [notaFiscal, setNotaFiscal] = React.useState("");
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
      const respPessoaFisica = await api.get("/pessoaFisica");
      const respPessoaJuridica = await api.get("/pessoaJuridica");

      let arrayFiltered = resp.data;
      let arrayFilteredPF = respPessoaFisica.data;
      let arrayFilteredPJ = respPessoaJuridica.data;

      arrayFiltered.unshift({
        idproduto: 0,
        desc_produto: "Selecione",
        preco_venda: 0.0,
      });

      arrayFilteredPF.unshift({
        idpessoa_fisica: 0,
        nome: "Selecione",
      });
      arrayFilteredPJ.unshift({
        idpessoa_juridica: 0,
        razao_social: "Selecione",
      });

      setProdutos(arrayFiltered);
      setPessoaFisicaArray(arrayFilteredPF);
      setPessoaJuridicaArray(arrayFilteredPJ);
    } catch (err) {
      addToast({
        title: "Erro",
        message: `Ocorreu um erro ao obter os dados ${err.response.data}`,
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
            onClick={async (ev) => {
              if (produtos[idxProduct].desc_produto === "Selecione") return;
              await handleAddProd();
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

  const handleSubmit = React.useCallback(async () => {
    let obj = {
      idpessoa_fisica: idPessoaFisica !== 0 || null,
      idpessoa_juridica: idPessoaJuridica !== 0 || null,
      valor_bruto: valTotalNota,
      valor_desconto: descValNota,
      valor_liquido: valTotalNota - descValNota,
      nota_fiscal: notaFiscal,
    };
    console.log(obj);

    try {
      await api.post("/entradaNota", obj);
      addToast({ title: "Sucesso", message: "Dados enviados com sucesso" });
    } catch (err) {
      addToast({
        title: "Erro",
        message: `Ocorreu um erro ao enviar os dados ${err.response.data}`,
      });
    }
  }, [addToast, descValNota, idPessoaFisica, idPessoaJuridica, valTotalNota]);

  const handleAddProd = React.useCallback(async () => {
    try {
      let obj = {
        identrada_produto: null,
        idproduto: produtos[idxProduct].idproduto,
        qtd_entrada: qtd,
        vl_compra: vlTotalRef.current.value,
      };
      const resp = await api.post("/movimentacaoProduto", obj);
      addToast({
        title: "Sucesso",
        message: `Produto adicionado com sucesso`,
      });
    } catch (err) {
      addToast({
        title: "Erro",
        message: `Ocorreu um erro ao adicionar o produto ${err.response.data}`,
      });
    }
  }, [addToast, idxProduct, produtos, qtd]);

  return (
    <>
      <Header />
      <Container>
        {produtos &&
          pessoaFisicaArray &&
          pessoaJuridicaArray &&
          produtos.length &&
          pessoaFisicaArray.length &&
          pessoaJuridicaArray.length && (
            <>
              <h3>Entrada Produto</h3>
              <Form>
                <Form.Row style={{ display: "flex", flexDirection: "row" }}>
                  <Col xl={1} style={{ marginRight: "10px" }}>
                    <Form.Label>Código</Form.Label>
                    <Form.Control disabled />
                  </Col>
                  <Col xl={5}>
                    <Form.Label>Nota fiscal</Form.Label>
                    <Form.Control
                      onChange={(ev) => {
                        setNotaFiscal(ev.target.value);
                      }}
                      value={notaFiscal}
                    />
                  </Col>
                </Form.Row>

                <Form.Group as={Col} controlId="productCode" className="mt-3">
                  <Form.Label>Razão Social</Form.Label>
                  <Col xl={6}>
                    <Form.Control
                      as="select"
                      onChange={(ev) => {
                        setIdPessoaJuridica(ev.target.value);
                      }}
                    >
                      {pessoaJuridicaArray ? (
                        pessoaJuridicaArray.map((empresa: any, idx: number) => (
                          <option
                            key={empresa.idpessoa_juridica}
                            value={empresa.idpessoa_juridica}
                          >
                            {empresa.razao_social}
                          </option>
                        ))
                      ) : (
                        <option>Sem empresas</option>
                      )}
                    </Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Col} controlId="productCode" className="mt-3">
                  <Form.Label>Nome Pessoa</Form.Label>
                  <Col xl={6}>
                    <Form.Control
                      as="select"
                      onChange={(ev) => {
                        setIdPessoaFisica(ev.target.value);
                      }}
                    >
                      {pessoaFisicaArray ? (
                        pessoaFisicaArray.map((pessoa: any, idx: number) => (
                          <option
                            key={pessoa.idpessoa_fisica}
                            value={pessoa.idpessoa_fisica}
                          >
                            {pessoa.nome}
                          </option>
                        ))
                      ) : (
                        <option>Sem pessoas</option>
                      )}
                    </Form.Control>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} controlId="productCode" className="mt-3">
                  <Form.Label>Cód. Produto</Form.Label>
                  <Col xl={6}>
                    <Form.Control
                      as="select"
                      onChange={(ev) => {
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
                            parseFloat(ev.target.value) -
                            parseFloat(valTotalNota)
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
                  <Col
                    xl={1}
                    style={{
                      paddingTop: "33px",
                      marginRight: "10px",
                      marginBottom: 10,
                    }}
                  >
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
export default EntradaProduto;
