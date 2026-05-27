import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

interface Props {
  label: string;
  icon?: string;
  active?: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<Props> = ({ label, icon, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.chip, active && styles.chipActive]}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
  >
    {icon && (
      <Ionicons name={icon as any} size={14} color={active ? colors.background : colors.textMuted} />
    )}
    <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  labelActive: { color: colors.background },
});

export default FilterChip;
