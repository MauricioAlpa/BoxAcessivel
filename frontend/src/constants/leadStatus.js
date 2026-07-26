export const STATUSES = [
  '1. Novo Lead',
  '2. Em Contato',
  '3. Proposta Enviada',
  '4. Negociando',
  '5. Fechado',
];

export function corDoStatus(status) {
  const cores = {
    '1. Novo Lead': 'var(--status-novo)',
    '2. Em Contato': 'var(--status-contato)',
    '3. Proposta Enviada': 'var(--status-proposta)',
    '4. Negociando': 'var(--status-negociando)',
    '5. Fechado': 'var(--status-fechado)',
  };
  return cores[status] ?? 'var(--color-text-muted)';
}