import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { colors, radius, spacing } from '../theme';
import { CATEGORIES } from '../data/categories';
import { PROVINCES } from '../data/provinces';
import { useApp } from '../context/AppContext';
import { RootStackParamList, TabParamList } from '../navigation/types';
import CreativeCard from '../components/CreativeCard';
import FilterChip from '../components/FilterChip';

type Nav = NativeStackNavigationProp<RootStackParamList> &
  BottomTabNavigationProp<TabParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { creatives } = useApp();

  // Responsive grid: aim for ~110px tiles, clamped between 3 and 5 columns.
  const numColumns = Math.min(5, Math.max(3, Math.floor(width / 110)));
  const tileWidth = (width - spacing.lg * 2 - spacing.sm * (numColumns - 1)) / numColumns;

  const featured = [...creatives].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const goToCategory = (categoryId: string) =>
    navigation.navigate('BrowseTab', { categoryId });

  const goToProvince = (province: string) =>
    navigation.navigate('BrowseTab', { province });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Sawubona 👋</Text>
          <Text style={styles.title}>Find SA's best creatives</Text>
        </View>
        <Ionicons name="color-palette" size={32} color={colors.primary} />
      </View>

      <Pressable style={styles.searchBar} onPress={() => navigation.navigate('BrowseTab')}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <Text style={styles.searchText}>Search photographers, DJs, MUAs…</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={[styles.tile, { width: tileWidth }]}
            onPress={() => goToCategory(cat.id)}
            accessibilityRole="button"
            accessibilityLabel={cat.name}
          >
            <View style={styles.tileIcon}>
              <Ionicons name={cat.icon as any} size={22} color={colors.primary} />
            </View>
            <Text style={styles.tileLabel} numberOfLines={2}>{cat.name}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Browse by province</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.provinceRow}
      >
        {PROVINCES.map((p) => (
          <FilterChip key={p} label={p} icon="location" onPress={() => goToProvince(p)} />
        ))}
      </ScrollView>

      <View style={styles.featuredHeader}>
        <Text style={styles.sectionTitle}>Top rated</Text>
        <Pressable onPress={() => navigation.navigate('BrowseTab')}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>
      <View style={styles.list}>
        {featured.map((c) => (
          <CreativeCard
            key={c.id}
            creative={c}
            onPress={() => navigation.navigate('CreativeDetail', { creativeId: c.id })}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, marginBottom: spacing.lg,
  },
  greeting: { color: colors.textMuted, fontSize: 14 },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 2 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginHorizontal: spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.border,
  },
  searchText: { color: colors.textMuted, fontSize: 14 },
  sectionTitle: {
    color: colors.text, fontSize: 18, fontWeight: '700',
    marginTop: spacing.xl, marginBottom: spacing.md, paddingHorizontal: spacing.lg,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  tile: { alignItems: 'center', gap: 6, paddingVertical: spacing.sm },
  tileIcon: {
    width: 56, height: 56, borderRadius: radius.md,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  tileLabel: { color: colors.textMuted, fontSize: 11, textAlign: 'center', fontWeight: '600' },
  provinceRow: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  featuredHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seeAll: { color: colors.primary, fontWeight: '600', marginTop: spacing.xl, marginBottom: spacing.md, paddingRight: spacing.lg },
  list: { paddingHorizontal: spacing.lg },
});

export default HomeScreen;
