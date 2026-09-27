# Política de Segurança — CONG Mobile

[English version below](#security-policy--cong-mobile)

A segurança do **CONG Mobile** é uma prioridade. O aplicativo faz parte da plataforma **CONG — Construtor Operacional para ONGs** e se comunica com os serviços da plataforma por meio da API oficial.

Este documento explica como reportar vulnerabilidades de segurança encontradas no aplicativo.

## Reportando uma vulnerabilidade

**Não publique vulnerabilidades de segurança em Issues, Discussions ou Pull Requests públicos.**

Para reportar uma vulnerabilidade de forma privada:

1. acesse a página principal do repositório do CONG Mobile no GitHub;
2. abra a aba **Security and quality**. Caso ela não esteja visível, procure-a no menu de abas adicionais;
3. na barra lateral, localize a seção **Reporting**;
4. clique em **Advisories**;
5. selecione **Report a vulnerability**;
6. descreva a vulnerabilidade e forneça as informações necessárias;
7. envie o relatório.

Esse mecanismo permite que o relatório seja enviado de forma privada aos responsáveis pelo projeto.

Sempre que possível, inclua:

* descrição do problema;
* passos para reproduzir a vulnerabilidade;
* versão ou commit afetado;
* plataforma afetada, como Android, iOS ou Web;
* comportamento esperado e comportamento observado;
* impacto potencial;
* screenshots ou evidências relevantes, quando apropriado;
* uma possível correção ou sugestão de mitigação, se disponível.

Não inclua informações pessoais desnecessárias, credenciais reais ou segredos no relatório.

## Escopo

Relatos podem envolver, entre outros:

* autenticação e gerenciamento de sessão;
* armazenamento local de informações sensíveis;
* exposição indevida de dados no aplicativo;
* comunicação insegura com a API;
* validação inadequada de dados recebidos pela API;
* exposição de informações sensíveis em logs;
* configuração insegura do aplicativo;
* permissões inadequadas;
* vulnerabilidades específicas de Android, iOS ou Web;
* dependências vulneráveis utilizadas pelo aplicativo.

## Arquitetura e credenciais

O CONG Mobile se comunica com a plataforma por meio da API da CONG.

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

O aplicativo mobile **não deve acessar diretamente o PostgreSQL ou utilizar credenciais privadas do Supabase**.

Variáveis com o prefixo `EXPO_PUBLIC_` são disponibilizadas no aplicativo e, portanto, **não devem conter segredos**.

Credenciais como:

```text
DATABASE_URL
SUPABASE_SECRET_KEY
```

não devem ser incluídas no aplicativo mobile.

A identificação de uma variável pública, seu nome ou sua existência no projeto não deve ser tratada como um segredo. O que deve permanecer protegido são seus valores confidenciais, quando houver.

## Dados e privacidade

Não inclua em Issues, Pull Requests ou relatórios públicos:

* dados pessoais de usuários;
* dados de beneficiários;
* dados de voluntários;
* documentos pessoais;
* tokens;
* senhas;
* chaves privadas;
* credenciais;
* informações internas de organizações.

Ao reproduzir uma vulnerabilidade, utilize dados fictícios sempre que possível.

## Dependências

O projeto utiliza dependências de terceiros, incluindo componentes do ecossistema Expo e React Native.

Vulnerabilidades identificadas em dependências utilizadas pelo CONG Mobile também podem ser reportadas pelo mecanismo privado descrito neste documento.

Sempre que possível, informe:

* nome da dependência;
* versão afetada;
* versão na qual o problema foi corrigido, caso conhecida;
* referência pública da vulnerabilidade, quando existir.

## Desenvolvimento e produção

Contribuidores externos devem utilizar seus próprios ambientes de desenvolvimento.

A infraestrutura de produção da CONG não deve ser utilizada para testes de segurança, exploração de vulnerabilidades ou experimentos não autorizados.

Não realize:

* testes destrutivos;
* tentativas de acesso não autorizado;
* exploração de contas de terceiros;
* testes de carga não autorizados;
* alterações em dados reais;
* qualquer atividade que possa prejudicar usuários ou serviços da CONG.

## Divulgação

Após o recebimento de um relatório, os responsáveis pelo projeto poderão investigar o problema, solicitar informações adicionais, desenvolver uma correção e definir a forma adequada de divulgação.

Não divulgue publicamente detalhes técnicos de uma vulnerabilidade antes que os responsáveis pelo projeto tenham tido oportunidade razoável de analisá-la e corrigi-la.

## Contato

O mecanismo preferencial para reportar vulnerabilidades é o sistema privado de **Security Advisories** do GitHub descrito neste documento.

Caso esse mecanismo esteja temporariamente indisponível, não publique os detalhes técnicos da vulnerabilidade. Solicite aos responsáveis pelo projeto um canal privado de contato por meio de um Issue sem informações sensíveis.

---

# Security Policy — CONG Mobile

[Versão em português acima](#política-de-segurança--cong-mobile)

Security is a priority for **CONG Mobile**. The application is part of the **CONG — Operational Builder for NGOs** platform and communicates with the platform's services through the official API.

This document explains how to report security vulnerabilities found in the application.

## Reporting a vulnerability

**Do not disclose security vulnerabilities through public Issues, Discussions, or Pull Requests.**

To report a vulnerability privately:

1. go to the CONG Mobile repository's main page on GitHub;
2. open the **Security and quality** tab. If it is not visible, look for it in the additional tabs menu;
3. in the sidebar, find the **Reporting** section;
4. click **Advisories**;
5. select **Report a vulnerability**;
6. describe the vulnerability and provide the necessary information;
7. submit the report.

This mechanism allows the report to be sent privately to the project maintainers.

Whenever possible, include:

* description of the issue;
* steps to reproduce the vulnerability;
* affected version or commit;
* affected platform, such as Android, iOS, or Web;
* expected and observed behavior;
* potential impact;
* relevant screenshots or evidence, when appropriate;
* a possible fix or mitigation suggestion, if available.

Do not include unnecessary personal information, real credentials, or secrets in the report.

## Scope

Reports may involve, among other things:

* authentication and session management;
* local storage of sensitive information;
* improper data exposure in the application;
* insecure communication with the API;
* improper validation of data received from the API;
* exposure of sensitive information in logs;
* insecure application configuration;
* inappropriate permissions;
* Android, iOS, or Web-specific vulnerabilities;
* vulnerable dependencies used by the application.

## Architecture and credentials

CONG Mobile communicates with the platform through the CONG API.

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

The mobile application **must not directly access PostgreSQL or use private Supabase credentials**.

Variables with the `EXPO_PUBLIC_` prefix are exposed to the application and therefore **must not contain secrets**.

Credentials such as:

```text
DATABASE_URL
SUPABASE_SECRET_KEY
```

must not be included in the mobile application.

The identification of a public variable, its name, or its existence in the project should not be treated as a secret. What must remain protected are its confidential values, when applicable.

## Data and privacy

Do not include in public Issues, Pull Requests, or reports:

* user personal data;
* beneficiary data;
* volunteer data;
* personal documents;
* tokens;
* passwords;
* private keys;
* credentials;
* internal organization information.

When reproducing a vulnerability, use fictional data whenever possible.

## Dependencies

The project uses third-party dependencies, including components from the Expo and React Native ecosystems.

Vulnerabilities identified in dependencies used by CONG Mobile may also be reported through the private mechanism described in this document.

Whenever possible, include:

* dependency name;
* affected version;
* version in which the issue was fixed, if known;
* public vulnerability reference, if available.

## Development and production

External contributors should use their own development environments.

CONG production infrastructure must not be used for security testing, vulnerability exploitation, or unauthorized experiments.

Do not perform:

* destructive testing;
* unauthorized access attempts;
* exploitation of third-party accounts;
* unauthorized load testing;
* modifications to real data;
* any activity that could harm CONG users or services.

## Disclosure

After receiving a report, project maintainers may investigate the issue, request additional information, develop a fix, and determine an appropriate disclosure process.

Do not publicly disclose technical details of a vulnerability before the project maintainers have had a reasonable opportunity to investigate and address it.

## Contact

The preferred mechanism for reporting vulnerabilities is GitHub's private **Security Advisories** system described in this document.

If this mechanism is temporarily unavailable, do not publish technical details about the vulnerability. Ask the project maintainers for a private communication channel through an Issue without sensitive information.
