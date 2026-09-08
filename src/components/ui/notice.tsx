import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type NoticeProps = {
  tone: 'success' | 'error';
  message: string;
};

export function Notice({ tone, message }: NoticeProps) {
  const theme = useTheme();
  const color = tone === 'success' ? theme.success : theme.danger;
  return (
    <View style={[styles.notice, { borderColor: color, backgroundColor: theme.backgroundElement }]}>
      <Ionicons
        name={tone === 'success' ? 'checkmark-circle' : 'alert-circle'}
        size={18}
        color={color}
      />
      <Text style={[styles.text, { color: theme.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.sm,
    padding: Spacing.three,
  },
  text: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '500' },
});
