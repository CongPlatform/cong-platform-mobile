import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

// =========================================================
// TIPOS
// =========================================================

export interface SelectionOption {
  value: string;
  label?: string;
  meta?: string;
  code?: string;
  featured?: boolean;
}

interface SelectionModalProps {
  open: boolean;
  title: string;
  description?: string;
  searchPlaceholder?: string;
  options: readonly (string | SelectionOption)[];
  selected: string[];
  maxSelected?: number;
  allowCustom?: boolean;
  customLabel?: string;
  onChange: (next: string[]) => void;
  onClose: () => void;
}

// =========================================================
// UTILITÁRIOS
// =========================================================

function normalizeOption(
  option: string | SelectionOption,
): SelectionOption {
  return typeof option === "string"
    ? {
        value: option,
        label: option,
      }
    : option;
}

function sameValue(
  first: string,
  second: string,
): boolean {
  return (
    first.localeCompare(second, undefined, {
      sensitivity: "accent",
    }) === 0
  );
}

// =========================================================
// COMPONENTE
// =========================================================

export default function SelectionModal({
  open,
  title,
  description,
  searchPlaceholder = "Buscar...",
  options,
  selected,
  maxSelected,
  allowCustom = false,
  customLabel = "Adicionar outra opção",
  onChange,
  onClose,
}: SelectionModalProps) {
  const [query, setQuery] = useState("");
  const [customValue, setCustomValue] =
    useState("");
  const [showCustom, setShowCustom] =
    useState(false);
  const [error, setError] = useState("");

  // =======================================================
  // FECHAR
  // =======================================================

  const handleClose = useCallback(() => {
    setQuery("");
    setCustomValue("");
    setShowCustom(false);
    setError("");

    onClose();
  }, [onClose]);

  // =======================================================
  // NORMALIZAÇÃO
  // =======================================================

  const normalizedOptions = useMemo(
    () => options.map(normalizeOption),
    [options],
  );

  // =======================================================
  // PESQUISA + DESTAQUES
  // =======================================================

  const visibleOptions = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLocaleLowerCase();

    const filtered = normalizedQuery
      ? normalizedOptions.filter((option) => {
          const haystack =
            `${option.label ?? option.value} ` +
            `${option.meta ?? ""} ` +
            `${option.code ?? ""}`;

          return haystack
            .toLocaleLowerCase()
            .includes(normalizedQuery);
        })
      : normalizedOptions;

    return [...filtered].sort(
      (first, second) => {
        if (
          first.featured === second.featured
        ) {
          return 0;
        }

        return first.featured ? -1 : 1;
      },
    );
  }, [normalizedOptions, query]);

  // =======================================================
  // SELECIONAR OPÇÃO
  // =======================================================

  function toggleOption(value: string) {
    const alreadySelected = selected.some(
      (item) => sameValue(item, value),
    );

    if (alreadySelected) {
      onChange(
        selected.filter(
          (item) => !sameValue(item, value),
        ),
      );

      setError("");

      return;
    }

    if (
      maxSelected &&
      selected.length >= maxSelected
    ) {
      setError(
        `Você pode selecionar até ${maxSelected}.`,
      );

      return;
    }

    onChange([...selected, value]);
    setError("");
  }

  // =======================================================
  // OPÇÃO PERSONALIZADA
  // =======================================================

  function addCustom() {
    const value = customValue.trim();

    if (!value) {
      setError(
        "Digite uma opção antes de adicionar.",
      );

      return;
    }

    if (value.length > 60) {
      setError(
        "Use no máximo 60 caracteres.",
      );

      return;
    }

    if (
      selected.some((item) =>
        sameValue(item, value),
      )
    ) {
      setError(
        "Essa opção já foi adicionada.",
      );

      return;
    }

    if (
      maxSelected &&
      selected.length >= maxSelected
    ) {
      setError(
        `Você pode selecionar até ${maxSelected}.`,
      );

      return;
    }

    onChange([...selected, value]);

    setCustomValue("");
    setShowCustom(false);
    setError("");
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={handleClose}
        accessibilityRole="button"
        accessibilityLabel="Fechar seleção"
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
                {title}
              </Text>

              {description ? (
                <Text style={styles.description}>
                  {description}
                </Text>
              ) : null}
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

          {/* ===============================================
              PESQUISA
          =============================================== */}

          <View style={styles.searchBox}>
            <MaterialIcons
              name="search"
              size={18}
              color={Colors.slate500}
            />

            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={(value) => {
                setQuery(value);
                setError("");
              }}
              placeholder={searchPlaceholder}
              placeholderTextColor={
                Colors.slate400
              }
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* ===============================================
              CONTADOR
          =============================================== */}

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {selected.length} selecionada
              {selected.length === 1 ? "" : "s"}
            </Text>

            {maxSelected ? (
              <Text style={styles.metaText}>
                máximo {maxSelected}
              </Text>
            ) : null}
          </View>

          {/* ===============================================
              OPÇÕES
          =============================================== */}

          <ScrollView
            style={styles.optionList}
            contentContainerStyle={
              styles.optionListContent
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {visibleOptions.map((option) => {
              const value = option.value;

              const checked = selected.some(
                (item) =>
                  sameValue(item, value),
              );

              return (
                <Pressable
                  key={value}
                  style={({ pressed }) => [
                    styles.option,

                    checked &&
                      styles.optionSelected,

                    pressed && styles.pressed,
                  ]}
                  onPress={() =>
                    toggleOption(value)
                  }
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: checked,
                  }}
                >
                  <View style={styles.optionCopy}>
                    {option.code ? (
                      <View
                        style={styles.codeBadge}
                      >
                        <Text
                          style={
                            styles.codeBadgeText
                          }
                        >
                          {option.code}
                        </Text>
                      </View>
                    ) : null}

                    <View
                      style={
                        styles.optionTextContainer
                      }
                    >
                      <Text
                        style={[
                          styles.optionTitle,

                          checked &&
                            styles.optionTitleSelected,
                        ]}
                      >
                        {option.label ?? value}
                      </Text>

                      {option.meta ? (
                        <Text
                          style={styles.optionMeta}
                        >
                          {option.meta}
                        </Text>
                      ) : null}
                    </View>

                    {option.featured ? (
                      <View
                        style={
                          styles.featuredBadge
                        }
                      >
                        <MaterialIcons
                          name="local-fire-department"
                          size={12}
                          color={Colors.accentDark}
                        />

                        <Text
                          style={
                            styles.featuredBadgeText
                          }
                        >
                          Em alta
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View
                    style={[
                      styles.check,

                      checked &&
                        styles.checkSelected,
                    ]}
                  >
                    {checked ? (
                      <MaterialIcons
                        name="check"
                        size={13}
                        color={Colors.white}
                      />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}

            {visibleOptions.length === 0 ? (
              <Text style={styles.empty}>
                Nenhuma opção encontrada.
              </Text>
            ) : null}
          </ScrollView>

          {/* ===============================================
              OPÇÃO PERSONALIZADA
          =============================================== */}

          {allowCustom ? (
            <View style={styles.customArea}>
              {!showCustom ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.customTrigger,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => {
                    setShowCustom(true);
                    setError("");
                  }}
                  accessibilityRole="button"
                >
                  <MaterialIcons
                    name="add"
                    size={16}
                    color={Colors.primaryDark}
                  />

                  <Text
                    style={
                      styles.customTriggerText
                    }
                  >
                    {customLabel}
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.customRow}>
                  <TextInput
                    style={styles.customInput}
                    value={customValue}
                    onChangeText={(value) => {
                      setCustomValue(value);
                      setError("");
                    }}
                    maxLength={60}
                    placeholder="Digite e adicione"
                    placeholderTextColor={
                      Colors.slate400
                    }
                    returnKeyType="done"
                    onSubmitEditing={addCustom}
                  />

                  <Pressable
                    style={({ pressed }) => [
                      styles.customAddButton,
                      pressed && styles.pressed,
                    ]}
                    onPress={addCustom}
                    accessibilityRole="button"
                  >
                    <Text
                      style={
                        styles.customAddButtonText
                      }
                    >
                      Adicionar
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          ) : null}

          {/* ===============================================
              ERRO
          =============================================== */}

          {error ? (
            <Text
              style={styles.error}
              accessibilityRole="alert"
            >
              {error}
            </Text>
          ) : null}

          {/* ===============================================
              FOOTER
          =============================================== */}

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.doneButton,
                pressed && styles.pressed,
              ]}
              onPress={handleClose}
              accessibilityRole="button"
            >
              <Text
                style={styles.doneButtonText}
              >
                Concluir seleção
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
const SCREEN_HEIGHT = Dimensions.get("window").height;
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
    maxHeight: SCREEN_HEIGHT * 0.88,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: Colors.slate200,

    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,

    backgroundColor: Colors.white,
  },

  // =========================================================
  // CABEÇALHO
  // =========================================================

  header: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 13,

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",

    gap: 20,
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

    color: Colors.slate600,

    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },

  closeButton: {
    width: 36,
    height: 36,

    flexShrink: 0,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 10,

    backgroundColor: Colors.white,
  },

  // =========================================================
  // PESQUISA
  // =========================================================

  searchBox: {
    minHeight: 46,

    marginHorizontal: 16,
    paddingHorizontal: 13,

    flexDirection: "row",
    alignItems: "center",

    gap: 10,

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 12,

    backgroundColor: Colors.white,
  },

  searchInput: {
    flex: 1,

    paddingVertical: 0,

    color: Colors.ink,

    fontFamily: Fonts.body,
    fontSize: 14,
  },

  // =========================================================
  // CONTADOR
  // =========================================================

  metaRow: {
    paddingTop: 9,
    paddingHorizontal: 18,
    paddingBottom: 7,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 12,
  },

  metaText: {
    color: Colors.slate500,

    fontFamily: Fonts.body,
    fontSize: 12,
  },

  // =========================================================
  // LISTA
  // =========================================================

  optionList: {
    minHeight: 180,
    flexShrink: 1,
  },

  optionListContent: {
    paddingTop: 4,
    paddingHorizontal: 10,
    paddingBottom: 12,

    gap: 6,
  },

  // =========================================================
  // OPÇÃO
  // =========================================================

  option: {
    width: "100%",
    minHeight: 52,

    paddingHorizontal: 12,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 12,

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 12,

    backgroundColor: Colors.white,
  },

  optionSelected: {
    borderColor: Colors.primary200,
    backgroundColor: Colors.primary50,
  },

  optionCopy: {
    flex: 1,
    minWidth: 0,

    flexDirection: "row",
    alignItems: "center",

    gap: 10,
  },

  optionTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  optionTitle: {
    color: Colors.ink,

    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
  },

  optionTitleSelected: {
    color: Colors.primaryDark,
  },

  optionMeta: {
    marginTop: 2,

    color: Colors.slate500,

    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },

  // =========================================================
  // CÓDIGO
  // =========================================================

  codeBadge: {
    width: 34,
    height: 34,

    flexShrink: 0,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 9,

    backgroundColor: Colors.primary50,
  },

  codeBadgeText: {
    color: Colors.primaryDark,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: 11,
  },

  // =========================================================
  // EM ALTA
  // =========================================================

  featuredBadge: {
    flexShrink: 0,

    paddingHorizontal: 7,
    paddingVertical: 3,

    flexDirection: "row",
    alignItems: "center",

    gap: 4,

    borderWidth: 1,
    borderColor: Colors.accent200,
    borderRadius: 999,

    backgroundColor: Colors.accent50,
  },

  featuredBadgeText: {
    color: Colors.accentDark,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: 10,
  },

  // =========================================================
  // CHECK
  // =========================================================

  check: {
    width: 23,
    height: 23,

    flexShrink: 0,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 999,

    backgroundColor: Colors.white,
  },

  checkSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },

  // =========================================================
  // VAZIO
  // =========================================================

  empty: {
    marginVertical: 24,

    color: Colors.slate500,

    fontFamily: Fonts.body,
    fontSize: 13,

    textAlign: "center",
  },

  // =========================================================
  // PERSONALIZADO
  // =========================================================

  customArea: {
    paddingHorizontal: 16,
    paddingVertical: 11,

    borderTopWidth: 1,
    borderTopColor: Colors.slate200,
  },

  customTrigger: {
    minHeight: 42,

    alignSelf: "flex-start",

    flexDirection: "row",
    alignItems: "center",

    gap: 7,
  },

  customTriggerText: {
    color: Colors.primaryDark,

    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  customRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 8,
  },

  customInput: {
    flex: 1,
    minHeight: 42,

    paddingHorizontal: 12,

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 11,

    backgroundColor: Colors.white,

    color: Colors.ink,

    fontFamily: Fonts.body,
    fontSize: 13,
  },

  customAddButton: {
    minHeight: 42,

    paddingHorizontal: 17,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 11,

    backgroundColor: Colors.accent,
  },

  customAddButtonText: {
    color: Colors.inkStrong,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: 12,
  },

  // =========================================================
  // ERRO
  // =========================================================

  error: {
    paddingHorizontal: 16,
    paddingBottom: 8,

    color: Colors.dangerDark,

    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },

  // =========================================================
  // FOOTER
  // =========================================================

  footer: {
    paddingTop: 13,
    paddingHorizontal: 16,
    paddingBottom: 18,

    alignItems: "stretch",

    borderTopWidth: 1,
    borderTopColor: Colors.slate200,
  },

  doneButton: {
    width: "100%",
    minHeight: 42,

    paddingHorizontal: 17,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 11,

    backgroundColor: Colors.accent,
  },

  doneButtonText: {
    color: Colors.inkStrong,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: 13,
  },

  // =========================================================
  // INTERAÇÃO
  // =========================================================

  pressed: {
    opacity: 0.72,
  },
});
