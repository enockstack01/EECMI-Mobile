import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextFieldProps = TextInputProps & {
  label: string;
  required?: boolean;
  error?: string;
};

export function TextField({
  label,
  required = false,
  error,
  multiline,
  style,
  ...rest
}: TextFieldProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label}
        {required ? <Text style={{ color: theme.danger }}> *</Text> : null}
      </Text>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        multiline={multiline}
        style={[
          styles.input,
          {
            backgroundColor: theme.background,
            borderColor: error ? theme.danger : theme.border,
            color: theme.text,
          },
          multiline && styles.multiline,
          style,
        ]}
        {...rest}
      />
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.one },
  label: { fontFamily: Fonts.sans, fontSize: 13, fontWeight: '600' },
  input: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
  },
  multiline: { minHeight: 110, textAlignVertical: 'top', paddingTop: Spacing.two + 2 },
  error: { fontSize: 12, fontWeight: '500' },
});
