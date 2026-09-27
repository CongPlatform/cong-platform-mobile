import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        justifyContent: "center",
        padding: 20,
    },

    dialog: {
        width: "100%",
        maxHeight: "78%",
        backgroundColor: Colors.white,
        borderRadius: 20,
        overflow: "hidden",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 14,
    },

    title: {
        flex: 1,
        fontFamily: Fonts.bodyBold,
        fontSize: Fonts.lg,
        color: Colors.ink,
    },

    closeButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },

    search: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        marginBottom: 14,
        paddingHorizontal: 14,
        minHeight: 46,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        backgroundColor: Colors.surfaceSoft,
        gap: 8,
    },

    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontFamily: Fonts.body,
        fontSize: Fonts.sm,
        color: Colors.ink,
    },

    searchClear: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 8,
    },

    option: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        backgroundColor: Colors.white,
    },

    optionSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary50,
    },

    optionText: {
        flex: 1,
        fontFamily: Fonts.bodyMedium,
        fontSize: Fonts.sm,
        color: Colors.ink,
    },

    optionTextSelected: {
        fontFamily: Fonts.bodySemiBold,
        color: Colors.primary,
    },

    status: {
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        gap: 10,
    },

    statusText: {
        fontFamily: Fonts.body,
        fontSize: Fonts.sm,
        color: Colors.muted,
    },

    empty: {
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
        gap: 6,
    },

    emptyTitle: {
        fontFamily: Fonts.bodySemiBold,
        fontSize: Fonts.sm,
        color: Colors.ink,
        textAlign: "center",
    },

    emptyText: {
        fontFamily: Fonts.body,
        fontSize: Fonts.xs,
        color: Colors.muted,
        textAlign: "center",
    },
});