import { createContext, useContext, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

const CHAVE = 'box_admin_token';


function lerToken() {
  return localStorage.getItem(CHAVE) ?? sessionStorage.getItem(CHAVE);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(lerToken);

  async function login(email, senha, lembrar = true) {
    const { token: novoToken } = await api.login(email, senha);
    const alvo = lembrar ? localStorage : sessionStorage;
    const outro = lembrar ? sessionStorage : localStorage;
    outro.removeItem(CHAVE);
    alvo.setItem(CHAVE, novoToken);
    setToken(novoToken);
  }

  function logout() {
    localStorage.removeItem(CHAVE);
    sessionStorage.removeItem(CHAVE);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
