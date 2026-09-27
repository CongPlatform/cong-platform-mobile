# Guia de Contribuição — CONG Mobile

[English version below](#contribution-guide--cong-mobile)

Obrigado pelo interesse em contribuir com o **CONG Mobile**, aplicativo móvel da plataforma **CONG — Construtor Operacional para ONGs**.

O CONG Mobile é um projeto open source em desenvolvimento. Este documento define o fluxo de contribuição para manter alterações revisáveis, seguras e coerentes com a arquitetura do aplicativo e sua integração com a API da CONG.

---

## Antes de contribuir

Antes de começar:

1. leia o `README.md`;
2. leia o `CODE_OF_CONDUCT.md`;
3. leia o `SECURITY.md`;
4. leia o `CONEXAO.md`;
5. verifique Issues abertas relacionadas ao que você pretende alterar;
6. para mudanças grandes, novas funcionalidades ou decisões que afetem a arquitetura do aplicativo, abra ou participe de uma Issue antes de implementar.

Correções pequenas, documentação e ajustes localizados normalmente podem seguir diretamente para um Pull Request.

---

## Formas de contribuir

Contribuições são bem-vindas em áreas como:

- código;
- correções de bugs;
- testes e validações;
- documentação;
- acessibilidade;
- interface e experiência do usuário;
- traduções;
- melhorias de integração com a API;
- melhorias de navegação;
- melhorias de desempenho;
- melhorias de segurança;
- manutenção e atualização de dependências.

---

## Ambiente de desenvolvimento

Contribuidores externos devem trabalhar em seus próprios ambientes.

Você **não precisa e não deve ter acesso** a:

- banco de produção da CONG;
- projeto Supabase de produção;
- infraestrutura de produção da API;
- segredos de deploy;
- chaves privadas;
- tokens ou credenciais de mantenedores.

O aplicativo mobile se comunica com a infraestrutura da CONG por meio da API. O aplicativo **não deve acessar diretamente o PostgreSQL ou utilizar credenciais privadas do Supabase**.

Para desenvolvimento, utilize uma API de desenvolvimento ou outro ambiente indicado pelos mantenedores.

Nunca utilize dados pessoais ou dados reais de organizações em testes.

---

## Fluxo recomendado

```text
Fork
 ↓
Branch
 ↓
Alterações
 ↓
Validação local
 ↓
Commit
 ↓
Push para o fork
 ↓
Pull Request
 ↓
Revisão
 ↓
Merge
```

### 1. Faça um fork

Crie um fork do repositório oficial do CONG Mobile em sua conta do GitHub.

### 2. Clone seu fork

```bash
git clone https://github.com/SEU-USUARIO/cong-platform-mobile.git
cd cong-platform-mobile
```

### 3. Adicione o repositório oficial como upstream

```bash
git remote add upstream https://github.com/CongPlatform/cong-platform-mobile.git
```

### 4. Atualize sua base

Salvo indicação diferente em uma Issue, novas contribuições devem partir da branch `main`.

```bash
git fetch upstream
git checkout main
git pull upstream main
```

### 5. Crie uma branch

Exemplos:

```text
feature/community-feed
feature/profile-edit
fix/login-validation
fix/navigation
docs/readme-update
docs/connection-guide
refactor/auth-flow
chore/update-expo
```

Evite trabalhar diretamente em `main`.

---

## Convenção de branches

Prefira prefixos descritivos:

```text
feature/   nova funcionalidade
fix/       correção de bug
docs/      documentação
refactor/  reorganização de código
test/      testes
chore/     manutenção e configuração
```

Use nomes curtos, em inglês e separados por hífen.

---

## Instalação

Instale as dependências:

```bash
npm ci
```

Crie seu arquivo de ambiente de desenvolvimento a partir do exemplo:

```text
.env.development.example
```

e configure:

```text
.env.development
```

A variável utilizada pelo aplicativo é:

```text
EXPO_PUBLIC_API_URL=https://seu-dominio-de-desenvolvimento
```

O valor deve apontar para a origem da API, sem o sufixo `/api`.

Consulte `CONEXAO.md` para entender como o aplicativo se conecta à API.

Nunca copie credenciais reais da infraestrutura oficial da CONG.

---

## Variáveis de ambiente e segurança

Variáveis com o prefixo `EXPO_PUBLIC_` ficam disponíveis no aplicativo e **não devem conter segredos**.

Não coloque no projeto mobile:

```text
DATABASE_URL
SUPABASE_SECRET_KEY
```

ou qualquer outra credencial privada.

O aplicativo mobile não deve receber credenciais necessárias para acessar diretamente o banco de dados ou serviços administrativos do Supabase.

Nunca envie para o repositório:

- arquivos `.env` reais;
- senhas;
- tokens;
- chaves privadas;
- credenciais de serviços;
- connection strings privadas;
- informações internas de infraestrutura.

---

## Conexão com a API

O CONG Mobile utiliza a mesma API utilizada pelo ecossistema da CONG.

O fluxo esperado é:

```text
CONG Mobile
     ↓
HTTPS
     ↓
CONG API
     ↓
Serviços e regras de negócio
     ↓
Supabase / PostgreSQL
```

O aplicativo mobile não deve implementar uma conexão direta com o banco de dados.

Alterações relacionadas à comunicação com a API devem respeitar o padrão existente no projeto e ser avaliadas considerando também o contrato utilizado pelo backend.

Consulte `CONEXAO.md` antes de modificar a configuração ou o fluxo de conexão.

---

## Padrão de código

Ao alterar o projeto:

- preserve a tipagem TypeScript;
- evite `any` sem justificativa;
- reutilize componentes, hooks e serviços existentes quando fizer sentido;
- preserve a separação entre interface, lógica e comunicação com a API;
- mantenha as regras de autenticação e persistência de acordo com os padrões existentes;
- não coloque segredos no aplicativo;
- respeite a estrutura de diretórios e assets existente;
- mantenha alterações pequenas e focadas;
- atualize a documentação quando o comportamento público do aplicativo mudar.

---

## Assets e identidade visual

Os assets utilizados pelo aplicativo estão organizados no diretório:

```text
assets/
```

Antes de modificar ou reutilizar elementos visuais, consulte a documentação de identidade e direitos de mídia disponível no repositório, quando aplicável.

A presença de logos, mascotes ou fotografias em um repositório público **não significa que estejam licenciados sob a MIT License**.

Alterações de identidade visual destinadas ao projeto oficial podem ser propostas por Pull Request, mas a licença do código não concede direito geral de reutilização da marca CONG.

---

## Commits

Use mensagens objetivas.

Exemplos:

```text
feat: add profile editing
fix: correct login navigation
docs: update mobile setup guide
style: adjust community layout
refactor: simplify auth flow
test: add authentication validation
chore: update Expo configuration
```

Tipos recomendados:

```text
feat:     nova funcionalidade
fix:      correção de erro
docs:     documentação
style:    ajustes visuais ou formatação
refactor: reorganização sem alterar comportamento esperado
test:     testes
chore:    configuração e manutenção
```

Não é necessário colocar muitas mudanças independentes no mesmo commit.

---

## Validação local

Antes de abrir um Pull Request, execute:

```bash
npm run lint
```

Se sua alteração envolver comportamento específico, faça também os testes manuais relevantes no ambiente de desenvolvimento.

Dependendo da alteração, valide pelo menos:

- inicialização do Expo;
- navegação afetada;
- autenticação, quando aplicável;
- comunicação com a API, quando aplicável;
- comportamento em telas afetadas;
- comportamento responsivo nas plataformas envolvidas.

O repositório atualmente não possui um script `build` no `package.json`. Portanto, não inclua `npm run build` como etapa obrigatória de validação sem que esse script seja adicionado ao projeto.

Não envie um Pull Request sabendo que a aplicação não inicia ou que a alteração introduziu erros conhecidos, a menos que o próprio propósito da contribuição seja investigar uma falha e isso esteja claramente explicado.

---

## Pull Requests

Ao abrir um Pull Request:

- explique o que mudou;
- explique por que a alteração foi necessária;
- informe quais partes do aplicativo foram afetadas;
- descreva como você validou a mudança;
- inclua screenshots quando houver alteração visual relevante;
- relacione a Issue correspondente quando existir;
- destaque mudanças de configuração ou alterações que exijam atualização da API;
- mantenha o PR focado em um objetivo principal.

Um Pull Request pode receber solicitações de alteração antes de ser aceito.

A abertura de um Pull Request não garante merge automático.

---

## Novas funcionalidades e alterações grandes

Antes de implementar uma nova funcionalidade, mudança estrutural ampla ou alteração significativa na arquitetura do aplicativo, abra uma Issue.

Explique:

- qual problema será resolvido;
- quem será beneficiado;
- comportamento esperado;
- impacto na arquitetura do aplicativo;
- possíveis dependências;
- impacto na integração com a API;
- riscos de segurança ou privacidade;
- alternativas consideradas.

Isso evita retrabalho e ajuda a manter o aplicativo consistente com a plataforma CONG.

---

## Segurança

Vulnerabilidades sensíveis não devem ser publicadas em Issues, Discussions ou Pull Requests.

Consulte `SECURITY.md`.

Se você encontrar uma possível vulnerabilidade, utilize o mecanismo privado indicado pela política de segurança.

Não faça testes destrutivos ou não autorizados contra a API ou qualquer infraestrutura de produção.

---

## Privacidade e dados

Não utilize em código, testes, screenshots ou documentação:

- dados reais de beneficiários;
- dados reais de voluntários sem autorização;
- documentos pessoais;
- tokens;
- senhas;
- dados internos de organizações;
- informações privadas de usuários.

Use dados fictícios em exemplos e testes.

---

## Código de Conduta

Toda participação na comunidade do CONG Mobile está sujeita ao `CODE_OF_CONDUCT.md`.

Discussões técnicas podem envolver discordância, mas devem permanecer respeitosas e construtivas.

---

## Revisão e manutenção

Os mantenedores podem:

- solicitar alterações;
- pedir divisão de um Pull Request muito grande;
- fechar propostas duplicadas;
- rejeitar alterações incompatíveis com a direção do projeto;
- editar títulos, labels ou metadados de Issues e Pull Requests;
- solicitar documentação adicional;
- adiar funcionalidades que ainda não façam parte das prioridades do projeto.

Essas decisões devem buscar preservar segurança, manutenção, consistência arquitetural e integração adequada com a plataforma CONG.

---

## Dúvidas

Se você não tiver certeza de como implementar uma contribuição, abra uma Issue ou participe de uma discussão existente antes de investir em uma alteração grande.

Contribuições pequenas e bem explicadas são preferíveis a grandes mudanças difíceis de revisar.

---

# Contribution Guide — CONG Mobile

[Versão em português acima](#guia-de-contribuição--cong-mobile)

Thank you for your interest in contributing to **CONG Mobile**, the mobile application of **CONG — Operational Builder for NGOs**.

CONG Mobile is an open-source project under active development. This document defines the contribution workflow used to keep changes reviewable, secure, and consistent with the application's architecture and integration with the CONG API.

---

## Before contributing

Before you start:

1. read `README.md`;
2. read `CODE_OF_CONDUCT.md`;
3. read `SECURITY.md`;
4. read `CONEXAO.md`;
5. check existing Issues related to your intended change;
6. for large changes, new features, or decisions affecting the application's architecture, open or join an Issue before implementation.

Small fixes, documentation changes, and localized improvements can normally proceed directly to a Pull Request.

---

## Ways to contribute

Contributions are welcome in areas such as:

- code;
- bug fixes;
- tests and validation;
- documentation;
- accessibility;
- interface and user experience;
- translations;
- API integration improvements;
- navigation improvements;
- performance improvements;
- security improvements;
- dependency maintenance.

---

## Development environment

External contributors should work in their own environments.

You **do not need and should not receive access** to:

- CONG production databases;
- production Supabase projects;
- production API infrastructure;
- deployment secrets;
- private keys;
- maintainer tokens or credentials.

The mobile application communicates with CONG infrastructure through the API. The application **must not directly access PostgreSQL or use private Supabase credentials**.

For development, use a development API or another environment indicated by the maintainers.

Never use personal data or real organization data in tests.

---

## Recommended workflow

```text
Fork
 ↓
Branch
 ↓
Changes
 ↓
Local validation
 ↓
Commit
 ↓
Push to fork
 ↓
Pull Request
 ↓
Review
 ↓
Merge
```

### 1. Fork the repository

Create a fork of the official CONG Mobile repository in your GitHub account.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR-USERNAME/cong-platform-mobile.git
cd cong-platform-mobile
```

### 3. Add the official repository as upstream

```bash
git remote add upstream https://github.com/CongPlatform/cong-platform-mobile.git
```

### 4. Update your base branch

Unless an Issue states otherwise, new contributions should start from `main`.

```bash
git fetch upstream
git checkout main
git pull upstream main
```

### 5. Create a branch

Examples:

```text
feature/community-feed
feature/profile-edit
fix/login-validation
fix/navigation
docs/readme-update
docs/connection-guide
refactor/auth-flow
chore/update-expo
```

Avoid working directly on `main`.

---

## Branch naming

Prefer descriptive prefixes:

```text
feature/   new functionality
fix/       bug fix
docs/      documentation
refactor/  code reorganization
test/      tests
chore/     maintenance and configuration
```

Use short English names separated by hyphens.

---

## Installation

Install dependencies:

```bash
npm ci
```

Create your development environment file from:

```text
.env.development.example
```

and configure:

```text
.env.development
```

The variable used by the application is:

```text
EXPO_PUBLIC_API_URL=https://your-development-domain
```

The value must point to the API origin without the `/api` suffix.

See `CONEXAO.md` for details about how the application connects to the API.

Never copy real credentials from CONG's official infrastructure.

---

## Environment variables and security

Variables with the `EXPO_PUBLIC_` prefix are available to the application and **must not contain secrets**.

Do not place the following in the mobile project:

```text
DATABASE_URL
SUPABASE_SECRET_KEY
```

or any other private credential.

The mobile application must not receive credentials required to directly access the database or administrative Supabase services.

Never commit:

- real `.env` files;
- passwords;
- tokens;
- private keys;
- service credentials;
- private connection strings;
- internal infrastructure information.

---

## API connection

CONG Mobile uses the same API as the CONG ecosystem.

The expected flow is:

```text
CONG Mobile
     ↓
HTTPS
     ↓
CONG API
     ↓
Services and business rules
     ↓
Supabase / PostgreSQL
```

The mobile application must not establish a direct database connection.

Changes related to API communication must follow the existing project patterns and be evaluated considering the contract used by the backend.

Read `CONEXAO.md` before modifying the connection configuration or flow.

---

## Code standards

When changing the project:

- preserve TypeScript typing;
- avoid `any` without justification;
- reuse existing components, hooks, and services when appropriate;
- preserve separation between interface, logic, and API communication;
- keep authentication and persistence logic consistent with existing project patterns;
- never expose secrets in the application;
- respect the existing directory and asset structure;
- keep changes focused;
- update documentation when public application behavior changes.

---

## Assets and visual identity

Application assets are organized in:

```text
assets/
```

Before modifying or reusing visual elements, read the identity and media-rights documentation available in the repository, when applicable.

The presence of logos, mascots, or photographs in a public repository **does not mean that they are licensed under the MIT License**.

Brand changes intended for the official project may be proposed through Pull Requests, but the software license does not grant general rights to reuse the CONG brand.

---

## Commits

Use clear commit messages.

Examples:

```text
feat: add profile editing
fix: correct login navigation
docs: update mobile setup guide
style: adjust community layout
refactor: simplify auth flow
test: add authentication validation
chore: update Expo configuration
```

Recommended types:

```text
feat:     new feature
fix:      bug fix
docs:     documentation
style:    visual or formatting changes
refactor: code reorganization without changing expected behavior
test:     tests
chore:    configuration and maintenance
```

Avoid grouping many unrelated changes into the same commit.

---

## Local validation

Before opening a Pull Request, run:

```bash
npm run lint
```

Also perform relevant manual checks in the development environment when your change affects user-facing behavior.

Depending on the change, validate at least:

- Expo startup;
- affected navigation;
- authentication, when applicable;
- API communication, when applicable;
- affected screens;
- responsive behavior on the relevant platforms.

The repository currently does not define a `build` script in `package.json`. Therefore, `npm run build` is not a required validation step unless such a script is added to the project.

Do not knowingly submit a Pull Request when the application does not start or the change introduces known errors, unless the contribution is specifically intended to investigate such a failure and that is clearly explained.

---

## Pull Requests

When opening a Pull Request:

- explain what changed;
- explain why the change was needed;
- identify affected parts of the application;
- describe how you validated the change;
- include screenshots for relevant visual changes;
- link the related Issue when one exists;
- highlight configuration changes or changes requiring API updates;
- keep the PR focused on one main objective.

A Pull Request may receive requested changes before acceptance.

Opening a Pull Request does not guarantee that it will be merged.

---

## New features and large changes

Before implementing a new feature, broad structural change, or significant architectural change, open an Issue.

Explain:

- the problem being solved;
- who benefits;
- expected behavior;
- architectural impact;
- dependencies;
- impact on API integration;
- security or privacy risks;
- alternatives considered.

This reduces rework and helps keep the application consistent with the CONG platform.

---

## Security

Sensitive vulnerabilities must not be disclosed in public Issues, Discussions, or Pull Requests.

See `SECURITY.md`.

If you find a potential vulnerability, use the private reporting mechanism described in the security policy.

Do not perform destructive or unauthorized testing against the API or any production infrastructure.

---

## Privacy and data

Do not include in code, tests, screenshots, or documentation:

- real beneficiary data;
- real volunteer data without authorization;
- personal documents;
- tokens;
- passwords;
- internal organization data;
- private user information.

Use fictional data in examples and tests.

---

## Code of Conduct

All participation in the CONG Mobile community is governed by `CODE_OF_CONDUCT.md`.

Technical discussions may involve disagreement, but they must remain respectful and constructive.

---

## Review and maintenance

Maintainers may:

- request changes;
- ask for a very large Pull Request to be split;
- close duplicate proposals;
- reject changes that conflict with the project's direction;
- edit Issue or Pull Request titles, labels, or metadata;
- request additional documentation;
- postpone features that are not currently part of project priorities.

These decisions should aim to preserve security, maintainability, architectural consistency, and proper integration with the CONG platform.

---

## Questions

If you are unsure how to approach a contribution, open an Issue or join an existing discussion before investing in a large implementation.

Small, focused, well-explained contributions are preferred over large changes that are difficult to review.
