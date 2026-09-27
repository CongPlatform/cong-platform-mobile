import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  // =========================================================
  // FORMULÁRIO
  // =========================================================

  form: {
    width: "100%",
    gap: 23,
  },

  // =========================================================
  // CABEÇALHO
  // =========================================================

  header: {
    gap: 5,
  },

  eyebrow: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 0.8,
  },

  title: {
    color: Colors.inkStrong,
    fontFamily: Fonts.bodyBold,
    fontSize: 26,
    lineHeight: 32,
  },

  description: {
    color: Colors.slate600,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 20,
  },

  // =========================================================
  // SEÇÕES
  // =========================================================

  section: {
    gap: 11,
  },

  sectionTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  required: {
    color: Colors.primary,
  },

  // =========================================================
  // TECNOLOGIAS SELECIONADAS
  // =========================================================

  selectedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  chip: {
    minHeight: 34,

    paddingLeft: 11,
    paddingRight: 5,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    borderWidth: 1,
    borderColor: Colors.primary200,
    borderRadius: 999,

    backgroundColor: Colors.primary50,
  },

  chipText: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
  },

  chipRemoveButton: {
    width: 27,
    height: 27,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 999,
  },

  // =========================================================
  // ADICIONAR TECNOLOGIAS
  // =========================================================

  addButton: {
    minHeight: 43,

    paddingHorizontal: 13,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    borderWidth: 1,
    borderColor: Colors.primary200,
    borderRadius: 11,

    backgroundColor: Colors.primary50,
  },

  addButtonText: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  // =========================================================
  // EXPERIÊNCIA
  // =========================================================

  segmentedControl: {
    flexDirection: "row",

    padding: 4,
    gap: 4,

    borderRadius: 12,

    backgroundColor: Colors.slate100,
  },

  segment: {
    flex: 1,
    minHeight: 40,

    paddingHorizontal: 5,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 9,
  },

  segmentSelected: {
    backgroundColor: Colors.white,
  },

  segmentText: {
    color: Colors.slate600,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    textAlign: "center",
  },

  segmentTextSelected: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodyBold,
  },

  // =========================================================
  // INDICADOR DE EXPERIÊNCIA
  // =========================================================

  experiencePreview: {
    padding: 13,
    gap: 11,

    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 13,

    backgroundColor: Colors.paperSoft,
  },

  experienceMeter: {
    flexDirection: "row",
    gap: 5,
  },

  experienceMeterItem: {
    flex: 1,
    height: 5,

    borderRadius: 999,

    backgroundColor: Colors.slate200,
  },

  experienceMeterActive: {
    backgroundColor: Colors.primary,
  },

  experienceCopy: {
    gap: 3,
  },

  experienceTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  experienceDescription: {
    color: Colors.slate600,
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 17,
  },

  // =========================================================
  // CAMPO
  // =========================================================

  field: {
    gap: 7,
  },

  fieldLabel: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  optional: {
    color: Colors.slate500,
    fontFamily: Fonts.body,
    fontSize: 10,
  },

  input: {
    minHeight: 46,

    paddingHorizontal: 13,

    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 11,

    backgroundColor: Colors.white,

    color: Colors.ink,
    fontFamily: Fonts.body,
    fontSize: 13,
  },

  // =========================================================
  // ERRO
  // =========================================================

  error: {
    paddingHorizontal: 12,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",

    gap: 7,

    borderWidth: 1,
    borderColor: Colors.red200,
    borderRadius: 11,

    backgroundColor: Colors.dangerSoft,
  },

  errorText: {
    flex: 1,

    color: Colors.dangerDark,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 16,
  },

  // =========================================================
  // FOOTER
  // =========================================================

  footer: {
    width: "100%",
  },

  submitButton: {
    width: "100%",
    minHeight: 48,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    borderRadius: 12,

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
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  pressed: {
    opacity: 0.7,
  },
});