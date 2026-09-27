# CONG — Operational Builder for NGOs

[Versão em português](https://github.com/CongPlatform/cong-platform-mobile/blob/main/README.md)

**CONG Mobile** is the mobile application of the **CONG — Operational Builder for NGOs** platform, developed to provide access to the platform from mobile devices.

The application is built with **Expo, React Native, and TypeScript** and uses the same API as CONG Web. Authentication and data communication are handled through the Express API, keeping the application separate from the database and private server credentials.

> CONG Mobile is still under active development and does not have a stable 1.0 release.

---

## Table of Contents

* [Project status](https://github.com/CongPlatform/cong-platform-mobile#project-status)
* [Architecture](https://github.com/CongPlatform/cong-platform-mobile#architecture)
* [Technologies](https://github.com/CongPlatform/cong-platform-mobile#technologies)
* [Repository structure](https://github.com/CongPlatform/cong-platform-mobile#repository-structure)
* [Running the project](https://github.com/CongPlatform/cong-platform-mobile#running-the-project)
* [Environment variables](https://github.com/CongPlatform/cong-platform-mobile#environment-variables)
* [API connection](https://github.com/CongPlatform/cong-platform-mobile#api-connection)
* [Development](https://github.com/CongPlatform/cong-platform-mobile#development)
* [Validation before contributing](https://github.com/CongPlatform/cong-platform-mobile#validation-before-contributing)
* [Contributing](https://github.com/CongPlatform/cong-platform-mobile#contributing)
* [Security](https://github.com/CongPlatform/cong-platform-mobile#security)
* [Licensing](https://github.com/CongPlatform/cong-platform-mobile#licensing)
* [Code of Conduct](https://github.com/CongPlatform/cong-platform-mobile#code-of-conduct)
* [Team](https://github.com/CongPlatform/cong-platform-mobile#team)
* [Development status](https://github.com/CongPlatform/cong-platform-mobile#development-status)

---

## Project status

CONG Mobile already has a functional development base, including:

* an application built with Expo, React Native, and TypeScript;
* navigation with Expo Router;
* integration with the CONG Express API;
* authentication integrated with CONG infrastructure;
* secure on-device storage through Expo Secure Store;
* configuration for Android, iOS, and Web through Expo;
* integration with Expo ecosystem resources and modules;
* configuration for Google authentication.

The application is still under development and evolves together with the API and CONG Web.

The versions and dependencies currently used are defined in [`package.json`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/package.json).

---

## Architecture

The application works as a client of the CONG API. It does not connect directly to PostgreSQL.

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

The Express API receives requests from the application, participates in the authentication flow, and accesses the PostgreSQL database of the Supabase project used by the platform. The Mobile client only receives the configuration required to locate the public API.

The application must not receive `DATABASE_URL` or `SUPABASE_SECRET_KEY`.

---

## Technologies

### Application

* Expo
* React Native
* TypeScript
* Expo Router
* React Native Paper
* React Native Reanimated
* React Native Gesture Handler
* React Native SVG

### Resources in use

* Expo Secure Store
* Expo File System
* Expo Font
* Expo Image
* Expo Linking
* Expo Web Browser
* Expo Splash Screen
* Expo Status Bar
* Expo System UI

### Integrations

* CONG Express API
* Supabase Auth through the API
* Google Sign-In

The exact dependency versions are available in [`package.json`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/package.json).

---

## Repository structure

```text
cong-platform-mobile/
├── assets/                   # Application assets
├── scripts/                  # Auxiliary scripts
├── src/                     # Application source code
├── .env.development.example # Environment configuration example
├── app.json                 # Expo configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── CONEXAO.md               # API connection configuration
├── CONTRIBUTING.md          # Contribution guide
├── CODE_OF_CONDUCT.md       # Code of Conduct
├── LICENSE                  # Project license
└── README.md                # Main documentation
```

---

## Running the project

### Prerequisites

You will need:

* Node.js;
* npm;
* Git;
* Expo;
* an Android/iOS device or a compatible environment for running the application.

For physical-device testing, the device must also be able to reach the configured API.

### 1. Clone the repository

```bash
git clone https://github.com/CongPlatform/cong-platform-mobile.git
cd cong-platform-mobile
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Create `.env.development` from `.env.development.example` and configure the API URL.

### 4. Start the project

```bash
npm start
```

To clear the cache:

```bash
npx expo start -c
```

To start directly on a specific platform:

```bash
npm run android
npm run ios
npm run web
```

The available scripts are defined in [`package.json`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/package.json).

---

## Environment variables

The application uses `EXPO_PUBLIC_API_URL` to define the API origin used during development.

Example:

```env
EXPO_PUBLIC_API_URL=https://your-hosted-domain
```

The URL must contain the **API origin without `/api` at the end**. The client adds `/api` to the requests made by the application.

Variables with the `EXPO_PUBLIC_` prefix are part of the client and must not contain secrets.

Do not place the following in the application:

```env
DATABASE_URL=...
SUPABASE_SECRET_KEY=...
```

These credentials belong to the server environment and are not required to run the mobile client.

---

## API connection

The Mobile application uses the CONG Express API to access platform resources.

During development, `EXPO_PUBLIC_API_URL` must point to the origin of the environment being used.

For tests with the hosted API, the configuration flow is documented in [`CONEXAO.md`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/CONEXAO.md).

When testing with a local API on a physical device, the computer running the backend must be reachable from the device over the network. `CONEXAO.md` contains the specific instructions for this scenario.

---

## Development

Before changing the project, create a branch from the development branch.

Examples:

```text
feature/dashboard
feature/login-validation
fix/session
docs/readme-update
```

Avoid working directly on the `main` branch.

For the remaining contribution rules, see [`CONTRIBUTING.md`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/CONTRIBUTING.md).

---

## Validation before contributing

Before opening a Pull Request, run:

```bash
npm run lint
```

When a change affects a specific flow, also perform the corresponding manual validation.

Changes involving authentication, sessions, or API communication should be verified in the environment where they will be used.

---

## Contributing

Contributions are welcome in areas such as:

* code;
* bug fixes;
* documentation;
* interface;
* accessibility;
* tests;
* integrations;
* translations.

The recommended workflow is:

```text
Branch → Changes → Local validation → Pull Request → Review → Merge
```

See [`CONTRIBUTING.md`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/CONTRIBUTING.md) before contributing.

---

## Security

The application must not contain private credentials from CONG infrastructure.

In particular:

* do not commit real `.env` files;
* do not put `DATABASE_URL` in the client;
* do not put `SUPABASE_SECRET_KEY` in the client;
* do not put secrets in `EXPO_PUBLIC_*` variables;
* do not implement direct PostgreSQL access in the application.

Security vulnerabilities should be reported according to the project's security policy.

---

## Licensing

The source code in this repository is distributed under the [MIT License](https://github.com/CongPlatform/cong-platform-mobile/blob/main/LICENSE).

The code license does not automatically grant permission to reuse branding elements or other materials that may have their own rules.

---

## Code of Conduct

Participation in the project is subject to [`CODE_OF_CONDUCT.md`](https://github.com/CongPlatform/cong-platform-mobile/blob/main/CODE_OF_CONDUCT.md).

---

## Team

CONG is initially developed by:

* **André Mendes** — Mobile Development;
* **João Palumbo** — Documentation and Research;
* **Kelvin Palka** — Web Development.

The project originated as a Final Course Project for the Integrated High School and Systems Development Technical Program at ETEC de Hortolândia.

---

## Development status

CONG Mobile is under active development.

The application, its interfaces, integrations, and structure may change as the CONG platform evolves.

The application follows the development of CONG Web and the shared API used by the platform.
F