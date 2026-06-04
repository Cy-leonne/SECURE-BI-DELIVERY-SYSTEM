import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">;

export default function CustomerProfileScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Jane Customer</Text>
          <Text style={styles.subtitle}>Customer Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>janecustomer@example.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>+254 722 456 789</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Member Since</Text>
            <Text style={styles.value}>January 2026</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Orders</Text>
            <Text style={styles.value}>12</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("CustomerDashboard")}
          >
            <Ionicons name="arrow-back" size={20} color="#2563EB" />
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>Back to Dashboard</Text>
              <Text style={styles.actionNote}>View your orders and place new orders.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionItem, styles.actionItemAlt]}>
            <Ionicons name="notifications" size={20} color="#7c3aed" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionText, styles.actionTextAlt]}>
                Notification Settings
              </Text>
              <Text style={[styles.actionNote, styles.actionNoteAlt]}>
                Manage delivery alerts and updates.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionItem, styles.actionItemAlt]}>
            <Ionicons name="document-text" size={20} color="#0891b2" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionText, styles.actionTextAlt]}>Addresses</Text>
              <Text style={[styles.actionNote, styles.actionNoteAlt]}>
                Manage saved delivery addresses.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: "Role" }] })}
        >
          <Ionicons name="log-out" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  content: {
    paddingBottom: 40,
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
    backgroundColor: "#fce7f3",
    marginBottom: 18,
  },
  infoRow: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
  },
  value: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  actionItemAlt: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  actionContent: {
    marginLeft: 14,
    flex: 1,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  actionTextAlt: {
    color: "#64748b",
  },
  actionNote: {
    marginTop: 4,
    fontSize: 13,
    color: "#94a3b8",
  },
  actionNoteAlt: {
    color: "#64748b",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
