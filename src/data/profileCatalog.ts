// =========================================================
// TIPOS
// =========================================================

export interface CauseOption {
  id: string;
  label: string;
  category: string;
  featured?: boolean;
  subtopics: readonly string[];
}

export interface LanguageOption {
  value: string;
  label: string;
  code: string;
}

// =========================================================
// CAUSAS
// =========================================================

export const CAUSE_OPTIONS: readonly CauseOption[] = [
  {
    id: "animals",
    label: "Proteção animal",
    category: "Animais",
    featured: true,
    subtopics: [
      "Resgate animal",
      "Adoção responsável",
      "Castração",
      "Cuidados veterinários",
      "Animais abandonados",
    ],
  },
  {
    id: "hunger",
    label: "Combate à fome",
    category: "Assistência social",
    featured: true,
    subtopics: [
      "Distribuição de alimentos",
      "Segurança alimentar",
      "Cestas básicas",
      "Cozinhas solidárias",
    ],
  },
  {
    id: "education",
    label: "Educação",
    category: "Educação",
    featured: true,
    subtopics: [
      "Reforço escolar",
      "Alfabetização",
      "Educação infantil",
      "Educação de jovens e adultos",
      "Formação profissional",
    ],
  },
  {
    id: "environment",
    label: "Meio ambiente",
    category: "Meio ambiente",
    featured: true,
    subtopics: [
      "Reciclagem",
      "Preservação ambiental",
      "Educação ambiental",
      "Reflorestamento",
      "Sustentabilidade",
    ],
  },
  {
    id: "disability",
    label: "Inclusão de pessoas com deficiência",
    category: "Inclusão",
    subtopics: [
      "Acessibilidade",
      "Inclusão social",
      "Inclusão profissional",
      "Tecnologia assistiva",
      "Educação inclusiva",
    ],
  },
  {
    id: "children",
    label: "Crianças e adolescentes",
    category: "Infância",
    featured: true,
    subtopics: [
      "Proteção infantil",
      "Educação",
      "Acolhimento",
      "Esporte",
      "Cultura",
    ],
  },
  {
    id: "older-people",
    label: "Pessoas idosas",
    category: "Pessoa idosa",
    subtopics: [
      "Convivência",
      "Saúde",
      "Inclusão digital",
      "Acolhimento",
      "Direitos da pessoa idosa",
    ],
  },
  {
    id: "lgbtqia",
    label: "Direitos LGBTQIA+",
    category: "Direitos humanos",
    subtopics: [
      "Acolhimento",
      "Combate à discriminação",
      "Empregabilidade",
      "Saúde",
      "Direitos humanos",
    ],
  },
  {
    id: "health",
    label: "Saúde e bem-estar",
    category: "Saúde",
    featured: true,
    subtopics: [
      "Saúde preventiva",
      "Saúde mental",
      "Atendimento comunitário",
      "Promoção da saúde",
      "Qualidade de vida",
    ],
  },
  {
    id: "housing",
    label: "Moradia digna",
    category: "Habitação",
    subtopics: [
      "Reformas",
      "Construção",
      "Regularização",
      "Acolhimento",
      "Melhoria habitacional",
    ],
  },
  {
    id: "culture",
    label: "Cultura e arte",
    category: "Cultura",
    subtopics: [
      "Música",
      "Teatro",
      "Dança",
      "Artes visuais",
      "Literatura",
    ],
  },
  {
    id: "sports",
    label: "Esporte e lazer",
    category: "Esporte",
    subtopics: [
      "Futebol",
      "Artes marciais",
      "Atividades recreativas",
      "Esporte comunitário",
      "Inclusão pelo esporte",
    ],
  },
  {
    id: "women",
    label: "Direitos das mulheres",
    category: "Direitos humanos",
    subtopics: [
      "Combate à violência",
      "Empoderamento",
      "Empregabilidade",
      "Saúde da mulher",
      "Acolhimento",
    ],
  },
  {
    id: "racial-equality",
    label: "Igualdade racial",
    category: "Direitos humanos",
    subtopics: [
      "Combate ao racismo",
      "Educação antirracista",
      "Cultura",
      "Empregabilidade",
      "Direitos humanos",
    ],
  },
  {
    id: "migrants",
    label: "Migrantes e refugiados",
    category: "Direitos humanos",
    subtopics: [
      "Acolhimento",
      "Documentação",
      "Ensino de idiomas",
      "Empregabilidade",
      "Integração social",
    ],
  },
  {
    id: "homelessness",
    label: "Pessoas em situação de rua",
    category: "Assistência social",
    subtopics: [
      "Alimentação",
      "Acolhimento",
      "Higiene",
      "Documentação",
      "Reinserção social",
    ],
  },
  {
    id: "community",
    label: "Desenvolvimento comunitário",
    category: "Comunidade",
    subtopics: [
      "Associações comunitárias",
      "Geração de renda",
      "Capacitação",
      "Economia solidária",
      "Participação social",
    ],
  },
  {
    id: "digital-inclusion",
    label: "Inclusão digital",
    category: "Tecnologia",
    subtopics: [
      "Alfabetização digital",
      "Acesso à tecnologia",
      "Cursos de informática",
      "Internet comunitária",
      "Tecnologia social",
    ],
  },
];

// =========================================================
// SERIALIZAÇÃO DAS CAUSAS
// =========================================================

export const CAUSE_SUBTOPIC_SEPARATOR = "::";

export function serializeCauseSubtopic(
  parent: string,
  subtopic: string,
): string {
  return `${parent}${CAUSE_SUBTOPIC_SEPARATOR}${subtopic}`;
}

export function parseCauseSelection(value: string): {
  parent: string;
  subtopic: string;
} {
  const [parent, ...rest] = value.split(
    CAUSE_SUBTOPIC_SEPARATOR,
  );

  return {
    parent: parent.trim(),
    subtopic: rest.join(CAUSE_SUBTOPIC_SEPARATOR).trim(),
  };
}

export function causeSelectionLabel(
  value: string,
): string {
  const { parent, subtopic } =
    parseCauseSelection(value);

  return subtopic ? `#${subtopic}` : parent;
}

// =========================================================
// ATIVIDADES DE VOLUNTARIADO
// =========================================================

export const VOLUNTEER_ACTIVITY_OPTIONS = [
  "Atendimento em bazar",
  "Atendimento ao público",
  "Organização de estoque",
  "Separação de alimentos, roupas ou doações",
  "Entregas",
  "Eventos e mutirões",
  "Comunicação e redes sociais",
  "Fotografia e vídeo",
  "Tecnologia",
  "Apoio administrativo",
  "Captação de recursos",
  "Aulas e oficinas",
  "Transporte e logística",
  "Triagem e recepção",
  "Organização de documentos",
  "Apoio em campanhas",
] as const;

// =========================================================
// DESIGN
// =========================================================

export const DESIGN_SPECIALTY_OPTIONS = [
  "UI Design",
  "UX Design",
  "Design gráfico",
  "Identidade visual",
  "Ilustração",
  "Motion design",
  "Design editorial",
  "Social media",
  "Apresentações",
  "Acessibilidade em interfaces",
  "Pesquisa com usuários",
  "Prototipação",
] as const;

export const DESIGN_TOOL_OPTIONS = [
  "Figma",
  "Canva",
  "Adobe Illustrator",
  "Adobe Photoshop",
  "Adobe After Effects",
  "Adobe InDesign",
  "Framer",
  "Miro",
  "Blender",
  "Penpot",
] as const;

// =========================================================
// TECNOLOGIAS
// =========================================================

export const TECHNOLOGY_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "React Native",
  "Node.js",
  "Express",
  "Next.js",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "PHP",
  "PostgreSQL",
  "MySQL",
  "Supabase",
  "Firebase",
  "Docker",
  "Git",
  "GitHub",
  "HTML",
  "CSS",
  "Tailwind",
  "Prisma",
  "Zod",
  "Vitest",
  "Jest",
  "Playwright",
] as const;

// =========================================================
// IDIOMAS
// =========================================================

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  {
    value: "Português",
    label: "Português",
    code: "PT",
  },
  {
    value: "Inglês",
    label: "Inglês",
    code: "EN",
  },
  {
    value: "Espanhol",
    label: "Espanhol",
    code: "ES",
  },
  {
    value: "Francês",
    label: "Francês",
    code: "FR",
  },
  {
    value: "Alemão",
    label: "Alemão",
    code: "DE",
  },
  {
    value: "Italiano",
    label: "Italiano",
    code: "IT",
  },
  {
    value: "Mandarim",
    label: "Mandarim",
    code: "ZH",
  },
  {
    value: "Japonês",
    label: "Japonês",
    code: "JA",
  },
  {
    value: "Coreano",
    label: "Coreano",
    code: "KO",
  },
  {
    value: "Árabe",
    label: "Árabe",
    code: "AR",
  },
  {
    value: "Russo",
    label: "Russo",
    code: "RU",
  },
  {
    value: "Língua de sinais internacional",
    label: "Língua de sinais internacional",
    code: "IS",
  },
];

// =========================================================
// ACESSIBILIDADE
// =========================================================

export const ACCESSIBILITY_SKILL_OPTIONS = [
  {
    id: "libras",
    label: "Libras",
  },
  {
    id: "braille",
    label: "Braille",
  },
  {
    id: "audio-description",
    label: "Audiodescrição",
  },
  {
    id: "accessible-captions",
    label: "Legendagem acessível",
  },
  {
    id: "plain-language",
    label: "Linguagem simples",
  },
] as const;

// =========================================================
// APOIO DE EMPRESAS
// =========================================================

export const COMPANY_SUPPORT_OPTIONS = [
  "Recursos financeiros",
  "Produtos e materiais",
  "Serviços profissionais",
  "Tecnologia",
  "Comunicação e divulgação",
  "Transporte e logística",
  "Espaço físico",
  "Voluntariado corporativo",
  "Capacitação",
] as const;