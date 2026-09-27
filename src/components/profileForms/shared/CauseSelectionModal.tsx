import { Fonts } from "@/constants/Fonts";
import {
  CAUSE_OPTIONS,
  causeSelectionLabel,
  parseCauseSelection,
  serializeCauseSubtopic,
  type CauseOption,
} from "@/data/profileCatalog";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import {
  useCallback,
  useMemo,
  useState,
} from "react";
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
// PROPS
// =========================================================

interface CauseSelectionModalProps {
  open: boolean;
  title: string;
  description?: string;
  selected: string[];
  maxParents?: number;
  onChange: (next: string[]) => void;
  onClose: () => void;
}

// =========================================================
// CAUSAS PRINCIPAIS SELECIONADAS
// =========================================================

function selectedParents(
  selected: string[],
): string[] {
  const result = new Set<string>();

  for (const value of selected) {
    const parsed = parseCauseSelection(value);

    if (!parsed.subtopic) {
      result.add(parsed.parent);
    }
  }

  return [...result];
}

// =========================================================
// SUBTÓPICOS SELECIONADOS
// =========================================================

function selectedSubtopics(
  selected: string[],
  parent: string,
): string[] {
  return selected
    .map(parseCauseSelection)
    .filter(
      (item) =>
        item.parent === parent &&
        Boolean(item.subtopic),
    )
    .map((item) => item.subtopic);
}

// =========================================================
// COMPONENTE
// =========================================================

export default function CauseSelectionModal({
  open,
  title,
  description,
  selected,
  maxParents = 3,
  onChange,
  onClose,
}: CauseSelectionModalProps) {
  const [query, setQuery] = useState("");

  const [
    expandedParents,
    setExpandedParents,
  ] = useState<string[]>([]);

  const [error, setError] = useState("");

  // =======================================================
  // FECHAR
  // =======================================================

  const handleClose = useCallback(() => {
    setQuery("");
    setExpandedParents([]);
    setError("");
    onClose();
  }, [onClose]);

  // =======================================================
  // CAUSAS PRINCIPAIS
  // =======================================================

  const parents = useMemo(
    () => selectedParents(selected),
    [selected],
  );

  // =======================================================
  // PESQUISA
  // =======================================================

  const visibleOptions = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLocaleLowerCase();

    const filtered = normalizedQuery
      ? CAUSE_OPTIONS.filter((cause) => {
          const haystack = [
            cause.label,
            cause.category,
            ...cause.subtopics,
          ]
            .join(" ")
            .toLocaleLowerCase();

          return haystack.includes(
            normalizedQuery,
          );
        })
      : [...CAUSE_OPTIONS];

    return [...filtered].sort((a, b) => {
      if (
        Boolean(a.featured) ===
        Boolean(b.featured)
      ) {
        return 0;
      }

      return a.featured ? -1 : 1;
    });
  }, [query]);

  // =======================================================
  // EXPANDIR
  // =======================================================

  function toggleExpanded(parent: string) {
    setExpandedParents((current) =>
      current.includes(parent)
        ? current.filter(
            (item) => item !== parent,
          )
        : [...current, parent],
    );
  }

  // =======================================================
  // REMOVER CAUSA E SUBTÓPICOS
  // =======================================================

  function removeParentAndChildren(
    parent: string,
  ) {
    onChange(
      selected.filter(
        (value) =>
          parseCauseSelection(value).parent !==
          parent,
      ),
    );

    setExpandedParents((current) =>
      current.filter(
        (item) => item !== parent,
      ),
    );

    setError("");
  }

  // =======================================================
  // SELECIONAR CAUSA
  // =======================================================

  function selectParent(cause: CauseOption) {
    const alreadySelected = parents.includes(
      cause.label,
    );

    if (alreadySelected) {
      removeParentAndChildren(cause.label);
      return;
    }

    if (parents.length >= maxParents) {
      setError(
        `Escolha no máximo ${maxParents} causas principais.`,
      );

      return;
    }

    onChange([...selected, cause.label]);

    setExpandedParents((current) =>
      current.includes(cause.label)
        ? current
        : [...current, cause.label],
    );

    setError("");
  }

  // =======================================================
  // SUBTÓPICO
  // =======================================================

  function toggleSubtopic(
    parent: string,
    subtopic: string,
  ) {
    const parentSelected =
      parents.includes(parent);

    if (!parentSelected) {
      setError(
        "Selecione primeiro a causa principal para escolher seus subtópicos.",
      );

      return;
    }

    const serialized =
      serializeCauseSubtopic(
        parent,
        subtopic,
      );

    const alreadySelected =
      selected.includes(serialized);

    onChange(
      alreadySelected
        ? selected.filter(
            (value) =>
              value !== serialized,
          )
        : [...selected, serialized],
    );

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
                {title}
              </Text>

              {description ? (
                <Text
                  style={styles.description}
                >
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
              placeholder="Buscar causa ou subtópico..."
              placeholderTextColor={
                Colors.slate400
              }
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* ===============================================
              INFORMAÇÕES
          =============================================== */}

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {parents.length} de {maxParents}{" "}
              causas principais
            </Text>

            <Text style={styles.metaText}>
              Subtópicos são opcionais
            </Text>
          </View>

          {/* ===============================================
              RESUMO DAS SELEÇÕES
          =============================================== */}

          {selected.length > 0 ? (
            <View
              style={styles.selectedSummary}
            >
              {selected.map((value) => (
                <View
                  key={value}
                  style={
                    styles.selectedSummaryItem
                  }
                >
                  <Text
                    style={
                      styles.selectedSummaryText
                    }
                  >
                    {causeSelectionLabel(value)}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* ===============================================
              LISTA
          =============================================== */}

          <ScrollView
            style={styles.list}
            contentContainerStyle={
              styles.listContent
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            {visibleOptions.map((cause) => {
              const checked = parents.includes(
                cause.label,
              );

              const subtopics =
                selectedSubtopics(
                  selected,
                  cause.label,
                );

              const expanded =
                checked &&
                expandedParents.includes(
                  cause.label,
                );

              return (
                <View
                  key={cause.id}
                  style={[
                    styles.causeCard,

                    checked &&
                      styles.causeCardSelected,
                  ]}
                >
                  {/* =======================================
                      CAUSA PRINCIPAL
                  ======================================= */}

                  <View
                    style={styles.causeMainRow}
                  >
                    <Pressable
                      style={({ pressed }) => [
                        styles.causeMainButton,

                        pressed &&
                          styles.pressed,
                      ]}
                      onPress={() =>
                        selectParent(cause)
                      }
                      accessibilityRole="button"
                      accessibilityState={{
                        selected: checked,
                      }}
                    >
                      {/* CHECK */}

                      <View
                        style={[
                          styles.checkBox,

                          checked &&
                            styles.checkBoxSelected,
                        ]}
                      >
                        {checked ? (
                          <MaterialIcons
                            name="check"
                            size={14}
                            color={Colors.white}
                          />
                        ) : null}
                      </View>

                      {/* TEXTO */}

                      <View
                        style={styles.causeCopy}
                      >
                        <Text
                          style={
                            styles.causeLabel
                          }
                        >
                          {cause.label}
                        </Text>

                        <Text
                          style={
                            styles.causeCategory
                          }
                        >
                          {cause.category}
                        </Text>
                      </View>

                      {/* EM ALTA */}

                      {cause.featured ? (
                        <View
                          style={
                            styles.featuredBadge
                          }
                        >
                          <MaterialIcons
                            name="local-fire-department"
                            size={13}
                            color={
                              Colors.accentDark
                            }
                          />

                          <Text
                            style={
                              styles.featuredText
                            }
                          >
                            Em alta
                          </Text>
                        </View>
                      ) : null}
                    </Pressable>

                    {/* EXPANDIR */}

                    <Pressable
                      style={({ pressed }) => [
                        styles.expandButton,

                        !checked &&
                          styles.expandButtonDisabled,

                        pressed &&
                          checked &&
                          styles.pressed,
                      ]}
                      disabled={!checked}
                      onPress={() =>
                        toggleExpanded(
                          cause.label,
                        )
                      }
                      accessibilityRole="button"
                      accessibilityLabel={
                        checked
                          ? `${
                              expanded
                                ? "Ocultar"
                                : "Mostrar"
                            } subtópicos de ${cause.label}`
                          : `Selecione ${cause.label} para acessar os subtópicos`
                      }
                    >
                      <MaterialIcons
                        name={
                          expanded
                            ? "keyboard-arrow-up"
                            : "keyboard-arrow-down"
                        }
                        size={22}
                        color={Colors.slate600}
                      />
                    </Pressable>
                  </View>

                  {/* =======================================
                      SUBTÓPICOS
                  ======================================= */}

                  {expanded ? (
                    <View
                      style={styles.subtopics}
                    >
                      {cause.subtopics.map(
                        (subtopic) => {
                          const selectedSubtopic =
                            subtopics.includes(
                              subtopic,
                            );

                          return (
                            <Pressable
                              key={subtopic}
                              style={({
                                pressed,
                              }) => [
                                styles.subtopic,

                                selectedSubtopic &&
                                  styles.subtopicSelected,

                                pressed &&
                                  styles.pressed,
                              ]}
                              onPress={() =>
                                toggleSubtopic(
                                  cause.label,
                                  subtopic,
                                )
                              }
                              accessibilityRole="button"
                              accessibilityState={{
                                selected:
                                  selectedSubtopic,
                              }}
                            >
                              <Text
                                style={
                                  styles.subtopicHash
                                }
                              >
                                #
                              </Text>

                              <Text
                                style={[
                                  styles.subtopicText,

                                  selectedSubtopic &&
                                    styles.subtopicTextSelected,
                                ]}
                              >
                                {subtopic}
                              </Text>

                              {selectedSubtopic ? (
                                <MaterialIcons
                                  name="check"
                                  size={13}
                                  color={
                                    Colors.primaryDark
                                  }
                                />
                              ) : null}
                            </Pressable>
                          );
                        },
                      )}
                    </View>
                  ) : null}
                </View>
              );
            })}

            {visibleOptions.length === 0 ? (
              <Text style={styles.empty}>
                Nenhuma causa ou subtópico
                encontrado.
              </Text>
            ) : null}
          </ScrollView>

          {/* ===============================================
              ERRO
          =============================================== */}

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
              <Text
                style={styles.finishButtonText}
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

    padding: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(15, 28, 45, 0.54)",
  },

  // =========================================================
  // MODAL
  // =========================================================

  dialog: {
    width: "100%",
    maxWidth: 720,
    maxHeight: SCREEN_HEIGHT - 20,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 15,

    backgroundColor: Colors.white,
  },

  // =========================================================
  // CABEÇALHO
  // =========================================================

  header: {
    paddingHorizontal: 15,
    paddingTop: 16,
    paddingBottom: 12,

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",

    gap: 14,
  },

  headerCopy: {
    flex: 1,

    gap: 4,
  },

  title: {
    color: Colors.inkStrong,

    fontFamily: Fonts.bodyBold,
    fontSize: 18,
    lineHeight: 23,
  },

  description: {
    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },

  closeButton: {
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 9,
  },

  // =========================================================
  // PESQUISA
  // =========================================================

  searchBox: {
    minHeight: 44,

    marginHorizontal: 15,

    paddingHorizontal: 12,

    flexDirection: "row",
    alignItems: "center",

    gap: 8,

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 11,

    backgroundColor: Colors.white,
  },

  searchInput: {
    flex: 1,

    minHeight: 42,

    paddingVertical: 0,

    color: Colors.ink,

    fontFamily: Fonts.body,
    fontSize: 14,
  },

  // =========================================================
  // META
  // =========================================================

  metaRow: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 8,

    flexDirection: "row",
    justifyContent: "space-between",

    gap: 10,
  },

  metaText: {
    flexShrink: 1,

    color: Colors.slate500,

    fontFamily: Fonts.body,
    fontSize: 11,
  },

  // =========================================================
  // RESUMO
  // =========================================================

  selectedSummary: {
    paddingHorizontal: 15,
    paddingBottom: 10,

    flexDirection: "row",
    flexWrap: "wrap",

    gap: 6,
  },

  selectedSummaryItem: {
    paddingHorizontal: 8,
    paddingVertical: 5,

    borderWidth: 1,
    borderColor: Colors.primary100,
    borderRadius: 999,

    backgroundColor: Colors.primary50,
  },

  selectedSummaryText: {
    color: Colors.primaryDark,

    fontFamily: Fonts.bodyBold,
    fontSize: 11,
  },

  // =========================================================
  // LISTA
  // =========================================================

  list: {
    flexShrink: 1,
  },

  listContent: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 12,

    gap: 8,
  },

  // =========================================================
  // CAUSA
  // =========================================================

  causeCard: {
    minHeight: 58,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 13,

    backgroundColor: Colors.white,
  },

  causeCardSelected: {
    borderColor: Colors.primary200,
  },

  causeMainRow: {
    minHeight: 58,

    flexDirection: "row",
    alignItems: "stretch",
  },

  causeMainButton: {
    flex: 1,

    minHeight: 58,

    paddingHorizontal: 12,
    paddingVertical: 9,

    flexDirection: "row",
    alignItems: "center",

    gap: 9,
  },

  // =========================================================
  // CHECK
  // =========================================================

  checkBox: {
    width: 23,
    height: 23,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 7,
  },

  checkBoxSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },

  // =========================================================
  // TEXTO DA CAUSA
  // =========================================================

  causeCopy: {
    flex: 1,

    minHeight: 36,

    justifyContent: "center",

    gap: 2,
  },

  causeLabel: {
    color: Colors.ink,

    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  causeCategory: {
    color: Colors.slate500,

    fontFamily: Fonts.body,
    fontSize: 11,
  },

  // =========================================================
  // EM ALTA
  // =========================================================

  featuredBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,

    flexDirection: "row",
    alignItems: "center",

    gap: 4,

    borderRadius: 999,

    backgroundColor: Colors.accent50,
  },

  featuredText: {
    color: Colors.accentDark,

    fontFamily: Fonts.bodyBold,
    fontSize: 10,
  },

  // =========================================================
  // EXPANDIR
  // =========================================================

  expandButton: {
    width: 42,

    alignItems: "center",
    justifyContent: "center",

    borderLeftWidth: 1,
    borderLeftColor: Colors.slate100,
  },

  expandButtonDisabled: {
    opacity: 0.35,
  },

  // =========================================================
  // SUBTÓPICOS
  // =========================================================

  subtopics: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,

    flexDirection: "row",
    flexWrap: "wrap",

    gap: 7,

    borderTopWidth: 1,
    borderTopColor: Colors.slate100,

    backgroundColor: Colors.slate50,
  },

  subtopic: {
    minHeight: 32,

    paddingHorizontal: 8,
    paddingVertical: 5,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 999,

    backgroundColor: Colors.white,
  },

  subtopicSelected: {
    borderColor: Colors.primary200,
    backgroundColor: Colors.primary50,
  },

  subtopicHash: {
    color: Colors.primary,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: 12,
  },

  subtopicText: {
    color: Colors.slate600,

    fontFamily: Fonts.body,
    fontSize: 12,
  },

  subtopicTextSelected: {
    color: Colors.primaryDark,
  },

  // =========================================================
  // VAZIO
  // =========================================================

  empty: {
    paddingVertical: 11,

    color: Colors.slate500,

    fontFamily: Fonts.body,
    fontSize: 12,
  },

  // =========================================================
  // ERRO
  // =========================================================

  error: {
    paddingHorizontal: 15,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",

    gap: 7,
  },

  errorText: {
    flex: 1,

    color: Colors.dangerDark,

    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 17,
  },

  // =========================================================
  // FOOTER
  // =========================================================

  footer: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 15,

    borderTopWidth: 1,
    borderTopColor: Colors.slate100,

    backgroundColor: Colors.white,
  },

  finishButton: {
    width: "100%",
    minHeight: 40,

    paddingHorizontal: 14,
    paddingVertical: 8,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,

    backgroundColor: Colors.primary,
  },

  finishButtonPressed: {
    opacity: 0.82,
  },

  finishButtonText: {
    color: Colors.white,

    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  // =========================================================
  // INTERAÇÃO
  // =========================================================

  pressed: {
    opacity: 0.72,
  },
});
