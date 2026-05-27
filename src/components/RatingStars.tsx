import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface Props {
  rating: number;
  size?: number;
  showValue?: boolean;
}

const RatingStars: React.FC<Props> = ({ rating, size = 14, showValue = true }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {stars.map((s) => {
        const name = rating >= s ? 'star' : rating >= s - 0.5 ? 'star-half' : 'star-outline';
        return <Ionicons key={s} name={name} size={size} color={colors.star} />;
      })}
      {showValue && <Text style={[styles.value, { fontSize: size }]}>{rating.toFixed(1)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  value: { color: colors.textMuted, marginLeft: 4, fontWeight: '600' },
});

export default RatingStars;
