import { createContext, useContext, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('box_admin_token'));

  async function login(email, senha) {
    const { token: novoToken } = await api.login(email, senha);
    localStorage.setItem('box_admin_token', novoToken);
    setToken(novoToken);
  }

  function logout() {
    localStorage.removeItem('box_admin_token');
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