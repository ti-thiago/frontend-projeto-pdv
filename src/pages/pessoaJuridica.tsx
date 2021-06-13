import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Header from "../components/Header";
import api from "../services/api";
import { useAuth } from "../hooks/auth";
import { useToast } from "../hooks/toast";
import { useRouteMatch } from "react-router-dom";
import { onlyNumbers } from "../utils/validation";
import moment from "moment";

interface IdRoute {
  id: string;
}
const PessoaFisica: React.FC = () => {
  const { params } = useRouteMatch<IdRoute>();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [pessoaJuridica, setPessoaJuridica] = React.useState<any>([]);
  const [idxPessoa, setIdxPessoa] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);
  const [razaoSocial, setRazaoSocial] = React.useState("");
  const [nomeFantasia, setNomeFantasia] = React.useState("");
  const [cnpj, setCnpj] = React.useState("");
  const [inscEstadual, setInscEstadual] = React.useState("");
  const [cep, setCep] = React.useState("");
  const [logradouro, setLogradouro] = React.useState("");
  const [numero, setNumero] = React.useState("");
  const [bairro, setBairro] = React.useState("");
  const [municipio, setMunicipio] = React.useState("");
  const [uf, setUf] = React.useState(user.uf);
  const [telefone, setTelefone] = React.useState("");
  const [eMail, setEmail] = React.useState("");
  const [pessoaContato, setPessoaContato] = React.useState("");
  const [observacao, setObservacao] = React.useState("");

  async function getPessoaData(id?: any) {
    let data = "";

    try {
      if (id) {
        data = id;

        const resp = await api.get(`/pessoaJuridica/${data}`);
        setRazaoSocial(resp.data.razao_social);
        setInscEstadual(resp.data.insc_estadual);
        setNomeFantasia(resp.data.nome_fantasia);
        setCnpj(resp.data.cnpj);
        setCep(resp.data.cep);
        setLogradouro(resp.data.logradouro);
        setNumero(resp.data.numero);
        setBairro(resp.data.bairro);
        setMunicipio(resp.data.municipio);
        setUf(resp.data.uf);
        setTelefone(resp.data.telefone);
        setPessoaContato(resp.data.pessoa_contato);
        setEmail(resp.data.e_mail);
        setObservacao(resp.data.observacao);
      } else {
        const resp = await api.get(`/pessoaJuridica/`);
        let arrayFiltered = resp.data;
        arrayFiltered.unshift({
          idpessoa_juridica: "",
          razao_social: "Selecione",
        });

        setPessoaJuridica(arrayFiltered);
      }
    } catch (err) {
      addToast({
        title: "Erro",
        message: `Ocorreu um erro ao obter os dados ${err.message}`,
      });
    }
  }
  React.useEffect(() => {
    getPessoaData();
  }, []);

  const handleSubmit = React.useCallback(
    async (ev: any) => {
      ev.preventDefault();

      let obj: any = {};

      obj.razao_social = razaoSocial;
      obj.insc_estadual = inscEstadual;
      obj.nome_fantasia = nomeFantasia;
      obj.cnpj = onlyNumbers(cnpj) || null;
      obj.cep = onlyNumbers(cep) || null;
      obj.logradouro = logradouro;
      obj.numero = onlyNumbers(numero) || null;
      obj.bairro = bairro;
      obj.municipio = municipio;
      obj.uf = uf;
      obj.telefone = onlyNumbers(telefone) || null;
      obj.e_mail = eMail;
      obj.pessoa_contato = pessoaContato;
      obj.observacao = observacao;

      try {
        setLoading(true);
        let resp;
        if (!idxPessoa) {
          resp = await api.post(`/pessoaJuridica/`, obj);
        } else {
          resp = await api.put(
            `/pessoaJuridica/${pessoaJuridica[idxPessoa].idpessoa_juridica}`,
            obj
          );
        }

        setLoading(false);

        addToast({
          title: "Sucesso",
          message: "Dados atualizados, com sucesso",
        });
        window.location.reload();
      } catch (err) {
        setLoading(false);
        addToast({
          title: "Erro",
          message: `Ocorreu um erro ao atualizar os dados ${err.message}`,
        });
      }
    },
    [
      addToast,
      bairro,
      cep,
      cnpj,
      eMail,
      idxPessoa,
      inscEstadual,
      logradouro,
      municipio,
      nomeFantasia,
      numero,
      observacao,
      pessoaContato,
      pessoaJuridica,
      razaoSocial,
      telefone,
      uf,
    ]
  );

  async function handleDelete() {
    try {
      if (!idxPessoa) return;
      await api.delete(
        `/pessoaJuridica/${pessoaJuridica[idxPessoa].idpessoa_juridica}`
      );
    } catch (err) {
      setLoading(false);
      addToast({
        title: "Erro",
        message: `Ocorreu um erro ao excluir os dados ${err.message}`,
      });
    }
  }
  return (
    <>
      <Header />
      <Container>
        <Form onSubmit={handleSubmit}>
          <h3>Dados da Empresa</h3>
          <Form.Row>
            <Col xl={6}>
              <Form.Group
                as={Col}
                controlId="formGridState"
                style={{ marginBottom: "30px" }}
              >
                <Form.Label>Selecione a Empresa</Form.Label>
                <Form.Control
                  ref={selectRef}
                  as="select"
                  defaultValue={0}
                  onChange={async (ev: any) => {
                    await getPessoaData(
                      pessoaJuridica[ev.target.value].idpessoa_juridica
                    );
                    setIdxPessoa(ev.target.value);
                  }}
                >
                  {pessoaJuridica ? (
                    pessoaJuridica.map((pessoa: any, idx: any) => (
                      <option key={pessoa.idpessoa_juridica} value={idx}>
                        {pessoa.razao_social}
                      </option>
                    ))
                  ) : (
                    <option>Sem Empresas</option>
                  )}
                </Form.Control>
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={2} className="mr-2">
              <Form.Label>Código</Form.Label>
              <Form.Control placeholder="Código" disabled />
            </Col>
            <Col xl={2} style={{ marginLeft: "10px" }}>
              <Form.Label>CNPJ</Form.Label>

              <Form.Control
                required
                placeholder="00000000000000"
                onChange={(ev) => setCnpj(ev.target.value)}
                value={cnpj}
              />
            </Col>
            <Col xl={8} style={{ marginLeft: "10px" }}>
              <Form.Label>Inscrição Estadual</Form.Label>
              <Form.Control
                required
                value={inscEstadual}
                onChange={(ev) => setInscEstadual(ev.target.value)}
              />
            </Col>
          </Form.Row>

          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={8}>
              <Form.Label>Razão Social</Form.Label>
              <Form.Control
                required
                value={razaoSocial}
                onChange={(ev) => setRazaoSocial(ev.target.value)}
              />
            </Col>
          </Form.Row>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={8}>
              <Form.Label>Nome Fantasia</Form.Label>
              <Form.Control
                value={nomeFantasia}
                onChange={(ev) => setNomeFantasia(ev.target.value)}
              />
            </Col>
          </Form.Row>

          <h3 style={{ marginTop: "10px" }}>Endereço</h3>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={2} className="mr-2">
              <Form.Label>CEP</Form.Label>
              <Form.Control
                value={cep}
                onChange={(ev) => setCep(ev.target.value)}
                placeholder="00000000"
              />
            </Col>
            <Col xl={8} style={{ marginLeft: "10px" }}>
              <Form.Label>Logradouro</Form.Label>
              <Form.Control
                value={logradouro}
                onChange={(ev) => setLogradouro(ev.target.value)}
              />
            </Col>
            <Col xl={2} style={{ marginLeft: "10px" }}>
              <Form.Label>Número</Form.Label>
              <Form.Control
                value={numero}
                onChange={(ev) => setNumero(ev.target.value)}
              />
            </Col>
          </Form.Row>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={6} className="mr-2">
              <Form.Label>Bairro</Form.Label>
              <Form.Control
                value={bairro}
                onChange={(ev) => setBairro(ev.target.value)}
              />
            </Col>
            <Col xl={4} style={{ marginLeft: "10px" }}>
              <Form.Label>Município</Form.Label>
              <Form.Control
                value={municipio}
                onChange={(ev) => setMunicipio(ev.target.value)}
              />
            </Col>
            <Form.Group
              as={Col}
              controlId="formGridState"
              style={{ marginLeft: "10px" }}
            >
              <Form.Label>UF</Form.Label>
              <Form.Control
                as="select"
                defaultValue={uf || "GO"}
                onChange={(ev) => setUf(ev.target.value)}
              >
                <option>GO</option>
                <option>MT</option>
                <option>SP</option>
                <option>PR</option>
                <option>RJ</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <h3 style={{ marginTop: "10px" }}>Contatos</h3>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={3} className="mr-2">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                value={telefone}
                onChange={(ev) => setTelefone(ev.target.value)}
                maxLength={11}
              />
            </Col>
            <Col xl={3} style={{ marginLeft: "10px" }}>
              <Form.Label>Pessoa Contato</Form.Label>
              <Form.Control
                onChange={(ev) => setPessoaContato(ev.target.value)}
                value={pessoaContato}
              />
            </Col>
          </Form.Row>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={8}>
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                value={eMail}
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </Col>
          </Form.Row>
          <Row className="mt-2 mb-1">
            <Col xl={1}>
              <Button
                style={{ marginRight: -30 }}
                variant="primary"
                type="submit"
                disabled={!!loading}
              >
                Enviar
              </Button>
            </Col>
            <Col xl={1}>
              <Button
                variant="success"
                type="button"
                onClick={(ev) => {
                  window.location.reload();
                }}
                disabled={!!loading}
              >
                Novo
              </Button>
            </Col>
            <Col xl={1}>
              <Button
                variant="danger"
                type="button"
                onClick={(ev) => {
                  handleDelete();
                  window.location.reload();
                }}
                disabled={!!loading}
                style={{ marginLeft: -33 }}
              >
                Excluir
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
export default PessoaFisica;
