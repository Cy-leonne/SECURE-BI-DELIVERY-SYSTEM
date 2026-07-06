import React from "react";
import { TextInput, StyleSheet, TextInputProps, View, Text } from "react-native";
import { FontSize, Spacing } from "../utils/responsive";

type Props = TextInputProps & {
  label?: string;
};

export default function InputField({ label, ...props }: Props) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={styles.input} placeholderTextColor="#94a3b8" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: Spacing.sm,
    color: "#0f172a",
    fontWeight: "600",
    fontSize: FontSize.base,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: Spacing.md,
    color: "#0f172a",
    fontSize: FontSize.base,
    minHeight: 44,
  },
});