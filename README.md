# Box Acessível - Landing Page e Painel de Gestão de Leads

## 📋 Sobre o Projeto

O **Box Acessível** é uma aplicação web desenvolvida para otimizar o processo de captação e gerenciamento de leads da empresa.

O sistema é dividido em três módulos principais:

* **Landing Page Pública** para captação de clientes.
* **API REST** responsável pelas regras de negócio e comunicação com o banco de dados.
* **Dashboard Administrativo** para acompanhamento de métricas e gerenciamento do funil de vendas.

O principal objetivo é aumentar a taxa de conversão de visitantes em clientes potenciais, fornecendo métricas em tempo real e controle completo do funil comercial.

---

# Arquitetura

```
Visitante
     │
     ▼
Landing Page
     │
 Formulário
     │
     ▼
API REST
     │
     ▼
Banco de Dados
     │
     ▼
Dashboard Administrativo
```

---

# Funcionalidades

## Landing Page

* Página responsiva
* Captura de Nome, E-mail e Telefone
* Validação dos dados
* Conteúdo liberado apenas após cadastro
* Registro automático de visitas
* Botão para atendimento via WhatsApp

---

## API

Responsável por:

* Cadastro de Leads
* Registro de visitas
* Controle do funil de vendas
* Autenticação
* Comunicação com o banco de dados
* Fornecimento das métricas para o Dashboard

---

## Dashboard

Permite ao administrador:

* Visualizar total de visitantes
* Visualizar quantidade de leads
* Calcular taxa de conversão
* Filtrar leads
* Alterar status do funil
* Visualizar gráficos de desempenho

---

# Fluxo da Aplicação

```
Visitante acessa a Landing Page
            │
            ▼
Preenche Nome, Email e Telefone
            │
            ▼
Dados validados
            │
            ▼
Lead salvo no Banco
            │
            ▼
Conteúdo liberado
            │
            ▼
Administrador acompanha no Dashboard
```

---

# Regras de Negócio

* O conteúdo da Landing Page permanece bloqueado até o cadastro do visitante.
* Não é permitido cadastrar dois leads com o mesmo e-mail.
* Todo novo lead inicia na etapa **Novo Lead**.
* Apenas administradores autenticados podem acessar o Dashboard.
* O administrador pode alterar manualmente qualquer etapa do funil.

---

# Tecnologias

## Front-end

* React
* CSS
* HTML
* Framer Motion

## Back-end

* Node.js
* Express

## Banco de Dados

* PostgreSQL

## Autenticação

* JWT
* NextAuth

---

# Estrutura do Projeto

```
box-acessivel/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── styles/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   └── database/
│
├── docs/
│
└── README.md
```

---

# Instalação

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Entre na pasta:

```bash
cd box-acessivel
```

Instale as dependências do Front-end:

```bash
npm install
```

Instale as dependências do Back-end:

```bash
npm install
```

Configure o arquivo `.env` com as credenciais do banco de dados.

Execute o projeto:

```bash
npm run dev
```

---

# Funcionalidades Futuras

* Integração com Google Analytics
* Integração com CRM
* Exportação de Leads para Excel
* Dashboard com indicadores avançados
* Histórico de alterações dos Leads

---

# Objetivos do Sistema

* Aumentar a conversão de visitantes em leads.
* Melhorar o acompanhamento do funil de vendas.
* Disponibilizar métricas em tempo real.
* Centralizar o gerenciamento dos contatos comerciais.

---

# Licença

Este projeto foi desenvolvido para fins acadêmicos e demonstração de conhecimentos em desenvolvimento web.
