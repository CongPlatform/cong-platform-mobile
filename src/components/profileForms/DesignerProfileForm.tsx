import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import {
  DESIGN_SPECIALTY_OPTIONS,
  DESIGN_TOOL_OPTIONS,
} from "@/data/profileCatalog";
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

export type DesignerProfileFormData = {
  specialties: string[];
  tools: string[];
  portfolioUrl: string;
};

interface DesignerProfileFormProps {
  specialties: string[];
  tools: string[];
  portfolioUrl: string;

  completed: boolean;
  saving: boolean;
  submitLabel?: string;

  onSpecialtiesChange: (value: string[]) => void;
  onToolsChange: (value: string[]) => void;
  onPortfolioUrlChange: (value: string) => void;

  onSubmit: (
    data: DesignerProfileFormData,
  ) => void | Promise<void>;
}

interface SelectedItemsProps {
  values: string[];
  onChange: (value: string[]) => void;
}

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
// ITENS SELECIONADOS
// =========================================================

function SelectedItems({
  values,
  onChange,
}: SelectedItemsProps) {
  if (values.length === 0) {
    return null;
  }

  function removeItem(value: string) {
    onChange(
      values.filter((item) => item !== value),
    );
  }

  return (
    <View style={styles.selectedList}>
      {values.map((value) => (
        <View
          key={value}
          style={styles.chip}
        >
          <Text style={styles.chipText}>
            {value}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.chipRemoveButton,
              pressed && styles.pressed,
            ]}
            onPress={() => removeItem(value)}
            accessibilityRole="button"
            accessibilityLabel={`Remover ${value}`}
          >
            <MaterialIcons
              name="close"
              size={15}
              color={Colors.primaryDark}
            />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

// =========================================================
// COMPONENTE
// =========================================================

export default function DesignerProfileForm(
  props: DesignerProfileFormProps,
) {
  const [
    specialtiesOpen,
    setSpecialtiesOpen,
  ] = useState(false);

  const [toolsOpen, setToolsOpen] =
    useState(false);

  const [error, setError] = useState("");

  // =======================================================
  // SALVAR
  // =======================================================

  async function submit() {
    if (!props.specialties.length) {
      setError(
        "Escolha pelo menos uma especialidade.",
      );

      return;
    }

    if (!props.tools.length) {
      setError(
        "Escolha pelo menos uma ferramenta que você utiliza.",
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
      specialties: props.specialties,
      tools: props.tools,
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
            Designer
          </Text>

          <Text style={styles.description}>
            Conte onde você pode contribuir.
          </Text>
        </View>

        {/* =================================================
            ESPECIALIDADES
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Especialidades{" "}
            <Text style={styles.required}>
              *
            </Text>
          </Text>

          <SelectedItems
            values={props.specialties}
            onChange={(next) => {
              props.onSpecialtiesChange(next);
              setError("");
            }}
          />

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              setSpecialtiesOpen(true)
            }
            accessibilityRole="button"
            accessibilityLabel="Adicionar especialidades"
          >
            <MaterialIcons
              name="add"
              size={18}
              color={Colors.primaryDark}
            />

            <Text style={styles.addButtonText}>
              Adicionar especialidades
            </Text>
          </Pressable>
        </View>

        {/* =================================================
            FERRAMENTAS
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ferramentas{" "}
            <Text style={styles.required}>
              *
            </Text>
          </Text>

          <SelectedItems
            values={props.tools}
            onChange={(next) => {
              props.onToolsChange(next);
              setError("");
            }}
          />

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              setToolsOpen(true)
            }
            accessibilityRole="button"
            accessibilityLabel="Adicionar ferramentas"
          >
            <MaterialIcons
              name="add"
              size={18}
              color={Colors.primaryDark}
            />

            <Text style={styles.addButtonText}>
              Adicionar ferramentas
            </Text>
          </Pressable>
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
              placeholder="behance.net/seuusuario"
              placeholderTextColor={
                Colors.slate400
              }
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
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
            {props.saving ? (
              <ActivityIndicator
                size="small"
                color={Colors.white}
              />
            ) : null}

            <Text
              style={styles.submitButtonText}
            >
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
          MODAL DE ESPECIALIDADES
      =================================================== */}

      <SelectionModal
        open={specialtiesOpen}
        title="Especialidades"
        options={DESIGN_SPECIALTY_OPTIONS}
        selected={props.specialties}
        maxSelected={20}
        allowCustom
        customLabel="Adicionar outra especialidade"
        onChange={(next) => {
          props.onSpecialtiesChange(next);
          setError("");
        }}
        onClose={() =>
          setSpecialtiesOpen(false)
        }
      />

      {/* ===================================================
          MODAL DE FERRAMENTAS
      =================================================== */}

      <SelectionModal
        open={toolsOpen}
        title="Ferramentas"
        options={DESIGN_TOOL_OPTIONS}
        selected={props.tools}
        maxSelected={20}
        allowCustom
        customLabel="Adicionar outra ferramenta"
        onChange={(next) => {
          props.onToolsChange(next);
          setError("");
        }}
        onClose={() =>
          setToolsOpen(false)
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

  required: {
    color: Colors.danger,
  },

  // =========================================================
  // ITENS SELECIONADOS
  // =========================================================

  selectedList: {
    marginBottom: 10,

    flexDirection: "row",
    flexWrap: "wrap",

    gap: 8,
  },

  chip: {
    minHeight: 34,

    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 5,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    borderWidth: 1,
    borderColor: Colors.primary200,
    borderRadius: 999,

    backgroundColor: Colors.primary50,
  },

  chipText: {
    flexShrink: 1,

    color: Colors.primaryDark,

    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
  },

  chipRemoveButton: {
    width: 24,
    height: 24,

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
  // CAMPO
  // =========================================================

  field: {
    width: "100%",
  },

  fieldLabel: {
    marginBottom: 8,

    color: Colors.inkStrong,

    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },

  optional: {
    color: Colors.muted,

    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
  },

  input: {
    width: "100%",
    minHeight: 52,

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 12,

    backgroundColor: Colors.white,

    color: Colors.ink,

    fontFamily: Fonts.body,
    fontSize: 14,
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
