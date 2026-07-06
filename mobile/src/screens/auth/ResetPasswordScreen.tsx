import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { resetPassword } from "../../api";
import { FontSize, Spacing, ResponsiveDimensions } from "../../utils/responsive";

type ResetPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "ResetPassword"
>;

const { width } = Dimensions.get("window");

export default function ResetPasswordScreen({ navigation }: ResetPasswordProps) {
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    if (!data.email || !data.newPassword || !data.confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage(null);
    setIsSubmitting(true);
    try {
      await resetPassword(data.email, data.newPassword);
      navigation.navigate("Login", { role: "customer" });
    } catch (error: any) {
      setMessage(error?.message || "Could not reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and choose a new secure password.
        </Text>

        <View style={styles.inputWrapper}>
          <InputField
            label=""
            placeholder="Email Address"
            value={data.email}
            onChangeText={(value) => setData({ ...data, email: value })}
          />
        </View>

        <View style={styles.inputWrapper}>
          <InputField
            label=""
            placeholder="New Password"
            secureTextEntry
            value={data.newPassword}
            onChangeText={(value) => setData({ ...data, newPassword: value })}
          />
        </View>

        <View style={styles.inputWrapper}>
          <InputField
            label=""
            placeholder="Confirm New Password"
            secureTextEntry
            value={data.confirmPassword}
            onChangeText={(value) => setData({ ...data, confirmPassword: value })}
          />
        </View>

        {message ? <Text style={styles.errorText}>{message}</Text> : null}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={isSubmitting ? "Resetting..." : "Reset Password"}
            onPress={handleReset}
            disabled={isSubmitting}
          />
        </View>

        <TouchableOpacity
          style={styles.backToLogin}
          onPress={() => navigation.navigate("Login", { role: "customer" })}
        >
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  card: {
    width: ResponsiveDimensions.cardWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: FontSize["2xl"],
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: "#64748B",
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  inputWrapper: {
    marginBottom: Spacing.md,
  },
  buttonContainer: {
    marginTop: Spacing.md,
  },
  backToLogin: {
    marginTop: Spacing.lg,
    alignSelf: "center",
  },
  backText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: FontSize.base,
  },
  errorText: {
    color: "#b91c1c",
    textAlign: "center",
    marginBottom: Spacing.md,
    fontSize: FontSize.sm,
  },
});
