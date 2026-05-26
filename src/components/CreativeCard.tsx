import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Creative } from '../types';
import { colors, radius, spacing } from '../theme';
import { getCategory } from '../data/categories';
import { formatRand } from '../utils/format';
import RatingStars from './RatingStars';
import LikeButton from './LikeButton';

interface Props {
  creative: Creative;
  onPress: () => void;
}

const CreativeCard: React.FC<Props> = ({ creative, onPress }) => {
  const category = getCategory(creative.categoryId);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`View ${creative.name}`}
    >
      <Image source={{ uri: creative.avatar }} style={styles.avatar} />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{creative.name}</Text>
          <LikeButton creativeId={creative.id} likes={creative.likes} />
        </View>
        <Text style={styles.tagline} numberOfLines={1}>{creative.tagline}</Text>
        <View style={styles.metaRow}>
          {category && (
            <View style={styles.badge}>
              <Ionicons name={category.icon as any} size={12} color={colors.primary} />
              <Text style={styles.badgeText}>{category.name}</Text>
            </View>
          )}
          <View style={styles.location}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} />
            <Text style={styles.locationText} numberOfLines={1}>{creative.city}</Text>
          </View>
        </View>
        <View style={styles.footerRow}>
          <RatingStars rating={creative.rating} />
          <Text style={styles.price}>
            from <Text style={styles.priceValue}>{formatRand(creative.startingPrice)}</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  pressed: { opacity: 0.7 },
  avatar: { width: 84, height: 84, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  body: { flex: 1, justifyContent: 'space-between' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  name: { color: colors.text, fontSize: 16, fontWeight: '700', flexShrink: 1 },
  tagline: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill,
  },
  badgeText: { color: colors.primary, fontSize: 11, fontWeight: '600' },
  location: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  locationText: { color: colors.textMuted, fontSize: 12 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  price: { color: colors.textMuted, fontSize: 12 },
  priceValue: { color: colors.text, fontWeight: '700', fontSize: 14 },
});

export default CreativeCard;
