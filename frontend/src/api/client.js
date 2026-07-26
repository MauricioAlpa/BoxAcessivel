const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.erro || 'Erro inesperado, tenta de novo');
  }

  return data;
}

export const api = {
  login: (email, senha) => request('/auth/login', { method: 'POST', body: { email, senha } }),
  criarLead: (lead) => request('/leads', { method: 'POST', body: lead }),
  registrarVisita: () => request('/visitas', { method: 'POST', body: {} }),
  conversao: (token) => request('/metrics/conversao', { token }),
  listarLeads: (token) => request('/leads', { token }),
  atualizarStatusLead: (id, status, token) =>
    request(`/leads/${id}/status`, { method: 'PATCH', body: { status }, token }),
};