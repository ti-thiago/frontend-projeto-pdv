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
  const { updateUser } = useAuth();
  const { addToast } = useToast();
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [idxPessoa, setIdxPessoa] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);
  const [nome, setNome] = React.useState("");
  const [nrCpf, setNrCpf] = React.useState("");
  const [dtNascimento, setDtNascimento] = React.useState("");
  const [nrIdentidade, setNrIdentidade] = React.useState("");
  const [orgaoEmissorRg, setOrgaoEmissorRg] = React.useState("");
  const [ufOrgaoEmissorRg, setUfOrgaoEmissorRg] = React.useState("");

  const [estadoCivil, setEstadoCivil] = React.useState("");
  const [sexo, setSexo] = React.useState("");
  const [cep, setCep] = React.useState("");
  const [logradouro, setLogradouro] = React.useState("");
  const [numero, setNumero] = React.useState("");
  const [bairro, setBairro] = React.useState("");
  const [municipio, setMunicipio] = React.useState("");
  const [uf, setUf] = React.useState("");
  const [telResidencial, setTelResidencial] = React.useState("");
  const [telCelular, setTelCelular] = React.useState("");

  const [eMail, setEmail] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");

  const [pessoaFisica, setPessoaFisica] = React.useState<any>([]);

  const getPessoaData = React.useCallback(
    async (id?: any) => {
      let data = "";

      try {
        if (id) {
          data = id;

          const resp = await api.get(`/pessoaFisica/${data}`);
          let dt = "";
          setNome(resp.data.nome);
          if (resp.data.dt_nascimento) {
            dt = resp.data.dt_nascimento;
            dt = moment(dt, "YYYY-MM-DD").format("DD/MM/YYYY");
          }
          setDtNascimento(dt);
          setSexo(resp.data.sexo);
          setNrCpf(resp.data.nr_cpf);
          setEstadoCivil(resp.data.estado_civil);
          setNrIdentidade(resp.data.nr_identidade);
          setOrgaoEmissorRg(resp.data.orgao_emissor_rg);
          setUfOrgaoEmissorRg(resp.data.uf_orgao_emissor_rg);
          setCep(resp.data.cep);
          setLogradouro(resp.data.logradouro);
          setNumero(resp.data.numero);
          setBairro(resp.data.bairro);
          setMunicipio(resp.data.municipio);
          setUf(resp.data.uf);
          setTelResidencial(resp.data.tel_residencial);
          setTelCelular(resp.data.tel_celular);
          setEmail(resp.data.e_mail);
          setWhatsapp(resp.data.whatsapp);
        } else {
          const resp = await api.get(`/pessoaFisica/`);
          let arrayFiltered = resp.data;
          arrayFiltered.unshift({ idpessoa_fisica: "", nome: "Selecione" });

          setPessoaFisica(arrayFiltered);
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
          message: `Ocorreu um erro ao obter os dados ${msg}`,
        });
      }
    },
    [addToast]
  );
  React.useEffect(() => {
    getPessoaData();
  }, [getPessoaData]);

  async function handleSubmit(ev: any) {
    ev.preventDefault();

    let dtNasc;
    if (dtNascimento)
      dtNasc = moment(dtNascimento, "DD/MM/YYYY").format("YYYY-MM-DD");

    let obj: any = {};

    obj.nome = nome;
    obj.nr_cpf = onlyNumbers(nrCpf) || null;
    obj.dt_nascimento = dtNasc;
    obj.nr_identidade = onlyNumbers(nrIdentidade) || null;
    obj.orgao_emissor_rg = orgaoEmissorRg;
    obj.uf_orgao_emissor_rg = ufOrgaoEmissorRg;
    obj.estado_civil = estadoCivil;
    obj.sexo = sexo;
    obj.cep = onlyNumbers(cep) || null;
    obj.logradouro = logradouro;
    obj.numero = onlyNumbers(numero) || null;
    obj.bairro = bairro;
    obj.municipio = municipio;
    obj.uf = uf;
    obj.tel_residencial = onlyNumbers(telResidencial) || null;
    obj.tel_celular = onlyNumbers(telCelular) || null;
    obj.e_mail = eMail;
    obj.whatsapp = whatsapp || "N";
    try {
      setLoading(true);
      let resp;
      if (!idxPessoa) {
        resp = await api.post(`/pessoaFisica/`, obj);
      } else {
        resp = await api.put(
          `/pessoaFisica/${pessoaFisica[idxPessoa].idpessoa_fisica}`,
          obj
        );
      }

      setLoading(false);

      updateUser(resp.data);
      addToast({ title: "Sucesso", message: "Dados atualizados, com sucesso" });
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
      setLoading(false);
      addToast({
        title: "Erro",
        message: `Ocorreu um erro ao atualizar os dados ${msg}`,
      });
    }
  }

  async function handleDelete() {
    try {
      if (!idxPessoa) return;
      await api.delete(
        `/pessoaFisica/${pessoaFisica[idxPessoa].idpessoa_fisica}`
      );
    } catch (err) {
      let msg;
      if (err.response && err.response.data && err.response.data.err)
        msg = err.response.data.err;
      else if (err.response.data) msg = err.response.data;
      else msg = err.message.err;
      if (typeof msg === "object") {
        msg = msg.msg;
      }
      setLoading(false);
      addToast({
        title: "Erro",
        message: `Ocorreu um erro ao excluir os dados ${msg}`,
      });
    }
  }
  return (
    <>
      <Header />
      <Container>
        <Form onSubmit={handleSubmit}>
          <h3>Dados Pessoais</h3>
          <Form.Row>
            <Col xl={6}>
              <Form.Group
                as={Col}
                controlId="formGridState"
                style={{ marginBottom: "30px" }}
              >
                <Form.Label>Selecione a Pessoa</Form.Label>
                <Form.Control
                  ref={selectRef}
                  as="select"
                  defaultValue={0}
                  onChange={async (ev: any) => {
                    await getPessoaData(
                      pessoaFisica[ev.target.value].idpessoa_fisica
                    );
                    setIdxPessoa(ev.target.value);
                  }}
                >
                  {pessoaFisica ? (
                    pessoaFisica.map((pessoa: any, idx: any) => (
                      <option key={pessoa.idpessoa_fisica} value={idx}>
                        {pessoa.nome}
                      </option>
                    ))
                  ) : (
                    <option>Sem pessoas</option>
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
            <Col xl={8} style={{ marginLeft: "50px" }}>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                required
                value={nome}
                onChange={(ev) => setNome(ev.target.value)}
                placeholder="Digite o nome"
              />
            </Col>
          </Form.Row>

          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={2}>
              <Form.Label>Dt. Nascimento</Form.Label>
              <Form.Control
                required
                placeholder="DD/MM/AAAA"
                onChange={(ev) => setDtNascimento(ev.target.value)}
                value={dtNascimento}
              />
            </Col>
            <Col xl={2} style={{ marginLeft: "10px" }}>
              <Form.Label>Sexo</Form.Label>
              <Form.Control
                required
                maxLength={1}
                value={sexo}
                onChange={(ev) => setSexo(ev.target.value)}
              />
            </Col>
            <Col xl={4} style={{ marginLeft: "10px" }}>
              <Form.Label>CPF</Form.Label>
              <Form.Control
                value={nrCpf}
                required
                placeholder="0000000000"
                maxLength={11}
                onChange={(ev) => setNrCpf(ev.target.value)}
              />
            </Col>
            <Col xl={2} style={{ marginLeft: "10px" }}>
              <Form.Label>Estado Civíl</Form.Label>
              <Form.Control
                maxLength={1}
                onChange={(ev) => setEstadoCivil(ev.target.value)}
                value={estadoCivil}
              />
            </Col>
          </Form.Row>

          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={1}>
              <Form.Label>Nr. Identidade</Form.Label>
              <Form.Control
                onChange={(ev) => setNrIdentidade(ev.target.value)}
                value={nrIdentidade}
              />
            </Col>

            <Col xl={2} style={{ marginLeft: "10px" }}>
              <Form.Label>Orgão Emissor</Form.Label>
              <Form.Control
                onChange={(ev) => setOrgaoEmissorRg(ev.target.value)}
                value={orgaoEmissorRg}
              />
            </Col>
            <Col xl={1} style={{ marginLeft: "10px" }}>
              <Form.Label>UF. Emissão</Form.Label>
              <Form.Control
                onChange={(ev) => setUfOrgaoEmissorRg(ev.target.value)}
                value={ufOrgaoEmissorRg}
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
                value={uf}
              >
                <option value={"GO"}>GO</option>
                <option value="MT">MT</option>
                <option value="SP">SP</option>
                <option value="PR">PR</option>
                <option value="RJ">RJ</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <h3 style={{ marginTop: "10px" }}>Contatos</h3>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={3} className="mr-2">
              <Form.Label>Telefone Residencial</Form.Label>
              <Form.Control
                value={telResidencial}
                onChange={(ev) => setTelResidencial(ev.target.value)}
                maxLength={11}
              />
            </Col>
            <Col xl={3} style={{ marginLeft: "10px" }}>
              <Form.Label>Telefone Celular</Form.Label>
              <Form.Control
                onChange={(ev) => setTelCelular(ev.target.value)}
                value={telCelular}
                maxLength={12}
              />
            </Col>
            <Col
              xl={3}
              style={{
                marginLeft: "10px",
                alignContent: "stretch",
              }}
            >
              <Form.Check
                style={{ marginTop: "35px" }}
                type="checkbox"
                label="É WhatsApp?"
                onChange={(ev) => {
                  if (ev.target.checked) {
                    setWhatsapp("S");
                  } else {
                    setWhatsapp("N");
                  }
                }}
                checked={whatsapp === "S"}
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
