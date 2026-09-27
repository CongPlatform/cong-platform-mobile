import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FEATURES = [
  {
    icon: "groups" as const,
    title: "Conectar",
    description:
      "Aproxima organizações, voluntários e profissionais em torno de causas sociais.",
  },
  {
    icon: "view-module" as const,
    title: "Organizar",
    description:
      "Centraliza perfis, atividades e informações que hoje ficam espalhadas em várias ferramentas.",
  },
  {
    icon: "insights" as const,
    title: "Acompanhar",
    description:
      "Ajuda a transformar dados da rotina em uma visão mais clara do trabalho e do impacto da organização.",
  },
];

const TEAM = [
  "André Mendes Moura",
  "João Felipe Rocha Palumbo",
  "Kelvin Willian Palka de Souza",
];

export default function About() {
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.badge}>
            <MaterialIcons
              name="favorite"
              size={15}
              color={Colors.primary}
            />
            <Text style={styles.badgeText}>
              PROJETO CONG
            </Text>
          </View>

          <Text style={styles.title}>
            Tecnologia para fortalecer quem gera impacto.
          </Text>

          <Text style={styles.intro}>
            A CONG, Construtor Operacional para ONGs, é uma plataforma
            colaborativa criada para facilitar a organização do trabalho social
            e aproximar pessoas, organizações e oportunidades de colaboração.
          </Text>
        </View>

        <View style={styles.missionCard}>
          <View style={styles.missionIcon}>
            <MaterialIcons
              name="handshake"
              size={25}
              color={Colors.primaryDark}
            />
          </View>

          <View style={styles.missionText}>
            <Text style={styles.sectionTitle}>
              Nosso objetivo
            </Text>
            <Text style={styles.paragraph}>
              Reduzir processos fragmentados e oferecer uma base simples para
              gestão, colaboração e acompanhamento das ações das organizações.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            O que a plataforma faz
          </Text>

          <View style={styles.featureList}>
            {FEATURES.map((feature) => (
              <View
                key={feature.title}
                style={styles.featureRow}
              >
                <View style={styles.featureIcon}>
                  <MaterialIcons
                    name={feature.icon}
                    size={21}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>
                    {feature.title}
                  </Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.teamCard}>
          <View style={styles.teamHeading}>
            <MaterialIcons
              name="school"
              size={22}
              color={Colors.primaryDark}
            />
            <View>
              <Text style={styles.sectionTitle}>
                Equipe do TCC
              </Text>
              <Text style={styles.teamSubtitle}>
                Desenvolvimento da plataforma CONG
              </Text>
            </View>
          </View>

          <View style={styles.teamList}>
            {TEAM.map((member, index) => (
              <View
                key={member}
                style={styles.memberRow}
              >
                <View style={styles.memberNumber}>
                  <Text style={styles.memberNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={styles.memberName}>
                  {member}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer}>
          CONG • Projeto de TCC • 2026
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// =========================================================
// ESTILOS
// =========================================================

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.paper,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 38,
    gap: 18,
  },

  header: {
    gap: 10,
  },

  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.primary50,
  },

  badgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.xs,
    letterSpacing: 1,
    color: Colors.primary,
  },

  title: {
    maxWidth: 350,
    fontFamily: Fonts.brand,
    fontSize: Fonts["3xl"],
    lineHeight: 38,
    color: Colors.primaryDark,
  },

  intro: {
    fontFamily: Fonts.body,
    fontSize: Fonts.md,
    lineHeight: 24,
    color: Colors.ink,
  },

  missionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 13,
    padding: 17,
    borderRadius: 18,
    backgroundColor: Colors.cardYellow,
  },

  missionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },

  missionText: {
    flex: 1,
    gap: 5,
  },

  section: {
    gap: 11,
  },

  sectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.lg,
    color: Colors.primaryDark,
  },

  paragraph: {
    fontFamily: Fonts.body,
    fontSize: Fonts.sm,
    lineHeight: 21,
    color: Colors.ink,
  },

  featureList: {
    gap: 9,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    padding: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },

  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary50,
  },

  featureText: {
    flex: 1,
    gap: 3,
  },

  featureTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.md,
    color: Colors.ink,
  },

  featureDescription: {
    fontFamily: Fonts.body,
    fontSize: Fonts.sm,
    lineHeight: 20,
    color: Colors.muted,
  },

  teamCard: {
    gap: 14,
    padding: 17,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.primary100,
    backgroundColor: Colors.primary50,
  },

  teamHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  teamSubtitle: {
    marginTop: 2,
    fontFamily: Fonts.body,
    fontSize: Fonts.xs,
    color: Colors.muted,
  },

  teamList: {
    gap: 9,
  },

  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  memberNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },

  memberNumberText: {
    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.xs,
    color: Colors.primary,
  },

  memberName: {
    flex: 1,
    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.sm,
    color: Colors.ink,
  },

  footer: {
    textAlign: "center",
    fontFamily: Fonts.bodyMedium,
    fontSize: Fonts.xs,
    color: Colors.slate500,
  },
});
