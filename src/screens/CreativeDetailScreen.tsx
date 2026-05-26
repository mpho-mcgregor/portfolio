import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing } from '../theme';
import { getCategory } from '../data/categories';
import { useApp } from '../context/AppContext';
import { formatRand } from '../utils/format';
import { RootStackParamList } from '../navigation/types';
import RatingStars from '../components/RatingStars';
import LikeButton from '../components/LikeButton';
import ReviewCard from '../components/ReviewCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type DetailRoute = RouteProp<RootStackParamList, 'CreativeDetail'>;

const CreativeDetailScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<DetailRoute>();
  const insets = useSafeAreaInsets();
  const { creatives, addReview } = useApp();

  const creative = creatives.find((c) => c.id === route.params.creativeId);

  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  if (!creative) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Creative not found.</Text>
      </View>
    );
  }

  const category = getCategory(creative.categoryId);

  const submitReview = () => {
    if (!author.trim() || !comment.trim()) return;
    addReview(creative.id, { author: author.trim(), comment: comment.trim(), rating });
    setAuthor('');
    setComment('');
    setRating(5);
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image source={{ uri: creative.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{creative.name}</Text>
          <Text style={styles.tagline}>{creative.tagline}</Text>

          <View style={styles.metaRow}>
            {category && (
              <View style={styles.badge}>
                <Ionicons name={category.icon as any} size={13} color={colors.primary} />
                <Text style={styles.badgeText}>{category.name}</Text>
              </View>
            )}
            <View style={styles.location}>
              <Ionicons name="location" size={13} color={colors.textMuted} />
              <Text style={styles.locationText}>{creative.city}, {creative.province}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <RatingStars rating={creative.rating} size={16} />
              <Text style={styles.statLabel}>{creative.reviews.length} reviews</Text>
            </View>
            <LikeButton creativeId={creative.id} likes={creative.likes} variant="full" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{creative.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services & pricing</Text>
          {creative.services.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDesc}>{service.description}</Text>
              </View>
              <View style={styles.serviceRight}>
                <Text style={styles.servicePrice}>{formatRand(service.price)}</Text>
                <Pressable
                  style={styles.bookSmall}
                  onPress={() => navigation.navigate('Booking', { creativeId: creative.id, serviceId: service.id })}
                >
                  <Text style={styles.bookSmallText}>Book</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Pressable onPress={() => setShowForm((s) => !s)} hitSlop={8}>
              <Text style={styles.addReview}>{showForm ? 'Cancel' : '+ Add review'}</Text>
            </Pressable>
          </View>

          {showForm && (
            <View style={styles.form}>
              <TextInput
                value={author}
                onChangeText={setAuthor}
                placeholder="Your name"
                placeholderTextColor={colors.textMuted}
                style={styles.formInput}
              />
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Share your experience"
                placeholderTextColor={colors.textMuted}
                multiline
                style={[styles.formInput, styles.formTextArea]}
              />
              <View style={styles.starPicker}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons
                    key={s}
                    name={rating >= s ? 'star' : 'star-outline'}
                    size={28}
                    color={colors.star}
                    onPress={() => setRating(s)}
                  />
                ))}
              </View>
              <Pressable
                style={[styles.submit, (!author.trim() || !comment.trim()) && styles.submitDisabled]}
                onPress={submitReview}
                disabled={!author.trim() || !comment.trim()}
              >
                <Text style={styles.submitText}>Post review</Text>
              </Pressable>
            </View>
          )}

          {creative.reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bookBar, { paddingBottom: insets.bottom || spacing.md }]}>
        <View>
          <Text style={styles.bookBarLabel}>Starting from</Text>
          <Text style={styles.bookBarPrice}>{formatRand(creative.startingPrice)}</Text>
        </View>
        <Pressable
          style={styles.bookButton}
          onPress={() => navigation.navigate('Booking', { creativeId: creative.id })}
        >
          <Ionicons name="calendar" size={18} color={colors.background} />
          <Text style={styles.bookButtonText}>Book now</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  missingText: { color: colors.textMuted },
  hero: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: spacing.md, backgroundColor: colors.surfaceAlt },
  name: { color: colors.text, fontSize: 24, fontWeight: '800' },
  tagline: { color: colors.textMuted, fontSize: 14, marginTop: 4, textAlign: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap', justifyContent: 'center' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceAlt, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill,
  },
  badgeText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  location: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationText: { color: colors.textMuted, fontSize: 12 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', marginTop: spacing.lg, gap: spacing.md,
  },
  stat: { gap: 4 },
  statLabel: { color: colors.textMuted, fontSize: 12 },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: spacing.md },
  bio: { color: colors.textMuted, fontSize: 14, lineHeight: 22 },
  serviceCard: {
    flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  serviceInfo: { flex: 1 },
  serviceTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  serviceDesc: { color: colors.textMuted, fontSize: 13, marginTop: 3, lineHeight: 18 },
  serviceRight: { alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.sm },
  servicePrice: { color: colors.primary, fontSize: 15, fontWeight: '800' },
  bookSmall: { backgroundColor: colors.surfaceAlt, paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.sm },
  bookSmallText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addReview: { color: colors.primary, fontWeight: '600', marginBottom: spacing.md },
  form: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm,
  },
  formInput: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.sm, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, color: colors.text, fontSize: 14,
  },
  formTextArea: { minHeight: 70, textAlignVertical: 'top' },
  starPicker: { flexDirection: 'row', gap: 6, paddingVertical: spacing.xs },
  submit: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingVertical: spacing.md, alignItems: 'center' },
  submitDisabled: { opacity: 0.4 },
  submitText: { color: colors.background, fontWeight: '700', fontSize: 14 },
  bookBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
    paddingHorizontal: spacing.lg, paddingTop: spacing.md,
  },
  bookBarLabel: { color: colors.textMuted, fontSize: 12 },
  bookBarPrice: { color: colors.text, fontSize: 18, fontWeight: '800' },
  bookButton: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill,
  },
  bookButtonText: { color: colors.background, fontWeight: '800', fontSize: 15 },
});

export default CreativeDetailScreen;
