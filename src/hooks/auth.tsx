import React, { createContext, useCallback, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";

interface IUser {
  bairro: string;
  cep: number;
  dt_emissao_rg: string;
  dt_nascimento: string;
  e_mail: string;
  estado_civil: string;
  idpessoa_fisica: 1;
  logradouro: string;
  municipio: string;
  nome: string;
  nr_cpf: string;
  nr_identidade: string;
  numero: number;
  orgao_emissor_rg: string;
  sexo: string;
  tel_adicional: string;
  tel_celular: string;
  tel_residencial: string;
  uf: string;
  uf_orgao_emissor_rg: string;
  whatsapp: string;
  idpessoa_juridica: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  insc_estadual: string;
  telefone: string;
  pessoa_contato: string;
  observacao: string;
}

interface IAuthState {
  user: IUser;
}

interface ISignInCredentials {
  nome_usuario: string;
  senha: string;
}

interface IAuthContextData {
  user: IUser;
  signIn(credentials: ISignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: IUser): void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const [data, setData] = useState<IAuthState>(() => {
    const user = localStorage.getItem("@PdvUser");

    if (user) {
      return { user: JSON.parse(user) };
    }

    return {} as IAuthState;
  });

  const signOut = useCallback(() => {
    localStorage.removeItem("@PdvUser");

    setData({} as IAuthState);
  }, []);

  const signIn = useCallback(async ({ nome_usuario, senha }) => {
    const response = await api.post("/", {
      nome_usuario,
      senha,
    });
    const user = response.data;
    localStorage.setItem("@PdvUser", JSON.stringify(user));

    setData({ user });
  }, []);

  const updateUser = useCallback((user: IUser) => {
    console.log(user);
    localStorage.setItem("@PdvUser", JSON.stringify(user));

    setData({
      user,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
