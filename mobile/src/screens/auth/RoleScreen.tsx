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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { DeviceSize, FontSize, Spacing, ResponsiveDimensions } from "../../utils/responsive";

type RoleProps = NativeStackScreenProps<RootStackParamList, "Role">;

const { width } = Dimensions.get("window");

export default function RoleScreen({ navigation }: RoleProps) {
  const [role, setRole] = useState<"courier" | "customer" | "admin">(
    "courier"
  );
  const insets = useSafeAreaInsets();

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
    alignItems: "center",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },

  lockIconContainer: {
    width: ResponsiveDimensions.largeIconSize,
    height: ResponsiveDimensions.largeIconSize,
    borderRadius: ResponsiveDimensions.largeIconSize / 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },

  appTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },

  appSubtitle: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: "#BFD8EC",
    letterSpacing: 0.8,
    marginTop: Spacing.xs,
  },

  card: {
    width: ResponsiveDimensions.cardWidth,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: "80%",
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

  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
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
    marginRight: Spacing.md,
  },

  textContainer: {
    flex: 1,
  },

  roleTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: "#111827",
    marginBottom: Spacing.xs,
  },

  roleDescription: {
    fontSize: FontSize.sm,
    color: "#6B7280",
  },

  activeText: {
    color: "#FFFFFF",
  },

  activeSubText: {
    color: "#E0E7FF",
  },

  buttonContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
  },

  footerText: {
    marginLeft: Spacing.xs,
    fontSize: FontSize.sm,
    color: "#6B7280",
  },
});