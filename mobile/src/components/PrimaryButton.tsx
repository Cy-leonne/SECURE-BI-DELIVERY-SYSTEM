import React from "react";
import { Pressable, Text, StyleSheet, Dimensions } from "react-native";
import { FontSize, Spacing, ResponsiveDimensions } from "../utils/responsive";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({ title, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: Spacing.md,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
    minHeight: ResponsiveDimensions.buttonHeight,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    backgroundColor: "#94a3b8",
  },
  text: {
    color: "#fff",
    fontWeight: "800",
    fontSize: FontSize.lg,
  },
});