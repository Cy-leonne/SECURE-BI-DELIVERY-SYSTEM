import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

type RoleProps = NativeStackScreenProps<RootStackParamList, "Role">;

const { width } = Dimensions.get("window");

export default function RoleScreen({ navigation }: RoleProps) {
  const [role, setRole] = useState<"courier" | "customer" | "admin">(
    "courier"
  );

  const handleContinue = () => {
    if (role === "customer") {
      navigation.navigate("Register", { role: "customer" });
    } else {
      navigation.navigate("Login", { role });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Icon */}
        <View style={styles.headerContainer}>
          <View style={styles.lockIconContainer}>
            <Ionicons
              name="lock-closed"
              size={50}
              color="#ffffff"
            />
          </View>
          <Text style={styles.appTitle}>SECURE BI</Text>
          <Text style={styles.appSubtitle}>DELIVERY SYSTEM</Text>
        </View>

        {/* Card Container */}
        <View style={styles.card}>
          {/* Title */}
          <Text style={styles.title}>Welcome to SecureBi</Text>
          <Text style={styles.subtitle}>
            Select your role to continue
          </Text>

          {/* Courier Card */}
          <Pressable
            style={[
              styles.roleCard,
              role === "courier" && styles.activeCard,
            ]}
            onPress={() => setRole("courier")}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="person"
                size={28}
                color={role === "courier" ? "#fff" : "#2563EB"}
              />
            </View>

            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.roleTitle,
                  role === "courier" && styles.activeText,
                ]}
              >
                Courier
              </Text>

              <Text
                style={[
                  styles.roleDescription,
                  role === "courier" && styles.activeSubText,
                ]}
              >
                Deliver packages securely
              </Text>
            </View>
          </Pressable>

          {/* Customer Card */}
          <Pressable
            style={[
              styles.roleCard,
              role === "customer" && styles.activeCard,
            ]}
            onPress={() => setRole("customer")}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="people"
                size={28}
                color={role === "customer" ? "#fff" : "#2563EB"}
              />
            </View>

            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.roleTitle,
                  role === "customer" && styles.activeText,
                ]}
              >
                Customer
              </Text>

              <Text
                style={[
                  styles.roleDescription,
                  role === "customer" && styles.activeSubText,
                ]}
              >
                Receive packages securely
              </Text>
            </View>
          </Pressable>

          {/* Admin Card */}
          <Pressable
            style={[
              styles.roleCard,
              role === "admin" && styles.activeCard,
            ]}
            onPress={() => setRole("admin")}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="shield-checkmark"
                size={28}
                color={role === "admin" ? "#fff" : "#2563EB"}
              />
            </View>

            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.roleTitle,
                  role === "admin" && styles.activeText,
                ]}
              >
                Admin
              </Text>

              <Text
                style={[
                  styles.roleDescription,
                  role === "admin" && styles.activeSubText,
                ]}
              >
                Manage users, reports, and delivery data
              </Text>
            </View>
          </Pressable>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={`Continue as ${role}`}
              onPress={handleContinue}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Ionicons name="lock-closed" size={14} color="#6B7280" />
            <Text style={styles.footerText}>
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
    backgroundColor: "#001F3D",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  lockIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  appTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },

  appSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#BFD8EC",
    letterSpacing: 0.8,
    marginTop: 4,
  },

  card: {
    width: width > 500 ? 420 : "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },

  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },

  activeCard: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  textContainer: {
    flex: 1,
  },

  roleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  roleDescription: {
    fontSize: 13,
    color: "#6B7280",
  },

  activeText: {
    color: "#FFFFFF",
  },

  activeSubText: {
    color: "#E0E7FF",
  },

  buttonContainer: {
    marginTop: 16,
    marginBottom: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  footerText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#6B7280",
  },
});