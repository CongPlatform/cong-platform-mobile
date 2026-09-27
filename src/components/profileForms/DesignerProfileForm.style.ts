import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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