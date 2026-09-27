import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

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