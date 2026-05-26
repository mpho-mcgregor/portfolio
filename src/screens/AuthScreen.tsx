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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing } from '../theme';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';
  const canSubmit =
    email.trim() && password && (!isRegister || name.trim()) && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isRegister) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logo}>
          <Ionicons name="color-palette" size={36} color={colors.primary} />
        </View>
        <Text style={styles.title}>{isRegister ? 'Create your account' : 'Welcome back'}</Text>
        <Text style={styles.subtitle}>
          {isRegister
            ? 'Join CreativeConnect to like and book creatives.'
            : 'Sign in to like, review and book creatives.'}
        </Text>

        {isRegister && (
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            autoCapitalize="words"
          />
        )}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password (min 6 characters)"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          secureTextEntry
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.submit, !canSubmit && styles.submitDisabled]}
          onPress={submit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitText}>
            {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => { setMode(isRegister ? 'login' : 'register'); setError(null); }}
          style={styles.switch}
        >
          <Text style={styles.switchText}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <Text style={styles.switchLink}>{isRegister ? 'Sign in' : 'Sign up'}</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingTop: spacing.xxl },
  logo: {
    width: 72, height: 72, borderRadius: radius.lg, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: spacing.lg,
  },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl },
  input: {
    backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, color: colors.text, fontSize: 15,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md,
  },
  error: { color: colors.danger, fontSize: 13, textAlign: 'center', marginBottom: spacing.md },
  submit: {
    backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: spacing.lg,
    alignItems: 'center', marginTop: spacing.sm,
  },
  submitDisabled: { opacity: 0.4 },
  submitText: { color: colors.background, fontWeight: '800', fontSize: 16 },
  switch: { marginTop: spacing.xl, alignItems: 'center' },
  switchText: { color: colors.textMuted, fontSize: 14 },
  switchLink: { color: colors.primary, fontWeight: '700' },
});

export default AuthScreen;
