import React, { useState } from 'react';
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
import { api } from '../api/client';
import { notifyLocal } from '../notifications';
import { formatRand } from '../utils/format';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type CheckoutRoute = RouteProp<RootStackParamList, 'Checkout'>;

const onlyDigits = (s: string) => s.replace(/\D/g, '');

const formatCardNumber = (s: string) =>
  onlyDigits(s).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (s: string) => {
  const d = onlyDigits(s).slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const isValidExpiry = (s: string) => {
  const m = /^(\d{2})\/(\d{2})$/.exec(s);
  if (!m) return false;
  const month = Number(m[1]);
  return month >= 1 && month <= 12;
};

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<CheckoutRoute>();
  const insets = useSafeAreaInsets();

  const [cardName, setCardName] = useState(params.name);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const cardValid =
    cardName.trim().length > 1 &&
    onlyDigits(cardNumber).length === 16 &&
    isValidExpiry(expiry) &&
    cvv.length >= 3;

  const pay = async () => {
    if (!cardValid || processing) return;
    setProcessing(true);
    setError(null);
    try {
      // Simulate a payment gateway round-trip before recording the booking.
      await new Promise((r) => setTimeout(r, 1600));
      const booking = await api.createBooking({
        creativeId: params.creativeId,
        serviceId: params.serviceId,
        date: params.date,
        name: params.name,
        paid: true,
      });
      setReference(booking.reference);
      notifyLocal(
        'Booking confirmed 🎉',
        `Your booking with ${params.creativeName} for ${params.date} is in. Ref ${booking.reference}.`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment could not be completed');
    } finally {
      setProcessing(false);
    }
  };

  if (reference) {
    return (
      <View style={styles.centered}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={48} color={colors.background} />
        </View>
        <Text style={styles.confirmTitle}>Payment successful</Text>
        <Text style={styles.confirmText}>
          You paid {formatRand(params.amount)} to {params.creativeName} for{' '}
          "{params.serviceTitle}" on {params.date}.
        </Text>
        <View style={styles.refBox}>
          <Text style={styles.refLabel}>Booking reference</Text>
          <Text style={styles.refValue}>{reference}</Text>
        </View>
        <Pressable
          style={styles.doneButton}
          onPress={() => navigation.navigate('Tabs', { screen: 'AccountTab' })}
        >
          <Text style={styles.doneButtonText}>View my bookings</Text>
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
        <View style={styles.orderCard}>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Creative</Text>
            <Text style={styles.orderValue}>{params.creativeName}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Service</Text>
            <Text style={styles.orderValue}>{params.serviceTitle}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Date</Text>
            <Text style={styles.orderValue}>{params.date}</Text>
          </View>
          <View style={[styles.orderRow, styles.orderTotal]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatRand(params.amount)}</Text>
          </View>
        </View>

        <View style={styles.sandbox}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <Text style={styles.sandboxText}>
            Demo checkout — use any details, e.g. card 4242 4242 4242 4242.
          </Text>
        </View>

        <Text style={styles.label}>Name on card</Text>
        <TextInput
          value={cardName}
          onChangeText={setCardName}
          placeholder="Full name"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Card number</Text>
        <View style={styles.cardInputWrap}>
          <Ionicons name="card" size={18} color={colors.textMuted} />
          <TextInput
            value={cardNumber}
            onChangeText={(t) => setCardNumber(formatCardNumber(t))}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={colors.textMuted}
            style={styles.cardInput}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Expiry</Text>
            <TextInput
              value={expiry}
              onChangeText={(t) => setExpiry(formatExpiry(t))}
              placeholder="MM/YY"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              value={cvv}
              onChangeText={(t) => setCvv(onlyDigits(t).slice(0, 4))}
              placeholder="123"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              keyboardType="number-pad"
              secureTextEntry
            />
          </View>
        </View>

        {error && <Text style={styles.errorMsg}>{error}</Text>}

        <Pressable
          style={[styles.pay, (!cardValid || processing) && styles.payDisabled]}
          onPress={pay}
          disabled={!cardValid || processing}
        >
          {processing ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <>
              <Ionicons name="lock-closed" size={16} color={colors.background} />
              <Text style={styles.payText}>Pay {formatRand(params.amount)}</Text>
            </>
          )}
        </Pressable>
        <Text style={styles.disclaimer}>
          Payments are simulated. No real card is charged.
        </Text>
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
  orderCard: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, gap: spacing.sm,
  },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderLabel: { color: colors.textMuted, fontSize: 14 },
  orderValue: { color: colors.text, fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right', marginLeft: spacing.md },
  orderTotal: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md, marginTop: spacing.xs },
  totalLabel: { color: colors.text, fontSize: 16, fontWeight: '700' },
  totalValue: { color: colors.primary, fontSize: 20, fontWeight: '800' },
  sandbox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surfaceAlt, borderRadius: radius.sm, padding: spacing.md, marginTop: spacing.lg,
  },
  sandboxText: { color: colors.textMuted, fontSize: 12, flex: 1 },
  label: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, color: colors.text, fontSize: 15,
    borderWidth: 1, borderColor: colors.border,
  },
  cardInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  cardInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
  errorMsg: { color: colors.danger, fontSize: 13, textAlign: 'center', marginTop: spacing.md },
  pay: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: spacing.lg,
    marginTop: spacing.xl, minHeight: 56,
  },
  payDisabled: { opacity: 0.4 },
  payText: { color: colors.background, fontWeight: '800', fontSize: 16 },
  disclaimer: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: spacing.md },
  checkCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  confirmTitle: { color: colors.text, fontSize: 24, fontWeight: '800' },
  confirmText: { color: colors.textMuted, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  refBox: {
    backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  refLabel: { color: colors.textMuted, fontSize: 12 },
  refValue: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 2, letterSpacing: 1 },
  doneButton: {
    backgroundColor: colors.primary, borderRadius: radius.pill,
    paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, marginTop: spacing.sm,
  },
  doneButtonText: { color: colors.background, fontWeight: '800', fontSize: 15 },
});

export default CheckoutScreen;
