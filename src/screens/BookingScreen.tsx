import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing } from '../theme';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { formatRand } from '../utils/format';
import { CreativeDetail } from '../types';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type BookingRoute = RouteProp<RootStackParamList, 'Booking'>;

const BookingScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<BookingRoute>();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();

  const { creativeId } = route.params;
  const [creative, setCreative] = useState<CreativeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState(user?.name ?? '');
  const [date, setDate] = useState('');
  const [selectedService, setSelectedService] = useState<string | undefined>(route.params.serviceId);

  useEffect(() => {
    api.getCreative(creativeId)
      .then(setCreative)
      .catch(() => setCreative(null))
      .finally(() => setLoading(false));
  }, [creativeId]);

  if (!isAuthenticated) {
    return (
      <View style={styles.centered}>
        <Ionicons name="lock-closed-outline" size={44} color={colors.textMuted} />
        <Text style={styles.gateTitle}>Sign in to book</Text>
        <Text style={styles.gateText}>Create an account or log in to send a booking request.</Text>
        <Pressable style={styles.doneButton} onPress={() => navigation.navigate('Auth')}>
          <Text style={styles.doneButtonText}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!creative) {
    return (
      <View style={styles.centered}>
        <Text style={styles.gateText}>Creative not found.</Text>
      </View>
    );
  }

  const service = creative.services.find((s) => s.id === selectedService);
  const canSubmit = !!(name.trim() && date.trim() && service);

  const proceed = () => {
    if (!canSubmit || !service) return;
    navigation.navigate('Checkout', {
      creativeId: creative.id,
      creativeName: creative.name,
      serviceId: service.id,
      serviceTitle: service.title,
      amount: service.price,
      date: date.trim(),
      name: name.trim(),
    });
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
        <View style={styles.creativeRow}>
          <Text style={styles.creativeName}>{creative.name}</Text>
          <Text style={styles.creativeCity}>{creative.city}, {creative.province}</Text>
        </View>

        <Text style={styles.label}>Choose a service</Text>
        {creative.services.map((s) => {
          const active = selectedService === s.id;
          return (
            <Pressable
              key={s.id}
              style={[styles.serviceOption, active && styles.serviceOptionActive]}
              onPress={() => setSelectedService(s.id)}
            >
              <View style={styles.radio}>{active && <View style={styles.radioDot} />}</View>
              <View style={styles.serviceOptionInfo}>
                <Text style={styles.serviceOptionTitle}>{s.title}</Text>
                <Text style={styles.serviceOptionDesc} numberOfLines={1}>{s.description}</Text>
              </View>
              <Text style={styles.serviceOptionPrice}>{formatRand(s.price)}</Text>
            </Pressable>
          );
        })}

        <Text style={styles.label}>Your name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Preferred date</Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="e.g. 14 June 2026"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        {service && (
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Total to pay</Text>
            <Text style={styles.summaryValue}>{formatRand(service.price)}</Text>
          </View>
        )}

        <Pressable
          style={[styles.submit, !canSubmit && styles.submitDisabled]}
          onPress={proceed}
          disabled={!canSubmit}
        >
          <Ionicons name="card-outline" size={18} color={colors.background} />
          <Text style={styles.submitText}>Proceed to checkout</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center',
    padding: spacing.xl, gap: spacing.md,
  },
  gateTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  gateText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  creativeRow: { marginBottom: spacing.lg },
  creativeName: { color: colors.text, fontSize: 20, fontWeight: '800' },
  creativeCity: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  label: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  serviceOption: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  serviceOptionActive: { borderColor: colors.primary },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  serviceOptionInfo: { flex: 1 },
  serviceOptionTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  serviceOptionDesc: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  serviceOptionPrice: { color: colors.primary, fontSize: 14, fontWeight: '800' },
  input: {
    backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, color: colors.text, fontSize: 15,
    borderWidth: 1, borderColor: colors.border,
  },
  summary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: spacing.xl, paddingVertical: spacing.md, paddingHorizontal: spacing.lg,
    backgroundColor: colors.surfaceAlt, borderRadius: radius.md,
  },
  summaryLabel: { color: colors.textMuted, fontSize: 14 },
  summaryValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  submit: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: spacing.lg,
    marginTop: spacing.xl,
  },
  submitDisabled: { opacity: 0.4 },
  submitText: { color: colors.background, fontWeight: '800', fontSize: 16 },
  doneButton: {
    backgroundColor: colors.primary, borderRadius: radius.pill,
    paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, marginTop: spacing.lg,
  },
  doneButtonText: { color: colors.background, fontWeight: '800', fontSize: 15 },
});

export default BookingScreen;
