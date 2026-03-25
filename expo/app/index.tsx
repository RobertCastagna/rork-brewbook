import { router, Stack } from "expo-router";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { ArrowRight, ChevronDown, Clock3, Coffee, Droplets, Lock, Sparkles } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import * as Haptics from "expo-haptics";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

type BrewMethod = "All" | "Pour Over" | "Espresso" | "French Press" | "Cold Brew" | "AeroPress";

interface Recipe {
  id: string;
  name: string;
  method: Exclude<BrewMethod, "All">;
  time: string;
  image: string;
  isPremium: boolean;
  tastingNotes: string;
  ratio: string;
  grind: string;
}

const FILTERS: BrewMethod[] = ["All", "Pour Over", "Espresso", "French Press", "Cold Brew", "AeroPress"];

const RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Honey Oat Latte",
    method: "Espresso",
    time: "3 min",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    isPremium: false,
    tastingNotes: "Caramel, toasted oat, soft citrus finish",
    ratio: "1:2",
    grind: "Fine",
  },
  {
    id: "2",
    name: "Bright V60 Citrus",
    method: "Pour Over",
    time: "4 min",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80",
    isPremium: false,
    tastingNotes: "Mandarin, jasmine, raw sugar",
    ratio: "1:16",
    grind: "Medium-fine",
  },
  {
    id: "3",
    name: "Velvet Press",
    method: "French Press",
    time: "5 min",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    isPremium: false,
    tastingNotes: "Dark chocolate, plum, creamy body",
    ratio: "1:15",
    grind: "Coarse",
  },
  {
    id: "4",
    name: "Maple Cold Brew",
    method: "Cold Brew",
    time: "12 hr",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80",
    isPremium: false,
    tastingNotes: "Maple sweetness, cocoa nib, mellow finish",
    ratio: "1:8",
    grind: "Extra coarse",
  },
  {
    id: "5",
    name: "Camp AeroPress",
    method: "AeroPress",
    time: "2 min",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
    isPremium: false,
    tastingNotes: "Berry jam, cocoa, bright finish",
    ratio: "1:14",
    grind: "Medium",
  },
  {
    id: "6",
    name: "Brown Sugar Shakerato",
    method: "Espresso",
    time: "3 min",
    image: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80",
    isPremium: true,
    tastingNotes: "Brown sugar, orange peel, silky crema",
    ratio: "1:2.5",
    grind: "Fine",
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedFilter, setSelectedFilter] = useState<BrewMethod>("All");
  const [expandedRecipeIds, setExpandedRecipeIds] = useState<string[]>([]);

  const theme = useMemo(() => {
    return isDark
      ? {
          background: "#1A120D",
          card: "#2A1D15",
          secondaryCard: "#34261D",
          text: "#FFF8F0",
          muted: "#C9B7A5",
          accent: "#D4A053",
          border: "rgba(255, 248, 240, 0.08)",
          overlay: "rgba(16, 10, 7, 0.45)",
        }
      : {
          background: "#FFF8F0",
          card: "#F6EBDD",
          secondaryCard: "#FFFDF9",
          text: "#4A2C17",
          muted: "#7B604C",
          accent: "#D4A053",
          border: "rgba(74, 44, 23, 0.08)",
          overlay: "rgba(74, 44, 23, 0.16)",
        };
  }, [isDark]);

  const filteredRecipes = useMemo(() => {
    if (selectedFilter === "All") {
      return RECIPES;
    }

    return RECIPES.filter((recipe) => recipe.method === selectedFilter);
  }, [selectedFilter]);

  console.log("[BrewBook] rendering home screen", {
    selectedFilter,
    recipeCount: filteredRecipes.length,
    expandedRecipeIds,
    colorScheme,
  });

  const toggleRecipeExpansion = async (recipe: Recipe) => {
    console.log("[BrewBook] toggling recipe expansion", { recipeId: recipe.id, isPremium: recipe.isPremium });

    if (recipe.isPremium) {
      router.push("./paywall");
      return;
    }

    setExpandedRecipeIds((currentExpandedRecipeIds) => {
      if (currentExpandedRecipeIds.includes(recipe.id)) {
        return currentExpandedRecipeIds.filter((recipeId) => recipeId !== recipe.id);
      }

      return [...currentExpandedRecipeIds, recipe.id];
    });

    await Haptics.selectionAsync();
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]} testID="brewbook-home-screen">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID="brewbook-home-scroll"
      >
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.eyebrow, { color: theme.accent }]}>BREWBOOK</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroCopy}>
              <Text style={[styles.heroTitle, { color: theme.text }]}>Coffee recipes worth waking up for</Text>
              <Text style={[styles.heroSubtitle, { color: theme.muted }]}>Free recipes, pro techniques, and a timer built for your morning ritual.</Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: theme.secondaryCard, borderColor: theme.border }]}>
              <Coffee color={theme.accent} size={22} />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statPill, { backgroundColor: theme.secondaryCard, borderColor: theme.border }]}>
              <Sparkles color={theme.accent} size={16} />
              <Text style={[styles.statText, { color: theme.text }]}>10 free recipes</Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: theme.secondaryCard, borderColor: theme.border }]}>
              <Clock3 color={theme.accent} size={16} />
              <Text style={[styles.statText, { color: theme.text }]}>Timer included</Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("./paywall")}
            style={[styles.heroCta, { backgroundColor: theme.text }]}
            testID="open-paywall-button"
          >
            <Text style={[styles.heroCtaText, { color: theme.background }]}>Unlock BrewBook Pro</Text>
            <ArrowRight color={theme.background} size={16} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
          testID="brewbook-filter-bar"
        >
          {FILTERS.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? theme.text : theme.secondaryCard,
                    borderColor: isActive ? theme.text : theme.border,
                  },
                ]}
                testID={`filter-${filter.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Text style={[styles.filterText, { color: isActive ? theme.background : theme.text }]}>{filter}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Today&apos;s picks</Text>
          <Text style={[styles.sectionCaption, { color: theme.muted }]}>Recipe feed preview</Text>
        </View>

        <View style={styles.grid}>
          {filteredRecipes.map((recipe) => {
            const isExpanded = expandedRecipeIds.includes(recipe.id);

            return (
              <Pressable
                key={recipe.id}
                onPress={() => {
                  void toggleRecipeExpansion(recipe);
                }}
                style={[
                  styles.card,
                  styles.expandableCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  isExpanded ? { backgroundColor: theme.secondaryCard } : null,
                ]}
                testID={`recipe-card-${recipe.id}`}
              >
                <View style={styles.imageWrap}>
                  <Image source={{ uri: recipe.image }} style={styles.image} contentFit="cover" transition={200} />
                  {recipe.isPremium ? (
                    <>
                      <BlurView intensity={30} tint={isDark ? "dark" : "light"} style={styles.blurOverlay} />
                      <View style={[styles.proBadge, { backgroundColor: theme.accent }]}> 
                        <Lock size={12} color="#20140E" />
                        <Text style={styles.proBadgeText}>PRO</Text>
                      </View>
                    </>
                  ) : null}
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.cardHeaderRow}>
                    <Text numberOfLines={isExpanded ? 3 : 2} style={[styles.cardTitle, { color: theme.text }]}>
                      {recipe.name}
                    </Text>
                    <View
                      style={[
                        styles.expandIconWrap,
                        { backgroundColor: recipe.isPremium ? theme.accent : theme.secondaryCard, borderColor: theme.border },
                        isExpanded ? styles.expandIconWrapOpen : null,
                      ]}
                    >
                      {recipe.isPremium ? <Lock size={14} color="#20140E" /> : <ChevronDown size={14} color={theme.text} />}
                    </View>
                  </View>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Droplets size={14} color={theme.accent} />
                      <Text style={[styles.metaText, { color: theme.muted }]}>{recipe.method}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock3 size={14} color={theme.accent} />
                      <Text style={[styles.metaText, { color: theme.muted }]}>{recipe.time}</Text>
                    </View>
                  </View>

                  {isExpanded ? (
                    <View style={[styles.expandedContent, { borderTopColor: theme.border }]} testID={`recipe-card-expanded-${recipe.id}`}>
                      <Text style={[styles.expandedLabel, { color: theme.muted }]}>Flavor profile</Text>
                      <Text style={[styles.expandedText, { color: theme.text }]}>{recipe.tastingNotes}</Text>

                      <View style={styles.expandedStatsRow}>
                        <View style={[styles.expandedStatCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                          <Text style={[styles.expandedStatLabel, { color: theme.muted }]}>Ratio</Text>
                          <Text style={[styles.expandedStatValue, { color: theme.text }]}>{recipe.ratio}</Text>
                        </View>
                        <View style={[styles.expandedStatCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                          <Text style={[styles.expandedStatLabel, { color: theme.muted }]}>Grind</Text>
                          <Text style={[styles.expandedStatValue, { color: theme.text }]}>{recipe.grind}</Text>
                        </View>
                      </View>

                      <Text style={[styles.expandHint, { color: theme.accent }]}>Tap again to collapse</Text>
                    </View>
                  ) : (
                    <Text style={[styles.expandHint, { color: theme.accent }]}>
                      {recipe.isPremium ? "Tap to unlock preview" : "Tap to expand"}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  heroCopy: {
    flex: 1,
    gap: 8,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  heroBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  heroCta: {
    marginTop: 18,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  heroCtaText: {
    fontSize: 14,
    fontWeight: "800",
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statText: {
    fontSize: 13,
    fontWeight: "600",
  },
  filtersRow: {
    gap: 10,
    paddingBottom: 8,
    paddingRight: 20,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 18,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  sectionCaption: {
    fontSize: 13,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  card: {
    width: "47.8%",
    borderWidth: 1,
    borderRadius: 24,
    overflow: "hidden",
  },
  expandableCard: {
    alignSelf: "flex-start",
  },
  imageWrap: {
    height: 180,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  proBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  proBadgeText: {
    color: "#20140E",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  cardBody: {
    padding: 12,
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    minHeight: 40,
  },
  expandIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  expandIconWrapOpen: {
    transform: [{ rotate: "180deg" }],
  },
  metaRow: {
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1,
  },
  expandedContent: {
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 10,
  },
  expandedLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  expandedText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  expandedStatsRow: {
    flexDirection: "row",
    gap: 8,
  },
  expandedStatCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 4,
  },
  expandedStatLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  expandedStatValue: {
    fontSize: 13,
    fontWeight: "800",
  },
  expandHint: {
    fontSize: 12,
    fontWeight: "700",
  },
});
