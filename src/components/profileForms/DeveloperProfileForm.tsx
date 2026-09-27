import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import { TECHNOLOGY_OPTIONS } from "../../data/profileCatalog";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import SelectionModal from "./shared/SelectionModal";

// =========================================================
// TIPOS
// =========================================================

export type DeveloperExperienceLevel =
  | ""
  | "beginner"
  | "intermediate"
  | "advanced";

export type DeveloperProfileFormData = {
  technologies: string[];
  experienceLevel: DeveloperExperienceLevel;
  portfolioUrl: string;
};

interface DeveloperProfileFormProps {
  technologies: string[];
  experienceLevel: DeveloperExperienceLevel;
  portfolioUrl: string;
  completed: boolean;
  saving: boolean;
  submitLabel?: string;

  onTechnologiesChange: (value: string[]) => void;

  onExperienceLevelChange: (
    value: DeveloperExperienceLevel,
  ) => void;

  onPortfolioUrlChange: (value: string) => void;

  onSubmit: (
    data: DeveloperProfileFormData,
  ) => void | Promise<void>;
}

// =========================================================
// EXPERIÊNCIA
// =========================================================

const EXPERIENCE_OPTIONS = [
  {
    value: "beginner",
    label: "Iniciante",
    description:
      "Você está aprendendo a base e quer contribuir com orientação.",
    strength: 1,
  },
  {
    value: "intermediate",
    label: "Intermediário",
    description:
      "Já desenvolve com autonomia e consegue assumir tarefas com algum apoio.",
    strength: 2,
  },
  {
    value: "advanced",
    label: "Avançado",
    description:
      "Consegue liderar soluções e apoiar decisões técnicas mais complexas.",
    strength: 3,
  },
] as const;

// =========================================================
// URL
// =========================================================

function normalizeOptionalUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  return /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
}

function isValidOptionalUrl(value: string): boolean {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(normalizeOptionalUrl(value));

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

// =========================================================
// COMPONENTE
// =========================================================

export default function DeveloperProfileForm(
  props: DeveloperProfileFormProps,
) {
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  // =======================================================
  // EXPERIÊNCIA ATUAL
  // =======================================================

  const activeExperience =
    EXPERIENCE_OPTIONS.find(
      (option) =>
        option.value === props.experienceLevel,
    ) ?? null;

  // =======================================================
  // REMOVER TECNOLOGIA
  // =======================================================

  function removeTechnology(technology: string) {
    props.onTechnologiesChange(
      props.technologies.filter(
        (item) => item !== technology,
      ),
    );

    setError("");
  }

  // =======================================================
  // SALVAR
  // =======================================================

  async function submit() {
    if (props.technologies.length === 0) {
      setError(
        "Escolha pelo menos uma tecnologia.",
      );
      return;
    }

    if (!props.experienceLevel) {
      setError(
        "Selecione seu nível de experiência.",
      );
      return;
    }

    if (!isValidOptionalUrl(props.portfolioUrl)) {
      setError(
        "Informe um link de portfólio válido.",
      );
      return;
    }

    setError("");

    await props.onSubmit({
      technologies: props.technologies,
      experienceLevel: props.experienceLevel,
      portfolioUrl: normalizeOptionalUrl(
        props.portfolioUrl,
      ),
    });
  }

  return (
    <>
      <View style={styles.form}>
        {/* =================================================
            CABEÇALHO
        ================================================= */}

        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            PERFIL PESSOAL
          </Text>

          <Text style={styles.title}>
            Desenvolvedor
          </Text>

          <Text style={styles.description}>
            Conte um pouco sobre sua experiência técnica.
          </Text>
        </View>

        {/* =================================================
            TECNOLOGIAS
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Tecnologias{" "}
            <Text style={styles.required}>*</Text>
          </Text>

          {props.technologies.length > 0 && (
            <View style={styles.selectedList}>
              {props.technologies.map(
                (technology) => (
                  <View
                    key={technology}
                    style={styles.chip}
                  >
                    <Text style={styles.chipText}>
                      {technology}
                    </Text>

                    <Pressable
                      style={({ pressed }) => [
                        styles.chipRemoveButton,
                        pressed && styles.pressed,
                      ]}
                      onPress={() =>
                        removeTechnology(technology)
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Remover ${technology}`}
                    >
                      <MaterialIcons
                        name="close"
                        size={15}
                        color={Colors.primaryDark}
                      />
                    </Pressable>
                  </View>
                ),
              )}
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
            onPress={() => setModalOpen(true)}
            accessibilityRole="button"
          >
            <MaterialIcons
              name="add"
              size={18}
              color={Colors.primaryDark}
            />

            <Text style={styles.addButtonText}>
              Adicionar tecnologias
            </Text>
          </Pressable>
        </View>

        {/* =================================================
            EXPERIÊNCIA
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Experiência{" "}
            <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.segmentedControl}>
            {EXPERIENCE_OPTIONS.map((option) => {
              const selected =
                props.experienceLevel === option.value;

              return (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => [
                    styles.segment,
                    selected &&
                      styles.segmentSelected,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => {
                    props.onExperienceLevelChange(
                      option.value,
                    );
                    setError("");
                  }}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected,
                  }}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      selected &&
                        styles.segmentTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ===============================================
              INDICADOR DE EXPERIÊNCIA
          =============================================== */}

          <View style={styles.experiencePreview}>
            <View style={styles.experienceMeter}>
              {EXPERIENCE_OPTIONS.map((option) => {
                const active =
                  activeExperience !== null &&
                  option.strength <=
                    activeExperience.strength;

                return (
                  <View
                    key={option.value}
                    style={[
                      styles.experienceMeterItem,
                      active &&
                        styles.experienceMeterActive,
                    ]}
                  />
                );
              })}
            </View>

            <View style={styles.experienceCopy}>
              <Text style={styles.experienceTitle}>
                {activeExperience
                  ? activeExperience.label
                  : "Escolha o nível que mais combina com você"}
              </Text>

              <Text
                style={
                  styles.experienceDescription
                }
              >
                {activeExperience
                  ? activeExperience.description
                  : "Usamos isso para sugerir contribuições compatíveis com sua autonomia técnica."}
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            PORTFÓLIO
        ================================================= */}

        <View style={styles.section}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>
              Portfólio{" "}
              <Text style={styles.optional}>
                opcional
              </Text>
            </Text>

            <TextInput
              style={styles.input}
              value={props.portfolioUrl}
              onChangeText={(value) => {
                props.onPortfolioUrlChange(value);
                setError("");
              }}
              placeholder="github.com/seuusuario"
              placeholderTextColor={
                Colors.slate400
              }
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
        </View>

        {/* =================================================
            ERRO
        ================================================= */}

        {error ? (
          <View style={styles.error}>
            <MaterialIcons
              name="error-outline"
              size={17}
              color={Colors.dangerDark}
            />

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : null}

        {/* =================================================
            SALVAR
        ================================================= */}

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,

              pressed &&
                !props.saving &&
                styles.submitButtonPressed,

              props.saving &&
                styles.submitButtonDisabled,
            ]}
            disabled={props.saving}
            onPress={() => void submit()}
            accessibilityRole="button"
          >
            {props.saving && (
              <ActivityIndicator
                size="small"
                color={Colors.white}
              />
            )}

            <Text style={styles.submitButtonText}>
              {props.saving
                ? "Salvando..."
                : props.submitLabel ??
                  (props.completed
                    ? "Salvar alterações"
                    : "Salvar e continuar")}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ===================================================
          MODAL COMPARTILHADO
      =================================================== */}

      <SelectionModal
        open={modalOpen}
        title="Tecnologias"
        description="Busque e selecione o que você usa ou está aprendendo."
        searchPlaceholder="Buscar..."
        options={TECHNOLOGY_OPTIONS}
        selected={props.technologies}
        maxSelected={20}
        allowCustom
        customLabel="Adicionar outra tecnologia"
        onChange={(next) => {
          props.onTechnologiesChange(next);
          setError("");
        }}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
const styles = StyleSheet.create({
  // =========================================================
  // FORMULÁRIO
  // =========================================================

  form: {
    width: "100%",
    gap: 23,
  },

  // =========================================================
  // CABEÇALHO
  // =========================================================

  header: {
    gap: 5,
  },

  eyebrow: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 0.8,
  },

  title: {
    color: Colors.inkStrong,
    fontFamily: Fonts.bodyBold,
    fontSize: 26,
    lineHeight: 32,
  },

  description: {
    color: Colors.slate600,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 20,
  },

  // =========================================================
  // SEÇÕES
  // =========================================================

  section: {
    gap: 11,
  },

  sectionTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  required: {
    color: Colors.primary,
  },

  // =========================================================
  // TECNOLOGIAS SELECIONADAS
  // =========================================================

  selectedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  chip: {
    minHeight: 34,

    paddingLeft: 11,
    paddingRight: 5,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    borderWidth: 1,
    borderColor: Colors.primary200,
    borderRadius: 999,

    backgroundColor: Colors.primary50,
  },

  chipText: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
  },

  chipRemoveButton: {
    width: 27,
    height: 27,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 999,
  },

  // =========================================================
  // ADICIONAR TECNOLOGIAS
  // =========================================================

  addButton: {
    minHeight: 43,

    paddingHorizontal: 13,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    borderWidth: 1,
    borderColor: Colors.primary200,
    borderRadius: 11,

    backgroundColor: Colors.primary50,
  },

  addButtonText: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  // =========================================================
  // EXPERIÊNCIA
  // =========================================================

  segmentedControl: {
    flexDirection: "row",

    padding: 4,
    gap: 4,

    borderRadius: 12,

    backgroundColor: Colors.slate100,
  },

  segment: {
    flex: 1,
    minHeight: 40,

    paddingHorizontal: 5,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 9,
  },

  segmentSelected: {
    backgroundColor: Colors.white,
  },

  segmentText: {
    color: Colors.slate600,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    textAlign: "center",
  },

  segmentTextSelected: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodyBold,
  },

  // =========================================================
  // INDICADOR DE EXPERIÊNCIA
  // =========================================================

  experiencePreview: {
    padding: 13,
    gap: 11,

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 13,

    backgroundColor: Colors.paperSoft,
  },

  experienceMeter: {
    flexDirection: "row",
    gap: 5,
  },

  experienceMeterItem: {
    flex: 1,
    height: 5,

    borderRadius: 999,

    backgroundColor: Colors.slate200,
  },

  experienceMeterActive: {
    backgroundColor: Colors.primary,
  },

  experienceCopy: {
    gap: 3,
  },

  experienceTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  experienceDescription: {
    color: Colors.slate600,
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 17,
  },

  // =========================================================
  // CAMPO
  // =========================================================

  field: {
    gap: 7,
  },

  fieldLabel: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  optional: {
    color: Colors.slate500,
    fontFamily: Fonts.body,
    fontSize: 10,
  },

  input: {
    minHeight: 46,

    paddingHorizontal: 13,

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 11,

    backgroundColor: Colors.white,

    color: Colors.ink,
    fontFamily: Fonts.body,
    fontSize: 13,
  },

  // =========================================================
  // ERRO
  // =========================================================

  error: {
    paddingHorizontal: 12,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",

    gap: 7,

    borderWidth: 1,
    borderColor: Colors.red200,
    borderRadius: 11,

    backgroundColor: Colors.dangerSoft,
  },

  errorText: {
    flex: 1,

    color: Colors.dangerDark,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 16,
  },

  // =========================================================
  // FOOTER
  // =========================================================

  footer: {
    width: "100%",
  },

  submitButton: {
    width: "100%",
    minHeight: 48,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    borderRadius: 12,

    backgroundColor: Colors.primary,
  },

  submitButtonPressed: {
    opacity: 0.82,
  },

  submitButtonDisabled: {
    opacity: 0.55,
  },

  submitButtonText: {
    color: Colors.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  pressed: {
    opacity: 0.7,
  },
});
