import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing } from '../theme';
import { CATEGORIES } from '../data/categories';
import { PROVINCES } from '../data/provinces';
import { useApp } from '../context/AppContext';
import { RootStackParamList, TabParamList } from '../navigation/types';
import CreativeCard from '../components/CreativeCard';
import FilterChip from '../components/FilterChip';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type BrowseRoute = RouteProp<TabParamList, 'BrowseTab'>;

const BrowseScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<BrowseRoute>();
  const insets = useSafeAreaInsets();
  const { creatives } = useApp();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);

  // Apply incoming filters when navigating in from Home.
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.categoryId) setCategory(route.params.categoryId);
      if (route.params?.province) setProvince(route.params.province);
    }, [route.params?.categoryId, route.params?.province])
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return creatives.filter((c) => {
      if (category && c.categoryId !== category) return false;
      if (province && c.province !== province) return false;
      if (q && !`${c.name} ${c.tagline} ${c.city}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [creatives, query, category, province]);

  const clearFilters = () => {
    setCategory(null);
    setProvince(null);
    setQuery('');
  };

  const hasFilters = category || province || query;

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.title}>Browse creatives</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, service or city"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Ionicons name="close-circle" size={18} color={colors.textMuted} onPress={() => setQuery('')} />
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c.id}
            label={c.name}
            icon={c.icon}
            active={category === c.id}
            onPress={() => setCategory((prev) => (prev === c.id ? null : c.id))}
          />
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {PROVINCES.map((p) => (
          <FilterChip
            key={p}
            label={p}
            icon="location"
            active={province === p}
            onPress={() => setProvince((prev) => (prev === p ? null : p))}
          />
        ))}
      </ScrollView>

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>
          {results.length} {results.length === 1 ? 'creative' : 'creatives'}
        </Text>
        {hasFilters && (
          <Text style={styles.clear} onPress={clearFilters}>Clear filters</Text>
        )}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CreativeCard
            creative={item}
            onPress={() => navigation.navigate('CreativeDetail', { creativeId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="sad-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>No creatives match your filters yet.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginHorizontal: spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
  },
  input: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 6 },
  filterRow: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  resultHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, marginTop: spacing.sm, marginBottom: spacing.sm,
  },
  resultCount: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  clear: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  empty: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.xxl },
  emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center' },
});

export default BrowseScreen;
