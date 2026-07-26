import { useState } from 'react';
import { api } from '../../api/client';
import './LeadForm.css';

function formatarTelefone(valor) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

export function LeadForm({ onSucesso }) {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [aceite, setAceite] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  function handleChange(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (!aceite) {
      setErro('Você precisa concordar com o uso dos dados conforme a LGPD.');
      return;
    }

    setEnviando(true);
    try {
      await api.criarLead({
        nome: form.nome,
        email: form.email,
        telefone: form.telefone.replace(/\D/g, ''),
        consentimento: 'true',
      });
      sessionStorage.setItem('box_lead_convertido', 'true');
      onSucesso();
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <h2>Preencha para ver depoimentos de uso e mais informações</h2>

      <label htmlFor="nome">Nome Completo *</label>
      <input
        id="nome"
        type="text"
        placeholder="Ex: João da Silva"
        value={form.nome}
        onChange={(e) => handleChange('nome', e.target.value)}
        required
      />

      <label htmlFor="email">E-mail *</label>
      <input
        id="email"
        type="email"
        placeholder="Ex: joao@empresa.com"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        required
      />

      <label htmlFor="telefone">Telefone / WhatsApp *</label>
      <input
        id="telefone"
        type="tel"
        placeholder="(00) 00000-0000"
        value={form.telefone}
        onChange={(e) => handleChange('telefone', formatarTelefone(e.target.value))}
        required
      />

      <label className="lead-form__checkbox">
        <input
          type="checkbox"
          checked={aceite}
          onChange={(e) => setAceite(e.target.checked)}
        />
        Concordo com o uso dos meus dados conforme a LGPD. Suas informações são
        protegidas e não serão compartilhadas.
      </label>

      {erro && <p className="lead-form__erro" role="alert">{erro}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar Respostas'}
      </button>
    </form>
  );
}