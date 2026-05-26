import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing } from '../theme';
import { CATEGORIES } from '../data/categories';
import { PROVINCES } from '../data/provinces';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';
import FilterChip from '../components/FilterChip';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface ServiceDraft {
  title: string;
  description: string;
  price: string;
}

const emptyService = (): ServiceDraft => ({ title: '', description: '', price: '' });

const BecomeCreativeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [tagline, setTagline] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [services, setServices] = useState<ServiceDraft[]>([emptyService()]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateService = (index: number, field: keyof ServiceDraft, value: string) =>
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));

  const addService = () => setServices((prev) => [...prev, emptyService()]);
  const removeService = (index: number) =>
    setServices((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  const validServices = services
    .map((s) => ({
      title: s.title.trim(),
      description: s.description.trim(),
      price: Number(s.price),
    }))
    .filter((s) => s.title && s.description && Number.isFinite(s.price) && s.price > 0);

  const canSubmit =
    name.trim() && tagline.trim() && categoryId && province && city.trim() &&
    bio.trim() && validServices.length > 0 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.createMyCreative({
        name: name.trim(),
        tagline: tagline.trim(),
        categoryId: categoryId!,
        province: province!,
        city: city.trim(),
        bio: bio.trim(),
        services: validServices,
      });
      navigation.replace('Dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xl }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.intro}>
          List yourself on CreativeConnect. Clients across South Africa will be able to find and book you.
        </Text>

        <Text style={styles.label}>Display name</Text>
        <TextInput value={name} onChangeText={setName} placeholder="e.g. Lindi Lens" placeholderTextColor={colors.textMuted} style={styles.input} />

        <Text style={styles.label}>Tagline</Text>
        <TextInput value={tagline} onChangeText={setTagline} placeholder="e.g. Event & portrait photography" placeholderTextColor={colors.textMuted} style={styles.input} />

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipWrap}>
          {CATEGORIES.map((c) => (
            <FilterChip key={c.id} label={c.name} icon={c.icon} active={categoryId === c.id} onPress={() => setCategoryId(c.id)} />
          ))}
        </View>

        <Text style={styles.label}>Province</Text>
        <View style={styles.chipWrap}>
          {PROVINCES.map((p) => (
            <FilterChip key={p} label={p} icon="location" active={province === p} onPress={() => setProvince(p)} />
          ))}
        </View>

        <Text style={styles.label}>City / town</Text>
        <TextInput value={city} onChangeText={setCity} placeholder="e.g. Soweto" placeholderTextColor={colors.textMuted} style={styles.input} />

        <Text style={styles.label}>About you</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Tell clients about your work and experience"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, styles.textArea]}
          multiline
        />

        <View style={styles.servicesHeader}>
          <Text style={styles.label}>Services & pricing</Text>
          <Pressable onPress={addService} hitSlop={8} style={styles.addService}>
            <Ionicons name="add-circle" size={18} color={colors.primary} />
            <Text style={styles.addServiceText}>Add</Text>
          </Pressable>
        </View>

        {services.map((s, i) => (
          <View key={i} style={styles.serviceCard}>
            <View style={styles.serviceCardHeader}>
              <Text style={styles.serviceCardTitle}>Service {i + 1}</Text>
              {services.length > 1 && (
                <Pressable onPress={() => removeService(i)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={16} color={colors.danger} />
                </Pressable>
              )}
            </View>
            <TextInput
              value={s.title}
              onChangeText={(t) => updateService(i, 'title', t)}
              placeholder="Title (e.g. Event Shoot)"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <TextInput
              value={s.description}
              onChangeText={(t) => updateService(i, 'description', t)}
              placeholder="Short description"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.serviceSpacing]}
            />
            <View style={styles.priceRow}>
              <Text style={styles.rand}>R</Text>
              <TextInput
                value={s.price}
                onChangeText={(t) => updateService(i, 'price', t.replace(/[^0-9]/g, ''))}
                placeholder="Price"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.priceInput]}
                keyboardType="number-pad"
              />
            </View>
          </View>
        ))}

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable style={[styles.submit, !canSubmit && styles.submitDisabled]} onPress={submit} disabled={!canSubmit}>
          <Text style={styles.submitText}>{submitting ? 'Creating…' : 'Create my profile'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  intro: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginBottom: spacing.sm },
  label: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, color: colors.text, fontSize: 15, borderWidth: 1, borderColor: colors.border,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  servicesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addService: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.lg },
  addServiceText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  serviceCard: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md,
    marginTop: spacing.sm, gap: spacing.sm,
  },
  serviceCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  serviceCardTitle: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  serviceSpacing: { marginTop: 0 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rand: { color: colors.text, fontSize: 16, fontWeight: '800' },
  priceInput: { flex: 1 },
  error: { color: colors.danger, fontSize: 13, textAlign: 'center', marginTop: spacing.lg },
  submit: {
    backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: spacing.lg,
    alignItems: 'center', marginTop: spacing.xl,
  },
  submitDisabled: { opacity: 0.4 },
  submitText: { color: colors.background, fontWeight: '800', fontSize: 16 },
});

export default BecomeCreativeScreen;
