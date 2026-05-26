import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing } from '../theme';
import { api } from '../api/client';
import { AppNotification } from '../types';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ICONS: Record<string, string> = {
  new_booking: 'calendar',
  booking_confirmed: 'checkmark-circle',
  booking_declined: 'close-circle',
  booking_completed: 'checkmark-done-circle',
  booking_cancelled: 'ban',
  new_review: 'star',
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      api.getNotifications()
        .then((data) => { if (active) setItems(data); })
        .catch(() => { if (active) setItems([]); })
        .finally(() => { if (active) setLoading(false); });
      // Mark everything read once the screen is opened.
      api.markNotificationsRead().catch(() => {});
      return () => { active = false; };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <Pressable
          style={[styles.card, !item.read && styles.unread]}
          onPress={() => {
            if (item.data?.creativeId) {
              navigation.navigate('CreativeDetail', { creativeId: item.data.creativeId });
            }
          }}
        >
          <View style={styles.iconWrap}>
            <Ionicons name={(ICONS[item.type] ?? 'notifications') as any} size={18} color={colors.primary} />
          </View>
          <View style={styles.body}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.body}</Text>
            <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
          </View>
          {!item.read && <View style={styles.dot} />}
        </Pressable>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>No notifications yet.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.lg, flexGrow: 1 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  unread: { borderColor: colors.primary },
  iconWrap: {
    width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  body: { flex: 1 },
  title: { color: colors.text, fontSize: 15, fontWeight: '700' },
  text: { color: colors.textMuted, fontSize: 13, marginTop: 2, lineHeight: 18 },
  time: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, marginTop: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 14 },
});

export default NotificationsScreen;
