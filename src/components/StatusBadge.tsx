import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { BookingStatus } from '../types';

const META: Record<BookingStatus, { label: string; color: string; icon: string }> = {
  pending: { label: 'Unpaid', color: colors.textMuted, icon: 'ellipse-outline' },
  paid: { label: 'Awaiting confirmation', color: colors.star, icon: 'time' },
  confirmed: { label: 'Confirmed', color: colors.success, icon: 'checkmark-circle' },
  completed: { label: 'Completed', color: colors.accent, icon: 'checkmark-done-circle' },
  declined: { label: 'Declined', color: colors.danger, icon: 'close-circle' },
  cancelled: { label: 'Cancelled', color: colors.danger, icon: 'ban' },
};

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const meta = META[status] ?? META.pending;
  return (
    <View style={styles.row}>
      <Ionicons name={meta.icon as any} size={13} color={meta.color} />
      <Text style={[styles.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  text: { fontSize: 12, fontWeight: '700' },
});

export default StatusBadge;
