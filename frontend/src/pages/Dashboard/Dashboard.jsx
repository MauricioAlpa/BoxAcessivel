import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { STATUSES, corDoStatus } from '../../constants/leadStatus';
import './Dashboard.css';

export function Dashboard() {
  const { token, logout } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const [metricsData, leadsData] = await Promise.all([
          api.conversao(token),
          api.listarLeads(token),
        ]);
        setMetrics(metricsData);
        setLeads(leadsData);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [token]);

  const novosHoje = useMemo(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    return leads.filter((lead) => lead.criado_em.slice(0, 10) === hoje).length;
  }, [leads]);

  const funil = useMemo(
    () => STATUSES.map((status) => ({
      status,
      total: leads.filter((lead) => lead.status === status).length,
    })),
    [leads]
  );

  const evolucao = useMemo(() => {
    const dias = [...Array(7)].map((_, i) => {
      const data = new Date();
      data.setDate(data.getDate() - (6 - i));
      return data.toISOString().slice(0, 10);
    });
    return dias.map((dia) => ({
      dia: dia.slice(5),
      total: leads.filter((lead) => lead.criado_em.slice(0, 10) === dia).length,
    }));
  }, [leads]);

  const leadsFiltrados = filtro === 'Todos' ? leads : leads.filter((l) => l.status === filtro);

  async function mudarStatus(id, novoStatus) {
    const anterior = leads;
    setLeads((atual) => atual.map((l) => (l.id === id ? { ...l, status: novoStatus } : l)));
    try {
      await api.atualizarStatusLead(id, novoStatus, token);
    } catch (err) {
      setLeads(anterior);
      alert(err.message);
    }
  }

  if (carregando) return <p className="dashboard__loading">Carregando painel...</p>;

  return (
    <div className="dashboard">
      <aside className="dashboard__sidebar">
        <div className="dashboard__brand">
          <span className="dashboard__logo">B</span> Box Acessível
        </div>
        <nav>
          <span className="dashboard__nav-item dashboard__nav-item--ativo">Dashboard</span>
        </nav>
        <button className="dashboard__sair" onClick={logout}>Sair</button>
      </aside>

      <main className="dashboard__main">
        <header>
          <h1>Dashboard</h1>
          <p>Visão geral dos leads e métricas de conversão</p>
        </header>

        {erro && <p className="dashboard__erro" role="alert">{erro}</p>}

        <section className="dashboard__kpis">
          <div className="dashboard__kpi"><span>Total de Visitas</span><strong>{metrics.totalVisitas}</strong></div>
          <div className="dashboard__kpi"><span>Leads Captados</span><strong>{metrics.totalLeads}</strong></div>
          <div className="dashboard__kpi"><span>Taxa de Conversão</span><strong>{metrics.taxaConversao}%</strong></div>
          <div className="dashboard__kpi"><span>Novos Leads Hoje</span><strong>{novosHoje}</strong></div>
        </section>

        <section className="dashboard__grid">
          <div className="dashboard__evolucao">
            <h2>Evolução de Leads, últimos 7 dias</h2>
            <svg viewBox="0 0 280 120" className="dashboard__chart">
              {evolucao.map((ponto, i) => {
                const max = Math.max(...evolucao.map((p) => p.total), 1);
                const altura = (ponto.total / max) * 80;
                return (
                  <g key={ponto.dia} transform={`translate(${i * 40}, 0)`}>
                    <rect x="8" y={100 - altura} width="24" height={altura} rx="4" fill="var(--color-orange)" />
                    <text x="20" y="115" textAnchor="middle" fontSize="9" fill="var(--color-text-muted)">
                      {ponto.dia}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="dashboard__funil">
            <h2>Funil de Vendas</h2>
            {funil.map(({ status, total }) => (
              <div className="dashboard__funil-item" key={status}>
                <span>{status}</span>
                <strong>{total}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard__tabela">
          <div className="dashboard__tabela-topo">
            <h2>Leads Recentes</h2>
            <div className="dashboard__filtros">
              {['Todos', ...STATUSES].map((status) => (
                <button
                  key={status}
                  className={filtro === status ? 'ativo' : ''}
                  onClick={() => setFiltro(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nome</th><th>E-mail</th><th>Telefone</th><th>Status</th><th>Data Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {leadsFiltrados.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.nome}</td>
                  <td>{lead.email}</td>
                  <td>{lead.telefone}</td>
                  <td>
                    <select
                      className="dashboard__status-select"
                      style={{ '--status-color': corDoStatus(lead.status) }}
                      value={lead.status}
                      onChange={(e) => mudarStatus(lead.id, e.target.value)}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(lead.criado_em).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}