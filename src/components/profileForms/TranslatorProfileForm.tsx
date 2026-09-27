import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import {
  ACCESSIBILITY_SKILL_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/data/profileCatalog";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

import SelectionModal from "./shared/SelectionModal";

// =========================================================
// TIPOS
// =========================================================

export type TranslatorProfileFormData = {
  languages: string[];
  accessibilitySkills: string[];
  notes: string;
};

interface TranslatorProfileFormProps {
  languages: string[];
  accessibilitySkills: string[];
  notes: string;

  completed: boolean;
  saving: boolean;
  submitLabel?: string;

  onLanguagesChange: (value: string[]) => void;

  onAccessibilitySkillsChange: (
    value: string[],
  ) => void;

  onNotesChange: (value: string) => void;

  onSubmit: (
    data: TranslatorProfileFormData,
  ) => void | Promise<void>;
}

// =========================================================
// ÍCONES DE ACESSIBILIDADE
// =========================================================

type MaterialIconName =
  | "back-hand"
  | "grid-view"
  | "graphic-eq"
  | "closed-caption"
  | "menu-book";

const ACCESSIBILITY_ICONS: Record<
  string,
  MaterialIconName
> = {
  libras: "back-hand",
  braille: "grid-view",
  "audio-description": "graphic-eq",
  "accessible-captions": "closed-caption",
  "plain-language": "menu-book",
};

// =========================================================
// CÓDIGO DO IDIOMA
// =========================================================

function languageCode(language: string): string {
  return (
    LANGUAGE_OPTIONS.find(
      (option) => option.value === language,
    )?.code ??
    language.slice(0, 2).toUpperCase()
  );
}

// =========================================================
// COMPONENTE
// =========================================================

export default function TranslatorProfileForm(
  props: TranslatorProfileFormProps,
) {
  const [languagesOpen, setLanguagesOpen] =
    useState(false);

  const [error, setError] = useState("");

  // =======================================================
  // ACESSIBILIDADE
  // =======================================================

  function toggleSkill(skill: string) {
    const selected =
      props.accessibilitySkills.includes(skill);

    props.onAccessibilitySkillsChange(
      selected
        ? props.accessibilitySkills.filter(
            (item) => item !== skill,
          )
        : [
            ...props.accessibilitySkills,
            skill,
          ],
    );

    setError("");
  }

  // =======================================================
  // REMOVER IDIOMA
  // =======================================================

  function removeLanguage(language: string) {
    props.onLanguagesChange(
      props.languages.filter(
        (item) => item !== language,
      ),
    );

    setError("");
  }

  // =======================================================
  // SALVAR
  // =======================================================

  async function submit() {
    if (
      props.languages.length === 0 &&
      props.accessibilitySkills.length === 0
    ) {
      setError(
        "Escolha ao menos um idioma ou recurso de acessibilidade.",
      );

      return;
    }

    setError("");

    await props.onSubmit({
      languages: props.languages,
      accessibilitySkills:
        props.accessibilitySkills,
      notes: props.notes,
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
            Tradução e acessibilidade
          </Text>

          <Text style={styles.description}>
            Informe os idiomas e recursos com que você
            consegue colaborar.
          </Text>
        </View>

        {/* =================================================
            RECURSOS DE ACESSIBILIDADE
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recursos de acessibilidade
          </Text>

          <View style={styles.accessibilityList}>
            {ACCESSIBILITY_SKILL_OPTIONS.map(
              (option) => {
                const selected =
                  props.accessibilitySkills.includes(
                    option.label,
                  );

                const iconName =
                  ACCESSIBILITY_ICONS[option.id];

                return (
                  <Pressable
                    key={option.id}
                    style={({ pressed }) => [
                      styles.accessibilityOption,

                      selected &&
                        styles.accessibilityOptionSelected,

                      pressed && styles.pressed,
                    ]}
                    onPress={() =>
                      toggleSkill(option.label)
                    }
                    accessibilityRole="button"
                    accessibilityState={{
                      selected,
                    }}
                  >
                    <View
                      style={[
                        styles.accessibilityIcon,

                        selected &&
                          styles.accessibilityIconSelected,
                      ]}
                    >
                      <MaterialIcons
                        name={iconName}
                        size={20}
                        color={
                          selected
                            ? Colors.primaryDark
                            : Colors.muted
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.accessibilityText,

                        selected &&
                          styles.accessibilityTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>
        </View>

        {/* =================================================
            IDIOMAS
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Idiomas
          </Text>

          {props.languages.length > 0 ? (
            <View style={styles.languageList}>
              {props.languages.map(
                (language) => (
                  <View
                    key={language}
                    style={styles.languageItem}
                  >
                    <View
                      style={styles.languageCode}
                    >
                      <Text
                        style={
                          styles.languageCodeText
                        }
                      >
                        {languageCode(language)}
                      </Text>
                    </View>

                    <Text
                      style={styles.languageName}
                    >
                      {language}
                    </Text>

                    <Pressable
                      style={({ pressed }) => [
                        styles.languageRemoveButton,
                        pressed && styles.pressed,
                      ]}
                      onPress={() =>
                        removeLanguage(language)
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Remover ${language}`}
                    >
                      <MaterialIcons
                        name="close"
                        size={18}
                        color={Colors.muted}
                      />
                    </Pressable>
                  </View>
                ),
              )}
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              setLanguagesOpen(true)
            }
            accessibilityRole="button"
          >
            <MaterialIcons
              name="add"
              size={18}
              color={Colors.primaryDark}
            />

            <Text style={styles.addButtonText}>
              Adicionar idiomas
            </Text>
          </Pressable>
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
            {props.saving ? (
              <ActivityIndicator
                size="small"
                color={Colors.white}
              />
            ) : null}

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
          MODAL DE IDIOMAS
      =================================================== */}

      <SelectionModal
        open={languagesOpen}
        title="Idiomas"
        description="Escolha os idiomas em que você pode traduzir, revisar ou adaptar conteúdo."
        options={LANGUAGE_OPTIONS}
        selected={props.languages}
        maxSelected={10}
        allowCustom
        customLabel="Adicionar outro idioma"
        onChange={(next) => {
          props.onLanguagesChange(next);
          setError("");
        }}
        onClose={() =>
          setLanguagesOpen(false)
        }
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
  },

  // =========================================================
  // CABEÇALHO
  // =========================================================

  header: {
    marginBottom: 28,
  },

  eyebrow: {
    marginBottom: 6,

    color: Colors.primary,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: 11,
    letterSpacing: 1.1,

    textTransform: "uppercase",
  },

  title: {
    color: Colors.inkStrong,

    fontFamily: Fonts.brand,
    fontSize: 28,
    lineHeight: 36,
  },

  description: {
    marginTop: 6,

    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },

  // =========================================================
  // SEÇÕES
  // =========================================================

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    marginBottom: 10,

    color: Colors.inkStrong,

    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },

  // =========================================================
  // ACESSIBILIDADE
  // =========================================================

  accessibilityList: {
    gap: 9,
  },

  accessibilityOption: {
    minHeight: 54,

    paddingHorizontal: 12,
    paddingVertical: 9,

    flexDirection: "row",
    alignItems: "center",

    gap: 11,

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 12,

    backgroundColor: Colors.white,
  },

  accessibilityOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary50,
  },

  accessibilityIcon: {
    width: 36,
    height: 36,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,

    backgroundColor: Colors.slate50,
  },

  accessibilityIconSelected: {
    backgroundColor: Colors.primary100,
  },

  accessibilityText: {
    flex: 1,

    color: Colors.ink,

    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
  },

  accessibilityTextSelected: {
    color: Colors.primaryDark,
  },

  // =========================================================
  // IDIOMAS
  // =========================================================

  languageList: {
    marginBottom: 10,

    gap: 8,
  },

  languageItem: {
    minHeight: 48,

    paddingHorizontal: 10,
    paddingVertical: 7,

    flexDirection: "row",
    alignItems: "center",

    gap: 10,

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 11,

    backgroundColor: Colors.white,
  },

  languageCode: {
    minWidth: 38,
    height: 30,

    paddingHorizontal: 7,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 8,

    backgroundColor: Colors.primary50,
  },

  languageCodeText: {
    color: Colors.primaryDark,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: 11,
  },

  languageName: {
    flex: 1,

    color: Colors.ink,

    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
  },

  languageRemoveButton: {
    width: 32,
    height: 32,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 999,
  },

  // =========================================================
  // ADICIONAR
  // =========================================================

  addButton: {
    minHeight: 44,

    alignSelf: "flex-start",

    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",

    gap: 7,

    borderWidth: 1,
    borderColor: Colors.primary200,
    borderRadius: 11,

    backgroundColor: Colors.primary50,
  },

  addButtonText: {
    color: Colors.primaryDark,

    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  // =========================================================
  // ERRO
  // =========================================================

  error: {
    marginBottom: 18,

    paddingHorizontal: 12,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",

    gap: 8,

    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 10,
  },

  errorText: {
    flex: 1,

    color: Colors.dangerDark,

    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },

  // =========================================================
  // FOOTER
  // =========================================================

  footer: {
    marginTop: 4,

    alignItems: "flex-end",
  },

  submitButton: {
    minHeight: 50,

    paddingHorizontal: 22,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    borderRadius: 11,

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

    fontFamily: Fonts.bodyExtraBold,
    fontSize: 14,
  },

  // =========================================================
  // INTERAÇÃO
  // =========================================================

  pressed: {
    opacity: 0.72,
  },
});
