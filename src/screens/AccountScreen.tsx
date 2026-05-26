import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing } from '../theme';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { formatRand } from '../utils/format';
import { Booking } from '../types';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, logout } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        setBookings([]);
        return;
      }
      setLoading(true);
      api.getBookings()
        .then(setBookings)
        .catch(() => setBookings([]))
        .finally(() => setLoading(false));
    }, [isAuthenticated])
  );

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Ionicons name="person-circle-outline" size={64} color={colors.textMuted} />
        <Text style={styles.gateTitle}>Your account</Text>
        <Text style={styles.gateText}>
          Sign in to manage your favourites, reviews and bookings.
        </Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Auth')}>
          <Text style={styles.buttonText}>Sign in or sign up</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <Pressable onPress={logout} hitSlop={8} style={styles.logout}>
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>My bookings</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.booking}
            onPress={() => navigation.navigate('CreativeDetail', { creativeId: item.creativeId })}
          >
            <View style={styles.bookingIcon}>
              <Ionicons name="calendar" size={18} color={colors.primary} />
            </View>
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingTitle}>{item.serviceTitle}</Text>
              <Text style={styles.bookingMeta}>
                {item.creativeName} · {item.city}
              </Text>
              <Text style={styles.bookingDate}>{item.date}</Text>
            </View>
            <Text style={styles.bookingPrice}>{formatRand(item.servicePrice)}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
          ) : (
            <View style={styles.emptyBookings}>
              <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
              <Text style={styles.gateText}>No bookings yet. Find a creative to book!</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  gateTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  gateText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  button: {
    backgroundColor: colors.primary, borderRadius: radius.pill,
    paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, marginTop: spacing.md,
  },
  buttonText: { color: colors.background, fontWeight: '800', fontSize: 15 },
  profile: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.lg, marginBottom: spacing.xl,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: colors.text, fontSize: 22, fontWeight: '800' },
  profileInfo: { flex: 1 },
  name: { color: colors.text, fontSize: 20, fontWeight: '800' },
  email: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  logout: { alignItems: 'center', gap: 2 },
  logoutText: { color: colors.danger, fontSize: 11, fontWeight: '700' },
  sectionTitle: {
    color: colors.text, fontSize: 18, fontWeight: '700',
    paddingHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1 },
  booking: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  bookingIcon: {
    width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  bookingInfo: { flex: 1 },
  bookingTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  bookingMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  bookingDate: { color: colors.primary, fontSize: 12, fontWeight: '600', marginTop: 2 },
  bookingPrice: { color: colors.text, fontSize: 14, fontWeight: '800' },
  emptyBookings: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.xxl },
});

export default AccountScreen;
