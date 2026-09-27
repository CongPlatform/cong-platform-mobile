import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import { getCitiesByState } from "@/utils/brazil";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

interface CitySelectModalProps {
    open: boolean;
    state: string;
    selected: string;
    onSelect: (value: string) => void;
    onClose: () => void;
}

function normalizeSearchText(value: string) {
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export default function CitySelectModal({
    open,
    state,
    selected,
    onSelect,
    onClose,
}: CitySelectModalProps) {
    const [search, setSearch] = useState("");
    const [cities, setCities] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open || !state) {
            return;
        }

        let active = true;

        setLoading(true);
        setError("");
        setCities([]);

        void getCitiesByState(state)
            .then((result) => {
                if (active) {
                    setCities(result);
                }
            })
            .catch(() => {
                if (active) {
                    setError(
                        "Não foi possível carregar as cidades agora.",
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [open, state]);

    const normalizedSearch = normalizeSearchText(search);

    const filteredCities = cities.filter((city) =>
        !normalizedSearch
            ? true
            : normalizeSearchText(city).includes(normalizedSearch),
    );

    function handleClose() {
        setSearch("");
        onClose();
    }

    function handleSelect(city: string) {
        setSearch("");
        onSelect(city);
        onClose();
    }

    return (
        <Modal
            visible={open}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            <Pressable
                style={styles.backdrop}
                onPress={handleClose}
            >
                <Pressable
                    style={styles.dialog}
                    onPress={(event) => event.stopPropagation()}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Selecione a cidade
                        </Text>

                        <Pressable
                            style={styles.closeButton}
                            onPress={handleClose}
                        >
                            <MaterialIcons
                                name="close"
                                size={20}
                                color={Colors.slate600}
                            />
                        </Pressable>
                    </View>

                    <View style={styles.search}>
                        <MaterialIcons
                            name="search"
                            size={20}
                            color={Colors.slate500}
                        />

                        <TextInput
                            style={styles.searchInput}
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Pesquisar cidade..."
                            placeholderTextColor={Colors.slate500}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />

                        {search ? (
                            <Pressable
                                style={styles.searchClear}
                                onPress={() => setSearch("")}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={18}
                                    color={Colors.slate500}
                                />
                            </Pressable>
                        ) : null}
                    </View>

                    {loading ? (
                        <View style={styles.status}>
                            <ActivityIndicator
                                size="small"
                                color={Colors.primary}
                            />

                            <Text style={styles.statusText}>
                                Carregando cidades...
                            </Text>
                        </View>
                    ) : error ? (
                        <View style={styles.empty}>
                            <MaterialIcons
                                name="error-outline"
                                size={28}
                                color={Colors.slate400}
                            />

                            <Text style={styles.emptyTitle}>
                                Não foi possível carregar
                            </Text>

                            <Text style={styles.emptyText}>
                                {error}
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            contentContainerStyle={styles.content}
                            keyboardShouldPersistTaps="handled"
                        >
                            {filteredCities.length > 0 ? (
                                filteredCities.map((city) => {
                                    const active =
                                        city === selected;

                                    return (
                                        <Pressable
                                            key={city}
                                            style={[
                                                styles.option,
                                                active &&
                                                    styles.optionSelected,
                                            ]}
                                            onPress={() =>
                                                handleSelect(city)
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    active &&
                                                        styles.optionTextSelected,
                                                ]}
                                            >
                                                {city}
                                            </Text>

                                            {active ? (
                                                <MaterialIcons
                                                    name="check"
                                                    size={18}
                                                    color={Colors.primary}
                                                />
                                            ) : null}
                                        </Pressable>
                                    );
                                })
                            ) : (
                                <View style={styles.empty}>
                                    <MaterialIcons
                                        name="search-off"
                                        size={28}
                                        color={Colors.slate400}
                                    />

                                    <Text style={styles.emptyTitle}>
                                        Nenhuma cidade encontrada
                                    </Text>

                                    <Text style={styles.emptyText}>
                                        Tente pesquisar outro nome.
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
}
const styles = StyleSheet.create({
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
