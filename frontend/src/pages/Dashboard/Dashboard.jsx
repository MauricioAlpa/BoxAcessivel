import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { Sidebar } from '../../components/Shell/Sidebar';
import './Dashboard.css';

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
};

const FIXED_VARS = {
  '--brand-2': '#5566AE',
  '--brand-deep': '#1F2A5A',
  '--success': '#1CA863',
  '--success-text': '#15804A',
  '--danger': '#CE181E',
};

const STATUS_META = {
  '1. Novo Lead': { label: 'Novo lead', fg: 'var(--brand-2)', bg: 'color-mix(in srgb, var(--brand-2) 13%, transparent)' },
  '2. Em Contato': { label: 'Em contato', fg: 'var(--brand)', bg: 'color-mix(in srgb, var(--brand) 9%, transparent)' },
  '3. Proposta Enviada': { label: 'Proposta', fg: 'var(--brand)', bg: 'transparent', border: '1px solid color-mix(in srgb, var(--brand-2) 40%, transparent)', padding: '4px 9px' },
  '4. Negociando': { label: 'Negociação', fg: '#FFFFFF', bg: 'var(--brand-2)' },
  '5. Fechado': { label: 'Fechado', fg: 'var(--success-text)', bg: 'color-mix(in srgb, var(--success) 11%, transparent)' },
};

const FUNIL = [
  { status: '1. Novo Lead', label: 'Novo lead', fill: 'var(--brand)', delay: 460 },
  { status: '2. Em Contato', label: 'Em contato', fill: 'color-mix(in srgb, var(--brand) 70%, var(--brand-2))', delay: 520 },
  { status: '3. Proposta Enviada', label: 'Proposta', fill: 'var(--brand-2)', delay: 580 },
  { status: '4. Negociando', label: 'Negociação', fill: 'color-mix(in srgb, var(--brand-2) 62%, #FFFFFF)', delay: 640 },
  { status: '5. Fechado', label: 'Fechado', fill: 'color-mix(in srgb, var(--brand-2) 38%, #FFFFFF)', delay: 700 },
];

const AVATARES = [
  { bg: 'color-mix(in srgb, var(--brand) 14%, transparent)', fg: 'var(--brand)' },
  { bg: 'color-mix(in srgb, var(--brand) 10%, transparent)', fg: 'var(--brand)' },
  { bg: 'color-mix(in srgb, var(--brand-2) 16%, transparent)', fg: 'var(--brand-2)' },
  { bg: 'color-mix(in srgb, var(--brand) 10%, transparent)', fg: 'var(--brand)' },
];

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const GRID_COLS = '1.5fr 1fr 1.5fr 1fr .8fr';
const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const nf = (dec = 0) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });

function ymdLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function diaMes(d) {
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
}

function ddmm(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatarTelefone(tel) {
  const d = String(tel ?? '').replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return tel;
}

function iniciais(nome) {
  const partes = String(nome ?? '').trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function geometry(values) {
  const W = 600;
  const H = 180;
  const TOP = 14;
  const max = Math.max.apply(null, values) * 1.12 || 1;
  const n = values.length;
  const pts = values.map((v, i) => ({
    x: n === 1 ? 0 : (i / (n - 1)) * W,
    y: H - (v / max) * (H - TOP),
    v,
  }));
  let d = 'M' + pts[0].x.toFixed(1) + ',' + pts[0].y.toFixed(1);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ' C' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) + ' ' + p2.x.toFixed(1) + ',' + p2.y.toFixed(1);
  }
  return { pts, line: d, area: d + ' L600,196 L0,196 Z', H: 196 };
}

function buildSeries(leads) {
  const porDia = new Map();
  leads.forEach((l) => {
    const k = ymdLocal(new Date(l.criado_em));
    porDia.set(k, (porDia.get(k) || 0) + 1);
  });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(d.getDate() - i);
    dias.push(d);
  }
  const values = dias.map((d) => porDia.get(ymdLocal(d)) || 0);
  const pointLabels = dias.map(diaMes);

  return { label: 'Últimos 7 dias', values, labels: pointLabels, pointLabels };
}

const svgBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function KpiCard({ icone, icoBg, countTo, decimals, prefix, suffix, valorTexto, rotulo, delay }) {
  return (
    <div
      className="h-kpi"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: `box-shadow 220ms ${EASE}, transform 220ms ${EASE}`,
        animation: `riseIn 480ms ${EASE} ${delay}ms both`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '11px',
            background: icoBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icone}
        </div>
      </div>
      <div>
        <div
          data-count-to={countTo}
          data-decimals={decimals}
          data-prefix={prefix}
          data-suffix={suffix}
          style={{
            fontSize: '34px',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'var(--txt)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {valorTexto}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--txt-2)', marginTop: '2px' }}>{rotulo}</div>
      </div>
    </div>
  );
}

const CARD = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: '16px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
};

const CARD_TITULO = {
  margin: '0 0 3px',
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: 'var(--txt)',
};

const CARD_SUB = { margin: 0, fontSize: '13px', color: 'var(--txt-3)' };
const CELULA_TXT2 = { fontSize: '13px', color: 'var(--txt-2)' };
const CELULA_ELIPSE = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };

export function Dashboard({ accent = '#2F3E7E', sidebarCollapsed = false }) {
  const { token } = useAuth();
  const raizRef = useRef(null);

  const [metrics, setMetrics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [erro, setErro] = useState('');
  const [collapsed, setCollapsed] = useState(sidebarCollapsed);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    let vivo = true;
    async function carregar() {
      try {
        const [metricsData, leadsData] = await Promise.all([api.conversao(token), api.listarLeads(token)]);
        if (!vivo) return;
        setMetrics(metricsData);
        setLeads(leadsData);
      } catch (err) {
        if (vivo) setErro(err.message);
      }
    }
    carregar();
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

  const carregado = metrics !== null;

  useEffect(() => {
    if (!carregado || !raizRef.current) return;
    const els = Array.from(raizRef.current.querySelectorAll('[data-count-to]'));
    const rafs = new Map();
    els.forEach((el, i) => {
      const to = parseFloat(el.getAttribute('data-count-to'));
      const dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const fmt = nf(dec);
      const dur = 900;
      const delay = 120 + i * 80;
      const start = performance.now() + delay;
      const tick = (now) => {
        const t = Math.min(1, Math.max(0, (now - start) / dur));
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + fmt.format(to * eased) + suffix;
        if (t < 1) rafs.set(el, requestAnimationFrame(tick));
      };
      rafs.set(el, requestAnimationFrame(tick));
    });
    return () => rafs.forEach((id) => cancelAnimationFrame(id));
  }, [carregado]);

  const serie = useMemo(() => buildSeries(leads), [leads]);
  const g = useMemo(() => geometry(serie.values), [serie]);
  const hp = hover === null ? null : g.pts[hover];

  const totalVisitas = metrics?.totalVisitas ?? 0;
  const totalLeads = metrics?.totalLeads ?? 0;
  const taxaConversao = metrics?.taxaConversao ?? 0;

  const funil = useMemo(() => {
    const contagem = FUNIL.map((f, i) => ({
      ...f,
      total: leads.filter((l) => FUNIL.findIndex((x) => x.status === l.status) >= i).length,
    }));
    const total = contagem[0].total || 1;
    return contagem.map((c) => ({
      ...c,
      pct: c.total === 0 ? 0 : Math.max(9, Math.round((c.total / total) * 100)),
    }));
  }, [leads]);

  const fechados = funil[funil.length - 1].total;
  const taxaFechamento = totalLeads > 0 ? (fechados / totalLeads) * 100 : 0;
  const recentes = useMemo(() => leads.slice(0, 6), [leads]);

  const anelTotal = 402;
  const anelPreenchido = (Math.min(100, Math.max(0, taxaConversao)) / 100) * anelTotal;

  return (
    <div
      ref={raizRef}
      className="dc-page"
      style={{
        ...LIGHT_VARS,
        ...FIXED_VARS,
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
      <Sidebar ativo="dashboard" collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <main style={{ flex: '1 1 auto', minWidth: 0, padding: '36px clamp(20px, 3.5vw, 48px) 64px' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', animation: `riseIn 420ms ${EASE} both` }}>
            <div>
              <h1 style={{ margin: '0 0 6px', fontSize: '32px', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--txt)' }}>
                Dashboard
              </h1>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--txt-2)', lineHeight: 1.4 }}>Visão geral da operação</p>
            </div>
          </header>

          {erro && (
            <p role="alert" style={{ margin: 0, fontSize: '13px', color: 'var(--danger)' }}>
              {erro}
            </p>
          )}

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,232px),1fr))', gap: '16px' }}>
            <KpiCard
              icone={
                <svg width="18" height="18" {...svgBase} stroke="var(--brand)">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              }
              icoBg="color-mix(in srgb, var(--brand) 12%, transparent)"
              countTo={totalVisitas}
              decimals={0}
              valorTexto={nf().format(totalVisitas)}
              rotulo="Total de visitas"
              delay={60}
            />
            <KpiCard
              icone={
                <svg width="18" height="18" {...svgBase} stroke="var(--brand-2)">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              }
              icoBg="color-mix(in srgb, var(--brand-2) 14%, transparent)"
              countTo={totalLeads}
              decimals={0}
              valorTexto={nf().format(totalLeads)}
              rotulo="Leads captados"
              delay={120}
            />
            <KpiCard
              icone={
                <svg width="18" height="18" {...svgBase} stroke="var(--brand)">
                  <circle cx="12" cy="12" r="9"></circle>
                  <circle cx="12" cy="12" r="5"></circle>
                  <circle cx="12" cy="12" r="1.4"></circle>
                </svg>
              }
              icoBg="color-mix(in srgb, var(--brand) 10%, transparent)"
              countTo={taxaConversao}
              decimals={1}
              suffix="%"
              valorTexto={`${nf(1).format(taxaConversao)}%`}
              rotulo="Taxa de conversão"
              delay={180}
            />
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,400px),1fr))', gap: '16px' }}>
            <div style={{ ...CARD, gap: '20px', animation: `riseIn 520ms ${EASE} 300ms both` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <h3 style={CARD_TITULO}>Evolução de leads</h3>
                  <p style={CARD_SUB}>{serie.label}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--txt-2)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--brand)' }}></span>
                  Leads
                </div>
              </div>
              <div style={{ position: 'relative', height: '196px' }} onMouseLeave={() => setHover(null)}>
                <svg viewBox="0 0 600 196" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', animation: `fadeIn 600ms ${EASE} 340ms both` }}>
                  <defs>
                    <linearGradient id="evoFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.22"></stop>
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="8" x2="600" y2="8" stroke="var(--line-soft)" strokeWidth="1" vectorEffect="non-scaling-stroke"></line>
                  <line x1="0" y1="65" x2="600" y2="65" stroke="var(--line-soft)" strokeWidth="1" vectorEffect="non-scaling-stroke"></line>
                  <line x1="0" y1="122" x2="600" y2="122" stroke="var(--line-soft)" strokeWidth="1" vectorEffect="non-scaling-stroke"></line>
                  <line x1="0" y1="180" x2="600" y2="180" stroke="var(--line)" strokeWidth="1" vectorEffect="non-scaling-stroke"></line>
                  <path d={g.area} fill="url(#evoFill)" style={{ animation: `fadeIn 700ms ${EASE} 380ms both` }}></path>
                  <path d={g.line} fill="none" stroke="var(--brand)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ strokeDasharray: 1400, animation: `drawLine 1100ms ${EASE} 260ms both` }}></path>
                </svg>
                {hp && (
                  <div style={{ position: 'absolute', top: 0, bottom: '16px', width: '1px', background: 'color-mix(in srgb, var(--brand) 45%, transparent)', left: `${((hp.x / 600) * 100).toFixed(2)}%` }}></div>
                )}
                {hp && (
                  <div style={{ position: 'absolute', width: '11px', height: '11px', borderRadius: '999px', background: 'var(--brand)', border: '2.5px solid var(--surface)', boxShadow: '0 2px 8px rgba(0,43,64,0.18)', left: `${((hp.x / 600) * 100).toFixed(2)}%`, top: `${((hp.y / g.H) * 100).toFixed(2)}%`, transform: 'translate(-50%,-50%)' }}></div>
                )}
                {hp && (
                  <div style={{ position: 'absolute', left: `${Math.min(92, Math.max(8, (hp.x / 600) * 100)).toFixed(2)}%`, top: `${((hp.y / g.H) * 100).toFixed(2)}%`, transform: 'translate(-50%,calc(-100% - 16px))', background: 'var(--brand)', color: '#fff', padding: '8px 12px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,43,64,0.22)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                    <div style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>
                      {(serie.pointLabels || serie.labels)[hover] || ''}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{hp.v} leads</div>
                  </div>
                )}
                <div style={{ position: 'absolute', inset: '0 0 16px', display: 'flex' }}>
                  {g.pts.map((p, i) => (
                    <div key={i} onMouseEnter={() => setHover(i)} style={{ flex: '1 1 0', height: '100%', cursor: 'crosshair' }}></div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--txt-3)', letterSpacing: '0.02em' }}>
                {serie.labels.map((l, i) => (
                  <span key={i}>{l}</span>
                ))}
              </div>
            </div>

            <div style={{ ...CARD, gap: '12px', animation: `riseIn 520ms ${EASE} 340ms both` }}>
              <div>
                <h3 style={CARD_TITULO}>Conversão</h3>
                <p style={CARD_SUB}>Visitas que se tornaram leads</p>
              </div>
              <div style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
                <div style={{ position: 'relative', width: '172px', height: '172px' }}>
                  <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="80" cy="80" r="64" fill="none" stroke="var(--line-soft)" strokeWidth="14"></circle>
                    <circle cx="80" cy="80" r="64" fill="none" stroke="var(--brand)" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${anelPreenchido.toFixed(0)} ${anelTotal}`} style={{ animation: `dashIn 1000ms ${EASE} 320ms both` }}></circle>
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                    <span data-count-to={taxaConversao} style={{ fontSize: '38px', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--txt)', fontVariantNumeric: 'tabular-nums' }}>
                      {nf(0).format(taxaConversao)}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--txt-3)' }}>por cento</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...CARD, gap: '20px', gridColumn: '1 / -1', animation: `riseIn 520ms ${EASE} 380ms both` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <h3 style={CARD_TITULO}>Funil de vendas</h3>
                  <p style={CARD_SUB}>Do primeiro contato ao fechamento</p>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand)', background: 'color-mix(in srgb, var(--brand) 10%, transparent)', padding: '5px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                  {`${nf(1).format(taxaFechamento)}% fecham`}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {funil.map((f) => (
                  <div key={f.status} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ width: '104px', flex: '0 0 auto', fontSize: '13px', color: 'var(--txt-2)' }}>{f.label}</span>
                    <div style={{ flex: '1 1 auto', height: '26px', borderRadius: '8px', background: 'var(--line-soft)', overflow: 'hidden' }}>
                      <div style={{ width: `${f.pct}%`, height: '100%', borderRadius: '8px', background: f.fill, transformOrigin: 'left', animation: `growX 720ms ${EASE} ${f.delay}ms both` }}></div>
                    </div>
                    <span style={{ width: '44px', flex: '0 0 auto', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: 'var(--txt)', fontVariantNumeric: 'tabular-nums' }}>
                      {nf(0).format(f.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', animation: `riseIn 520ms ${EASE} 460ms both` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', padding: '22px 24px' }}>
              <div>
                <h3 style={CARD_TITULO}>Leads recentes</h3>
                <p style={CARD_SUB}>{`Últimos ${recentes.length} cadastros`}</p>
              </div>
              <Link to="/admin/leads" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--brand)', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '8px 4px' }}>
                Ver todos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7"></path>
                  <path d="M7 7h10v10"></path>
                </svg>
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: '820px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: GRID_COLS, gap: '16px', padding: '10px 24px', borderTop: '1px solid var(--line-soft)', borderBottom: '1px solid var(--line-soft)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--txt-3)' }}>
                  <span>Nome</span>
                  <span>Telefone</span>
                  <span>E-mail</span>
                  <span>Status</span>
                  <span>Cadastro</span>
                </div>
                {recentes.map((lead, i) => {
                  const av = AVATARES[i % AVATARES.length];
                  const st = STATUS_META[lead.status] ?? STATUS_META['1. Novo Lead'];
                  const ultima = i === recentes.length - 1;
                  return (
                    <div key={lead.id} className="h-row" style={{ display: 'grid', gridTemplateColumns: GRID_COLS, gap: '16px', padding: '14px 24px', alignItems: 'center', ...(ultima ? null : { borderBottom: '1px solid var(--line-soft)' }), transition: `background 160ms ${EASE}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', minWidth: 0 }}>
                        <div style={{ width: '34px', height: '34px', flex: '0 0 auto', borderRadius: '999px', background: av.bg, color: av.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
                          {iniciais(lead.nome)}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--txt)', ...CELULA_ELIPSE }}>{lead.nome}</span>
                      </div>
                      <span style={{ ...CELULA_TXT2, fontVariantNumeric: 'tabular-nums' }}>{formatarTelefone(lead.telefone)}</span>
                      <span style={{ ...CELULA_TXT2, ...CELULA_ELIPSE }}>{lead.email}</span>
                      <span style={{ justifySelf: 'start', fontSize: '12px', fontWeight: 600, color: st.fg, background: st.bg, ...(st.border ? { border: st.border } : null), padding: st.padding ?? '5px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                        {st.label}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--txt-3)', fontVariantNumeric: 'tabular-nums' }}>{ddmm(lead.criado_em)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}