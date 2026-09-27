import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useCallback } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import type { VolunteerFrequency } from "../VolunteerProfileForm";
// =========================================================
// TIPOS
// =========================================================

export interface AvailabilityDetails {
  days: string[];
  periods: string[];
  frequency?: VolunteerFrequency;
}

interface AvailabilityModalProps {
  open: boolean;
  value: AvailabilityDetails;
  onChange: (value: AvailabilityDetails) => void;
  onClose: () => void;
}

// =========================================================
// OPÇÕES
// =========================================================

const DAYS = [
  ["Segunda", "Seg"],
  ["Terça", "Ter"],
  ["Quarta", "Qua"],
  ["Quinta", "Qui"],
  ["Sexta", "Sex"],
  ["Sábado", "Sáb"],
  ["Domingo", "Dom"],
] as const;

const PERIODS = [
  "Manhã",
  "Tarde",
  "Noite",
] as const;

const FREQUENCIES: {
  value: Exclude<
    VolunteerFrequency,
    "flexible"
  >;
  label: string;
}[] = [
  {
    value: "punctual",
    label: "Pontualmente",
  },
  {
    value: "monthly",
    label: "Algumas vezes por mês",
  },
  {
    value: "weekly",
    label: "Toda semana",
  },
];

// =========================================================
// AUXILIAR
// =========================================================

function toggle(
  values: string[],
  value: string,
): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

// =========================================================
// COMPONENTE
// =========================================================

export default function AvailabilityModal({
  open,
  value,
  onChange,
  onClose,
}: AvailabilityModalProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const flexible =
    value.frequency === "flexible";

  // =======================================================
  // DISPONIBILIDADE VARIÁVEL
  // =======================================================

  function toggleFlexible() {
    if (flexible) {
      onChange({
        days: [],
        periods: [],
        frequency: undefined,
      });

      return;
    }

    onChange({
      days: [],
      periods: [],
      frequency: "flexible",
    });
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={handleClose}
      >
        <Pressable
          style={styles.dialog}
          onPress={(event) =>
            event.stopPropagation()
          }
        >
          {/* ===============================================
              CABEÇALHO
          =============================================== */}

          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>
                Disponibilidade
              </Text>

              <Text style={styles.description}>
                Uma visão geral já basta. A escala
                exata pode ser combinada depois.
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <MaterialIcons
                name="close"
                size={18}
                color={Colors.slate600}
              />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={
              styles.scrollContent
            }
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
          >
            {/* =============================================
                DISPONIBILIDADE VARIÁVEL
            ============================================= */}

            <Pressable
              style={({ pressed }) => [
                styles.flexibleLine,

                flexible &&
                  styles.flexibleLineSelected,

                pressed && styles.pressed,
              ]}
              onPress={toggleFlexible}
              accessibilityRole="checkbox"
              accessibilityState={{
                checked: flexible,
              }}
            >
              <View
                style={[
                  styles.checkbox,

                  flexible &&
                    styles.checkboxSelected,
                ]}
              >
                {flexible ? (
                  <MaterialIcons
                    name="check"
                    size={15}
                    color={Colors.white}
                  />
                ) : null}
              </View>

              <View style={styles.flexibleCopy}>
                <Text
                  style={styles.flexibleTitle}
                >
                  Minha disponibilidade varia
                </Text>

                <Text
                  style={
                    styles.flexibleDescription
                  }
                >
                  Use esta opção se dias e
                  horários mudam bastante.
                </Text>
              </View>
            </Pressable>

            {/* =============================================
                CONFIGURAÇÃO NORMAL
            ============================================= */}

            {!flexible ? (
              <View style={styles.content}>
                {/* =========================================
                    DIAS
                ========================================= */}

                <View style={styles.fieldset}>
                  <Text style={styles.legend}>
                    Dias
                  </Text>

                  <View style={styles.weekRow}>
                    {DAYS.map(
                      ([
                        valueName,
                        shortLabel,
                      ]) => {
                        const selected =
                          value.days.includes(
                            valueName,
                          );

                        return (
                          <Pressable
                            key={valueName}
                            style={({
                              pressed,
                            }) => [
                              styles.dayButton,

                              selected &&
                                styles.optionSelected,

                              pressed &&
                                styles.pressed,
                            ]}
                            onPress={() =>
                              onChange({
                                ...value,

                                days: toggle(
                                  value.days,
                                  valueName,
                                ),
                              })
                            }
                            accessibilityRole="button"
                            accessibilityState={{
                              selected,
                            }}
                          >
                            <Text
                              style={[
                                styles.optionText,

                                selected &&
                                  styles.optionTextSelected,
                              ]}
                            >
                              {shortLabel}
                            </Text>
                          </Pressable>
                        );
                      },
                    )}
                  </View>
                </View>

                {/* =========================================
                    PERÍODOS
                ========================================= */}

                <View style={styles.fieldset}>
                  <Text style={styles.legend}>
                    Períodos
                  </Text>

                  <View
                    style={styles.periodRow}
                  >
                    {PERIODS.map((period) => {
                      const selected =
                        value.periods.includes(
                          period,
                        );

                      return (
                        <Pressable
                          key={period}
                          style={({
                            pressed,
                          }) => [
                            styles.periodButton,

                            selected &&
                              styles.optionSelected,

                            pressed &&
                              styles.pressed,
                          ]}
                          onPress={() =>
                            onChange({
                              ...value,

                              periods: toggle(
                                value.periods,
                                period,
                              ),
                            })
                          }
                          accessibilityRole="button"
                          accessibilityState={{
                            selected,
                          }}
                        >
                          <Text
                            style={[
                              styles.optionText,

                              selected &&
                                styles.optionTextSelected,
                            ]}
                          >
                            {period}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* =========================================
                    FREQUÊNCIA
                ========================================= */}

                <View
                  style={
                    styles.frequencyField
                  }
                >
                  <Text style={styles.legend}>
                    Frequência
                  </Text>

                  <View
                    style={
                      styles.frequencyList
                    }
                  >
                    {FREQUENCIES.map(
                      (frequency) => {
                        const selected =
                          value.frequency ===
                          frequency.value;

                        return (
                          <Pressable
                            key={
                              frequency.value
                            }
                            style={({
                              pressed,
                            }) => [
                              styles.frequencyOption,

                              selected &&
                                styles.frequencyOptionSelected,

                              pressed &&
                                styles.pressed,
                            ]}
                            onPress={() =>
                              onChange({
                                ...value,

                                frequency:
                                  frequency.value,
                              })
                            }
                            accessibilityRole="button"
                            accessibilityState={{
                              selected,
                            }}
                          >
                            <View
                              style={[
                                styles.radio,

                                selected &&
                                  styles.radioSelected,
                              ]}
                            >
                              {selected ? (
                                <View
                                  style={
                                    styles.radioDot
                                  }
                                />
                              ) : null}
                            </View>

                            <Text
                              style={[
                                styles.frequencyText,

                                selected &&
                                  styles.frequencyTextSelected,
                              ]}
                            >
                              {frequency.label}
                            </Text>
                          </Pressable>
                        );
                      },
                    )}
                  </View>
                </View>
              </View>
            ) : null}
          </ScrollView>

          {/* ===============================================
              FOOTER
          =============================================== */}

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.finishButton,

                pressed &&
                  styles.finishButtonPressed,
              ]}
              onPress={handleClose}
              accessibilityRole="button"
            >
              <MaterialIcons
                name="check"
                size={17}
                color={Colors.inkStrong}
              />

              <Text
                style={styles.finishButtonText}
              >
                Concluir
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
const styles = StyleSheet.create({
  // =========================================================
  // FUNDO
  // =========================================================

  backdrop: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor: "rgba(9, 22, 38, 0.48)",
  },

  // =========================================================
  // MODAL
  // =========================================================

  dialog: {
    width: "100%",
    maxHeight: "90%",

    overflow: "hidden",

    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,

    backgroundColor: Colors.white,
  },

  // =========================================================
  // CABEÇALHO
  // =========================================================

  header: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 16,

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",

    gap: 18,

    borderBottomWidth: 1,
    borderBottomColor: Colors.slate100,
  },

  headerCopy: {
    flex: 1,
  },

  title: {
    color: Colors.inkStrong,

    fontFamily: Fonts.bodyBold,
    fontSize: 19,
    lineHeight: 24,
  },

  description: {
    marginTop: 5,

    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },

  closeButton: {
    width: 36,
    height: 36,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 10,

    backgroundColor: Colors.white,
  },

  // =========================================================
  // SCROLL
  // =========================================================

  scroll: {
    flexShrink: 1,
  },

  scrollContent: {
    paddingBottom: 4,
  },

  // =========================================================
  // DISPONIBILIDADE VARIÁVEL
  // =========================================================

  flexibleLine: {
    marginHorizontal: 22,
    marginTop: 18,

    paddingHorizontal: 13,
    paddingVertical: 12,

    flexDirection: "row",
    alignItems: "flex-start",

    gap: 10,

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 12,

    backgroundColor: Colors.slate50,
  },

  flexibleLineSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary50,
  },

  checkbox: {
    width: 21,
    height: 21,

    marginTop: 2,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 5,

    backgroundColor: Colors.white,
  },

  checkboxSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },

  flexibleCopy: {
    flex: 1,

    gap: 2,
  },

  flexibleTitle: {
    color: Colors.ink,

    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },

  flexibleDescription: {
    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },

  // =========================================================
  // CONTEÚDO
  // =========================================================

  content: {
    paddingHorizontal: 22,
    paddingVertical: 20,

    gap: 20,
  },

  fieldset: {
    gap: 9,
  },

  legend: {
    color: Colors.ink,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: 13,
  },

  // =========================================================
  // DIAS
  // =========================================================

  weekRow: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 6,
  },

  dayButton: {
    minWidth: "22%",
    minHeight: 40,

    flexGrow: 1,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 10,

    backgroundColor: Colors.white,
  },

  // =========================================================
  // PERÍODOS
  // =========================================================

  periodRow: {
    flexDirection: "row",

    gap: 8,
  },

  periodButton: {
    flex: 1,
    minHeight: 40,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 10,

    backgroundColor: Colors.white,
  },

  // =========================================================
  // SELEÇÃO
  // =========================================================

  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary50,
  },

  optionText: {
    color: Colors.ink,

    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  optionTextSelected: {
    color: Colors.primaryDark,
  },

  // =========================================================
  // FREQUÊNCIA
  // =========================================================

  frequencyField: {
    gap: 7,
  },

  frequencyList: {
    gap: 7,
  },

  frequencyOption: {
    minHeight: 46,

    paddingHorizontal: 12,
    paddingVertical: 9,

    flexDirection: "row",
    alignItems: "center",

    gap: 10,

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 11,

    backgroundColor: Colors.white,
  },

  frequencyOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary50,
  },

  radio: {
    width: 20,
    height: 20,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 999,
  },

  radioSelected: {
    borderColor: Colors.primary,
  },

  radioDot: {
    width: 10,
    height: 10,

    borderRadius: 999,

    backgroundColor: Colors.primary,
  },

  frequencyText: {
    flex: 1,

    color: Colors.ink,

    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
  },

  frequencyTextSelected: {
    color: Colors.primaryDark,
  },

  // =========================================================
  // FOOTER
  // =========================================================

  footer: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 20,

    alignItems: "flex-end",

    borderTopWidth: 1,
    borderTopColor: Colors.slate100,

    backgroundColor: Colors.white,
  },

  finishButton: {
    minHeight: 42,

    paddingHorizontal: 17,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    borderRadius: 11,

    backgroundColor: Colors.accent,
  },

  finishButtonPressed: {
    opacity: 0.82,
  },

  finishButtonText: {
    color: Colors.inkStrong,

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
