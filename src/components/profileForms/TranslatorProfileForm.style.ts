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