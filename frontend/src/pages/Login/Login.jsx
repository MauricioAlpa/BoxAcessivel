import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await login(email, senha);
      navigate('/admin/dashboard');
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login">
      <aside className="login__marca">
        <div className="login__logo">B</div>
        <strong>Box Acessível</strong>
        <span>Painel Administrativo</span>
        <h1>Gerencie seus Leads com Inteligência</h1>
        <p>Acesse métricas em tempo real, gerencie o funil de vendas e acompanhe a taxa de conversão.</p>
      </aside>

      <div className="login__card">
        <h2>Entrar no Painel</h2>
        <p>Insira suas credenciais de administrador</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="admin@boxacessivel.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <p className="login__erro" role="alert">{erro}</p>}

          <button type="submit" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar no Painel →'}
          </button>
        </form>
      </div>
    </div>
  );
}