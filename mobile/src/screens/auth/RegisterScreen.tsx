import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

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

  const handleRegister = () => {
    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !data.password ||
      !data.confirmPassword
    ) {
      return;
    }

    navigation.navigate("Biometric");
  };

  return (
    <SafeAreaView style={styles.container}>
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
            title="Register"
            onPress={handleRegister}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    width: width > 500 ? 430 : "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 30,
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
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },

  inputWrapper: {
    marginBottom: 14,
  },

  buttonContainer: {
    marginTop: 8,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  footerText: {
    fontSize: 13,
    color: "#6B7280",
  },

  loginText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },

  bottomBrand: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  brandText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#6B7280",
  },
});