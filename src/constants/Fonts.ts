export const Fonts = {
  // ==================================================
  // FAMÍLIAS
  // ==================================================

  // Inter - textos e interface
  body: "Inter",
  bodyMedium: "InterMedium",
  bodySemiBold: "InterSemiBold",
  bodyBold: "InterBold",
  bodyExtraBold: "InterExtraBold",
  bodyBlack: "InterBlack",

  // Short Stack - identidade visual e títulos
  brand: "ShortStack",

  mono: "monospace",
  system: "System",

  // Apelidos
  interface: "Inter",
  heading: "ShortStack",
  code: "monospace",

  // ==================================================
  // AUTENTICAÇÃO
  // ==================================================

  authWelcomeTitle: 38,
  authCardTitle: 30,
  authWelcomeTitleMobile: 38,

  // ==================================================
  // TAMANHOS BÁSICOS
  // ==================================================

  "4xs": 8,
  "3xs": 9,
  "2xs": 10,

  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,

  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
  "7xl": 72,
  "8xl": 96,
  "9xl": 128,

  // ==================================================
  // TAMANHOS SEMÂNTICOS
  // ==================================================

  caption: 10,
  labelSmall: 11,
  label: 12,
  button: 14,

  bodySmall: 14,
  bodyNormal: 16,
  bodyLarge: 18,

  // ==================================================
  // TÍTULOS
  // ==================================================

  display: 64,

  h1: 48,
  h2: 36,
  h3: 28,
  h4: 22,
  h5: 18,
  h6: 16,

  // ==================================================
  // PESOS
  // ==================================================

  light: "300" as const,
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
  black: "900" as const,

  // Pesos semânticos
  weightBody: "400" as const,
  weightLabel: "600" as const,
  weightTitle: "700" as const,
  weightDisplay: "800" as const,

  // ==================================================
  // ALTURA DE LINHA
  // ==================================================

  lineNone: 1,
  lineDisplay: 0.95,
  lineTight: 1.1,
  lineCompact: 1.2,
  lineSnug: 1.3,
  lineHeading: 1.35,
  lineNormal: 1.5,
  lineReadable: 1.6,
  lineRelaxed: 1.7,
  lineLoose: 1.8,

  // ==================================================
  // ESPAÇAMENTO ENTRE LETRAS
  // ==================================================

  trackingTighter: -0.06,
  trackingTight: -0.04,
  trackingSnug: -0.02,
  trackingNormal: 0,
  trackingWide: 0.04,
  trackingWider: 0.08,
  trackingWidest: 0.14,
  trackingLabel: 0.1,

  // ==================================================
  // REGISTRO
  // ==================================================

  registerTitle: 40,
  registerFormTitle: 32,
  registerSuccessTitle: 36,

  // ==================================================
  // PROCESSO
  // ==================================================

  processTitle: 42,
  processDescription: 16,
  processStepHeading: 20,
  processStepNumber: 17,

  // ==================================================
  // RODAPÉ
  // ==================================================

  footerBody: 13,

  // ==================================================
  // PAPEL
  // ==================================================

  paperTitle: 32,
  paperMessage: 16,
  paperLabel: 11,
  paperValue: 17,
  paperButton: 16,

  // ==================================================
  // RESULTADOS
  // ==================================================

  resultsTitle: 38,
  resultsDescription: 16,
  resultsNumber: 42,

  // ==================================================
  // DETALHES
  // ==================================================

  detailsTitle: 36,
  detailsDescription: 16,
} as const;

export type FontKey = keyof typeof Fonts;