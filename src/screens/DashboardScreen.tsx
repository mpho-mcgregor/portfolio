import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing } from '../theme';
import { api } from '../api/client';
import { getCategory } from '../data/categories';
import { formatRand } from '../utils/format';
import { OwnerBooking, OwnerProfile } from '../types';
import { RootStackParamList } from '../navigation/types';
import StatusBadge from '../components/StatusBadge';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const StatCard: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon as any} size={20} color={colors.primary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [p, b] = await Promise.all([api.getMyCreative(), api.getMyCreativeBookings()]);
      setProfile(p);
      setBookings(b);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const act = async (id: string, action: 'confirm' | 'decline' | 'complete') => {
    setConfirmingId(id);
    try {
      if (action === 'confirm') await api.confirmBooking(id);
      else if (action === 'decline') await api.declineBooking(id);
      else await api.completeBooking(id);
      await load();
    } catch {
      // leave as-is on failure
    } finally {
      setConfirmingId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Could not load your dashboard.</Text>
      </View>
    );
  }

  const category = getCategory(profile.categoryId);

  return (
    <FlatList
      style={styles.container}
      data={bookings}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <View style={styles.profile}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.tagline}>{profile.tagline}</Text>
              <View style={styles.metaRow}>
                {category && (
                  <View style={styles.badge}>
                    <Ionicons name={category.icon as any} size={12} color={colors.primary} />
                    <Text style={styles.badgeText}>{category.name}</Text>
                  </View>
                )}
                <Text style={styles.location}>{profile.city}, {profile.province}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <StatCard icon="calendar" label="Bookings" value={String(profile.bookingCount)} />
            <StatCard icon="cash" label="Revenue" value={formatRand(profile.revenue)} />
            <StatCard icon="star" label="Rating" value={profile.rating.toFixed(1)} />
            <StatCard icon="heart" label="Likes" value={String(profile.likes)} />
          </View>

          {profile.awaitingConfirmation > 0 && (
            <View style={styles.alert}>
              <Ionicons name="notifications" size={16} color={colors.background} />
              <Text style={styles.alertText}>
                {profile.awaitingConfirmation} booking{profile.awaitingConfirmation > 1 ? 's' : ''} awaiting your confirmation
              </Text>
            </View>
          )}

          <View style={styles.linkRow}>
            <Pressable style={styles.link} onPress={() => navigation.navigate('CreativeDetail', { creativeId: profile.id })}>
              <Ionicons name="eye-outline" size={16} color={colors.primary} />
              <Text style={styles.linkText}>View public profile</Text>
            </Pressable>
            <Pressable style={styles.link} onPress={() => navigation.navigate('EditProfile')}>
              <Ionicons name="create-outline" size={16} color={colors.primary} />
              <Text style={styles.linkText}>Edit profile</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Incoming bookings</Text>
        </View>
      }
      renderItem={({ item }) => {
        const busy = confirmingId === item.id;
        return (
          <View style={styles.booking}>
            <View style={styles.bookingTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bookingService}>{item.serviceTitle}</Text>
                <Text style={styles.bookingClient}>{item.name} · {item.date}</Text>
              </View>
              <Text style={styles.bookingAmount}>{formatRand(item.amount)}</Text>
            </View>
            <View style={styles.bookingBottom}>
              <View style={{ flex: 1 }}>
                <StatusBadge status={item.status} />
              </View>
              {busy ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : item.status === 'paid' ? (
                <View style={styles.actions}>
                  <Pressable style={styles.declineBtn} onPress={() => act(item.id, 'decline')}>
                    <Text style={styles.declineText}>Decline</Text>
                  </Pressable>
                  <Pressable style={styles.confirmBtn} onPress={() => act(item.id, 'confirm')}>
                    <Text style={styles.confirmText}>Confirm</Text>
                  </Pressable>
                </View>
              ) : item.status === 'confirmed' ? (
                <Pressable style={styles.confirmBtn} onPress={() => act(item.id, 'complete')}>
                  <Text style={styles.confirmText}>Mark complete</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.emptyBookings}>
          <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
          <Text style={styles.muted}>No bookings yet. Share your profile to get hired!</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  centered: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  muted: { color: colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  profile: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  profileInfo: { flex: 1 },
  name: { color: colors.text, fontSize: 20, fontWeight: '800' },
  tagline: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill,
  },
  badgeText: { color: colors.primary, fontSize: 11, fontWeight: '600' },
  location: { color: colors.textMuted, fontSize: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xl },
  statCard: {
    flexGrow: 1, flexBasis: '47%', backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 12 },
  alert: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg,
    backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md,
  },
  alertText: { color: colors.background, fontSize: 13, fontWeight: '700', flex: 1 },
  linkRow: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.lg },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  linkText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.md },
  booking: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  bookingTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bookingService: { color: colors.text, fontSize: 15, fontWeight: '700' },
  bookingClient: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  bookingAmount: { color: colors.text, fontSize: 15, fontWeight: '800' },
  bookingBottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  confirmBtn: {
    backgroundColor: colors.primary, borderRadius: radius.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, alignItems: 'center',
  },
  confirmText: { color: colors.background, fontWeight: '800', fontSize: 13 },
  declineBtn: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, alignItems: 'center',
  },
  declineText: { color: colors.danger, fontWeight: '800', fontSize: 13 },
  emptyBookings: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.xl },
});

export default DashboardScreen;
