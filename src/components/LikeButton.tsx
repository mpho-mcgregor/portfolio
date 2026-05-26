import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius } from '../theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

interface Props {
  creativeId: string;
  likes: number;
  /** Compact pill for cards; full button for the detail screen. */
  variant?: 'pill' | 'full';
}

const LikeButton: React.FC<Props> = ({ creativeId, likes, variant = 'pill' }) => {
  const { isLiked, toggleLike } = useApp();
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const liked = isLiked(creativeId);

  const onPress = () => {
    if (!isAuthenticated) {
      navigation.navigate('Auth');
      return;
    }
    toggleLike(creativeId).catch(() => {});
  };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={liked ? 'Unlike' : 'Like'}
      style={[styles.base, variant === 'full' && styles.full]}
    >
      <Ionicons
        name={liked ? 'heart' : 'heart-outline'}
        size={variant === 'full' ? 20 : 16}
        color={liked ? colors.danger : colors.textMuted}
      />
      <Text style={[styles.count, liked && styles.countActive]}>{likes.toLocaleString('en-ZA')}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  full: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.md,
    justifyContent: 'center',
  },
  count: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  countActive: { color: colors.danger },
});

export default LikeButton;
