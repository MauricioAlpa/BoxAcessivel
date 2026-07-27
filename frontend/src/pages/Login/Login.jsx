import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import boxMark from '../../assets/box-mark.png';
import './Login.css';

const VARS = {
  '--brand': '#2F3E7E',
  '--brand-2': '#5566AE',
  '--brand-deep': '#1F2A5A',
  '--page': '#F4F6FB',
  '--surface': '#FFFFFF',
  '--line': '#E4E8F2',
  '--txt': '#1B2140',
  '--txt-2': '#5A6480',
  '--txt-3': '#8C95AE',
  '--danger': '#CE181E',
};

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const EYE_ON = 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z';
const EYE_OFF =
  'M3 3l18 18M10.6 6.2A9.8 9.8 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3 3.6M6.3 8.3A17 17 0 0 0 2 12s3.6 6 10 6a9.7 9.7 0 0 0 3.2-.5';

const BENEFICIOS = [
  'Gestão completa de leads',
  'Dashboard inteligente',
  'Relatórios em tempo real',
  'Controle do funil de vendas',
];

const INPUT_BASE = {
  width: '100%',
  boxSizing: 'border-box',
  height: '50px',
  borderRadius: '14px',
  border: '1px solid var(--line)',
  background: 'var(--surface)',
  fontFamily: 'inherit',
  fontSize: '15px',
  color: 'var(--txt)',
  transition: `border-color 160ms ${EASE}, box-shadow 160ms ${EASE}`,
};

const LABEL = { fontSize: '13px', fontWeight: 500, color: 'var(--txt)' };

const ICONE_CAMPO = {
  position: 'absolute',
  left: '14px',
  pointerEvents: 'none',
};

function Check({ size = 13, stroke = '#fff', width = 2.6, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d="M20 6 9 17l-5-5"></path>
    </svg>
  );
}

export function Login({ accent = '#2F3E7E', background = 'grid + brilho' }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const timer = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const anterior = document.body.style.background;
    document.body.style.background = '#F4F6FB';
    return () => {
      document.body.style.background = anterior;
    };
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const gridOpacity = background === 'apenas brilho' || background === 'limpo' ? 0 : 1;
  const blobOpacity = background === 'apenas grid' || background === 'limpo' ? 0 : 1;

  async function submit(e) {
    e.preventDefault();
    if (loading) return;

    const mail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setError('Informe um e-mail válido.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(mail, password, remember);
      setLoading(false);
      setSignedIn(true);
      timer.current = setTimeout(() => navigate('/admin/dashboard'), 1100);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  }

  const erroEmail = error && email.trim() === '';
  const erroSenha = error && password.length < 6 && email.trim() !== '';

  return (
    <div
      className="dc-login"
      style={{
        ...VARS,
        '--brand': accent,
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'Poppins',sans-serif",
        fontSize: '15px',
        color: 'var(--txt)',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <aside
        data-brand-panel="true"
        style={{
          flex: '0 0 44%',
          maxWidth: '620px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, var(--brand-deep) 0%, var(--brand) 58%, #3A4A92 100%)',
          borderRadius: '0 32px 32px 0',
          padding: 'clamp(36px, 4vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
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
            width: '520px',
            height: '520px',
            right: '-190px',
            top: '-160px',
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%)',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            left: '-140px',
            bottom: '-150px',
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(85,102,174,0.55) 0%, rgba(85,102,174,0) 72%)',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            right: '-70px',
            bottom: '90px',
            width: '340px',
            height: '340px',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '999px',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            right: '10px',
            bottom: '170px',
            width: '200px',
            height: '200px',
            border: '1px solid rgba(255,255,255,0.09)',
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

        <div style={{ position: 'relative', maxWidth: '460px', animation: `slideRight 620ms ${EASE} 80ms both` }}>
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
              marginBottom: '26px',
            }}
          >
            Plataforma comercial
          </span>
          <h1
            style={{
              margin: '0 0 16px',
              fontSize: 'clamp(28px, 3vw, 40px)',
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#fff',
              textWrap: 'pretty',
            }}
          >
            Gerencie seus leads com inteligência
          </h1>
          <p
            style={{
              margin: '0 0 34px',
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.74)',
              textWrap: 'pretty',
            }}
          >
            Acompanhe métricas em tempo real, organize o funil de vendas e decida com clareza, em um só lugar.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {BENEFICIOS.map((texto) => (
              <div key={texto} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    flex: '0 0 auto',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check />
                </span>
                <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)' }}>{texto}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.6)',
            animation: `fadeIn 700ms ${EASE} 240ms both`,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          Acesso restrito · dados protegidos
        </div>
      </aside>

      <main
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--page)',
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
              maskImage: 'radial-gradient(ellipse at 60% 40%, #000 20%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 60% 40%, #000 20%, transparent 78%)',
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              width: '560px',
              height: '560px',
              right: '-180px',
              top: '-220px',
              borderRadius: '999px',
              background: 'radial-gradient(circle, rgba(85,102,174,0.16) 0%, rgba(85,102,174,0) 70%)',
              opacity: blobOpacity,
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              width: '460px',
              height: '460px',
              left: '-160px',
              bottom: '-190px',
              borderRadius: '999px',
              background: 'radial-gradient(circle, rgba(47,62,126,0.12) 0%, rgba(47,62,126,0) 72%)',
              opacity: blobOpacity,
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
            padding: '8px clamp(20px, 3vw, 44px) 40px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: 'var(--surface)',
              borderRadius: '24px',
              boxShadow: '0 1px 2px rgba(27,33,64,0.04), 0 18px 48px rgba(27,33,64,0.10)',
              padding: 'clamp(28px, 3.4vw, 40px)',
              animation: `riseIn14 560ms ${EASE} 60ms both`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '26px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  flex: '0 0 auto',
                  borderRadius: '10px',
                  background: 'color-mix(in srgb, var(--brand) 8%, transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src={boxMark} alt="Box Acessível" style={{ width: '20px', height: 'auto', display: 'block' }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--txt)', letterSpacing: '-0.01em' }}>
                Box Acessível
              </span>
            </div>

            <h2
              style={{
                margin: '0 0 6px',
                fontSize: '26px',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                color: 'var(--txt)',
              }}
            >
              Entrar
            </h2>
            <p style={{ margin: '0 0 28px', fontSize: '14px', color: 'var(--txt-2)', lineHeight: 1.5 }}>
              Acesse sua conta para continuar.
            </p>

            {!signedIn && (
              <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="login-email" style={LABEL}>
                    E-mail
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--txt-3)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={ICONE_CAMPO}>
                      <rect x="2" y="4" width="20" height="16" rx="3"></rect>
                      <path d="m3 7 8.2 5.5a1.5 1.5 0 0 0 1.6 0L21 7"></path>
                    </svg>
                    <input
                      id="login-email"
                      className="l-input"
                      type="email"
                      autoComplete="email"
                      placeholder="voce@boxacessivel.com.br"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      style={{
                        ...INPUT_BASE,
                        padding: '0 14px 0 42px',
                        ...(erroEmail ? { borderColor: 'var(--danger)' } : null),
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="login-password" style={LABEL}>
                    Senha
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--txt-3)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={ICONE_CAMPO}>
                      <rect x="3" y="11" width="18" height="10" rx="2.5"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <input
                      id="login-password"
                      className="l-input"
                      type={show ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      style={{
                        ...INPUT_BASE,
                        padding: '0 46px 0 42px',
                        ...(erroSenha ? { borderColor: 'var(--danger)' } : null),
                      }}
                    />
                    <button
                      type="button"
                      className="l-eye"
                      onClick={() => setShow((v) => !v)}
                      aria-label="Mostrar ou ocultar senha"
                      style={{
                        position: 'absolute',
                        right: '8px',
                        width: '34px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 0,
                        background: 'transparent',
                        borderRadius: '9px',
                        color: 'var(--txt-3)',
                        cursor: 'pointer',
                        transition: `all 160ms ${EASE}`,
                      }}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d={show ? EYE_OFF : EYE_ON}></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className="l-check"
                    onClick={() => setRemember((v) => !v)}
                    role="checkbox"
                    aria-checked={remember}
                    style={{
                      width: '19px',
                      height: '19px',
                      flex: '0 0 auto',
                      borderRadius: '6px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: 0,
                      transition: `all 160ms ${EASE}`,
                      ...(remember ? { background: 'var(--brand)', borderColor: 'var(--brand)' } : null),
                    }}
                  >
                    <Check size={12} width={3} style={{ opacity: remember ? 1 : 0 }} />
                  </button>
                  <span
                    onClick={() => setRemember((v) => !v)}
                    style={{ fontSize: '14px', color: 'var(--txt-2)', cursor: 'pointer' }}
                  >
                    Lembrar-me neste dispositivo
                  </span>
                </div>

                <button
                  type="submit"
                  className="l-submit"
                  disabled={loading}
                  style={{
                    height: '50px',
                    marginTop: '2px',
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
                    transition: `background 180ms ${EASE}, transform 120ms ${EASE}, box-shadow 180ms ${EASE}`,
                    boxShadow: '0 6px 16px rgba(47,62,126,0.22)',
                    ...(loading ? { opacity: 0.72, cursor: 'not-allowed', boxShadow: 'none' } : null),
                  }}
                >
                  {loading && (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" style={{ animation: 'spin 800ms linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.2-8.56" opacity="0.9"></path>
                    </svg>
                  )}
                  {loading ? 'Autenticando…' : 'Entrar'}
                  {!loading && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m13 6 6 6-6 6"></path>
                    </svg>
                  )}
                </button>
              </form>
            )}

            {signedIn && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '22px 0 10px',
                  animation: `fadeIn 320ms ${EASE} both`,
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '999px',
                    background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={24} stroke="var(--brand)" width={2.2} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--txt)' }}>Acesso liberado</div>
                  <div style={{ fontSize: '14px', color: 'var(--txt-2)', marginTop: '3px' }}>
                    Levando você ao dashboard…
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            padding: '0 24px 28px',
            fontSize: '12px',
            color: 'var(--txt-3)',
          }}
        >
          <span>© 2026 Box Acessível</span>
        </div>
      </main>
    </div>
  );
}
