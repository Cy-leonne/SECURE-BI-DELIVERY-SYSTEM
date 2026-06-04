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
import { useAuth } from "../../context/AuthContext";
import { RootStackParamList } from "../../types";

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
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setMessage("Please enter email and password.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    try {
      const authUser = await login(loginData.email, loginData.password);
      const destination =
        authUser.role === "admin"
          ? "AdminDashboard"
          : authUser.role === "courier"
          ? "Dashboard"
          : "CustomerDashboard";

      navigation.reset({
        index: 0,
        routes: [{ name: destination }],
      });
    } catch (error: any) {
      setMessage(error?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <TouchableOpacity style={styles.forgotContainer}>
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
        <Text style={styles.orText}>
          or Login with Biometrics
        </Text>

        {/* Fingerprint Button */}
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: isAdmin
                    ? "AdminDashboard"
                    : isCustomer
                    ? "CustomerDashboard"
                    : "Dashboard",
                },
              ],
            })
          }
        >
          <Ionicons
            name="finger-print"
            size={48}
            color="#2563EB"
          />
        </TouchableOpacity>

        {/* Register */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don’t have an account?
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
    marginBottom: 28,
  },

  inputWrapper: {
    marginBottom: 14,
  },

  forgotContainer: {
    alignItems: "flex-start",
    marginBottom: 18,
  },

  forgotText: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "500",
  },

  buttonContainer: {
    marginBottom: 22,
  },

  orText: {
    textAlign: "center",
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 20,
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
    marginBottom: 26,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    fontSize: 13,
    color: "#6B7280",
  },

  registerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },

  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
  },
});