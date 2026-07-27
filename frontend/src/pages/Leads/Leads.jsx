import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { Sidebar } from '../../components/Shell/Sidebar';
import { STATUSES } from '../../constants/leadStatus';
import './Leads.css';

const LIGHT_VARS = {
  '--page': '#F4F6FB',
  '--surface': '#FFFFFF',
  '--line': '#E4E8F2',
  '--line-soft': '#F1F3FA',
  '--txt': '#1B2140',
  '--txt-2': '#5A6480',
  '--txt-3': '#8C95AE',
  '--side': '#232E63',
  '--side-fg': '#C6CDE9',
  '--side-line': 'rgba(255,255,255,0.14)',
  '--brand-2': '#5566AE',
  '--brand-deep': '#1F2A5A',
  '--success': '#1CA863',
  '--success-text': '#15804A',
  '--danger': '#CE181E',
};

const EASE = 'cubic-bezier(0.16,1,0.3,1)';
const POR_PAGINA = 20;
const COLS = '1.7fr 1.05fr 1.5fr 1.4fr .7fr .9fr';

const STATUS_META = {
  '1. Novo Lead': { label: 'Novo lead', fg: 'var(--brand-2)', bg: 'color-mix(in srgb, var(--brand-2) 13%, transparent)' },
  '2. Em Contato': { label: 'Em contato', fg: 'var(--brand)', bg: 'color-mix(in srgb, var(--brand) 9%, transparent)' },
  '3. Proposta Enviada': { label: 'Proposta', fg: 'var(--brand)', bg: 'transparent', border: '1px solid color-mix(in srgb, var(--brand-2) 40%, transparent)' },
  '4. Negociando': { label: 'Negociação', fg: '#FFFFFF', bg: 'var(--brand-2)' },
  '5. Fechado': { label: 'Fechado', fg: 'var(--success-text)', bg: 'color-mix(in srgb, var(--success) 11%, transparent)' },
};

const FILTROS_STATUS = ['todos', ...STATUSES];
const svgBase = { viewBox: '0 0 24 24', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const nf = (dec = 0) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });

function iniciais(nome) {
  const p = String(nome ?? '').trim().split(/\s+/).filter(Boolean);
  if (!p.length) return '?';
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function formatarTelefone(tel) {
  const d = String(tel ?? '').replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return tel;
}

function dataCompleta(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function tempoRelativo(iso) {
  if (!iso) return '—';
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} ${min === 1 ? 'minuto' : 'minutos'}`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} ${h === 1 ? 'hora' : 'horas'}`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'ontem';
  if (d < 7) return `há ${d} dias`;
  const sem = Math.floor(d / 7);
  if (sem < 5) return `há ${sem} ${sem === 1 ? 'semana' : 'semanas'}`;
  const mes = Math.floor(d / 30);
  return `há ${mes} ${mes === 1 ? 'mês' : 'meses'}`;
}

const CARD = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: '16px',
  padding: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  transition: `box-shadow 220ms ${EASE}, transform 220ms ${EASE}`,
};

const CHIP = {
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  padding: '0 13px',
  border: '1px solid var(--line)',
  background: 'var(--surface)',
  borderRadius: '12px',
  fontFamily: 'inherit',
  fontSize: '13px',
  color: 'var(--txt-2)',
  cursor: 'pointer',
  transition: `all 160ms ${EASE}`,
};

const CHIP_ATIVO = {
  borderColor: 'var(--brand)',
  color: 'var(--brand)',
  background: 'color-mix(in srgb, var(--brand) 5%, transparent)',
};

const SKELETON = {
  background: 'linear-gradient(90deg, #EFF1F8 25%, #F7F8FC 50%, #EFF1F8 75%)',
  backgroundSize: '420px 100%',
  animation: 'shimmer 1.4s linear infinite',
};

function Ico({ children, size = 16, stroke = 'currentColor', width = 1.8 }) {
  return (
    <svg width={size} height={size} {...svgBase} stroke={stroke} strokeWidth={width}>
      {children}
    </svg>
  );
}

export function Leads({ accent = '#2F3E7E', sidebarCollapsed = false }) {
  const { token } = useAuth();
  const raizRef = useRef(null);

  const [leads, setLeads] = useState([]);
  const [fase, setFase] = useState('carregando');
  const [collapsed, setCollapsed] = useState(sidebarCollapsed);
  const [query, setQuery] = useState('');
  const [statusIdx, setStatusIdx] = useState(0);
  const [maisRecentes, setMaisRecentes] = useState(true);
  const [pagina, setPagina] = useState(0);
  const [conversao, setConversao] = useState(0);
  const [atualizandoId, setAtualizandoId] = useState(null);

  async function carregar() {
    setFase('carregando');
    try {
      const [dados, metrics] = await Promise.all([api.listarLeads(token), api.conversao(token)]);
      setLeads(dados);
      setConversao(metrics.taxaConversao);
      setFase('dados');
    } catch {
      setFase('erro');
    }
  }

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const [dados, metrics] = await Promise.all([api.listarLeads(token), api.conversao(token)]);
        if (!vivo) return;
        setLeads(dados);
        setConversao(metrics.taxaConversao);
        setFase('dados');
      } catch {
        if (vivo) setFase('erro');
      }
    })();
    return () => {
      vivo = false;
    };
  }, [token]);

  useEffect(() => {
    const anterior = document.body.style.background;
    document.body.style.background = '#F4F6FB';
    return () => {
      document.body.style.background = anterior;
    };
  }, []);

  useEffect(() => {
    if (fase !== 'dados' || !raizRef.current) return;
    const els = Array.from(raizRef.current.querySelectorAll('[data-count-to]'));
    const rafs = new Map();
    els.forEach((el, i) => {
      const to = parseFloat(el.getAttribute('data-count-to'));
      const dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const fmt = nf(dec);
      const dur = 850;
      const start = performance.now() + 100 + i * 70;
      const tick = (now) => {
        const t = Math.min(1, Math.max(0, (now - start) / dur));
        el.textContent = fmt.format(to * (1 - Math.pow(1 - t, 3))) + suffix;
        if (t < 1) rafs.set(el, requestAnimationFrame(tick));
      };
      rafs.set(el, requestAnimationFrame(tick));
    });
    return () => rafs.forEach((id) => cancelAnimationFrame(id));
  }, [fase]);

  const resumo = useMemo(() => {
    const total = leads.length;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const novosHoje = leads.filter((l) => new Date(l.criado_em) >= hoje);
    const aguardam = novosHoje.filter((l) => l.status === '1. Novo Lead').length;
    const idx = (s) => STATUSES.indexOf(s);
    const cumulativo = (n) => leads.filter((l) => idx(l.status) >= n).length;
    const emContato = cumulativo(1);
    const negociacao = cumulativo(3);
    const fechados = cumulativo(4);
    return {
      total,
      novosHoje: novosHoje.length,
      aguardam,
      emContato,
      pctBase: total ? Math.round((emContato / total) * 100) : 0,
      negociacao,
      fechados,
    };
  }, [leads]);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    const st = FILTROS_STATUS[statusIdx];
    const out = leads.filter((l) => {
      const okQ = !q || `${l.nome} ${l.email}`.toLowerCase().includes(q);
      const okS = statusIdx === 0 || l.status === st;
      return okQ && okS;
    });
    out.sort((a, b) => {
      const cmp = new Date(a.criado_em) - new Date(b.criado_em);
      return maisRecentes ? -cmp : cmp;
    });
    return out;
  }, [leads, query, statusIdx, maisRecentes]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas - 1);
  const visiveis = filtrados.slice(paginaAtual * POR_PAGINA, paginaAtual * POR_PAGINA + POR_PAGINA);

  const isCarregando = fase === 'carregando';
  const isErro = fase === 'erro';
  const isVazio = !isCarregando && !isErro && leads.length === 0;
  const isSemResultados = !isCarregando && !isErro && !isVazio && filtrados.length === 0;
  const mostraLinhas = !isCarregando && !isErro && !isVazio && !isSemResultados;

  async function alterarStatus(idLead, novoStatus) {
    setAtualizandoId(idLead);
    const estadoAnterior = leads;
    setLeads((atual) =>
      atual.map((l) => (l.id === idLead ? { ...l, status: novoStatus, atualizado_em: new Date().toISOString() } : l))
    );
    try {
      await api.atualizarStatusLead(idLead, novoStatus, token);
    } catch {
      setLeads(estadoAnterior);
    } finally {
      setAtualizandoId(null);
    }
  }

  function limparFiltros() {
    setQuery('');
    setStatusIdx(0);
    setPagina(0);
  }

  const cards = [
    {
      rotulo: 'Total de leads',
      countTo: resumo.total,
      texto: nf().format(resumo.total),
      delay: 60,
      icone: (
        <Ico stroke="var(--brand-2)">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        </Ico>
      ),
    },
    {
      rotulo: 'Novos hoje',
      countTo: resumo.novosHoje,
      texto: nf().format(resumo.novosHoje),
      delay: 100,
      icone: (
        <Ico stroke="var(--brand-2)">
          <path d="M12 5v14"></path>
          <path d="M5 12h14"></path>
        </Ico>
      ),
    },
    {
      rotulo: 'Em contato',
      countTo: resumo.emContato,
      texto: nf().format(resumo.emContato),
      delay: 140,
      icone: (
        <Ico stroke="var(--brand-2)">
          <path d="M14.05 6A5 5 0 0 1 18 10"></path>
          <path d="M14.05 2a9 9 0 0 1 7.94 7.94"></path>
          <path d="M4 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L13 13l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 2 6.2 2 2 0 0 1 4 4"></path>
        </Ico>
      ),
    },
    {
      rotulo: 'Negociação',
      countTo: resumo.negociacao,
      texto: nf().format(resumo.negociacao),
      delay: 180,
      icone: (
        <Ico stroke="var(--brand-2)">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
        </Ico>
      ),
    },
    {
      rotulo: 'Fechados',
      countTo: resumo.fechados,
      texto: nf().format(resumo.fechados),
      delay: 220,
      icone: (
        <Ico stroke="var(--success)" width={1.9}>
          <path d="M20 6 9 17l-5-5"></path>
        </Ico>
      ),
    },
    {
      rotulo: 'Taxa de conversão',
      countTo: conversao,
      decimals: 1,
      suffix: '%',
      texto: `${nf(1).format(conversao)}%`,
      delay: 260,
      icone: (
        <Ico stroke="var(--brand)">
          <circle cx="12" cy="12" r="9"></circle>
          <circle cx="12" cy="12" r="5"></circle>
        </Ico>
      ),
    },
  ];

  const primario = {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 16px',
    border: 0,
    background: 'var(--brand)',
    color: '#fff',
    borderRadius: '12px',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: `background 180ms ${EASE}`,
  };

  return (
    <div
      ref={raizRef}
      className="dc-leads"
      style={{
        ...LIGHT_VARS,
        '--brand': accent,
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--page)',
        color: 'var(--txt)',
        fontFamily: "'Poppins',sans-serif",
        fontSize: '15px',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <Sidebar ativo="leads" collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <main style={{ flex: '1 1 auto', minWidth: 0, padding: '32px clamp(16px, 3.5vw, 48px) 64px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', animation: `riseIn 420ms ${EASE} both` }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--txt-3)', marginBottom: '10px' }}>
                <Link to="/admin/dashboard" style={{ color: 'var(--txt-3)' }}>
                  Início
                </Link>
                <Ico size={13} width={2}>
                  <path d="m9 18 6-6-6-6"></path>
                </Ico>
                <span style={{ color: 'var(--txt-2)', fontWeight: 500 }}>Leads</span>
              </div>
              <h1 style={{ margin: '0 0 6px', fontSize: '30px', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--txt)' }}>
                Leads
              </h1>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--txt-2)', lineHeight: 1.4 }}>
                Gerencie todos os leads captados pela plataforma.
              </p>
            </div>
          </header>

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,186px),1fr))', gap: '14px' }}>
            {cards.map((c) => (
              <div key={c.rotulo} className="l-kpi" style={{ ...CARD, animation: `riseIn 460ms ${EASE} ${c.delay}ms both` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--txt-2)' }}>{c.rotulo}</span>
                  {c.icone}
                </div>
                <div
                  data-count-to={c.countTo}
                  data-decimals={c.decimals}
                  data-suffix={c.suffix}
                  style={{
                    fontSize: '27px',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: 'var(--txt)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {c.texto}
                </div>
              </div>
            ))}
          </section>

          <section style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', animation: `fadeIn 500ms ${EASE} 340ms both` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', padding: '18px 20px', borderBottom: '1px solid var(--line-soft)' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: '1 1 260px', minWidth: '220px' }}>
                <svg width="16" height="16" {...svgBase} stroke="var(--txt-3)" style={{ position: 'absolute', left: '13px', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="7.5"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                  type="text"
                  className="l-busca"
                  placeholder="Buscar por nome ou e-mail"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPagina(0);
                  }}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    height: '40px',
                    padding: '0 14px 0 38px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    color: 'var(--txt)',
                    transition: `border-color 160ms ${EASE}, box-shadow 160ms ${EASE}`,
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="l-chip"
                  onClick={() => {
                    setStatusIdx((i) => (i + 1) % FILTROS_STATUS.length);
                    setPagina(0);
                  }}
                  style={{ ...CHIP, ...(statusIdx ? CHIP_ATIVO : null) }}
                >
                  {`Status: ${statusIdx === 0 ? 'todos' : STATUS_META[FILTROS_STATUS[statusIdx]].label}`}
                  <Ico size={14} width={2}>
                    <path d="m6 9 6 6 6-6"></path>
                  </Ico>
                </button>
                <button type="button" className="l-chip" onClick={() => { setMaisRecentes((v) => !v); setPagina(0); }} style={CHIP}>
                  <Ico size={15}>
                    <path d="m3 16 4 4 4-4"></path>
                    <path d="M7 20V4"></path>
                    <path d="M21 8h-8"></path>
                    <path d="M18 12h-5"></path>
                    <path d="M15 16h-2"></path>
                  </Ico>
                  {maisRecentes ? 'Mais recentes' : 'Mais antigos'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', padding: '14px 20px', borderBottom: '1px solid var(--line-soft)' }}>
              <span style={{ fontSize: '13px', color: 'var(--txt-2)' }}>
                {filtrados.length === 1 ? '1 lead encontrado' : `${nf().format(filtrados.length)} leads encontrados`}
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <div data-table-min="true" style={{ minWidth: '900px' }}>
                <div data-head="true" style={{ display: 'grid', gridTemplateColumns: COLS, gap: '14px', padding: '11px 20px', borderBottom: '1px solid var(--line-soft)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--txt-3)' }}>
                  <span>Lead</span>
                  <span data-col="secondary">Telefone</span>
                  <span>E-mail</span>
                  <span>Status</span>
                  <span>Cadastro</span>
                  <span data-col="secondary">Última interação</span>
                </div>

                {isCarregando && (
                  <div style={{ padding: '8px 0' }}>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} style={{ display: 'grid', gridTemplateColumns: COLS, gap: '14px', padding: '15px 20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '999px', ...SKELETON }}></div>
                          <div style={{ flex: 1, height: '12px', borderRadius: '6px', ...SKELETON }}></div>
                        </div>
                        <div style={{ height: '12px', borderRadius: '6px', ...SKELETON }}></div>
                        <div style={{ height: '12px', borderRadius: '6px', ...SKELETON }}></div>
                        <div style={{ height: '22px', borderRadius: '999px', ...SKELETON }}></div>
                        <div style={{ height: '12px', borderRadius: '6px', ...SKELETON }}></div>
                        <div style={{ height: '12px', borderRadius: '6px', ...SKELETON }}></div>
                      </div>
                    ))}
                  </div>
                )}

                {mostraLinhas && (
                  <div>
                    {visiveis.map((l) => {
                      const st = STATUS_META[l.status] ?? STATUS_META['1. Novo Lead'];
                      const estaAtualizando = atualizandoId === l.id;
                      return (
                        <div key={l.id} data-row="true" className="l-row" style={{ display: 'grid', gridTemplateColumns: COLS, gap: '14px', padding: '15px 20px', alignItems: 'center', borderBottom: '1px solid var(--line-soft)', transition: `background 160ms ${EASE}`, animation: `fadeIn 320ms ${EASE} both` }}>
                          <div data-cell="name" style={{ display: 'flex', alignItems: 'center', gap: '11px', minWidth: 0 }}>
                            <div style={{ width: '34px', height: '34px', flex: '0 0 auto', borderRadius: '999px', background: 'color-mix(in srgb, var(--brand) 9%, transparent)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
                              {iniciais(l.nome)}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {l.nome}
                              </div>
                            </div>
                          </div>
                          <span data-cell="phone" data-label="Telefone" data-col="secondary" style={{ fontSize: '13px', color: 'var(--txt-2)', fontVariantNumeric: 'tabular-nums' }}>
                            {formatarTelefone(l.telefone)}
                          </span>
                          <span data-cell="email" data-label="E-mail" style={{ fontSize: '13px', color: 'var(--txt-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {l.email}
                          </span>
                          <div data-cell="status" data-label="Status" style={{ justifySelf: 'start' }}>
                            <select
                              value={l.status}
                              disabled={estaAtualizando}
                              onChange={(e) => alterarStatus(l.id, e.target.value)}
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: st.fg,
                                background: st.bg,
                                ...(st.border ? { border: st.border } : { border: '1px solid transparent' }),
                                padding: '4px 8px',
                                borderRadius: '999px',
                                cursor: estaAtualizando ? 'wait' : 'pointer',
                                outline: 'none',
                                fontFamily: 'inherit',
                                opacity: estaAtualizando ? 0.6 : 1,
                              }}
                            >
                              {STATUSES.map((statusOpcao) => (
                                <option key={statusOpcao} value={statusOpcao} style={{ color: '#1B2140', background: '#FFFFFF' }}>
                                  {STATUS_META[statusOpcao]?.label || statusOpcao}
                                </option>
                              ))}
                            </select>
                          </div>
                          <span data-cell="created" data-label="Cadastro" style={{ fontSize: '13px', color: 'var(--txt-3)', fontVariantNumeric: 'tabular-nums' }}>
                            {dataCompleta(l.criado_em)}
                          </span>
                          <span data-cell="last" data-label="Última interação" data-col="secondary" style={{ fontSize: '13px', color: 'var(--txt-3)' }}>
                            {tempoRelativo(l.atualizado_em)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {isSemResultados && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '56px 24px', animation: `fadeIn 300ms ${EASE} both` }}>
                <div style={{ width: '132px', height: '132px', borderRadius: '16px', overflow: 'hidden', background: 'var(--line-soft)', marginBottom: '12px' }}></div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--txt)' }}>Nenhum lead encontrado</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--txt-2)', maxWidth: '340px', textAlign: 'center', lineHeight: 1.5 }}>
                  Ajuste a busca ou limpe os filtros para ver mais resultados.
                </p>
                <button type="button" className="l-primario-plano" onClick={limparFiltros} style={{ ...primario, marginTop: '14px' }}>
                  Limpar filtros
                </button>
              </div>
            )}

            {isVazio && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '56px 24px', animation: `fadeIn 300ms ${EASE} both` }}>
                <div style={{ width: '132px', height: '132px', borderRadius: '16px', overflow: 'hidden', background: 'var(--line-soft)', marginBottom: '12px' }}></div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--txt)' }}>Nenhum lead cadastrado</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--txt-2)', maxWidth: '340px', textAlign: 'center', lineHeight: 1.5 }}>
                  Os leads aparecem aqui conforme forem captados pela página pública.
                </p>
              </div>
            )}

            {isErro && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '56px 24px', animation: `fadeIn 300ms ${EASE} both` }}>
                <div style={{ width: '132px', height: '132px', borderRadius: '16px', overflow: 'hidden', background: 'var(--line-soft)', marginBottom: '12px' }}></div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--txt)' }}>Não foi possível carregar os leads</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--txt-2)', maxWidth: '360px', textAlign: 'center', lineHeight: 1.5 }}>
                  A conexão com o servidor falhou. Tente novamente em alguns instantes.
                </p>
                <button type="button" className="l-primario-plano" onClick={carregar} style={{ ...primario, marginTop: '14px' }}>
                  <Ico size={15} width={1.9}>
                    <path d="M21 12a9 9 0 1 1-3-6.7"></path>
                    <path d="M21 3v6h-6"></path>
                  </Ico>
                  Tentar novamente
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', padding: '14px 20px', borderTop: '1px solid var(--line-soft)', fontSize: '13px', color: 'var(--txt-3)' }}>
              <span>
                {mostraLinhas
                  ? `Mostrando ${nf().format(paginaAtual * POR_PAGINA + 1)}–${nf().format(
                      paginaAtual * POR_PAGINA + visiveis.length
                    )} de ${nf().format(filtrados.length)} leads`
                  : 'Nenhum resultado exibido'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {[
                  { dir: -1, path: 'm15 18-6-6 6-6', desativado: paginaAtual === 0, rot: 'Página anterior' },
                  { dir: 1, path: 'm9 18 6-6-6-6', desativado: paginaAtual >= totalPaginas - 1, rot: 'Próxima página' },
                ].map((b) => (
                  <button
                    key={b.dir}
                    type="button"
                    className="l-chip"
                    aria-label={b.rot}
                    disabled={b.desativado || !mostraLinhas}
                    onClick={() => setPagina((p) => Math.min(totalPaginas - 1, Math.max(0, p + b.dir)))}
                    style={{
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      gap: 0,
                      border: '1px solid var(--line)',
                      background: 'var(--surface)',
                      borderRadius: '10px',
                      color: 'var(--txt-3)',
                      cursor: b.desativado || !mostraLinhas ? 'not-allowed' : 'pointer',
                      opacity: b.desativado || !mostraLinhas ? 0.5 : 1,
                      transition: `all 160ms ${EASE}`,
                    }}
                  >
                    <Ico size={15} width={2}>
                      <path d={b.path}></path>
                    </Ico>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}