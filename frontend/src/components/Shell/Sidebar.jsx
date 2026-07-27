import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import boxMark from "../../assets/box-mark.png";
import './Sidebar.css';



const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const NAV_BASE = {
  display: 'flex',
  alignItems: 'center',
  gap: '11px',
  padding: '9px 10px',
  borderRadius: '10px',
};

const svgBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const ICONES = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5"></rect>
      <rect x="14" y="3" width="7" height="5" rx="1.5"></rect>
      <rect x="14" y="12" width="7" height="9" rx="1.5"></rect>
      <rect x="3" y="16" width="7" height="5" rx="1.5"></rect>
    </>
  ),
  leads: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </>
  ),
  sair: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <path d="m16 17 5-5-5-5"></path>
      <path d="M21 12H9"></path>
    </>
  ),
};


const ITENS = [
  { chave: 'dashboard', label: 'Dashboard', to: '/admin/dashboard' },
  { chave: 'leads', label: 'Leads', to: '/admin/leads' },
];

function Icone({ chave, ativo }) {
  return (
    <svg width="18" height="18" {...svgBase} stroke={ativo ? '#FFFFFF' : 'currentColor'} style={{ flex: '0 0 auto' }}>
      {ICONES[chave]}
    </svg>
  );
}

function NavItem({ chave, label, to, ativo, hide, center }) {
  const conteudo = (
    <>
      <Icone chave={chave} ativo={ativo} />
      <span style={{ whiteSpace: 'nowrap', ...hide }}>{label}</span>
    </>
  );

  if (ativo) {
    return (
      <span
        style={{
          ...NAV_BASE,
          color: '#fff',
          background: 'rgba(255,255,255,0.13)',
          boxShadow: 'inset 2px 0 0 #FFFFFF',
          fontWeight: 500,
          transition: `background 160ms ${EASE}`,
          ...center,
        }}
      >
        {conteudo}
      </span>
    );
  }

  const estilo = {
    ...NAV_BASE,
    color: 'var(--side-fg)',
    transition: `background 160ms ${EASE}, color 160ms`,
    ...center,
  };

  if (to) {
    return (
      <Link to={to} className="h-nav" style={estilo}>
        {conteudo}
      </Link>
    );
  }
  return (
    <a href="#" className="h-nav" style={estilo}>
      {conteudo}
    </a>
  );
}

function Secao({ label, hide, topo }) {
  return (
    <span
      style={{
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.32)',
        padding: topo ? '20px 8px 8px' : '0 8px 8px',
        ...hide,
      }}
    >
      {label}
    </span>
  );
}

export function Sidebar({ ativo, collapsed, onToggle }) {
  const { logout } = useAuth();
  const hide = collapsed ? { display: 'none' } : null;
  const center = collapsed ? { justifyContent: 'center', paddingLeft: 0, paddingRight: 0 } : null;

  return (
    <aside
      style={{
        width: collapsed ? '76px' : '248px',
        flex: '0 0 auto',
        background: 'var(--side)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px 18px',
        gap: '28px',
        transition: `width 240ms ${EASE}`,
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '0 6px', minHeight: '36px' }}>
        <div
          style={{
            flex: '0 0 auto',
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={boxMark} alt="Box Acessível" style={{ width: '20px', height: 'auto', display: 'block' }} />
        </div>
        <span
          style={{
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '15px',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            ...hide,
          }}
        >
          Box Acessível
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Secao label="Operação" hide={hide} />
        {ITENS.map((i) => (
          <NavItem key={i.chave} {...i} ativo={ativo === i.chave} hide={hide} center={center} />
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          type="button"
          className="h-nav"
          onClick={onToggle}
          style={{
            ...NAV_BASE,
            border: 0,
            background: 'transparent',
            color: 'var(--side-fg)',
            fontFamily: 'inherit',
            fontSize: '15px',
            cursor: 'pointer',
            transition: `background 160ms ${EASE}, color 160ms`,
            ...center,
          }}
        >
          <svg width="18" height="18" {...svgBase} stroke="currentColor" style={{ flex: '0 0 auto' }}>
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M9 3v18"></path>
            <path d={collapsed ? 'm14 9 3 3-3 3' : 'm16 15-3-3 3-3'}></path>
          </svg>
          <span style={{ whiteSpace: 'nowrap', ...hide }}>Recolher</span>
        </button>
        <div style={{ height: '1px', background: 'var(--side-line)', margin: '6px 8px' }}></div>
        <a
          href="#"
          className="h-nav"
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
          style={{
            ...NAV_BASE,
            color: 'var(--side-fg)',
            transition: `background 160ms ${EASE}, color 160ms`,
            ...center,
          }}
        >
          <Icone chave="sair" />
          <span style={{ whiteSpace: 'nowrap', ...hide }}>Sair</span>
        </a>
      </div>
    </aside>
  );
}
