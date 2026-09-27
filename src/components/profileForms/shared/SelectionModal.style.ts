import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import {
  Dimensions,
  StyleSheet,
} from "react-native";

const { height: SCREEN_HEIGHT } =
  Dimensions.get("window");

export const styles = StyleSheet.create({
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