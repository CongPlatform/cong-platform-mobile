import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import {
  VOLUNTEER_ACTIVITY_OPTIONS,
  causeSelectionLabel,
  parseCauseSelection,
} from "@/data/profileCatalog";
import {
  BRAZIL_STATES,
  getCitiesByState,
} from "@/utils/brazil";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import AvailabilityModal, {
  type AvailabilityDetails,
} from "./shared/AvailabilityModal";
import CauseSelectionModal from "./shared/CauseSelectionModal";
import SelectionModal from "./shared/SelectionModal";
import StateSelectModal from "./shared/StateSelectModal";
import CitySelectModal from "./shared/CitySelectModal";

// =========================================================
// TIPOS
// =========================================================

export type VolunteerOpportunityPreference =
  | "recurring"
  | "punctual"
  | "both";

export type VolunteerFrequency =
  | "punctual"
  | "monthly"
  | "weekly"
  | "flexible";

export interface VolunteerLocation {
  city?: string;
  state?: string;
  radiusKm?: number;
  remote: boolean;
}

export interface VolunteerProfileFormData {
  causes: string[];
  interestAreas: string[];
  availability: string;

  location?: VolunteerLocation;

  availabilityDetails?: {
    days: string[];
    periods: string[];
    frequency?: VolunteerFrequency;
  };

  opportunityPreference:
  VolunteerOpportunityPreference;
}

interface VolunteerProfileFormProps
  extends VolunteerProfileFormData {
  completed: boolean;
  saving: boolean;
  submitLabel?: string;

  onChange: (
    data: VolunteerProfileFormData,
  ) => void;

  onOpenParticipationChoices?: () => void;

  onSubmit: (
    data: VolunteerProfileFormData,
  ) => void | Promise<void>;
}

// =========================================================
// OPÇÕES
// =========================================================

const FREQUENCY_LABELS: Record<
  VolunteerFrequency,
  string
> = {
  punctual: "Pontualmente",
  monthly: "Algumas vezes por mês",
  weekly: "Toda semana",
  flexible: "Disponibilidade variável",
};

const OPPORTUNITY_OPTIONS = [
  {
    value: "recurring",
    label: "Recorrentes",
    description:
      "Participações contínuas em rotinas, equipes ou projetos ativos.",
  },
  {
    value: "punctual",
    label: "Pontuais",
    description:
      "Ações com começo e fim definidos, como eventos, mutirões e campanhas.",
  },
  {
    value: "both",
    label: "Ambos",
    description:
      "Quero receber oportunidades recorrentes e também pontuais.",
  },
] as const;

const RADIUS_OPTIONS = [
  {
    value: 5,
    label: "Até 5 km",
  },
  {
    value: 10,
    label: "Até 10 km",
  },
  {
    value: 25,
    label: "Até 25 km",
  },
  {
    value: 50,
    label: "Até 50 km",
  },
  {
    value: 100,
    label: "Região ampliada",
  },
] as const;

// =========================================================
// DISPONIBILIDADE
// =========================================================

function availabilityText(
  details: AvailabilityDetails,
): string {
  if (details.frequency === "flexible") {
    return "Disponibilidade variável";
  }

  const dayText = details.days.length
    ? details.days.join(", ")
    : "";

  const periodText = details.periods.length
    ? details.periods
      .join(" e ")
      .toLowerCase()
    : "";

  const frequencyText =
    details.frequency
      ? FREQUENCY_LABELS[
      details.frequency
      ]
      : "";

  return [
    dayText,
    periodText,
    frequencyText,
  ]
    .filter(Boolean)
    .join(" · ");
}

function availabilityPieces(
  details: AvailabilityDetails,
) {
  if (details.frequency === "flexible") {
    return {
      days: "Disponibilidade variável",
      periods: "Horários variáveis",
      frequency:
        FREQUENCY_LABELS.flexible,
    };
  }

  return {
    days: details.days.length
      ? details.days.join(", ")
      : "Dias não definidos",

    periods: details.periods.length
      ? details.periods.join(" e ")
      : "Períodos não definidos",

    frequency: details.frequency
      ? FREQUENCY_LABELS[
      details.frequency
      ]
      : "Frequência não definida",
  };
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
          style={styles.chip}
          key={value}
        >
          <Text style={styles.chipText}>
            {getLabel(value)}
          </Text>

          <Pressable
            style={styles.chipRemove}
            onPress={() => onRemove(value)}
            accessibilityRole="button"
            accessibilityLabel={`Remover ${value}`}
          >
            <MaterialIcons
              name="close"
              size={15}
              color={Colors.primaryDark}
            />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

// =========================================================
// SELETOR SIMPLES
// =========================================================

interface SimpleOption {
  value: string;
  label: string;
}

interface SimpleSelectModalProps {
  open: boolean;
  title: string;
  options: SimpleOption[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

function SimpleSelectModal({
  open,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: SimpleSelectModalProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={styles.selectBackdrop}
        onPress={onClose}
      >
        <Pressable
          style={styles.selectDialog}
          onPress={(event) =>
            event.stopPropagation()
          }
        >
          <View
            style={styles.selectHeader}
          >
            <Text
              style={styles.selectTitle}
            >
              {title}
            </Text>

            <Pressable
              style={styles.selectClose}
              onPress={onClose}
            >
              <MaterialIcons
                name="close"
                size={20}
                color={Colors.slate600}
              />
            </Pressable>
          </View>

          <ScrollView
            style={styles.selectList}
            contentContainerStyle={
              styles.selectListContent
            }
          >
            {options.map((option) => {
              const active =
                selected === option.value;

              return (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => [
                    styles.selectOption,

                    active &&
                    styles.selectOptionSelected,

                    pressed &&
                    styles.pressed,
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.selectOptionText,

                      active &&
                      styles.selectOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>

                  {active ? (
                    <MaterialIcons
                      name="check"
                      size={19}
                      color={
                        Colors.primary
                      }
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// =========================================================
// COMPONENTE
// =========================================================

export default function VolunteerProfileForm(
  props: VolunteerProfileFormProps,
) {
  const [
    causeModalOpen,
    setCauseModalOpen,
  ] = useState(false);

  const [
    activityModalOpen,
    setActivityModalOpen,
  ] = useState(false);

  const [
    availabilityModalOpen,
    setAvailabilityModalOpen,
  ] = useState(false);

  const [
    stateModalOpen,
    setStateModalOpen,
  ] = useState(false);

  const [
    cityModalOpen,
    setCityModalOpen,
  ] = useState(false);

  const [
    radiusModalOpen,
    setRadiusModalOpen,
  ] = useState(false);

  const [cities, setCities] = useState<
    string[]
  >([]);

  const [
    citiesLoading,
    setCitiesLoading,
  ] = useState(false);

  const [
    citiesError,
    setCitiesError,
  ] = useState("");

  const [error, setError] =
    useState("");

  // =======================================================
  // VALORES PADRÃO
  // =======================================================

  const location =
    props.location ?? {
      city: "",
      state: "",
      radiusKm: 10,
      remote: false,
    };

  const details: AvailabilityDetails =
    props.availabilityDetails ?? {
      days: [],
      periods: [],
      frequency: undefined,
    };

  const availabilitySummary =
    availabilityPieces(details);

  // =======================================================
  // UPDATE
  // =======================================================

  function update(
    patch: Partial<VolunteerProfileFormData>,
  ) {
    props.onChange({
      causes:
        patch.causes ?? props.causes,

      interestAreas:
        patch.interestAreas ??
        props.interestAreas,

      availability:
        patch.availability ??
        props.availability,

      location:
        patch.location ??
        props.location,

      availabilityDetails:
        patch.availabilityDetails ??
        props.availabilityDetails,

      opportunityPreference:
        patch.opportunityPreference ??
        props.opportunityPreference,
    });
  }

  // =======================================================
  // DISPONIBILIDADE
  // =======================================================

  function setAvailability(
    nextDetails: AvailabilityDetails,
  ) {
    update({
      availabilityDetails: nextDetails,

      availability:
        availabilityText(nextDetails),
    });

    setError("");
  }

  // =======================================================
  // CIDADES
  // =======================================================

  async function loadCities(
    state: string,
  ) {
    if (!state) {
      setCities([]);
      return;
    }

    setCitiesLoading(true);
    setCitiesError("");

    try {
      const result =
        await getCitiesByState(state);

      setCities(result);
    } catch {
      setCities([]);

      setCitiesError(
        "Não foi possível carregar as cidades. Tente novamente.",
      );
    } finally {
      setCitiesLoading(false);
    }
  }

  function handleStateChange(
    state: string,
  ) {
    update({
      location: {
        ...location,
        state,
        city: "",
      },
    });

    setCities([]);
    setCitiesError("");
    setError("");

    if (state) {
      void loadCities(state);
    }
  }

  // =======================================================
  // SUBMIT
  // =======================================================

  async function submit() {
    const selectedMainCauses =
      props.causes.filter(
        (value) =>
          !parseCauseSelection(value)
            .subtopic,
      );

    if (
      selectedMainCauses.length === 0
    ) {
      setError(
        "Escolha pelo menos uma causa principal.",
      );

      return;
    }

    if (
      selectedMainCauses.length > 3
    ) {
      setError(
        "Escolha no máximo 3 causas principais.",
      );

      return;
    }

    if (
      props.interestAreas.length === 0
    ) {
      setError(
        "Escolha pelo menos uma forma de ajudar.",
      );

      return;
    }

    if (
      !location.state ||
      !location.city
    ) {
      setError(
        "Selecione a UF e a cidade onde pretende atuar.",
      );

      return;
    }

    const availabilityComplete =
      details.frequency ===
      "flexible" ||
      (details.days.length > 0 &&
        details.periods.length > 0 &&
        Boolean(details.frequency));

    if (!availabilityComplete) {
      setError(
        "Defina sua disponibilidade geral.",
      );

      return;
    }

    setError("");

    await props.onSubmit({
      causes: props.causes,

      interestAreas:
        props.interestAreas,

      availability:
        availabilityText(details),

      location: {
        city: location.city,
        state: location.state,

        radiusKm:
          location.radiusKm ?? 10,

        remote: location.remote,
      },

      availabilityDetails: details,

      opportunityPreference:
        props.opportunityPreference,
    });
  }

  // =======================================================
  // LABELS DOS SELECTS
  // =======================================================

  const selectedState =
    BRAZIL_STATES.find(
      (state) =>
        state.code === location.state,
    );

  const radiusLabel =
    RADIUS_OPTIONS.find(
      (option) =>
        option.value ===
        (location.radiusKm ?? 10),
    )?.label ?? "Até 10 km";

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <>
      <View style={styles.form}>
        {/* ===============================================
            HEADER
        =============================================== */}

        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            Perfil pessoal
          </Text>

          <Text style={styles.title}>
            Voluntário
          </Text>

          <Text
            style={styles.description}
          >
            Vamos usar suas preferências
            para encontrar oportunidades
            melhores.
          </Text>
        </View>

        {/* ===============================================
            CAUSAS
        =============================================== */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Causas que gostaria de apoiar{" "}
            <Text style={styles.required}>
              *
            </Text>
          </Text>

          <SelectedItems
            values={props.causes}
            getLabel={
              causeSelectionLabel
            }
            onRemove={(value) => {
              const parsed =
                parseCauseSelection(value);

              update({
                causes: parsed.subtopic
                  ? props.causes.filter(
                    (item) =>
                      item !== value,
                  )
                  : props.causes.filter(
                    (item) =>
                      parseCauseSelection(
                        item,
                      ).parent !==
                      parsed.parent,
                  ),
              });
            }}
          />

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              setCauseModalOpen(true)
            }
          >
            <MaterialIcons
              name="add"
              size={19}
              color={Colors.primary}
            />

            <Text
              style={
                styles.addButtonText
              }
            >
              Escolher causas
            </Text>
          </Pressable>
        </View>

        {/* ===============================================
            ATIVIDADES
        =============================================== */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Como gostaria de ajudar{" "}
            <Text style={styles.required}>
              *
            </Text>
          </Text>

          <SelectedItems
            values={props.interestAreas}
            onRemove={(value) =>
              update({
                interestAreas:
                  props.interestAreas.filter(
                    (item) =>
                      item !== value,
                  ),
              })
            }
          />

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              setActivityModalOpen(true)
            }
          >
            <MaterialIcons
              name="add"
              size={19}
              color={Colors.primary}
            />

            <Text
              style={
                styles.addButtonText
              }
            >
              Escolher atividades
            </Text>
          </Pressable>
        </View>

        {/* ===============================================
            LOCALIZAÇÃO
        =============================================== */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Onde pretende atuar{" "}
            <Text style={styles.required}>
              *
            </Text>
          </Text>

          <View
            style={styles.locationGrid}
          >
            {/* UF */}

            <View
              style={styles.inlineField}
            >
              <Text
                style={styles.fieldLabel}
              >
                UF
              </Text>

              <Pressable
                style={styles.selectField}
                onPress={() =>
                  setStateModalOpen(true)
                }
              >
                <Text
                  style={[
                    styles.selectFieldText,

                    !selectedState &&
                    styles.placeholderText,
                  ]}
                >
                  {selectedState
                    ? `${selectedState.code} - ${selectedState.name}`
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

            {/* CIDADE */}

            <View
              style={styles.inlineField}
            >
              <Text
                style={styles.fieldLabel}
              >
                Cidade
              </Text>

              <Pressable
                style={[
                  styles.selectField,

                  (!location.state ||
                    citiesLoading) &&
                  styles.selectFieldDisabled,
                ]}
                disabled={
                  !location.state ||
                  citiesLoading
                }
                onPress={() => {
                  if (
                    location.state &&
                    cities.length === 0 &&
                    !citiesLoading
                  ) {
                    void loadCities(
                      location.state,
                    );
                  }

                  setCityModalOpen(true);
                }}
              >
                {citiesLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.primary}
                  />
                ) : (
                  <Text
                    style={[
                      styles.selectFieldText,

                      !location.city &&
                      styles.placeholderText,
                    ]}
                  >
                    {location.city ||
                      (location.state
                        ? "Selecione"
                        : "Escolha a UF primeiro")}
                  </Text>
                )}

                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={21}
                  color={
                    Colors.slate500
                  }
                />
              </Pressable>
            </View>

            {/* DISTÂNCIA */}

            <View
              style={styles.inlineField}
            >
              <Text
                style={styles.fieldLabel}
              >
                Distância
              </Text>

              <Pressable
                style={styles.selectField}
                onPress={() =>
                  setRadiusModalOpen(true)
                }
              >
                <Text
                  style={
                    styles.selectFieldText
                  }
                >
                  {radiusLabel}
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
          </View>

          {citiesError ? (
            <Pressable
              style={styles.textAction}
              onPress={() =>
                void loadCities(
                  location.state ?? "",
                )
              }
            >
              <MaterialIcons
                name="refresh"
                size={17}
                color={Colors.dangerDark}
              />

              <Text
                style={
                  styles.textActionText
                }
              >
                {citiesError}
              </Text>
            </Pressable>
          ) : null}

          {/* REMOTO */}

          <Pressable
            style={styles.checkboxLine}
            onPress={() =>
              update({
                location: {
                  ...location,

                  remote:
                    !location.remote,
                },
              })
            }
            accessibilityRole="checkbox"
            accessibilityState={{
              checked: location.remote,
            }}
          >
            <View
              style={[
                styles.checkbox,

                location.remote &&
                styles.checkboxSelected,
              ]}
            >
              {location.remote ? (
                <MaterialIcons
                  name="check"
                  size={14}
                  color={Colors.white}
                />
              ) : null}
            </View>

            <Text
              style={
                styles.checkboxLineText
              }
            >
              Também tenho interesse em
              oportunidades remotas.
            </Text>
          </Pressable>
        </View>

        {/* ===============================================
            TIPO DE OPORTUNIDADE
        =============================================== */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Tipo de oportunidade
          </Text>

          <View
            style={styles.choiceCards}
          >
            {OPPORTUNITY_OPTIONS.map(
              (option) => {
                const selected =
                  props.opportunityPreference ===
                  option.value;

                return (
                  <Pressable
                    key={option.value}
                    style={({
                      pressed,
                    }) => [
                        styles.choiceCard,

                        selected &&
                        styles.choiceCardSelected,

                        pressed &&
                        styles.pressed,
                      ]}
                    onPress={() =>
                      update({
                        opportunityPreference:
                          option.value,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.choiceCardTitle,

                        selected &&
                        styles.choiceCardTitleSelected,
                      ]}
                    >
                      {option.label}
                    </Text>

                    <Text
                      style={
                        styles.choiceCardDescription
                      }
                    >
                      {
                        option.description
                      }
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>
        </View>

        {/* ===============================================
            DISPONIBILIDADE
        =============================================== */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Disponibilidade{" "}
            <Text style={styles.required}>
              *
            </Text>
          </Text>

          {availabilityText(details) ? (
            <View
              style={
                styles.availabilityCard
              }
            >
              <View
                style={
                  styles.availabilityHeader
                }
              >
                <View
                  style={
                    styles.availabilityHeaderCopy
                  }
                >
                  <Text
                    style={
                      styles.availabilityTitle
                    }
                  >
                    Disponibilidade
                    configurada
                  </Text>

                  <Text
                    style={
                      styles.availabilityDescription
                    }
                  >
                    Essas preferências podem
                    ser ajustadas depois.
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    setAvailabilityModalOpen(
                      true,
                    )
                  }
                >
                  <Text
                    style={
                      styles.changeButtonText
                    }
                  >
                    Alterar
                  </Text>
                </Pressable>
              </View>

              <View
                style={
                  styles.availabilityMeta
                }
              >
                <View
                  style={
                    styles.summaryItem
                  }
                >
                  <View
                    style={
                      styles.summaryLabel
                    }
                  >
                    <MaterialIcons
                      name="calendar-today"
                      size={15}
                      color={
                        Colors.slate500
                      }
                    />

                    <Text
                      style={
                        styles.summaryLabelText
                      }
                    >
                      Dias
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.summaryValue
                    }
                  >
                    {
                      availabilitySummary.days
                    }
                  </Text>
                </View>

                <View
                  style={
                    styles.summaryItem
                  }
                >
                  <View
                    style={
                      styles.summaryLabel
                    }
                  >
                    <MaterialIcons
                      name="info-outline"
                      size={16}
                      color={
                        Colors.slate500
                      }
                    />

                    <Text
                      style={
                        styles.summaryLabelText
                      }
                    >
                      Períodos
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.summaryValue
                    }
                  >
                    {
                      availabilitySummary.periods
                    }
                  </Text>
                </View>

                <View
                  style={
                    styles.summaryItem
                  }
                >
                  <View
                    style={
                      styles.summaryLabel
                    }
                  >
                    <MaterialIcons
                      name="place"
                      size={16}
                      color={
                        Colors.slate500
                      }
                    />

                    <Text
                      style={
                        styles.summaryLabelText
                      }
                    >
                      Frequência
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.summaryValue
                    }
                  >
                    {
                      availabilitySummary.frequency
                    }
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed &&
                styles.pressed,
              ]}
              onPress={() =>
                setAvailabilityModalOpen(
                  true,
                )
              }
            >
              <MaterialIcons
                name="add"
                size={19}
                color={Colors.primary}
              />

              <Text
                style={
                  styles.addButtonText
                }
              >
                Definir disponibilidade
              </Text>
            </Pressable>
          )}
        </View>

        {/* ===============================================
            REPRESENTAR INICIATIVA
        =============================================== */}

        {props.onOpenParticipationChoices ? (
          <Pressable
            style={styles.inlineLink}
            onPress={
              props.onOpenParticipationChoices
            }
          >
            <Text
              style={
                styles.inlineLinkText
              }
            >
              Quero criar ou representar uma
              iniciativa própria
            </Text>
          </Pressable>
        ) : null}

        {/* ===============================================
            ERRO
        =============================================== */}

        {error ? (
          <View style={styles.errorBox}>
            <MaterialIcons
              name="error-outline"
              size={18}
              color={Colors.dangerDark}
            />

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : null}

        {/* ===============================================
            SUBMIT
        =============================================== */}

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,

              props.saving &&
              styles.submitButtonDisabled,

              pressed &&
              !props.saving &&
              styles.pressed,
            ]}
            disabled={props.saving}
            onPress={() => void submit()}
          >
            {props.saving ? (
              <ActivityIndicator
                size="small"
                color={Colors.white}
              />
            ) : null}

            <Text
              style={
                styles.submitButtonText
              }
            >
              {props.saving
                ? "Salvando..."
                : (props.submitLabel ??
                  (props.completed
                    ? "Salvar alterações"
                    : "Salvar e continuar"))}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* =================================================
          MODAL DE CAUSAS
      ================================================= */}

      <CauseSelectionModal
        open={causeModalOpen}
        title="Causas"
        description="Escolha até 3 causas principais e, dentro delas, marque os subtópicos que mais combinam com você."
        selected={props.causes}
        maxParents={3}
        onChange={(next) => {
          update({
            causes: next,
          });

          setError("");
        }}
        onClose={() =>
          setCauseModalOpen(false)
        }
      />

      {/* =================================================
          MODAL DE ATIVIDADES
      ================================================= */}

      <SelectionModal
        open={activityModalOpen}
        title="Formas de ajudar"
        options={
          VOLUNTEER_ACTIVITY_OPTIONS
        }
        selected={props.interestAreas}
        maxSelected={10}
        allowCustom
        customLabel="Adicionar outra forma de ajudar"
        onChange={(next) => {
          update({
            interestAreas: next,
          });

          setError("");
        }}
        onClose={() =>
          setActivityModalOpen(false)
        }
      />

      {/* =================================================
          DISPONIBILIDADE
      ================================================= */}

      <AvailabilityModal
        open={availabilityModalOpen}
        value={details}
        onChange={setAvailability}
        onClose={() =>
          setAvailabilityModalOpen(
            false,
          )
        }
      />

      {/* =================================================
          UF
      ================================================= */}

      <StateSelectModal
        open={stateModalOpen}
        selected={location.state ?? ""}
        onSelect={handleStateChange}
        onClose={() => setStateModalOpen(false)}
      />

      {/* =================================================
          CIDADE
      ================================================= */}

      <CitySelectModal
        open={cityModalOpen}
        state={location.state ?? ""}
        selected={location.city ?? ""}
        onSelect={(city) => {
          update({
            location: {
              ...location,
              city,
            },
          });

          setError("");
        }}
        onClose={() =>
          setCityModalOpen(false)
        }
      />

      {/* =================================================
          DISTÂNCIA
      ================================================= */}

      <SimpleSelectModal
        open={radiusModalOpen}
        title="Selecione a distância"
        selected={String(
          location.radiusKm ?? 10,
        )}
        options={RADIUS_OPTIONS.map(
          (option) => ({
            value: String(
              option.value,
            ),
            label: option.label,
          }),
        )}
        onSelect={(radius) =>
          update({
            location: {
              ...location,
              radiusKm: Number(radius),
            },
          })
        }
        onClose={() =>
          setRadiusModalOpen(false)
        }
      />
    </>
  );
}
const styles = StyleSheet.create({
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
