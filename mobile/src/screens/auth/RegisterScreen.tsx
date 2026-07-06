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
import { Ionicons } from "@expo/vector-icons";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { registerUser } from "../../api";
import { RootStackParamList, UserRole } from "../../types";
import { DeviceSize, FontSize, Spacing, ResponsiveDimensions } from "../../utils/responsive";

type RegisterProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

const { width } = Dimensions.get("window");

export default function RegisterScreen({
  navigation,
  route,
}: RegisterProps) {
  const role = route.params?.role || "customer";
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (
      !data.name ||
      !data.email ||
      !data.password ||
      !data.confirmPassword
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await registerUser(
        data.name,
        data.email,
        data.phone,
        data.password,
        role
      );

      navigation.navigate("Biometric", {
        userId: response.user.id,
        role: role as UserRole,
      });
    } catch (error: any) {
      setMessage(error?.message || "Registration failed. Please try again.");
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
        {/* Header */}
        <Text style={styles.title}>Create Your Account</Text>

        <Text style={styles.subtitle}>
          Register as a {role === "customer" ? "Customer" : role === "admin" ? "Admin" : "Courier"}
        </Text>

        {/* Full Name */}
        <View style={styles.inputWrapper}>
          <InputField
            label=""
            placeholder="Full Name"
            value={data.name}
            onChangeText={(v) =>
              setData({ ...data, name: v })
            }
          />
        </View>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <InputField
            label=""
            placeholder="Email Address"
            value={data.email}
            onChangeText={(v) =>
              setData({ ...data, email: v })
            }
          />
        </View>

        {/* Phone */}
        <View style={styles.inputWrapper}>
          <InputField
            label=""
            placeholder="Phone Number"
            value={data.phone}
            onChangeText={(v) =>
              setData({ ...data, phone: v })
            }
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <InputField
            label=""
            placeholder="Password"
            secureTextEntry
            value={data.password}
            onChangeText={(v) =>
              setData({ ...data, password: v })
            }
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.inputWrapper}>
          <InputField
            label=""
            placeholder="Confirm Password"
            secureTextEntry
            value={data.confirmPassword}
            onChangeText={(v) =>
              setData({
                ...data,
                confirmPassword: v,
              })
            }
          />
        </View>

        {/* Register Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={isSubmitting ? "Registering..." : "Register"}
            onPress={handleRegister}
            disabled={isSubmitting}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login", { role })}
          >
            <Text style={styles.loginText}> Login</Text>
          </TouchableOpacity>
        </View>

        {message ? (
          <Text style={styles.errorText}>{message}</Text>
        ) : null}

        {/* Bottom Branding */}
        <View style={styles.bottomBrand}>
          <Ionicons
            name="lock-closed"
            size={14}
            color="#6B7280"
          />
          <Text style={styles.brandText}>
            SecureBi Delivery System
          </Text>
        </View>
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

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
  },

  footerText: {
    fontSize: FontSize.sm,
    color: "#6B7280",
  },

  loginText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: "#2563EB",
  },

  errorText: {
    color: "#b91c1c",
    textAlign: "center",
    marginTop: Spacing.lg,
    fontSize: FontSize.sm,
  },

  bottomBrand: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
  },

  brandText: {
    marginLeft: Spacing.xs,
    fontSize: FontSize.sm,
    color: "#6B7280",
  },
});