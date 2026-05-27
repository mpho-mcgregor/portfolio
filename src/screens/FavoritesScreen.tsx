import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing } from '../theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';
import CreativeCard from '../components/CreativeCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { creatives, likedIds } = useApp();
  const { isAuthenticated } = useAuth();

  const liked = creatives.filter((c) => likedIds.includes(c.id));

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.title}>Your favourites</Text>

      {!isAuthenticated ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Sign in to save favourites</Text>
          <Text style={styles.emptyText}>
            Like creatives to keep them here and book them later.
          </Text>
          <Pressable style={styles.button} onPress={() => navigation.navigate('Auth')}>
            <Text style={styles.buttonText}>Sign in</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={liked}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CreativeCard
              creative={item}
              onPress={() => navigation.navigate('CreativeDetail', { creativeId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="heart-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No favourites yet</Text>
              <Text style={styles.emptyText}>
                Tap the heart on any creative to save them here for later.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1 },
  empty: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl * 2, paddingHorizontal: spacing.xl },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing.sm },
  emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  button: {
    backgroundColor: colors.primary, borderRadius: radius.pill,
    paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, marginTop: spacing.lg,
  },
  buttonText: { color: colors.background, fontWeight: '800', fontSize: 15 },
});

export default FavoritesScreen;
