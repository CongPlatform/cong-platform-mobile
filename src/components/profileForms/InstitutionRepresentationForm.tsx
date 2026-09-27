import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import {
    COMPANY_SUPPORT_OPTIONS,
    causeSelectionLabel,
    parseCauseSelection,
} from "@/data/profileCatalog";
import {
    BRAZIL_STATES,
    formatCep,
    formatCnpj,
    formatPhone,
    isValidCnpj,
    lookupCep,
    onlyDigits,
} from "@/utils/brazil";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import {
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import CauseSelectionModal from "./shared/CauseSelectionModal";
import SelectionModal from "./shared/SelectionModal";
import StateSelectModal from "./shared/StateSelectModal";
import CitySelectModal from "./shared/CitySelectModal";
// =========================================================
// TIPOS
// =========================================================

export type InitiativeKind =
    | "formal"
    | "independent"
    | "punctual";

export interface RepresentationDraft {
    name: string;
    legalName: string;
    cnpj: string;
    email: string;
    phone: string;
    description: string;
    cep: string;
    street: string;
    district: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    initiativeKind: InitiativeKind;
    areas: string[];
    supportTypes: string[];
}

export type OnboardingRepresentation =
    | "ngo"
    | "company";

interface InstitutionRepresentationFormProps {
    type: OnboardingRepresentation;
    draft: RepresentationDraft;
    saving: boolean;
    submitLabel?: string;
    onBack: () => void;

    onChange: <
        K extends keyof RepresentationDraft,
    >(
        field: K,
        value: RepresentationDraft[K],
    ) => void;

    onSubmit: () => void | Promise<void>;
}

type TouchKey =
    | "name"
    | "legalName"
    | "cnpj"
    | "email"
    | "phone"
    | "description"
    | "cep"
    | "number";

type CnpjCheckState =
    | { status: "idle" }
    | { status: "checking" }
    | { status: "available" }
    | {
        status: "duplicate";
        organizationName: string;
    }
    | { status: "error" };

// =========================================================
// HELPERS
// =========================================================

function isValidEmail(
    value: string,
): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        value.trim(),
    );
}

// =========================================================
// CHIPS
// =========================================================

interface SelectedItemsProps {
    values: string[];
    onRemove: (value: string) => void;
    getLabel?: (value: string) => string;
}

function SelectedItems({
    values,
    onRemove,
    getLabel = (value) => value,
}: SelectedItemsProps) {
    if (!values.length) {
        return null;
    }

    return (
        <View style={styles.selectedList}>
            {values.map((value) => (
                <View
                    key={value}
                    style={styles.chip}
                >
                    <Text
                        style={styles.chipText}
                        numberOfLines={1}
                    >
                        {getLabel(value)}
                    </Text>

                    <Pressable
                        style={styles.chipRemove}
                        onPress={() => onRemove(value)}
                        accessibilityRole="button"
                        accessibilityLabel={`Remover ${getLabel(
                            value,
                        )}`}
                    >
                        <MaterialIcons
                            name="close"
                            size={14}
                            color={Colors.slate500}
                        />
                    </Pressable>
                </View>
            ))}
        </View>
    );
}

// =========================================================
// FEEDBACK
// =========================================================

interface FieldFeedbackProps {
    tone: "neutral" | "valid" | "error";
    children: ReactNode;
}

function FieldFeedback({
    tone,
    children,
}: FieldFeedbackProps) {
    const icon =
        tone === "valid"
            ? "check-circle"
            : tone === "error"
                ? "error-outline"
                : null;

    return (
        <View style={styles.feedbackRow}>
            {icon ? (
                <MaterialIcons
                    name={icon}
                    size={14}
                    color={
                        tone === "valid"
                            ? Colors.greenVivid
                            : Colors.dangerDark
                    }
                />
            ) : null}

            <Text
                style={[
                    styles.fieldFeedback,
                    tone === "valid" &&
                    styles.fieldFeedbackValid,
                    tone === "error" &&
                    styles.fieldFeedbackError,
                ]}
            >
                {children}
            </Text>
        </View>
    );
}

// =========================================================
// FORMULÁRIO
// =========================================================

export default function InstitutionRepresentationForm({
    type,
    draft,
    saving,
    submitLabel,
    onBack,
    onChange,
    onSubmit,
}: InstitutionRepresentationFormProps) {
    const [areasOpen, setAreasOpen] =
        useState(false);

    const [supportOpen, setSupportOpen] =
        useState(false);

    const [stateOpen, setStateOpen] =
        useState(false);

    // MODAL DE CIDADE
    const [cityOpen, setCityOpen] =
        useState(false);

    const [cepLoading, setCepLoading] =
        useState(false);

    const [cepMessage, setCepMessage] =
        useState("");

    const [cepStatus, setCepStatus] =
        useState<"idle" | "valid" | "error">(
            "idle",
        );

    const [cnpjCheck, setCnpjCheck] =
        useState<CnpjCheckState>({
            status: "idle",
        });

    const [touched, setTouched] =
        useState<
            Partial<Record<TouchKey, boolean>>
        >({});

    const [
        validationAttempted,
        setValidationAttempted,
    ] = useState(false);

    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const currentCepRef = useRef(
        onlyDigits(draft.cep),
    );

    const lastResolvedCepRef =
        useRef("");

    const cepRequestRef = useRef(0);

    const currentCnpjRef = useRef(
        onlyDigits(draft.cnpj),
    );

    // =======================================================
    // REGRAS
    // =======================================================

    const kind: InitiativeKind =
        type === "company"
            ? "formal"
            : draft.initiativeKind;

    const requiresCnpj =
        type === "company" ||
        kind === "formal";

    const cnpjDigits = onlyDigits(
        draft.cnpj,
    );

    const cnpjComplete =
        cnpjDigits.length === 14;

    const cnpjValid =
        cnpjComplete &&
        isValidCnpj(draft.cnpj);

    const phoneDigits = onlyDigits(
        draft.phone,
    );

    const cepDigits = onlyDigits(
        draft.cep,
    );

    function markTouched(
        field: TouchKey,
    ) {
        setTouched((current) => ({
            ...current,
            [field]: true,
        }));
    }

    function shouldShow(
        field: TouchKey,
        hasValue: boolean,
    ) {
        return Boolean(
            touched[field] ||
            hasValue ||
            validationAttempted,
        );
    }

    // =======================================================
    // CEP
    // =======================================================

    function clearAddressFromPreviousCep() {
        onChangeRef.current("street", "");
        onChangeRef.current("district", "");
        onChangeRef.current("city", "");
        onChangeRef.current("state", "");
    }

    function handleCepChange(
        rawValue: string,
    ) {
        const formatted =
            formatCep(rawValue);

        const digits =
            onlyDigits(formatted);

        currentCepRef.current = digits;

        onChange("cep", formatted);

        if (
            lastResolvedCepRef.current &&
            digits !==
            lastResolvedCepRef.current
        ) {
            lastResolvedCepRef.current = "";

            clearAddressFromPreviousCep();
        }

        setCepMessage("");
        setCepStatus("idle");

        if (digits.length !== 8) {
            setCepLoading(false);
        }
    }

    useEffect(() => {
        const digits = onlyDigits(
            draft.cep,
        );

        currentCepRef.current = digits;

        if (
            digits.length !== 8 ||
            digits ===
            lastResolvedCepRef.current
        ) {
            return;
        }

        const requestId =
            ++cepRequestRef.current;

        const timer = setTimeout(() => {
            setCepLoading(true);

            setCepMessage(
                "Buscando endereço...",
            );

            setCepStatus("idle");

            void lookupCep(draft.cep)
                .then((address) => {
                    if (
                        requestId !==
                        cepRequestRef.current ||
                        currentCepRef.current !==
                        digits
                    ) {
                        return;
                    }

                    onChangeRef.current(
                        "street",
                        address.street,
                    );

                    onChangeRef.current(
                        "district",
                        address.district,
                    );

                    onChangeRef.current(
                        "city",
                        address.city,
                    );

                    onChangeRef.current(
                        "state",
                        address.state,
                    );

                    lastResolvedCepRef.current =
                        digits;

                    setCepStatus("valid");

                    setCepMessage(
                        `Endereço encontrado: ${address.street ||
                        "logradouro não informado"
                        }, ${address.district ||
                        "bairro não informado"
                        } - ${address.city}/${address.state}`,
                    );
                })
                .catch(() => {
                    if (
                        requestId !==
                        cepRequestRef.current ||
                        currentCepRef.current !==
                        digits
                    ) {
                        return;
                    }

                    setCepStatus("error");

                    setCepMessage(
                        "CEP não encontrado. Confira o número ou preencha o endereço manualmente.",
                    );
                })
                .finally(() => {
                    if (
                        requestId ===
                        cepRequestRef.current
                    ) {
                        setCepLoading(false);
                    }
                });
        }, 320);

        return () => {
            clearTimeout(timer);

            if (
                cepRequestRef.current ===
                requestId
            ) {
                cepRequestRef.current += 1;
            }
        };
    }, [draft.cep]);

    // =======================================================
    // CNPJ
    // =======================================================

    useEffect(() => {
        const digits = onlyDigits(draft.cnpj);

        currentCnpjRef.current = digits;

        if (
            !requiresCnpj ||
            digits.length !== 14 ||
            !isValidCnpj(draft.cnpj)
        ) {
            setCnpjCheck({
                status: "idle",
            });

            return;
        }

        /*
         * Por enquanto fazemos apenas a validação
         * local dos dígitos do CNPJ.
         *
         * A consulta de duplicidade será adicionada
         * quando o Supabase/backend for conectado.
         */
        setCnpjCheck({
            status: "available",
        });
    }, [
        draft.cnpj,
        requiresCnpj,
    ]);

    // =======================================================
    // VALIDAÇÕES
    // =======================================================

    const nameInvalid =
        draft.name.trim().length < 2;

    const legalNameInvalid =
        requiresCnpj &&
        draft.legalName.trim().length < 2;

    const emailInvalid =
        !isValidEmail(draft.email);

    const phoneInvalid =
        phoneDigits.length < 10 ||
        phoneDigits.length > 11;

    const descriptionInvalid =
        draft.description.trim().length <
        20;

    const cepInvalid =
        cepDigits.length !== 8;

    const numberInvalid =
        !draft.number.trim();

    const locationInvalid =
        !draft.city.trim() ||
        !BRAZIL_STATES.some(
            (state) =>
                state.code === draft.state,
        );

    const areasInvalid =
        draft.areas.filter(
            (value) =>
                !parseCauseSelection(value)
                    .subtopic,
        ).length === 0;

    const supportInvalid =
        type === "company" &&
        draft.supportTypes.length === 0;

    const duplicateCnpj =
        cnpjCheck.status === "duplicate";

    async function validateAndSubmit() {
        setValidationAttempted(true);

        setTouched({
            name: true,
            legalName: true,
            cnpj: true,
            email: true,
            phone: true,
            description: true,
            cep: true,
            number: true,
        });

        if (
            nameInvalid ||
            legalNameInvalid ||
            (requiresCnpj && !cnpjValid) ||
            duplicateCnpj ||
            emailInvalid ||
            phoneInvalid ||
            descriptionInvalid ||
            cepInvalid ||
            numberInvalid ||
            locationInvalid ||
            areasInvalid ||
            supportInvalid
        ) {
            return;
        }

        await onSubmit();
    }

    // =======================================================
    // RENDER
    // =======================================================

    return (
        <>
            <View style={styles.form}>
                {/* VOLTAR */}

                <Pressable
                    style={styles.backButton}
                    onPress={onBack}
                >
                    <MaterialIcons
                        name="arrow-back"
                        size={17}
                        color={Colors.primaryDark}
                    />

                    <Text
                        style={styles.backButtonText}
                    >
                        Voltar
                    </Text>
                </Pressable>

                {/* HEADER */}

                <View style={styles.header}>
                    <Text style={styles.eyebrow}>
                        Representação
                    </Text>

                    <Text style={styles.title}>
                        {type === "company"
                            ? "Empresa apoiadora"
                            : "Organização ou iniciativa"}
                    </Text>

                    <Text
                        style={styles.description}
                    >
                        {type === "company"
                            ? "Cadastre os dados essenciais da empresa."
                            : "Cadastre os dados essenciais da iniciativa."}
                    </Text>
                </View>

                {/* TIPO DE INICIATIVA */}

                {type === "ngo" ? (
                    <View style={styles.section}>
                        <Text
                            style={styles.sectionTitle}
                        >
                            Tipo de iniciativa{" "}
                            <Text
                                style={styles.required}
                            >
                                *
                            </Text>
                        </Text>

                        <View
                            style={
                                styles.segmentedControl
                            }
                        >
                            {(
                                [
                                    [
                                        "formal",
                                        "Organização formal",
                                    ],
                                    [
                                        "independent",
                                        "Projeto independente",
                                    ],
                                    [
                                        "punctual",
                                        "Ação pontual",
                                    ],
                                ] as const
                            ).map(([value, label]) => {
                                const selected =
                                    kind === value;

                                return (
                                    <Pressable
                                        key={value}
                                        style={[
                                            styles.segmentButton,
                                            selected &&
                                            styles.segmentSelected,
                                        ]}
                                        onPress={() => {
                                            onChange(
                                                "initiativeKind",
                                                value,
                                            );

                                            if (
                                                value !== "formal"
                                            ) {
                                                onChange(
                                                    "legalName",
                                                    "",
                                                );

                                                onChange(
                                                    "cnpj",
                                                    "",
                                                );

                                                setCnpjCheck({
                                                    status: "idle",
                                                });
                                            }
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.segmentText,
                                                selected &&
                                                styles.segmentTextSelected,
                                            ]}
                                        >
                                            {label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                ) : null}

                {/* NOME */}

                <View style={styles.section}>
                    <View style={styles.field}>
                        <Text
                            style={styles.fieldLabel}
                        >
                            {type === "company"
                                ? "Nome da empresa"
                                : kind === "punctual"
                                    ? "Nome da ação"
                                    : "Nome da iniciativa"}{" "}
                            *
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                shouldShow(
                                    "name",
                                    Boolean(draft.name),
                                ) &&
                                nameInvalid &&
                                styles.inputInvalid,
                            ]}
                            value={draft.name}
                            maxLength={120}
                            onBlur={() =>
                                markTouched("name")
                            }
                            onChangeText={(value) =>
                                onChange("name", value)
                            }
                        />

                        {shouldShow(
                            "name",
                            Boolean(draft.name),
                        ) && nameInvalid ? (
                            <FieldFeedback tone="error">
                                Use pelo menos 2 caracteres.
                            </FieldFeedback>
                        ) : null}
                    </View>

                    {/* RAZÃO SOCIAL / CNPJ */}

                    {requiresCnpj ? (
                        <>
                            <View style={styles.field}>
                                <Text
                                    style={
                                        styles.fieldLabel
                                    }
                                >
                                    Razão social *
                                </Text>

                                <TextInput
                                    style={[
                                        styles.input,
                                        shouldShow(
                                            "legalName",
                                            Boolean(
                                                draft.legalName,
                                            ),
                                        ) &&
                                        legalNameInvalid &&
                                        styles.inputInvalid,
                                    ]}
                                    value={draft.legalName}
                                    maxLength={160}
                                    onBlur={() =>
                                        markTouched(
                                            "legalName",
                                        )
                                    }
                                    onChangeText={(value) =>
                                        onChange(
                                            "legalName",
                                            value,
                                        )
                                    }
                                />

                                {shouldShow(
                                    "legalName",
                                    Boolean(draft.legalName),
                                ) &&
                                    legalNameInvalid ? (
                                    <FieldFeedback tone="error">
                                        Informe a razão social
                                        completa.
                                    </FieldFeedback>
                                ) : null}
                            </View>

                            <View style={styles.field}>
                                <Text
                                    style={
                                        styles.fieldLabel
                                    }
                                >
                                    CNPJ *
                                </Text>

                                <View
                                    style={
                                        styles.statusInput
                                    }
                                >
                                    <TextInput
                                        style={[
                                            styles.input,
                                            styles.statusTextInput,
                                            Boolean(
                                                draft.cnpj,
                                            ) &&
                                            (!cnpjValid ||
                                                duplicateCnpj) &&
                                            styles.inputInvalid,
                                        ]}
                                        keyboardType="number-pad"
                                        value={draft.cnpj}
                                        placeholder="00.000.000/0000-00"
                                        maxLength={18}
                                        onBlur={() =>
                                            markTouched("cnpj")
                                        }
                                        onChangeText={(
                                            value,
                                        ) => {
                                            const formatted =
                                                formatCnpj(value);

                                            onChange(
                                                "cnpj",
                                                formatted,
                                            );

                                            setCnpjCheck({
                                                status: "idle",
                                            });
                                        }}
                                    />

                                    {cnpjCheck.status ===
                                        "checking" ? (
                                        <View
                                            style={
                                                styles.loadingStatus
                                            }
                                        >
                                            <ActivityIndicator
                                                size="small"
                                                color={
                                                    Colors.primary
                                                }
                                            />
                                        </View>
                                    ) : null}
                                </View>

                                {shouldShow(
                                    "cnpj",
                                    Boolean(draft.cnpj),
                                ) &&
                                    !cnpjComplete ? (
                                    <FieldFeedback tone="error">
                                        Complete os 14 dígitos
                                        do CNPJ.
                                    </FieldFeedback>
                                ) : null}

                                {cnpjComplete &&
                                    !cnpjValid ? (
                                    <FieldFeedback tone="error">
                                        CNPJ inválido pelos
                                        dígitos verificadores.
                                    </FieldFeedback>
                                ) : null}

                                {cnpjValid &&
                                    cnpjCheck.status ===
                                    "checking" ? (
                                    <FieldFeedback tone="neutral">
                                        Verificando se este CNPJ
                                        já está cadastrado...
                                    </FieldFeedback>
                                ) : null}

                                {cnpjValid &&
                                    cnpjCheck.status ===
                                    "available" ? (
                                    <FieldFeedback tone="valid">
                                        CNPJ válido e disponível
                                        para cadastro.
                                    </FieldFeedback>
                                ) : null}

                                {cnpjValid &&
                                    cnpjCheck.status ===
                                    "duplicate" ? (
                                    <FieldFeedback tone="error">
                                        Este CNPJ já está
                                        cadastrado como “
                                        {
                                            cnpjCheck.organizationName
                                        }
                                        ”. Use a busca de
                                        instituições para
                                        solicitar vínculo.
                                    </FieldFeedback>
                                ) : null}

                                {cnpjValid &&
                                    cnpjCheck.status ===
                                    "error" ? (
                                    <FieldFeedback tone="neutral">
                                        Não foi possível conferir
                                        a duplicidade agora. O
                                        servidor validará
                                        novamente ao cadastrar.
                                    </FieldFeedback>
                                ) : null}
                            </View>
                        </>
                    ) : null}
                </View>

                {/* CONTATO */}

                <View style={styles.section}>
                    <View style={styles.field}>
                        <Text
                            style={styles.fieldLabel}
                        >
                            E-mail *
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                shouldShow(
                                    "email",
                                    Boolean(draft.email),
                                ) &&
                                emailInvalid &&
                                styles.inputInvalid,
                            ]}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={draft.email}
                            onBlur={() =>
                                markTouched("email")
                            }
                            onChangeText={(value) =>
                                onChange("email", value)
                            }
                        />

                        {shouldShow(
                            "email",
                            Boolean(draft.email),
                        ) && emailInvalid ? (
                            <FieldFeedback tone="error">
                                Digite um e-mail válido.
                            </FieldFeedback>
                        ) : null}
                    </View>

                    <View style={styles.field}>
                        <Text
                            style={styles.fieldLabel}
                        >
                            Telefone *
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                shouldShow(
                                    "phone",
                                    Boolean(draft.phone),
                                ) &&
                                phoneInvalid &&
                                styles.inputInvalid,
                            ]}
                            keyboardType="phone-pad"
                            value={draft.phone}
                            placeholder="(19) 99999-9999"
                            maxLength={15}
                            onBlur={() =>
                                markTouched("phone")
                            }
                            onChangeText={(value) =>
                                onChange(
                                    "phone",
                                    formatPhone(value),
                                )
                            }
                        />

                        {shouldShow(
                            "phone",
                            Boolean(draft.phone),
                        ) && phoneInvalid ? (
                            <FieldFeedback tone="error">
                                Informe DDD e telefone com 10
                                ou 11 dígitos.
                            </FieldFeedback>
                        ) : null}
                    </View>

                    <View style={styles.field}>
                        <Text
                            style={styles.fieldLabel}
                        >
                            Descrição *
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                styles.textarea,
                                shouldShow(
                                    "description",
                                    Boolean(
                                        draft.description,
                                    ),
                                ) &&
                                descriptionInvalid &&
                                styles.inputInvalid,
                            ]}
                            value={draft.description}
                            multiline
                            textAlignVertical="top"
                            maxLength={500}
                            placeholder={
                                kind === "punctual"
                                    ? "Explique o objetivo da ação e como ela funciona."
                                    : "Conte brevemente o que a iniciativa faz."
                            }
                            onBlur={() =>
                                markTouched(
                                    "description",
                                )
                            }
                            onChangeText={(value) =>
                                onChange(
                                    "description",
                                    value,
                                )
                            }
                        />

                        <FieldFeedback
                            tone={
                                descriptionInvalid &&
                                    shouldShow(
                                        "description",
                                        Boolean(
                                            draft.description,
                                        ),
                                    )
                                    ? "error"
                                    : "neutral"
                            }
                        >
                            {draft.description.trim()
                                .length}
                            /500 caracteres · mínimo de
                            20.
                        </FieldFeedback>
                    </View>
                </View>

                {/* LOCALIZAÇÃO */}

                <View style={styles.section}>
                    <Text
                        style={styles.sectionTitle}
                    >
                        Localização{" "}
                        <Text style={styles.required}>
                            *
                        </Text>
                    </Text>

                    <View style={styles.field}>
                        <Text
                            style={styles.fieldLabel}
                        >
                            CEP *
                        </Text>

                        <View
                            style={styles.statusInput}
                        >
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.statusTextInput,
                                    shouldShow(
                                        "cep",
                                        Boolean(draft.cep),
                                    ) &&
                                    cepInvalid &&
                                    styles.inputInvalid,
                                ]}
                                keyboardType="number-pad"
                                value={draft.cep}
                                placeholder="00000-000"
                                maxLength={9}
                                onBlur={() =>
                                    markTouched("cep")
                                }
                                onChangeText={
                                    handleCepChange
                                }
                            />

                            {cepLoading ? (
                                <View
                                    style={
                                        styles.loadingStatus
                                    }
                                >
                                    <ActivityIndicator
                                        size="small"
                                        color={Colors.primary}
                                    />
                                </View>
                            ) : null}
                        </View>

                        {shouldShow(
                            "cep",
                            Boolean(draft.cep),
                        ) &&
                            cepDigits.length > 0 &&
                            cepDigits.length < 8 ? (
                            <FieldFeedback tone="error">
                                Complete os 8 dígitos do CEP.
                            </FieldFeedback>
                        ) : null}

                        {cepMessage ? (
                            <FieldFeedback
                                tone={
                                    cepStatus === "valid"
                                        ? "valid"
                                        : cepStatus === "error"
                                            ? "error"
                                            : "neutral"
                                }
                            >
                                {cepMessage}
                            </FieldFeedback>
                        ) : null}
                    </View>

                    {cepDigits.length === 8 ? (
                        <>
                            <View style={styles.field}>
                                <Text
                                    style={
                                        styles.fieldLabel
                                    }
                                >
                                    Logradouro *
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    value={draft.street}
                                    maxLength={140}
                                    placeholder="Rua, avenida, estrada..."
                                    onChangeText={(value) =>
                                        onChange(
                                            "street",
                                            value,
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.field}>
                                <Text
                                    style={
                                        styles.fieldLabel
                                    }
                                >
                                    Número *
                                </Text>

                                <TextInput
                                    style={[
                                        styles.input,
                                        shouldShow(
                                            "number",
                                            Boolean(
                                                draft.number,
                                            ),
                                        ) &&
                                        numberInvalid &&
                                        styles.inputInvalid,
                                    ]}
                                    value={draft.number}
                                    maxLength={20}
                                    placeholder="S/N"
                                    onBlur={() =>
                                        markTouched("number")
                                    }
                                    onChangeText={(value) =>
                                        onChange(
                                            "number",
                                            value,
                                        )
                                    }
                                />

                                {shouldShow(
                                    "number",
                                    Boolean(draft.number),
                                ) &&
                                    numberInvalid ? (
                                    <FieldFeedback tone="error">
                                        Informe o número ou use
                                        S/N.
                                    </FieldFeedback>
                                ) : null}
                            </View>

                            <View style={styles.field}>
                                <Text
                                    style={
                                        styles.fieldLabel
                                    }
                                >
                                    Bairro
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    value={draft.district}
                                    maxLength={100}
                                    onChangeText={(value) =>
                                        onChange(
                                            "district",
                                            value,
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.field}>
                                <Text
                                    style={
                                        styles.fieldLabel
                                    }
                                >
                                    Complemento{" "}
                                    <Text
                                        style={
                                            styles.optional
                                        }
                                    >
                                        opcional
                                    </Text>
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    value={draft.complement}
                                    maxLength={100}
                                    onChangeText={(value) =>
                                        onChange(
                                            "complement",
                                            value,
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.field}>
                                <Text style={styles.fieldLabel}>
                                    Cidade *
                                </Text>

                                <Pressable
                                    style={[
                                        styles.selectField,
                                        !draft.state &&
                                        styles.selectFieldDisabled,
                                    ]}
                                    disabled={!draft.state}
                                    onPress={() => setCityOpen(true)}
                                >
                                    <Text
                                        style={[
                                            styles.selectFieldText,
                                            !draft.city &&
                                            styles.placeholder,
                                            !draft.state &&
                                            styles.selectFieldTextDisabled,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {draft.city
                                            ? draft.city
                                            : draft.state
                                                ? "Selecione a cidade"
                                                : "Selecione uma UF primeiro"}
                                    </Text>

                                    <MaterialIcons
                                        name="keyboard-arrow-down"
                                        size={21}
                                        color={
                                            draft.state
                                                ? Colors.slate500
                                                : Colors.slate400
                                        }
                                    />
                                </Pressable>
                            </View>

                            <View style={styles.field}>
                                <Text
                                    style={
                                        styles.fieldLabel
                                    }
                                >
                                    UF *
                                </Text>

                                <Pressable
                                    style={styles.selectField}
                                    onPress={() =>
                                        setStateOpen(true)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.selectFieldText,
                                            !draft.state &&
                                            styles.placeholder,
                                        ]}
                                    >
                                        {draft.state
                                            ? `${draft.state
                                            } - ${BRAZIL_STATES.find(
                                                (state) =>
                                                    state.code ===
                                                    draft.state,
                                            )?.name ?? ""
                                            }`
                                            : "Selecione"}
                                    </Text>

                                    <MaterialIcons
                                        name="keyboard-arrow-down"
                                        size={21}
                                        color={
                                            Colors.slate500
                                        }
                                    />
                                </Pressable>
                            </View>

                            {validationAttempted &&
                                locationInvalid ? (
                                <FieldFeedback tone="error">
                                    Confirme cidade e UF antes
                                    de continuar.
                                </FieldFeedback>
                            ) : null}
                        </>
                    ) : null}
                </View>

                {/* ÁREAS / CAUSAS */}

                <View style={styles.section}>
                    <Text
                        style={styles.sectionTitle}
                    >
                        {type === "company"
                            ? "Causas que deseja apoiar"
                            : "Áreas de atuação"}{" "}
                        <Text style={styles.required}>
                            *
                        </Text>
                    </Text>

                    <SelectedItems
                        values={draft.areas}
                        getLabel={
                            causeSelectionLabel
                        }
                        onRemove={(value) => {
                            const parsed =
                                parseCauseSelection(value);

                            onChange(
                                "areas",
                                parsed.subtopic
                                    ? draft.areas.filter(
                                        (item) =>
                                            item !== value,
                                    )
                                    : draft.areas.filter(
                                        (item) =>
                                            parseCauseSelection(
                                                item,
                                            ).parent !==
                                            parsed.parent,
                                    ),
                            );
                        }}
                    />

                    <Pressable
                        style={styles.addButton}
                        onPress={() =>
                            setAreasOpen(true)
                        }
                    >
                        <MaterialIcons
                            name="add"
                            size={17}
                            color={Colors.primary}
                        />

                        <Text
                            style={
                                styles.addButtonText
                            }
                        >
                            {type === "company"
                                ? "Adicionar causas"
                                : "Adicionar áreas"}
                        </Text>
                    </Pressable>

                    {validationAttempted &&
                        areasInvalid ? (
                        <FieldFeedback tone="error">
                            Escolha pelo menos uma causa
                            principal.
                        </FieldFeedback>
                    ) : null}
                </View>

                {/* APOIO DA EMPRESA */}

                {type === "company" ? (
                    <View style={styles.section}>
                        <Text
                            style={styles.sectionTitle}
                        >
                            Como pode apoiar{" "}
                            <Text
                                style={styles.required}
                            >
                                *
                            </Text>
                        </Text>

                        <SelectedItems
                            values={draft.supportTypes}
                            onRemove={(value) =>
                                onChange(
                                    "supportTypes",
                                    draft.supportTypes.filter(
                                        (item) =>
                                            item !== value,
                                    ),
                                )
                            }
                        />

                        <Pressable
                            style={styles.addButton}
                            onPress={() =>
                                setSupportOpen(true)
                            }
                        >
                            <MaterialIcons
                                name="add"
                                size={17}
                                color={Colors.primary}
                            />

                            <Text
                                style={
                                    styles.addButtonText
                                }
                            >
                                Adicionar formas de apoio
                            </Text>
                        </Pressable>

                        {validationAttempted &&
                            supportInvalid ? (
                            <FieldFeedback tone="error">
                                Escolha pelo menos uma forma
                                de apoio.
                            </FieldFeedback>
                        ) : null}
                    </View>
                ) : null}

                {/* SUBMIT */}

                <View style={styles.footer}>
                    <Pressable
                        style={[
                            styles.submitButton,
                            (saving ||
                                cnpjCheck.status ===
                                "checking") &&
                            styles.submitDisabled,
                        ]}
                        disabled={
                            saving ||
                            cnpjCheck.status ===
                            "checking"
                        }
                        onPress={() =>
                            void validateAndSubmit()
                        }
                    >
                        {saving ? (
                            <ActivityIndicator
                                size="small"
                                color={Colors.ink}
                            />
                        ) : null}

                        <Text
                            style={
                                styles.submitButtonText
                            }
                        >
                            {saving
                                ? "Cadastrando..."
                                : (submitLabel ??
                                    "Cadastrar e continuar")}
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* MODAIS */}

            <CauseSelectionModal
                open={areasOpen}
                title={
                    type === "company"
                        ? "Causas de interesse"
                        : "Áreas de atuação"
                }
                description={
                    type === "company"
                        ? "Escolha as causas principais e marque subtópicos para deixar o interesse da empresa mais específico."
                        : "Escolha as áreas principais e marque subtópicos que descrevem melhor a atuação da iniciativa."
                }
                selected={draft.areas}
                maxParents={5}
                onChange={(next) =>
                    onChange("areas", next)
                }
                onClose={() =>
                    setAreasOpen(false)
                }
            />

            <SelectionModal
                open={supportOpen}
                title="Formas de apoio"
                options={
                    COMPANY_SUPPORT_OPTIONS
                }
                selected={draft.supportTypes}
                maxSelected={8}
                allowCustom
                customLabel="Adicionar outra forma de apoio"
                onChange={(next) =>
                    onChange(
                        "supportTypes",
                        next,
                    )
                }
                onClose={() =>
                    setSupportOpen(false)
                }
            />

            <CitySelectModal
                open={cityOpen}
                state={draft.state}
                selected={draft.city}
                onSelect={(value) =>
                    onChange("city", value)
                }
                onClose={() =>
                    setCityOpen(false)
                }
            />

            <StateSelectModal
                open={stateOpen}
                selected={draft.state}
                onSelect={(value) => {
                    if (value !== draft.state) {
                        onChange("state", value);
                        onChange("city", "");
                    }
                }}
                onClose={() =>
                    setStateOpen(false)
                }
            />     
        </>
    );
}
const styles = StyleSheet.create({
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
