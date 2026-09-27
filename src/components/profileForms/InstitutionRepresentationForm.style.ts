import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    form: {
        width: "100%",
        gap: 22,
    },

    backButton: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    backButtonText: {
        color: Colors.primaryDark,
        fontFamily: Fonts.bodyBold,
        fontSize: 13,
    },

    header: {
        gap: 5,
    },

    eyebrow: {
        color: Colors.primary,
        fontFamily: Fonts.bodyExtraBold,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    title: {
        color: Colors.ink,
        fontFamily: Fonts.bodyBold,
        fontSize: 25,
        lineHeight: 31,
    },

    description: {
        color: Colors.muted,
        fontFamily: Fonts.body,
        fontSize: 14,
        lineHeight: 20,
    },

    section: {
        gap: 11,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.slate200,
    },

    sectionTitle: {
        color: Colors.ink,
        fontFamily: Fonts.bodyExtraBold,
        fontSize: 15,
    },

    required: {
        color: Colors.primary,
    },

    // =========================================================
    // SEGMENTADO
    // =========================================================

    segmentedControl: {
        width: "100%",
        padding: 3,
        gap: 3,
        borderWidth: 1,
        borderColor: Colors.slate200,
        borderRadius: 11,
        backgroundColor: Colors.slate50,
    },

    segmentButton: {
        minHeight: 39,
        paddingHorizontal: 12,
        paddingVertical: 7,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },

    segmentSelected: {
        backgroundColor: Colors.white,
    },

    segmentText: {
        color: Colors.slate600,
        fontFamily: Fonts.bodyBold,
        fontSize: 13,
    },

    segmentTextSelected: {
        color: Colors.primaryDark,
    },

    // =========================================================
    // CAMPOS
    // =========================================================

    field: {
        gap: 6,
    },

    fieldLabel: {
        color: Colors.ink,
        fontFamily: Fonts.bodyBold,
        fontSize: 13,
    },

    input: {
        width: "100%",
        minHeight: 43,
        paddingHorizontal: 11,
        paddingVertical: 9,
        borderWidth: 1,
        borderColor: Colors.slate300,
        borderRadius: 10,
        backgroundColor: Colors.white,
        color: Colors.ink,
        fontFamily: Fonts.body,
        fontSize: 14,
    },

    inputInvalid: {
        borderColor: Colors.dangerDark,
    },

    textarea: {
        minHeight: 100,
        maxHeight: 100,
    },

    optional: {
        color: Colors.muted,
        fontFamily: Fonts.body,
        fontSize: 12,
    },

    statusInput: {
        position: "relative",
    },

    statusTextInput: {
        paddingRight: 48,
    },

    loadingStatus: {
        position: "absolute",
        right: 12,
        top: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    // =========================================================
    // FEEDBACK
    // =========================================================

    feedbackRow: {
        minHeight: 18,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 5,
    },

    fieldFeedback: {
        flex: 1,
        color: Colors.slate500,
        fontFamily: Fonts.body,
        fontSize: 12,
        lineHeight: 17,
    },

    fieldFeedbackValid: {
        color: Colors.greenVivid,
    },

    fieldFeedbackError: {
        color: Colors.dangerDark,
    },

    // =========================================================
    // SELECT
    // =========================================================

    selectField: {
        width: "100%",
        minHeight: 43,
        paddingHorizontal: 11,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        borderWidth: 1,
        borderColor: Colors.slate300,
        borderRadius: 10,
        backgroundColor: Colors.white,
    },

    selectFieldText: {
        flex: 1,
        color: Colors.ink,
        fontFamily: Fonts.body,
        fontSize: 14,
    },

    placeholder: {
        color: Colors.muted,
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
        maxWidth: "100%",
        paddingLeft: 10,
        paddingRight: 5,
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderWidth: 1,
        borderColor: Colors.slate200,
        borderRadius: 999,
        backgroundColor: Colors.slate50,
    },

    chipText: {
        flexShrink: 1,
        color: Colors.ink,
        fontFamily: Fonts.body,
        fontSize: 13,
    },

    chipRemove: {
        width: 25,
        height: 25,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
    },

    // =========================================================
    // ADICIONAR
    // =========================================================

    addButton: {
        minHeight: 39,
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: Colors.primary200,
        borderRadius: 10,
        backgroundColor: Colors.slate50,
    },

    addButtonText: {
        color: Colors.primaryDark,
        fontFamily: Fonts.bodyBold,
        fontSize: 13,
    },

    // =========================================================
    // FOOTER
    // =========================================================

    footer: {
        paddingTop: 10,
    },

    submitButton: {
        width: "100%",
        minHeight: 44,
        paddingHorizontal: 17,
        paddingVertical: 9,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 10,
        backgroundColor: Colors.accent,
    },

    submitDisabled: {
        opacity: 0.58,
    },

    submitButtonText: {
        color: Colors.ink,
        fontFamily: Fonts.bodyExtraBold,
        fontSize: 14,
    },

    // =========================================================
    // MODAL UF
    // =========================================================

    modalBackdrop: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor:
            "rgba(9, 22, 38, 0.48)",
    },

    modalDialog: {
        width: "100%",
        maxHeight: "75%",
        overflow: "hidden",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        backgroundColor: Colors.white,
    },

    modalHeader: {
        minHeight: 62,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate100,
    },

    modalTitle: {
        flex: 1,
        color: Colors.ink,
        fontFamily: Fonts.bodyBold,
        fontSize: 17,
    },

    modalClose: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },

    modalContent: {
        padding: 12,
        gap: 5,
    },

    stateOption: {
        minHeight: 45,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        borderRadius: 9,
    },

    stateOptionSelected: {
        backgroundColor: Colors.primary50,
    },

    stateOptionText: {
        flex: 1,
        color: Colors.ink,
        fontFamily: Fonts.body,
        fontSize: 13,
    },

    stateOptionTextSelected: {
        color: Colors.primaryDark,
        fontFamily: Fonts.bodyBold,
    },

    stateSearchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,

        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 4,

        minHeight: 46,
        paddingHorizontal: 12,

        backgroundColor: Colors.white,

        borderWidth: 1,
        borderColor: Colors.borderStrong,
        borderRadius: 12,
    },

    stateSearchInput: {
        flex: 1,
        minHeight: 44,
        paddingVertical: 0,

        color: Colors.ink,
        fontFamily: Fonts.body,
        fontSize: Fonts.sm,
    },

    stateSearchClear: {
        width: 32,
        height: 32,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 16,
    },

    stateSearchEmpty: {
        alignItems: "center",
        justifyContent: "center",

        paddingHorizontal: 24,
        paddingVertical: 36,
    },

    stateSearchEmptyTitle: {
        marginTop: 10,

        color: Colors.ink,
        fontFamily: Fonts.bodySemiBold,
        fontSize: Fonts.sm,
        textAlign: "center",
    },

    stateSearchEmptyText: {
        marginTop: 4,

        color: Colors.muted,
        fontFamily: Fonts.body,
        fontSize: Fonts.xs,
        lineHeight: 18,
        textAlign: "center",
    },

    locationSearch: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,

        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 6,

        minHeight: 46,
        paddingHorizontal: 12,

        backgroundColor: Colors.white,

        borderWidth: 1,
        borderColor: Colors.borderStrong,
        borderRadius: 12,
    },

    locationSearchInput: {
        flex: 1,
        minHeight: 44,
        paddingVertical: 0,

        color: Colors.ink,
        fontFamily: Fonts.body,
        fontSize: Fonts.sm,
    },

    locationSearchClear: {
        width: 32,
        height: 32,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 16,
    },

    locationLoading: {
        minHeight: 180,

        alignItems: "center",
        justifyContent: "center",
        gap: 10,

        padding: 24,
    },

    locationLoadingText: {
        color: Colors.muted,
        fontFamily: Fonts.body,
        fontSize: Fonts.sm,
    },

    locationEmpty: {
        minHeight: 160,

        alignItems: "center",
        justifyContent: "center",

        paddingHorizontal: 24,
        paddingVertical: 28,
    },

    locationEmptyTitle: {
        marginTop: 10,

        color: Colors.ink,
        fontFamily: Fonts.bodySemiBold,
        fontSize: Fonts.sm,
        textAlign: "center",
    },

    locationEmptyText: {
        marginTop: 4,

        color: Colors.muted,
        fontFamily: Fonts.body,
        fontSize: Fonts.xs,
        lineHeight: 18,
        textAlign: "center",
    },

    cityModalState: {
        marginTop: 3,

        color: Colors.muted,
        fontFamily: Fonts.body,
        fontSize: Fonts.xs,
    },

    selectFieldDisabled: {
        opacity: 0.55,
    },

    selectFieldTextDisabled: {
        color: Colors.slate400,
    },
});