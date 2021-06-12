import React from "react";
import { Button, Col, Container, Form, Table } from "react-bootstrap";
import Header from "../components/Header";
import api from "../services/api";
import { useAuth } from "../hooks/auth";
import { useRouteMatch } from "react-router-dom";
import { onlyNumbers } from "../utils/validation";
interface IdRoute {
  id: string;
}
const PessoaFisica: React.FC = () => {
  const { params } = useRouteMatch<IdRoute>();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [pessoaFisica, setPessoaFisica] = React.useState<any[]>([]);
  const [nome, setNome] = React.useState(user.nome || "");
  const [nrCpf, setNrCpf] = React.useState(user.nr_cpf || "");
  const [dtNascimento, setDtNascimento] = React.useState(
    user.dt_nascimento || ""
  );
  const [nrIdentidade, setNrIdentidade] = React.useState(
    user.nr_identidade || ""
  );
  const [orgaoEmissorRg, setOrgaoEmissorRg] = React.useState(
    user.orgao_emissor_rg || ""
  );
  const [ufOrgaoEmissorRg, setUfOrgaoEmissorRg] = React.useState(
    user.uf_orgao_emissor_rg || ""
  );
  console.log(params);

  const [estadoCivil, setEstadoCivil] = React.useState(user.estado_civil || "");
  const [sexo, setSexo] = React.useState(user.sexo || "");
  const [cep, setCep] = React.useState(user.cep || "");
  const [logradouro, setLogradouro] = React.useState(user.logradouro || "");
  const [numero, setNumero] = React.useState(user.numero || "");
  const [bairro, setBairro] = React.useState(user.bairro || "");
  const [municipio, setMunicipio] = React.useState(user.municipio || "");
  const [uf, setUf] = React.useState(user.uf);
  const [telResidencial, setTelResidencial] = React.useState(
    user.tel_residencial || ""
  );
  const [telCelular, setTelCelular] = React.useState(user.tel_celular || "");

  const [eMail, setEmail] = React.useState(user.e_mail || "");
  const [whatsapp, setWhatsapp] = React.useState(user.whatsapp || "");

  async function handleSubmit(ev: any) {
    ev.preventDefault();
    let obj: any = {};
    obj.idpessoa_fisica = user.idpessoa_fisica;
    obj.nome = nome;
    obj.nr_cpf = onlyNumbers(nrCpf) || null;
    obj.dt_nascimento = dtNascimento;
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
      const resp = await api.put(`/pessoaFisica/${params.id}`, obj);
      setLoading(false);
      console.log(resp.data);

      updateUser(resp.data);
      alert(`Seus dados foram atualizados com sucesso`);
    } catch (err) {
      setLoading(false);
      alert("Ocorreu um erro ao atualizar os dados");
    }
  }

  return (
    <>
      <Header />
      <Container>
        <Form onSubmit={handleSubmit}>
          <h3>Dados Pessoais</h3>
          <Form.Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xl={2} className="mr-2">
              <Form.Label>Código</Form.Label>
              <Form.Control placeholder="Código" disabled />
            </Col>
            <Col xl={8} style={{ marginLeft: "50px" }}>
              <Form.Label>Nome</Form.Label>
              <Form.Control
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
                placeholder="DD/MM/AAAA"
                onChange={(ev) => setDtNascimento(ev.target.value)}
                value={dtNascimento}
              />
            </Col>
            <Col xl={2} style={{ marginLeft: "10px" }}>
              <Form.Label>Sexo</Form.Label>
              <Form.Control
                value={sexo}
                onChange={(ev) => setSexo(ev.target.value)}
              />
            </Col>
            <Col xl={4} style={{ marginLeft: "10px" }}>
              <Form.Label>CPF</Form.Label>
              <Form.Control value={nrCpf} placeholder="0000000000" />
            </Col>
            <Col xl={2} style={{ marginLeft: "10px" }}>
              <Form.Label>Estado Civíl</Form.Label>
              <Form.Control
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
                placeholder="00000-000"
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

          {/* <Form.Group as={Col} controlId="formGridState">
              <Form.Label>State</Form.Label>
              <Form.Control as="select" defaultValue="Choose...">
                <option>Choose...</option>
                <option>...</option>
              </Form.Control>
             */}

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
            <Col xl={3} className="mr-2">
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
              <Form.Label>É Whatsapp</Form.Label>
              <Form.Control />
              <Form.Check
                type="checkbox"
                label="É WhatsApp?"
                onChange={(ev) => {
                  if (ev.target.checked) {
                    setWhatsapp("S");
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
          <div className="mt-2 mb-2">
            <Button variant="primary" type="submit" disabled={!!loading}>
              Enviar
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
};
export default PessoaFisica;
