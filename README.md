# CONG — Construtor Operacional para ONGs

[English version](https://github.com/CongPlatform/cong-platform-mobile/blob/main/README.en.md)

O **CONG Mobile** é o aplicativo móvel da plataforma **CONG — Construtor Operacional para ONGs**, desenvolvido para permitir o acesso à plataforma por dispositivos móveis.

O aplicativo é construído com **Expo, React Native e TypeScript** e utiliza a mesma API do CONG Web. A comunicação com autenticação e dados é intermediada pela API Express, mantendo o aplicativo separado do banco de dados e das credenciais privadas do servidor.

> O CONG Mobile ainda está em desenvolvimento ativo e não possui uma versão estável 1.0.

---

## Índice

- [Status do projeto](https://github.com/CongPlatform/cong-platform-mobile#status-do-projeto)
- [Arquitetura](https://github.com/CongPlatform/cong-platform-mobile#arquitetura)
- [Tecnologias](https://github.com/CongPlatform/cong-platform-mobile#tecnologias)
- [Estrutura do repositório](https://github.com/CongPlatform/cong-platform-mobile#estrutura-do-repositório)
- [Executando o projeto](https://github.com/CongPlatform/cong-platform-mobile#executando-o-projeto)
- [Variáveis de ambiente](https://github.com/CongPlatform/cong-platform-mobile#variáveis-de-ambiente)
- [Conexão com a API](https://github.com/CongPlatform/cong-platform-mobile#conexão-com-a-api)
- [Desenvolvimento](https://github.com/CongPlatform/cong-platform-mobile#desenvolvimento)
- [Validação antes de contribuir](https://github.com/CongPlatform/cong-platform-mobile#validação-antes-de-contribuir)
- [Contribuindo](https://github.com/CongPlatform/cong-platform-mobile#contribuindo)
- [Segurança](https://github.com/CongPlatform/cong-platform-mobile#segurança)
- [Licenciamento](https://github.com/CongPlatform/cong-platform-mobile#licenciamento)
- [Código de Conduta](https://github.com/CongPlatform/cong-platform-mobile#código-de-conduta)
- [Equipe](https://github.com/CongPlatform/cong-platform-mobile#equipe)
- [Estado de desenvolvimento](https://github.com/CongPlatform/cong-platform-mobile#estado-de-desenvolvimento)

---

## Status do projeto

O CONG Mobile já possui uma base funcional em desenvolvimento, incluindo:

- aplicativo construído com Expo, React Native e TypeScript;
- navegação com Expo Router;
- integração com a API Express do CONG;
- autenticação integrada à infraestrutura do CONG;
- armazenamento seguro de informações no dispositivo por meio do Expo Secure Store;
- configuração para Android, iOS e Web por meio do Expo;
- integração com recursos e módulos do ecossistema Expo;
- configuração para autenticação com Google.

O aplicativo continua em desenvolvimento e evolui em conjunto com a API e o CONG Web.

As versões e dependências utilizadas estão definidas no [`package.json`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/package.json).

---

## Arquitetura

O aplicativo funciona como um cliente da API do CONG. Ele não realiza conexão direta com o PostgreSQL.

```text
                     CONG Mobile
                 Expo + React Native
                         │
                         │ HTTPS
                         ▼
                  CONG API /api/*
                Node.js + TypeScript
                      + Express
                         │
                         ├──────────► Supabase Auth
                         │
                         ▼
                   PostgreSQL
                  / Supabase
```

A API Express recebe as requisições do aplicativo, participa do fluxo de autenticação e acessa o PostgreSQL do projeto Supabase utilizado pela plataforma. O Mobile recebe apenas a configuração necessária para localizar a API pública.

O aplicativo não deve receber `DATABASE_URL` ou `SUPABASE_SECRET_KEY`.

---

## Tecnologias

### Aplicativo

- Expo
- React Native
- TypeScript
- Expo Router
- React Native Paper
- React Native Reanimated
- React Native Gesture Handler
- React Native SVG

### Recursos utilizados

- Expo Secure Store
- Expo File System
- Expo Font
- Expo Image
- Expo Linking
- Expo Web Browser
- Expo Splash Screen
- Expo Status Bar
- Expo System UI

### Integrações

- API Express do CONG
- Supabase Auth, por meio da API
- Google Sign-In

As versões exatas das dependências estão disponíveis no [`package.json`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/package.json).

---

## Estrutura do repositório

```text
cong-platform-mobile/
├── assets/                  # Recursos visuais do aplicativo
├── scripts/                 # Scripts auxiliares
├── src/                     # Código-fonte do aplicativo
├── .env.development.example # Exemplo de configuração de ambiente
├── app.json                 # Configuração do Expo
├── package.json              # Dependências e scripts
├── tsconfig.json             # Configuração do TypeScript
├── CONEXAO.md                # Configuração da conexão com a API
├── CONTRIBUTING.md           # Guia de contribuição
├── CODE_OF_CONDUCT.md        # Código de Conduta
├── LICENSE                   # Licença do projeto
└── README.md                 # Documentação principal
```

---

## Executando o projeto

### Pré-requisitos

Você precisará de:

- Node.js;
- npm;
- Git;
- Expo;
- um dispositivo Android/iOS ou um ambiente compatível para execução.

Para testes em dispositivo físico, o dispositivo também precisa conseguir alcançar a API configurada.

### 1. Clone o repositório

```bash
git clone https://github.com/CongPlatform/cong-platform-mobile.git
cd cong-platform-mobile
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

Crie `.env.development` a partir de `.env.development.example` e configure a URL da API.

### 4. Inicie o projeto

```bash
npm start
```

Para limpar o cache:

```bash
npx expo start -c
```

Para iniciar diretamente em uma plataforma:

```bash
npm run android
npm run ios
npm run web
```

Os scripts disponíveis estão definidos no [`package.json`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/package.json).

---

## Variáveis de ambiente

O aplicativo utiliza `EXPO_PUBLIC_API_URL` para definir a origem da API utilizada durante o desenvolvimento.

Exemplo:

```env
EXPO_PUBLIC_API_URL=https://seu-dominio-hospedado
```

A URL deve conter a **origem da API, sem `/api` ao final**. O cliente acrescenta `/api` às requisições realizadas pelo aplicativo.

Variáveis com prefixo `EXPO_PUBLIC_` fazem parte do cliente e não devem conter segredos.

Não coloque no aplicativo:

```env
DATABASE_URL=...
SUPABASE_SECRET_KEY=...
```

Essas credenciais pertencem ao ambiente do servidor e não são necessárias para executar o cliente mobile.

---

## Conexão com a API

O Mobile utiliza a API Express do CONG para acessar os recursos da plataforma.

Durante o desenvolvimento, `EXPO_PUBLIC_API_URL` deve apontar para a origem pública do ambiente utilizado.

Para testes com a API hospedada, o fluxo de configuração está documentado em [`CONEXAO.md`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/CONEXAO.md).

Para testes utilizando uma API local em dispositivo físico, o computador que executa o backend precisa estar acessível pela rede ao dispositivo. O `CONEXAO.md` contém as orientações específicas para esse cenário.

---

## Desenvolvimento

Antes de alterar o projeto, crie uma branch a partir da branch de desenvolvimento.

Exemplos:

```text
feature/dashboard
feature/login-validation
fix/session
docs/readme-update
```

Evite trabalhar diretamente na branch `main`.

Para as demais regras de contribuição, consulte [`CONTRIBUTING.md`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/CONTRIBUTING.md).

---

## Validação antes de contribuir

Antes de abrir um Pull Request, execute:

```bash
npm run lint
```

Quando a alteração afetar um fluxo específico, também realize a validação manual correspondente.

Alterações envolvendo autenticação, sessão ou comunicação com a API devem ser verificadas no ambiente em que serão utilizadas.

---

## Contribuindo

Contribuições são bem-vindas em áreas como:

- código;
- correções de bugs;
- documentação;
- interface;
- acessibilidade;
- testes;
- integrações;
- traduções.

O fluxo recomendado é:

```text
Branch → Alterações → Validação local → Pull Request → Revisão → Merge
```

Consulte [`CONTRIBUTING.md`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/CONTRIBUTING.md) antes de contribuir.

---

## Segurança

O aplicativo não deve conter credenciais privadas da infraestrutura da CONG.

Em particular:

- não envie arquivos `.env` reais para o repositório;
- não coloque `DATABASE_URL` no cliente;
- não coloque `SUPABASE_SECRET_KEY` no cliente;
- não coloque segredos em variáveis `EXPO_PUBLIC_*`;
- não implemente acesso direto ao PostgreSQL no aplicativo.

Vulnerabilidades devem ser reportadas de acordo com a política de segurança do projeto.

---

## Licenciamento

O código-fonte deste repositório é distribuído sob a [MIT License](https://github.com/CongPlatform/cong-platform-mobile/blob/main/LICENSE).

A licença do código não implica autorização automática para reutilização de elementos de marca ou outros materiais que possuam regras próprias.

---

## Código de Conduta

A participação no projeto está sujeita ao [`CODE_OF_CONDUCT.md`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/CODE_OF_CONDUCT.md).

---

## Equipe

A CONG é desenvolvida inicialmente por:

- **André Mendes** — Desenvolvimento Mobile;
- **João Palumbo** — Documentação e Pesquisa;
- **Kelvin Palka** — Desenvolvimento Web.

O projeto surgiu como Trabalho de Conclusão de Curso do Ensino Médio Integrado ao Técnico em Desenvolvimento de Sistemas da ETEC de Hortolândia.

---

## Estado de desenvolvimento

O CONG Mobile está em desenvolvimento ativo.

A aplicação, suas interfaces, integrações e estrutura podem sofrer alterações conforme a plataforma CONG evolui.

O aplicativo acompanha o desenvolvimento do CONG Web e da API compartilhada pela plataforma.
