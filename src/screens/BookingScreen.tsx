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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing } from '../theme';
import { useApp } from '../context/AppContext';
import { formatRand } from '../utils/format';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type BookingRoute = RouteProp<RootStackParamList, 'Booking'>;

const BookingScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<BookingRoute>();
  const insets = useSafeAreaInsets();
  const { creatives, addBooking } = useApp();

  const creative = creatives.find((c) => c.id === route.params.creativeId);

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [selectedService, setSelectedService] = useState<string | undefined>(route.params.serviceId);
  const [confirmed, setConfirmed] = useState(false);

  if (!creative) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Creative not found.</Text>
      </View>
    );
  }

  const service = creative.services.find((s) => s.id === selectedService);
  const canSubmit = name.trim() && date.trim() && selectedService;

  const confirm = () => {
    if (!canSubmit) return;
    addBooking({ creativeId: creative.id, serviceId: selectedService!, date, name: name.trim() });
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <View style={styles.confirmWrap}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={48} color={colors.background} />
        </View>
        <Text style={styles.confirmTitle}>Booking requested!</Text>
        <Text style={styles.confirmText}>
          {creative.name} will be in touch to confirm{' '}
          {service ? `"${service.title}"` : 'your booking'} on {date}.
        </Text>
        <Pressable style={styles.doneButton} onPress={() => navigation.navigate('Tabs')}>
          <Text style={styles.doneButtonText}>Back to home</Text>
        </Pressable>
      </View>
    );
  }

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
              <View style={styles.radio}>
                {active && <View style={styles.radioDot} />}
              </View>
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
            <Text style={styles.summaryLabel}>Estimated total</Text>
            <Text style={styles.summaryValue}>{formatRand(service.price)}</Text>
          </View>
        )}

        <Pressable
          style={[styles.submit, !canSubmit && styles.submitDisabled]}
          onPress={confirm}
          disabled={!canSubmit}
        >
          <Text style={styles.submitText}>Confirm booking request</Text>
        </Pressable>
        <Text style={styles.disclaimer}>
          This sends a request to the creative. No payment is taken in this demo.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  missingText: { color: colors.textMuted },
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
    backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: spacing.lg,
    alignItems: 'center', marginTop: spacing.xl,
  },
  submitDisabled: { opacity: 0.4 },
  submitText: { color: colors.background, fontWeight: '800', fontSize: 16 },
  disclaimer: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: spacing.md },
  confirmWrap: {
    flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center',
    padding: spacing.xl, gap: spacing.md,
  },
  checkCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  confirmTitle: { color: colors.text, fontSize: 24, fontWeight: '800' },
  confirmText: { color: colors.textMuted, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  doneButton: {
    backgroundColor: colors.primary, borderRadius: radius.pill,
    paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, marginTop: spacing.lg,
  },
  doneButtonText: { color: colors.background, fontWeight: '800', fontSize: 15 },
});

export default BookingScreen;
