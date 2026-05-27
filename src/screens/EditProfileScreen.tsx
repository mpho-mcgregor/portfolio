import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing } from '../theme';
import { CATEGORIES } from '../data/categories';
import { PROVINCES } from '../data/provinces';
import { api } from '../api/client';
import { OwnerProfile, Service } from '../types';
import { RootStackParamList } from '../navigation/types';
import FilterChip from '../components/FilterChip';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface ServiceRow {
  id?: string;
  title: string;
  description: string;
  price: string;
  dirty?: boolean;
}

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [newService, setNewService] = useState<ServiceRow>({ title: '', description: '', price: '' });

  const hydrate = useCallback((p: OwnerProfile) => {
    setName(p.name);
    setTagline(p.tagline);
    setCategoryId(p.categoryId);
    setProvince(p.province);
    setCity(p.city);
    setBio(p.bio);
    setServices(p.services.map((s: Service) => ({ ...s, price: String(s.price) })));
  }, []);

  const load = useCallback(async () => {
    try {
      hydrate(await api.getMyCreative());
    } catch {
      setError('Could not load your profile');
    } finally {
      setLoading(false);
    }
  }, [hydrate]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const saveProfile = async () => {
    if (!name.trim() || !tagline.trim() || !categoryId || !province || !city.trim() || !bio.trim()) {
      setError('All profile fields are required');
      return;
    }
    setSavingProfile(true);
    setError(null);
    try {
      await api.updateMyCreative({
        name: name.trim(),
        tagline: tagline.trim(),
        categoryId,
        province,
        city: city.trim(),
        bio: bio.trim(),
      });
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const updateServiceField = (index: number, field: keyof ServiceRow, value: string) =>
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value, dirty: true } : s))
    );

  const saveService = async (index: number) => {
    const s = services[index];
    const price = Number(s.price);
    if (!s.title.trim() || !s.description.trim() || !Number.isFinite(price) || price <= 0) {
      Alert.alert('Invalid', 'Title, description and a positive price are required.');
      return;
    }
    try {
      const updated = await api.updateService(s.id!, {
        title: s.title.trim(),
        description: s.description.trim(),
        price,
      });
      setServices((prev) =>
        prev.map((row, i) => (i === index ? { ...updated, price: String(updated.price), dirty: false } : row))
      );
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not save service');
    }
  };

  const deleteService = (index: number) => {
    const s = services[index];
    Alert.alert('Remove service', `Delete "${s.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteService(s.id!);
            setServices((prev) => prev.filter((_, i) => i !== index));
          } catch (e) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Could not delete service');
          }
        },
      },
    ]);
  };

  const addService = async () => {
    const price = Number(newService.price);
    if (!newService.title.trim() || !newService.description.trim() || !Number.isFinite(price) || price <= 0) {
      Alert.alert('Invalid', 'Title, description and a positive price are required.');
      return;
    }
    try {
      const created = await api.addService({
        title: newService.title.trim(),
        description: newService.description.trim(),
        price,
      });
      setServices((prev) => [...prev, { ...created, price: String(created.price) }]);
      setNewService({ title: '', description: '', price: '' });
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not add service');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xl }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Profile</Text>

        <Text style={styles.label}>Display name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor={colors.textMuted} />

        <Text style={styles.label}>Tagline</Text>
        <TextInput value={tagline} onChangeText={setTagline} style={styles.input} placeholderTextColor={colors.textMuted} />

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
        <TextInput value={city} onChangeText={setCity} style={styles.input} placeholderTextColor={colors.textMuted} />

        <Text style={styles.label}>About you</Text>
        <TextInput value={bio} onChangeText={setBio} style={[styles.input, styles.textArea]} multiline placeholderTextColor={colors.textMuted} />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable style={[styles.save, savingProfile && styles.disabled]} onPress={saveProfile} disabled={savingProfile}>
          <Text style={styles.saveText}>{savingProfile ? 'Saving…' : 'Save profile'}</Text>
        </Pressable>

        <Text style={[styles.sectionTitle, { marginTop: spacing.xxl }]}>Services & pricing</Text>

        {services.map((s, i) => (
          <View key={s.id ?? i} style={styles.serviceCard}>
            <TextInput value={s.title} onChangeText={(t) => updateServiceField(i, 'title', t)} style={styles.input} placeholder="Title" placeholderTextColor={colors.textMuted} />
            <TextInput value={s.description} onChangeText={(t) => updateServiceField(i, 'description', t)} style={[styles.input, styles.spacing]} placeholder="Description" placeholderTextColor={colors.textMuted} />
            <View style={styles.priceRow}>
              <Text style={styles.rand}>R</Text>
              <TextInput
                value={s.price}
                onChangeText={(t) => updateServiceField(i, 'price', t.replace(/[^0-9]/g, ''))}
                style={[styles.input, styles.priceInput]}
                keyboardType="number-pad"
                placeholder="Price"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.serviceActions}>
              <Pressable onPress={() => deleteService(i)} hitSlop={8} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={16} color={colors.danger} />
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
              <Pressable
                onPress={() => saveService(i)}
                style={[styles.serviceSave, !s.dirty && styles.disabled]}
                disabled={!s.dirty}
              >
                <Text style={styles.serviceSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <View style={[styles.serviceCard, styles.newCard]}>
          <Text style={styles.newTitle}>Add a service</Text>
          <TextInput value={newService.title} onChangeText={(t) => setNewService((p) => ({ ...p, title: t }))} style={styles.input} placeholder="Title" placeholderTextColor={colors.textMuted} />
          <TextInput value={newService.description} onChangeText={(t) => setNewService((p) => ({ ...p, description: t }))} style={[styles.input, styles.spacing]} placeholder="Description" placeholderTextColor={colors.textMuted} />
          <View style={styles.priceRow}>
            <Text style={styles.rand}>R</Text>
            <TextInput
              value={newService.price}
              onChangeText={(t) => setNewService((p) => ({ ...p, price: t.replace(/[^0-9]/g, '') }))}
              style={[styles.input, styles.priceInput]}
              keyboardType="number-pad"
              placeholder="Price"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <Pressable style={styles.serviceSave} onPress={addService}>
            <Text style={styles.serviceSaveText}>Add service</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  label: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, color: colors.text, fontSize: 15, borderWidth: 1, borderColor: colors.border,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  error: { color: colors.danger, fontSize: 13, textAlign: 'center', marginTop: spacing.lg },
  save: {
    backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: spacing.lg,
    alignItems: 'center', marginTop: spacing.xl,
  },
  disabled: { opacity: 0.4 },
  saveText: { color: colors.background, fontWeight: '800', fontSize: 16 },
  serviceCard: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md,
    marginTop: spacing.md, gap: spacing.sm,
  },
  newCard: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  newTitle: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  spacing: { marginTop: 0 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rand: { color: colors.text, fontSize: 16, fontWeight: '800' },
  priceInput: { flex: 1 },
  serviceActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deleteText: { color: colors.danger, fontWeight: '700', fontSize: 13 },
  serviceSave: {
    backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm, alignItems: 'center',
  },
  serviceSaveText: { color: colors.background, fontWeight: '800', fontSize: 13 },
});

export default EditProfileScreen;
