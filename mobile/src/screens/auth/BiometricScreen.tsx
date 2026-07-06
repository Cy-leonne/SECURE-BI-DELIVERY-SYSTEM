import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { registerBiometric } from "../../api";
import { FontSize, Spacing, ResponsiveDimensions } from "../../utils/responsive";

type BiometricProps = NativeStackScreenProps<
  RootStackParamList,
  "Biometric"
>;

const { width } = Dimensions.get("window");

export default function BiometricScreen({
  navigation,
  route,
}: BiometricProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const userId = route.params?.userId;
  const role = route.params?.role || "customer";

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!compatible || !enrolled) {
        setMessage("Biometric hardware not available or not enrolled. You can complete registration later.");
        setIsBiometricAvailable(false);
      } else {
        setIsBiometricAvailable(true);
      }
    } catch (error) {
      console.log("Biometric check error:", error);
      setIsBiometricAvailable(false);
      setMessage("Unable to check biometric availability.");
    }
  };

  const handleStartBiometricEnrollment = async () => {
    if (!isBiometricAvailable) {
      // Skip biometric enrollment if not available
      completeEnrollment("SKIP_BIOMETRIC");
      return;
    }

    setMessage(null);
    setIsSubmitting(true);

    try {
      // Step 1: Scan first fingerprint
      const result1 = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
        fallbackLabel: "Use PIN",
      });

      if (!result1.success) {
        setMessage("First biometric scan failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setStep(2);
      Alert.alert("Success", "First scan completed. Now please scan again to confirm.");

      // Step 2: Scan second fingerprint to confirm
      const result2 = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
        fallbackLabel: "Use PIN",
      });

      if (!result2.success) {
        setMessage("Second biometric scan failed. Please try again.");
        setStep(1);
        setIsSubmitting(false);
        return;
      }

      setStep(3);
      Alert.alert("Success", "Both scans completed. Finalizing enrollment...");

      // Complete enrollment with the biometric hash
      await completeEnrollment("SIMULATED_HASH_VALUE");
    } catch (error: any) {
      setMessage("Biometric enrollment error: " + error.message);
      setStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeEnrollment = async (biometricHash: string) => {
    if (!userId) {
      setMessage("Unable to complete biometric enrollment.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerBiometric(userId, biometricHash);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login", params: { role } }],
      });
    } catch (error: any) {
      setMessage(error?.message || "Enrollment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipBiometric = async () => {
    Alert.alert(
      "Skip Biometric",
      "You can enable biometric authentication later. Continue with registration?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Skip",
          onPress: () => completeEnrollment("SKIP_BIOMETRIC"),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>
          Biometric Registration
        </Text>

        <Text style={styles.subtitle}>
          {isBiometricAvailable ? "Register your fingerprint" : "Biometric Not Available"}
        </Text>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          <View style={step >= 1 ? styles.activeStep : styles.inactiveStep}>
            <Text style={step >= 1 ? styles.activeStepText : styles.inactiveStepText}>1</Text>
          </View>

          <View style={styles.line} />

          <View style={step >= 2 ? styles.activeStep : styles.inactiveStep}>
            <Text style={step >= 2 ? styles.activeStepText : styles.inactiveStepText}>2</Text>
          </View>

          <View style={styles.line} />

          <View style={step >= 3 ? styles.activeStep : styles.inactiveStep}>
            <Text style={step >= 3 ? styles.activeStepText : styles.inactiveStepText}>3</Text>
          </View>
        </View>

        {/* Fingerprint Circle */}
        <View style={styles.fingerprintWrapper}>
          <Ionicons
            name="finger-print"
            size={120}
            color={isBiometricAvailable ? "#2563EB" : "#CBD5E1"}
          />
        </View>

        {/* Instructions */}
        <Text style={styles.instructionTitle}>
          {step === 1 ? "Place your finger on the scanner" : step === 2 ? "Scan again to confirm" : "Enrollment complete!"}
        </Text>

        <Text style={styles.instructionText}>
          {step === 1 ? "Lift and place your finger several times" : step === 2 ? "Lift and place your finger again" : "Your fingerprint has been registered"}
        </Text>

        {/* Bottom Text */}
        <Text style={styles.helperText}>
          This helps us verify your identity during delivery
        </Text>

        {/* Button */}
        {message ? (
          <Text style={styles.errorText}>{message}</Text>
        ) : null}

        {isBiometricAvailable ? (
          <TouchableOpacity
            style={styles.button}
            onPress={handleStartBiometricEnrollment}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Processing..." : step === 3 ? "Continue to Login" : "Start Enrollment"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => completeEnrollment("NO_BIOMETRIC")}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Processing..." : "Continue Without Biometric"}
            </Text>
          </TouchableOpacity>
        )}

        {isBiometricAvailable && step === 1 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipBiometric}
          >
            <Text style={styles.skipButtonText}>
              Skip for now
            </Text>
          </TouchableOpacity>
        )}
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
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },

  title: {
    fontSize: FontSize["2xl"],
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },

  subtitle: {
    fontSize: FontSize.base,
    color: "#64748B",
    marginBottom: Spacing.xl,
    textAlign: "center",
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },

  activeStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  activeStepText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  inactiveStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  inactiveStepText: {
    color: "#6B7280",
    fontWeight: "700",
  },

  line: {
    width: 45,
    height: 2,
    backgroundColor: "#D1D5DB",
  },

  fingerprintWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
    backgroundColor: "#F8FAFC",
  },

  instructionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },

  instructionText: {
    fontSize: FontSize.base,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: Spacing.xl,
  },

  helperText: {
    fontSize: FontSize.sm,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },

  errorText: {
    color: "#b91c1c",
    marginBottom: Spacing.md,
    textAlign: "center",
    fontSize: FontSize.sm,
  },

  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: ResponsiveDimensions.buttonHeight,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: FontSize.lg,
    fontWeight: "700",
  },

  skipButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
  },

  skipButtonText: {
    color: "#2563EB",
    fontSize: FontSize.base,
    fontWeight: "600",
    textAlign: "center",
  },
});
