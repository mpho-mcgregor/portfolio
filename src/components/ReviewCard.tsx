import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Review } from '../types';
import { colors, radius, spacing } from '../theme';
import RatingStars from './RatingStars';

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Text style={styles.initial}>{review.author.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.headerText}>
        <Text style={styles.author}>{review.author}</Text>
        <Text style={styles.date}>{review.date}</Text>
      </View>
      <RatingStars rating={review.rating} size={12} showValue={false} />
    </View>
    <Text style={styles.comment}>{review.comment}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  initial: { color: colors.text, fontWeight: '700' },
  headerText: { flex: 1 },
  author: { color: colors.text, fontWeight: '600', fontSize: 14 },
  date: { color: colors.textMuted, fontSize: 11 },
  comment: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
});

export default ReviewCard;
