import { router, Stack } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Check, ChevronLeft, CircleHelp, Lock, Sparkles, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PlanId = "monthly" | "annual";

interface Plan {
  id: PlanId;
  title: string;
  price: string;
  period: string;
  badge?: string;
}

interface FeatureRow {
  label: string;
  free: string;
  pro: string;
}

const PLANS: Plan[] = [
  {
    id: "monthly",
    title: "Monthly",
    price: "$3.99",
    period: "/mo",
  },
  {
    id: "annual",
    title: "Annual",
    price: "$29.99",
    period: "/yr",
    badge: "Save 37%",
  },
];

const FEATURES: FeatureRow[] = [
  {
    label: "Recipes",
    free: "10",
    pro: "200+",
  },
  {
    label: "Brew methods",
    free: "3",
    pro: "All methods",
  },
  {
    label: "Brew timer",
    free: "Basic",
    pro: "Advanced presets",
  },
  {
    label: "Cupping notes",
    free: "—",
    pro: "Included",
  },
  {
    label: "Ratio calculator",
    free: "—",
    pro: "Included",
  },
  {
    label: "New recipes",
    free: "—",
    pro: "Monthly drops",
  },
];

const TERMS_URL = "https://example.com/terms";
const PRIVACY_URL = "https://example.com/privacy";
const APPLE_SUBSCRIPTIONS_URL = "https://apps.apple.com/account/subscriptions";

export default function PaywallScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("annual");

  const theme = useMemo(() => {
    return isDark
      ? {
          background: "#120C08",
          panel: "#241812",
          panelSecondary: "#2E2018",
          text: "#FFF8F0",
          muted: "#CBB8A8",
          accent: "#D4A053",
          accentStrong: "#E6B767",
          border: "rgba(255, 248, 240, 0.08)",
          glow: "rgba(212, 160, 83, 0.24)",
          tint: "rgba(255, 248, 240, 0.06)",
          pillText: "#2C1A0E",
        }
      : {
          background: "#FFF8F0",
          panel: "#F8EDE0",
          panelSecondary: "#FFFDF9",
          text: "#4A2C17",
          muted: "#7D6450",
          accent: "#D4A053",
          accentStrong: "#B97B2F",
          border: "rgba(74, 44, 23, 0.1)",
          glow: "rgba(212, 160, 83, 0.18)",
          tint: "rgba(74, 44, 23, 0.05)",
          pillText: "#2C1A0E",
        };
  }, [isDark]);

  const activePlan = useMemo(() => {
    return PLANS.find((plan) => plan.id === selectedPlan) ?? PLANS[0];
  }, [selectedPlan]);

  const openUrl = async (url: string) => {
    console.log("[BrewBook] opening external url", { url, platform: Platform.OS });
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      console.log("[BrewBook] unable to open url", { url });
      return;
    }

    await Linking.openURL(url);
  };

  const handleSelectPlan = async (planId: PlanId) => {
    console.log("[BrewBook] plan selected", { planId });
    setSelectedPlan(planId);
    await Haptics.selectionAsync();
  };

  const handleStartTrial = async () => {
    console.log("[BrewBook] start free trial tapped", { selectedPlan });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRestore = async () => {
    console.log("[BrewBook] restore purchases tapped");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]} testID="brewbook-paywall-screen">
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={isDark ? ["#2B1B12", "#120C08", "#120C08"] : ["#F0D7B5", "#FFF8F0", "#FFF8F0"]}
        locations={[0, 0.35, 1]}
        style={styles.gradient}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          testID="brewbook-paywall-scroll"
        >
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.back()}
              style={[styles.iconButton, { backgroundColor: theme.tint, borderColor: theme.border }]}
              testID="paywall-close-button"
            >
              <ChevronLeft color={theme.text} size={18} />
            </Pressable>

            <View style={[styles.topPill, { backgroundColor: theme.tint, borderColor: theme.border }]}>
              <Sparkles size={14} color={theme.accentStrong} />
              <Text style={[styles.topPillText, { color: theme.text }]}>Premium access</Text>
            </View>
          </View>

          <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
            <View style={[styles.heroGlow, { backgroundColor: theme.glow }]} />
            <View style={styles.heroCopyWrap}>
              <Text style={[styles.eyebrow, { color: theme.accentStrong }]}>UNLOCK BREWBOOK PRO</Text>
              <Text style={[styles.title, { color: theme.text }]}>Upgrade your daily ritual.</Text>
              <Text style={[styles.subtitle, { color: theme.muted }]}>
                Get premium coffee recipes, deeper brew guidance, and fresh drops every month.
              </Text>
            </View>

            <View style={styles.heroVisualWrap}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80" }}
                style={styles.heroImage}
                contentFit="cover"
                transition={200}
              />
              <View style={[styles.floatingBadge, { backgroundColor: theme.accent }]}>
                <Lock size={14} color={theme.pillText} />
                <Text style={[styles.floatingBadgeText, { color: theme.pillText }]}>PRO</Text>
              </View>
            </View>
          </View>

          <View style={[styles.planToggleCard, { backgroundColor: theme.panelSecondary, borderColor: theme.border }]}>
            {PLANS.map((plan) => {
              const isActive = plan.id === selectedPlan;
              return (
                <Pressable
                  key={plan.id}
                  onPress={() => {
                    void handleSelectPlan(plan.id);
                  }}
                  style={[
                    styles.planButton,
                    {
                      backgroundColor: isActive ? theme.text : theme.background,
                      borderColor: isActive ? theme.text : theme.border,
                    },
                  ]}
                  testID={`paywall-plan-${plan.id}`}
                >
                  <View style={styles.planHeaderRow}>
                    <Text style={[styles.planTitle, { color: isActive ? theme.background : theme.text }]}>{plan.title}</Text>
                    {plan.badge ? (
                      <View style={[styles.saveBadge, { backgroundColor: theme.accent }]}>
                        <Text style={styles.saveBadgeText}>{plan.badge}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.planPrice, { color: isActive ? theme.background : theme.text }]}>
                    {plan.price}
                    <Text style={[styles.planPeriod, { color: isActive ? theme.background : theme.muted }]}>{plan.period}</Text>
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.featureCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
            <View style={styles.featureHeaderRow}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>Free vs Pro</Text>
              <View style={[styles.featurePill, { backgroundColor: theme.tint, borderColor: theme.border }]}>
                <CircleHelp size={14} color={theme.accentStrong} />
                <Text style={[styles.featurePillText, { color: theme.text }]}>Placeholder plans</Text>
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderLabel, styles.tableFeatureCell, { color: theme.muted }]}>Feature</Text>
              <Text style={[styles.tableHeaderLabel, styles.tableValueCell, { color: theme.muted }]}>Free</Text>
              <Text style={[styles.tableHeaderLabel, styles.tableValueCell, { color: theme.muted }]}>Pro</Text>
            </View>

            {FEATURES.map((feature) => (
              <View key={feature.label} style={[styles.featureRow, { borderTopColor: theme.border }]}> 
                <Text style={[styles.featureLabel, styles.tableFeatureCell, { color: theme.text }]}>{feature.label}</Text>
                <View style={styles.tableValueCell}>
                  <Text style={[styles.featureValue, { color: theme.muted }]}>{feature.free}</Text>
                </View>
                <View style={styles.tableValueCell}>
                  <View style={styles.proValueWrap}>
                    <Check size={14} color={theme.accentStrong} />
                    <Text style={[styles.featureValue, { color: theme.text }]}>{feature.pro}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.highlightCard, { backgroundColor: theme.panelSecondary, borderColor: theme.border }]}>
            <View style={styles.highlightItem}>
              <Check size={16} color={theme.accentStrong} />
              <Text style={[styles.highlightText, { color: theme.text }]}>200+ premium recipes across all brew methods</Text>
            </View>
            <View style={styles.highlightItem}>
              <Check size={16} color={theme.accentStrong} />
              <Text style={[styles.highlightText, { color: theme.text }]}>Cupping notes, ratio tools, and monthly recipe drops</Text>
            </View>
            <View style={styles.highlightItem}>
              <X size={16} color={theme.muted} />
              <Text style={[styles.highlightText, { color: theme.muted }]}>No purchase is processed in this placeholder flow</Text>
            </View>
          </View>

          <Pressable
            onPress={() => {
              void handleStartTrial();
            }}
            style={[styles.ctaButton, { backgroundColor: theme.text }]}
            testID="paywall-start-trial-button"
          >
            <Text style={[styles.ctaTitle, { color: theme.background }]}>Start 7-Day Free Trial</Text>
            <Text style={[styles.ctaSubtitle, { color: theme.background }]}>{activePlan.price}{activePlan.period} after trial</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              void handleRestore();
            }}
            style={styles.restoreButton}
            testID="paywall-restore-button"
          >
            <Text style={[styles.restoreText, { color: theme.text }]}>Restore Purchases</Text>
          </Pressable>

          <View style={styles.legalBlock}>
            <Text style={[styles.legalText, { color: theme.muted }]}>Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless canceled at least 24 hours before the end of the current period. Manage subscriptions in Account Settings.</Text>
            <View style={styles.legalLinksRow}>
              <Pressable
                onPress={() => {
                  void openUrl(TERMS_URL);
                }}
                testID="paywall-terms-link"
              >
                <Text style={[styles.legalLink, { color: theme.text }]}>Terms of Service</Text>
              </Pressable>
              <Text style={[styles.legalDivider, { color: theme.muted }]}>•</Text>
              <Pressable
                onPress={() => {
                  void openUrl(PRIVACY_URL);
                }}
                testID="paywall-privacy-link"
              >
                <Text style={[styles.legalLink, { color: theme.text }]}>Privacy Policy</Text>
              </Pressable>
              <Text style={[styles.legalDivider, { color: theme.muted }]}>•</Text>
              <Pressable
                onPress={() => {
                  void openUrl(APPLE_SUBSCRIPTIONS_URL);
                }}
                testID="paywall-manage-link"
              >
                <Text style={[styles.legalLink, { color: theme.text }]}>Manage</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
    gap: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  topPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  topPillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  heroCard: {
    borderRadius: 30,
    borderWidth: 1,
    padding: 18,
    overflow: "hidden",
    gap: 18,
  },
  heroGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    top: -60,
    right: -40,
  },
  heroCopyWrap: {
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    maxWidth: "85%",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: "92%",
  },
  heroVisualWrap: {
    height: 210,
    borderRadius: 24,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  floatingBadge: {
    position: "absolute",
    right: 14,
    top: 14,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  floatingBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  planToggleCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 8,
    flexDirection: "row",
    gap: 8,
  },
  planButton: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  planHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  planTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  saveBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  saveBadgeText: {
    color: "#2C1A0E",
    fontSize: 10,
    fontWeight: "800",
  },
  planPrice: {
    fontSize: 24,
    fontWeight: "900",
  },
  planPeriod: {
    fontSize: 13,
    fontWeight: "700",
  },
  featureCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  featureHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  featureTitle: {
    fontSize: 21,
    fontWeight: "900",
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  featurePillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
  },
  tableHeaderLabel: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  tableFeatureCell: {
    flex: 1.35,
  },
  tableValueCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19,
    paddingRight: 10,
  },
  featureValue: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  proValueWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  highlightCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  ctaButton: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 2,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: "900",
  },
  ctaSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.8,
  },
  restoreButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  restoreText: {
    fontSize: 14,
    fontWeight: "800",
  },
  legalBlock: {
    gap: 12,
    paddingHorizontal: 4,
  },
  legalText: {
    fontSize: 12,
    lineHeight: 18,
  },
  legalLinksRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  legalLink: {
    fontSize: 12,
    fontWeight: "800",
  },
  legalDivider: {
    fontSize: 12,
    fontWeight: "700",
  },
});
