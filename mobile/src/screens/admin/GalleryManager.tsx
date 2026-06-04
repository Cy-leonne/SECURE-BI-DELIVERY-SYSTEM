import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AdminSidebar from "./AdminSidebar";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "GalleryManager">;

const galleryItems = [
  { id: "1", label: "Proof #1", status: "Active" },
  { id: "2", label: "Proof #2", status: "Active" },
  { id: "3", label: "Proof #3", status: "Archived" },
  { id: "4", label: "Proof #4", status: "Active" },
];

export default function GalleryManager() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        <AdminSidebar />

        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.pageTitle}>Gallery Manager</Text>
        <Text style={styles.pageSubtitle}>
          Manage delivery photo and biometric asset galleries for audits.
        </Text>

        <View style={styles.grid}>
          {galleryItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardStatus}>{item.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  layout: {
    flex: 1,
    flexDirection: "row",
  },

  main: {
    flex: 1,
    minWidth: 0,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
  },
  pageSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#475569",
    marginBottom: 24,
  },
  screenNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  screenNavButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  screenNavButtonSecondary: {
    backgroundColor: "#94a3b8",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  screenNavText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 10,
  },
  cardStatus: {
    fontSize: 13,
    color: "#64748b",
  },
});