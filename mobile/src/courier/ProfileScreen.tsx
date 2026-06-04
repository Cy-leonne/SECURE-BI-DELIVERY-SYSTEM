import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>John Courier</Text>
        <Text style={styles.subtitle}>Courier Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>johncourier@example.com</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>+254 722 345 678</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>Active</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate("Deliveries")}
        >
          <Text style={styles.actionText}>Deliveries</Text>
          <Text style={styles.actionNote}>View delivery details, start verification flow.</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: "Role" }] })}
      >
        <Text style={styles.logoutText}>Logout Courier</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#475569",
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 22,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#c7d2fe",
    marginBottom: 18,
  },
  infoRow: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: "#94a3b8",
  },
  value: {
    marginTop: 4,
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "700",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  actionItem: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  actionNote: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748b",
    lineHeight: 20,
  },
  logoutButton: {
    marginTop: "auto",
    backgroundColor: "#ef4444",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
