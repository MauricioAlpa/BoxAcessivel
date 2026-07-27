import { Fragment, useEffect, useRef, useState } from 'react';
import { api } from '../../api/client';
import boxMark from '../../assets/box-mark.png';
import obra1 from '../../assets/obra-1.jpg';
import obra2 from '../../assets/obra-2.jpg';
import obra3 from '../../assets/obra-3.jpg';
import './Gate.css';

const VARS = {
  '--page': '#F4F6FB',
  '--surface': '#FFFFFF',
  '--line': '#E4E8F2',
  '--txt': '#1B2140',
  '--txt-2': '#5A6480',
  '--txt-3': '#8C95AE',
  '--brand': '#2F3E7E',
  '--brand-2': '#5566AE',
  '--brand-deep': '#1F2A5A',
  '--danger': '#CE181E',
  '--success': '#1CA863',
};

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const WHATSAPP = 'https://wa.me/5571992425858?text=Ol%C3%A1,%20gostaria%20de%20conhecer%20a%20Box%20Acess%C3%ADvel.';
const INSTAGRAM = 'https://www.instagram.com/boxacessivel/';

const SITE = 'http://www.boxacessivel.com.br/';
const SEGUNDOS_REDIRECT = 8;

const ESTATISTICAS = [
  { countTo: 500, suffix: '+', texto: '500+', rotulo: 'Projetos' },
  { countTo: 98, suffix: '%', texto: '98%', rotulo: 'Satisfação' },
  { countTo: 6, suffix: '+', texto: '6+', rotulo: 'Anos de atuação' },
];

const OBRAS = [
  { legenda: 'Sem barreiras de acesso', foto: obra1 },
  { legenda: 'Elegância, conforto e segurança', foto: obra2 },
  { legenda: 'Ambientes novos ou reformas', foto: obra3 },
];

const INPUT_BASE = {
  width: '100%',
  boxSizing: 'border-box',
  height: '50px',
  padding: '0 14px 0 42px',
  borderRadius: '14px',
  border: '1px solid var(--line)',
  background: 'var(--surface)',
  fontFamily: 'inherit',
  fontSize: '15px',
  color: 'var(--txt)',
  transition: `border-color 160ms ${EASE}, box-shadow 160ms ${EASE}`,
};

const LABEL = { fontSize: '13px', fontWeight: 500, color: 'var(--txt)' };
const ICONE_CAMPO = { position: 'absolute', left: '14px', pointerEvents: 'none' };
const SOCIAL_BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  height: '40px',
  padding: '0 16px',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.22)',
  color: '#fff',
  fontSize: '14px',
  transition: `background 160ms ${EASE}, border-color 160ms`,
};

const svgLinha = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function IconeWhats({ size = 16 }) {
  return (
    <svg width={size} height={size} {...svgLinha} stroke="currentColor">
      <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.5A8.4 8.4 0 1 1 21 11.5"></path>
      <path d="M8.6 9.2c.3 2.6 3.6 5.9 6.2 6.2l1.2-1.6-2-1-1 1a7 7 0 0 1-2.8-2.8l1-1-1-2z"></path>
    </svg>
  );
}

function Check({ size = 12, stroke = '#fff', width = 3, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M20 6 9 17l-5-5"></path>
    </svg>
  );
}

function Escudo({ size = 14 }) {
  return (
    <svg width={size} height={size} {...svgLinha} stroke="currentColor">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  );
}

const maskPhone = (v) => {
  const d = String(v).replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? '(' + d : '';
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
};

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
const nomeCompleto = (v) => String(v).trim().split(' ').filter(Boolean).length >= 2;

export function Gate({ accent = '#2F3E7E', showStats = true, background = 'grid + brilho' }) {
  const raizRef = useRef(null);
  const timer = useRef(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [fone, setFone] = useState('');
  const [lgpd, setLgpd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [sentName, setSentName] = useState('');
  const [restante, setRestante] = useState(SEGUNDOS_REDIRECT);

  useEffect(() => {
    api.registrarVisita().catch(() => {});
  }, []);

  useEffect(() => {
    const anterior = document.body.style.background;
    document.body.style.background = '#F4F6FB';
    return () => {
      document.body.style.background = anterior;
    };
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!sent) return;
    const id = setInterval(() => {
      setRestante((s) => {
        if (s <= 1) {
          clearInterval(id);
          window.location.assign(SITE);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [sent]);

  useEffect(() => {
    if (!showStats || sent || !raizRef.current) return;
    const els = Array.from(raizRef.current.querySelectorAll('[data-count-to]'));
    const rafs = new Map();
    els.forEach((el, i) => {
      const to = parseFloat(el.getAttribute('data-count-to'));
      const suffix = el.getAttribute('data-suffix') || '';
      const fmt = new Intl.NumberFormat('pt-BR');
      const dur = 900;
      const start = performance.now() + 200 + i * 90;
      const tick = (now) => {
        const t = Math.min(1, Math.max(0, (now - start) / dur));
        el.textContent = fmt.format(Math.round(to * (1 - Math.pow(1 - t, 3)))) + suffix;
        if (t < 1) rafs.set(el, requestAnimationFrame(tick));
      };
      rafs.set(el, requestAnimationFrame(tick));
    });
    return () => rafs.forEach((id) => cancelAnimationFrame(id));
  }, [showStats, sent]);

  const gridOpacity = background === 'apenas brilho' || background === 'limpo' ? 0 : 1;

  async function submit(e) {
    e.preventDefault();
    if (loading) return;

    if (!nomeCompleto(nome)) {
      setError('Informe seu nome completo.');
      return;
    }
    if (!emailOk(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (fone.replace(/\D/g, '').length < 10) {
      setError('Informe um telefone com DDD.');
      return;
    }
    if (!lgpd) {
      setError('É necessário aceitar o uso dos dados conforme a LGPD.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.criarLead({
        nome: nome.trim(),
        email: email.trim(),
        telefone: fone.replace(/\D/g, ''),
        consentimento: 'true',
      });
      setLoading(false);
      setSentName(nome.trim().split(' ')[0]);
      setSent(true);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  }

  function reset() {
    setNome('');
    setEmail('');
    setFone('');
    setLgpd(false);
    setSent(false);
    setError('');
    setRestante(SEGUNDOS_REDIRECT);
  }

  const invalidName = !!error && !nomeCompleto(nome);
  const invalidMail = !!error && !invalidName && !emailOk(email);
  const invalidFone = !!error && !invalidName && !invalidMail && fone.replace(/\D/g, '').length < 10;

  const campos = [
    {
      id: 'lead-nome',
      label: 'Nome completo',
      tipo: 'text',
      autoComplete: 'name',
      placeholder: 'Ex.: João da Silva',
      valor: nome,
      set: setNome,
      invalido: invalidName,
      maxLength: 50,
      icone: (
        <>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </>
      ),
    },
    {
      id: 'lead-email',
      label: 'E-mail',
      tipo: 'email',
      autoComplete: 'email',
      placeholder: 'Ex.: joao@empresa.com',
      valor: email,
      set: setEmail,
      invalido: invalidMail,
      icone: (
        <>
          <rect x="2" y="4" width="20" height="16" rx="3"></rect>
          <path d="m3 7 8.2 5.5a1.5 1.5 0 0 0 1.6 0L21 7"></path>
        </>
      ),
    },
    {
      id: 'lead-fone',
      label: 'Telefone / WhatsApp',
      tipo: 'tel',
      inputMode: 'tel',
      autoComplete: 'tel',
      placeholder: '(00) 00000-0000',
      valor: fone,
      set: (v) => setFone(maskPhone(v)),
      invalido: invalidFone,
      tabular: true,
      icone: <path d="M4 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L13 13l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 2 6.2 2 2 0 0 1 4 4"></path>,
    },
  ];

  return (
    <div
      ref={raizRef}
      className="dc-captura"
      data-hero="true"
      style={{
        ...VARS,
        '--brand': accent,
        display: 'flex',
        alignItems: 'stretch',
        minHeight: '100vh',
        background: 'var(--page)',
        color: 'var(--txt)',
        fontFamily: "'Poppins',sans-serif",
        fontSize: '15px',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <section
        data-panel="true"
        style={{
          flex: '1 1 56%',
          maxWidth: '900px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, var(--brand-deep) 0%, var(--brand) 58%, #3A4A92 100%)',
          borderRadius: '0 32px 32px 0',
          padding: 'clamp(32px, 4vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(28px, 3vw, 44px)',
          color: '#fff',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.35,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            width: '560px',
            height: '560px',
            right: '-210px',
            top: '-190px',
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            width: '460px',
            height: '460px',
            left: '-170px',
            bottom: '-180px',
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(85,102,174,0.5) 0%, rgba(85,102,174,0) 72%)',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            right: '-80px',
            bottom: '120px',
            width: '360px',
            height: '360px',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '999px',
          }}
        ></div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: `slideRight 520ms ${EASE} both`,
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              flex: '0 0 auto',
              borderRadius: '10px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={boxMark} alt="Box Acessível" style={{ width: '22px', height: 'auto', display: 'block' }} />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em' }}>Box Acessível</span>
        </div>

        <div style={{ position: 'relative', maxWidth: '640px', animation: `slideRight 620ms ${EASE} 80ms both` }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.62)',
              border: '1px solid rgba(255,255,255,0.22)',
              padding: '6px 12px',
              borderRadius: '999px',
              marginBottom: '24px',
            }}
          >
            Acessibilidade sob medida
          </span>
          <h1
            style={{
              margin: '0 0 18px',
              fontSize: 'clamp(32px, 4.2vw, 56px)',
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: '#fff',
              textWrap: 'pretty',
            }}
          >
            Acessibilidade que transforma espaços
          </h1>
          <div
            style={{ width: '56px', height: '3px', borderRadius: '999px', background: '#fff', opacity: 0.5, marginBottom: '22px' }}
          ></div>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(15px, 1.2vw, 17px)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.76)',
              maxWidth: '520px',
              textWrap: 'pretty',
            }}
          >
            Desenvolvemos soluções inteligentes em acessibilidade para residências, empresas e empreendimentos, unindo
            segurança, elegância e funcionalidade.
          </p>
        </div>

        <div
          style={{
            position: 'relative',
            display: showStats ? 'flex' : 'none',
            gap: 'clamp(28px, 4vw, 56px)',
            flexWrap: 'wrap',
            animation: `fadeIn 700ms ${EASE} 200ms both`,
          }}
        >
          {ESTATISTICAS.map((s, i) => (
            <Fragment key={s.rotulo}>
              {i > 0 && <div style={{ width: '1px', background: 'rgba(255,255,255,0.16)' }}></div>}
              <div>
                <div
                  data-count-to={s.countTo}
                  data-suffix={s.suffix}
                  style={{
                    fontSize: '36px',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: '#fff',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {s.texto}
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.66)', marginTop: '6px' }}>{s.rotulo}</div>
              </div>
            </Fragment>
          ))}
        </div>

        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,168px),1fr))',
            gap: '16px',
            animation: `fadeIn 760ms ${EASE} 260ms both`,
          }}
        >
          {OBRAS.map((o) => (
            <div key={o.legenda}>
              <div
                style={{
                  aspectRatio: '4 / 3',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
              >
                <img
                  src={o.foto}
                  alt={o.legenda}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)', marginTop: '10px' }}>{o.legenda}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'relative',
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            animation: `fadeIn 800ms ${EASE} 320ms both`,
          }}
        >
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="c-social" style={SOCIAL_BASE}>
            <svg width="16" height="16" {...svgLinha} stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="17.5" cy="6.5" r="1"></circle>
            </svg>
            Instagram
          </a>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="c-whats"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              height: '40px',
              padding: '0 18px',
              borderRadius: '999px',
              background: 'var(--success)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              transition: `background 160ms ${EASE}, transform 120ms ${EASE}`,
            }}
          >
            <IconeWhats />
            Falar no WhatsApp
          </a>
        </div>
      </section>

      <div
        data-form-col="true"
        style={{
          flex: '1 1 44%',
          minWidth: 0,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(24px, 3vw, 48px)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: gridOpacity,
              backgroundImage:
                'linear-gradient(rgba(47,62,126,0.06) 1px, transparent 1px),linear-gradient(90deg, rgba(47,62,126,0.06) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'radial-gradient(ellipse at 55% 35%, #000 20%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 55% 35%, #000 20%, transparent 78%)',
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              width: '520px',
              height: '520px',
              right: '-190px',
              top: '-200px',
              borderRadius: '999px',
              background: 'radial-gradient(circle, rgba(85,102,174,0.16) 0%, rgba(85,102,174,0) 70%)',
            }}
          ></div>
        </div>

        <div
          style={{
            position: 'relative',
            flex: '1 1 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 0',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: 'var(--surface)',
              borderRadius: '24px',
              boxShadow: '0 1px 2px rgba(27,33,64,0.04), 0 18px 48px rgba(27,33,64,0.10)',
              padding: 'clamp(26px, 3.2vw, 36px)',
              animation: `riseIn14 560ms ${EASE} 80ms both`,
            }}
          >
            {!sent && (
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--brand)',
                    background: 'color-mix(in srgb, var(--brand) 8%, transparent)',
                    padding: '6px 11px',
                    borderRadius: '999px',
                    marginBottom: '16px',
                  }}
                >
                  <Check size={13} stroke="currentColor" width={2} />
                  Sem custo
                </span>
                <h2
                  style={{
                    margin: '0 0 8px',
                    fontSize: '22px',
                    fontWeight: 600,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.25,
                    color: 'var(--txt)',
                    textWrap: 'pretty',
                  }}
                >
                  Preencha para ver depoimentos de uso e mais informações
                </h2>
                <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'var(--txt-2)', lineHeight: 1.5 }}>
                  Retornamos em até 1 dia útil com projetos parecidos com o seu.
                </p>

                <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {campos.map((c) => (
                    <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor={c.id} style={LABEL}>
                        {c.label} <span style={{ color: 'var(--brand-2)' }}>*</span>
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--txt-3)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={ICONE_CAMPO}>
                          {c.icone}
                        </svg>
                        <input
                          id={c.id}
                          className="c-input"
                          type={c.tipo}
                          inputMode={c.inputMode}
                          autoComplete={c.autoComplete}
                          placeholder={c.placeholder}
                          maxLength={c.maxLength}
                          value={c.valor}
                          onChange={(e) => {
                            c.set(e.target.value);
                            setError('');
                          }}
                          style={{
                            ...INPUT_BASE,
                            ...(c.tabular ? { fontVariantNumeric: 'tabular-nums' } : null),
                            ...(c.invalido ? { borderColor: 'var(--danger)' } : null),
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '11px',
                      padding: '14px',
                      borderRadius: '14px',
                      background: '#F8F9FD',
                    }}
                  >
                    <button
                      type="button"
                      className="c-check"
                      onClick={() => {
                        setLgpd((v) => !v);
                        setError('');
                      }}
                      role="checkbox"
                      aria-checked={lgpd}
                      style={{
                        width: '19px',
                        height: '19px',
                        flex: '0 0 auto',
                        marginTop: '1px',
                        borderRadius: '6px',
                        border: '1px solid var(--line)',
                        background: 'var(--surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0,
                        transition: `all 160ms ${EASE}`,
                        ...(lgpd ? { background: 'var(--brand)', borderColor: 'var(--brand)' } : null),
                      }}
                    >
                      <Check style={{ opacity: lgpd ? 1 : 0 }} />
                    </button>
                    <span
                      onClick={() => {
                        setLgpd((v) => !v);
                        setError('');
                      }}
                      style={{ fontSize: '13px', color: 'var(--txt-2)', lineHeight: 1.5, cursor: 'pointer' }}
                    >
                      Concordo com o uso dos meus dados conforme a LGPD. Suas informações são protegidas e não serão
                      compartilhadas.
                    </span>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        background: 'color-mix(in srgb, var(--danger) 7%, transparent)',
                        color: 'var(--danger)',
                        fontSize: '13px',
                        animation: `fadeIn 220ms ${EASE} both`,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                        <circle cx="12" cy="12" r="9"></circle>
                        <path d="M12 8v4"></path>
                        <path d="M12 16h.01"></path>
                      </svg>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="c-submit"
                    disabled={loading}
                    style={{
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '9px',
                      border: 0,
                      borderRadius: '14px',
                      background: 'var(--brand)',
                      color: '#fff',
                      fontFamily: 'inherit',
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      boxShadow: '0 6px 16px rgba(47,62,126,0.22)',
                      transition: `background 180ms ${EASE}, box-shadow 180ms ${EASE}, transform 120ms ${EASE}`,
                      ...(loading ? { opacity: 0.72, cursor: 'not-allowed', boxShadow: 'none' } : null),
                    }}
                  >
                    {loading && (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" style={{ animation: 'spin 800ms linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.2-8.56"></path>
                      </svg>
                    )}
                    {loading ? 'Enviando…' : 'Enviar respostas'}
                    {!loading && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m13 6 6 6-6 6"></path>
                      </svg>
                    )}
                  </button>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      fontSize: '12px',
                      color: 'var(--txt-3)',
                    }}
                  >
                    <Escudo />
                    Seus dados ficam protegidos · sem spam
                  </div>
                </form>
              </div>
            )}

            {sent && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 0',
                  animation: `fadeIn 320ms ${EASE} both`,
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '999px',
                    background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={26} stroke="var(--brand)" width={2.2} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--txt)', letterSpacing: '-0.02em' }}>
                    Recebemos seus dados
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--txt-2)', lineHeight: 1.5 }}>
                    {sentName}, nossa equipe entra em contato em até 1 dia útil pelo telefone ou WhatsApp informado.
                  </p>
                </div>

                <a
                  href={SITE}
                  className="c-submit"
                  style={{
                    marginTop: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '9px',
                    height: '46px',
                    padding: '0 18px',
                    borderRadius: '14px',
                    background: 'var(--brand)',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 500,
                    boxShadow: '0 6px 16px rgba(47,62,126,0.22)',
                    transition: `background 180ms ${EASE}, box-shadow 180ms ${EASE}, transform 120ms ${EASE}`,
                  }}
                >
                  Conhecer o site
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m13 6 6 6-6 6"></path>
                  </svg>
                </a>

                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="c-whats"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '46px',
                    padding: '0 18px',
                    borderRadius: '14px',
                    background: 'var(--success)',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 500,
                    transition: `background 160ms ${EASE}`,
                  }}
                >
                  <IconeWhats />
                  Falar agora no WhatsApp
                </a>
                <div style={{ fontSize: '12px', color: 'var(--txt-3)' }} aria-live="polite">
                  {`Levando você ao site em ${restante}s…`}
                </div>
                <button
                  type="button"
                  className="c-reset"
                  onClick={reset}
                  style={{
                    border: 0,
                    background: 'transparent',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    color: 'var(--txt-3)',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  Enviar outra resposta
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--txt-3)',
          }}
        >
          <span>© 2026 Box Acessível</span>
        </div>
      </div>
    </div>
  );
}