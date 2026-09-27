import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import {
  Dimensions,
  StyleSheet,
} from "react-native";

const SCREEN_HEIGHT =
  Dimensions.get("window").height;

export const styles = StyleSheet.create({
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