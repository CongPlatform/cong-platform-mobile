import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  form: {
    width: "100%",
    gap: 18,
  },

  // =========================================================
  // HEADER
  // =========================================================

  header: {
    gap: 5,
    marginBottom: 4,
  },

  eyebrow: {
    color: Colors.primary,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  title: {
    color: Colors.inkStrong,
    fontFamily: Fonts.bodyBold,
    fontSize: 25,
    lineHeight: 31,
  },

  description: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },

  // =========================================================
  // SEÇÕES
  // =========================================================

  section: {
    gap: 11,
  },

  sectionTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 14,
    lineHeight: 19,
  },

  required: {
    color: Colors.dangerDark,
  },

  // =========================================================
  // CHIPS
  // =========================================================

  selectedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  chip: {
    minHeight: 32,
    paddingLeft: 10,
    paddingRight: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primary100,
    borderRadius: 999,
    backgroundColor: Colors.primary50,
  },

  chipText: {
    flexShrink: 1,
    color: Colors.primaryDark,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
  },

  chipRemove: {
    width: 27,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },

  // =========================================================
  // BOTÃO ADICIONAR
  // =========================================================

  addButton: {
    minHeight: 43,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.primary200,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },

  addButtonText: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  // =========================================================
  // LOCALIZAÇÃO
  // =========================================================

  locationGrid: {
    gap: 12,
  },

  inlineField: {
    gap: 7,
  },

  fieldLabel: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  selectField: {
    width: "100%",
    minHeight: 46,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 11,
    backgroundColor: Colors.white,
  },

  selectFieldDisabled: {
    opacity: 0.5,
  },

  selectFieldText: {
    flex: 1,
    color: Colors.ink,
    fontFamily: Fonts.body,
    fontSize: 13,
  },

  placeholderText: {
    color: Colors.slate500,
  },

  textAction: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  textActionText: {
    flexShrink: 1,
    color: Colors.dangerDark,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    lineHeight: 17,
  },

  // =========================================================
  // CHECKBOX REMOTO
  // =========================================================

  checkboxLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  checkbox: {
    width: 21,
    height: 21,
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

  checkboxLineText: {
    flex: 1,
    color: Colors.ink,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },

  // =========================================================
  // TIPO DE OPORTUNIDADE
  // =========================================================

  choiceCards: {
    gap: 8,
  },

  choiceCard: {
    minHeight: 70,
    paddingHorizontal: 13,
    paddingVertical: 11,
    justifyContent: "center",
    gap: 3,
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },

  choiceCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary50,
  },

  choiceCardTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  choiceCardTitleSelected: {
    color: Colors.primaryDark,
  },

  choiceCardDescription: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },

  // =========================================================
  // DISPONIBILIDADE
  // =========================================================

  availabilityCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 13,
    backgroundColor: Colors.white,
  },

  availabilityHeader: {
    padding: 13,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate100,
  },

  availabilityHeaderCopy: {
    flex: 1,
    gap: 2,
  },

  availabilityTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  availabilityDescription: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 16,
  },

  changeButtonText: {
    color: Colors.primary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  availabilityMeta: {
    padding: 13,
    gap: 12,
  },

  summaryItem: {
    gap: 4,
  },

  summaryLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  summaryLabelText: {
    color: Colors.slate500,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
  },

  summaryValue: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 17,
  },

  // =========================================================
  // LINK
  // =========================================================

  inlineLink: {
    alignSelf: "flex-start",
    paddingVertical: 4,
  },

  inlineLinkText: {
    color: Colors.primary,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    textDecorationLine: "underline",
  },

  // =========================================================
  // ERRO
  // =========================================================

  errorBox: {
    paddingHorizontal: 11,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    borderRadius: 9,
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
    paddingTop: 4,
  },

  submitButton: {
    width: "100%",
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 11,
    backgroundColor: Colors.primary,
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
  // MODAL SELECT
  // =========================================================

  selectBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor:
      "rgba(9, 22, 38, 0.48)",
  },

  selectDialog: {
    width: "100%",
    maxHeight: "75%",
    overflow: "hidden",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: Colors.white,
  },

  selectHeader: {
    minHeight: 62,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate100,
  },

  selectTitle: {
    flex: 1,
    color: Colors.inkStrong,
    fontFamily: Fonts.bodyBold,
    fontSize: 17,
  },

  selectClose: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  selectList: {
    flexShrink: 1,
  },

  selectListContent: {
    padding: 12,
    gap: 6,
  },

  selectOption: {
    minHeight: 46,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderRadius: 10,
  },

  selectOptionSelected: {
    backgroundColor: Colors.primary50,
  },

  selectOptionText: {
    flex: 1,
    color: Colors.ink,
    fontFamily: Fonts.body,
    fontSize: 13,
  },

  selectOptionTextSelected: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodyBold,
  },

  // =========================================================
  // INTERAÇÃO
  // =========================================================

  pressed: {
    opacity: 0.72,
  },
});