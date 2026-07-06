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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { RootStackParamList } from "../../types";
import { DeviceSize, FontSize, Spacing, ResponsiveDimensions } from "../../utils/responsive";

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

const { width } = Dimensions.get("window");

export default function LoginScreen({
  navigation,
  route,
}: LoginProps) {
  const role = route.params?.role || "courier";
  const isCustomer = role === "customer";
  const isAdmin = role === "admin";
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const { login, loginWithBiometric } = useAuth();

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);
    } catch (error) {
      console.log("Biometric check error:", error);
      setIsBiometricAvailable(false);
    }
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setMessage("Please enter email and password.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    try {
      await login(loginData.email, loginData.password);
      // AppNavigator automatically switches stacks when user state updates
    } catch (error: any) {
      setMessage(error?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!isBiometricAvailable) {
      Alert.alert(
        "Biometric Not Available",
        "Biometric authentication is not available on this device or no biometric is enrolled."
      );
      return;
    }

    if (!loginData.email) {
      setMessage("Enter your email to complete biometric login.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
        fallbackLabel: "Use PIN",
      });

      if (!result.success) {
        setMessage("Biometric authentication failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const biometricHash = "SIMULATED_HASH_VALUE";
      await loginWithBiometric(loginData.email, biometricHash);
      // AppNavigator automatically switches stacks when user state updates
    } catch (error: any) {
      setMessage(error?.message || "Biometric login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.card}>
        {/* Header */}
        <Text style={styles.title}>
          {isAdmin ? "Admin" : isCustomer ? "Customer" : "Courier"} Login
        </Text>

        <Text style={styles.subtitle}>
          Login to your account
        </Text>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <InputField
            label=""
            placeholder="Email / Phone Number"
            value={loginData.email}
            onChangeText={(v) =>
              setLoginData({
                ...loginData,
                email: v,
              })
            }
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <InputField
            label=""
            placeholder="Password"
            secureTextEntry
            value={loginData.password}
            onChangeText={(v) =>
              setLoginData({
                ...loginData,
                password: v,
              })
            }
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={isSubmitting ? "Logging in..." : "Login"}
            onPress={handleLogin}
            disabled={isSubmitting}
          />
        </View>

        {/* Divider */}
        {isBiometricAvailable && (
          <>
            <Text style={styles.orText}>
              or Login with Biometrics
            </Text>

            {/* Fingerprint Button */}
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
              disabled={isSubmitting}
            >
              <Ionicons
                name="finger-print"
                size={48}
                color={isSubmitting ? "#CBD5E1" : "#2563EB"}
              />
            </TouchableOpacity>
          </>
        )}

        {/* Register */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Register", { role })
            }
          >
            <Text style={styles.registerText}>
              {" "}
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {message ? (
          <Text style={styles.errorText}>
            {message}
          </Text>
        ) : null}
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

  forgotContainer: {
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },

  forgotText: {
    fontSize: FontSize.sm,
    color: "#2563EB",
    fontWeight: "500",
  },

  buttonContainer: {
    marginBottom: Spacing.lg,
  },

  orText: {
    textAlign: "center",
    fontSize: FontSize.sm,
    color: "#6B7280",
    marginBottom: Spacing.lg,
  },

  biometricButton: {
    width: 90,
    height: 90,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#F8FAFC",
    marginBottom: Spacing.xl,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    fontSize: FontSize.sm,
    color: "#6B7280",
  },

  registerText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: "#2563EB",
  },

  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: Spacing.lg,
    fontSize: FontSize.sm,
  },
});
