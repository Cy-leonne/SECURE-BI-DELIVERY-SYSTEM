import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
 Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AdminSidebar from "./AdminSidebar";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UsersScreen"
>;

const { width } = Dimensions.get("window");

const users = [
  {
    id: "u1",
    name: "John Doe",
    role: "Customer",
    phone: "+254 700 123 456",
    status: "Active",
  },
  {
    id: "u2",
    name: "Mary Smith",
    role: "Customer",
    phone: "+254 711 234 567",
    status: "Active",
  },
  {
    id: "u3",
    name: "John Courier",
    role: "Courier",
    phone: "+254 722 345 678",
    status: "Active",
  },
  {
    id: "u4",
    name: "Jane Courier",
    role: "Courier",
    phone: "+254 733 456 789",
    status: "Inactive",
  },
];

export default function UsersScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search)
    );
  }, [search]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        <AdminSidebar />

        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
        {/* PAGE TITLE */}

        <View style={styles.header}>
          <Text style={styles.pageTitle}>
            USERS MANAGEMENT (ADMIN)
          </Text>
        </View>

        {/* SEARCH + BUTTON */}

        <View style={styles.topBar}>
          <TextInput
            placeholder="Search users..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>
              + Add User
            </Text>
          </TouchableOpacity>
        </View>

        {/* TABLE */}

        <View style={styles.tableContainer}>
          {/* TABLE HEADER */}

          <View style={styles.tableHeader}>
            <Text
              style={[styles.headerText, styles.nameColumn]}
            >
              Name
            </Text>

            <Text style={styles.headerText}>Role</Text>

            <Text style={styles.headerText}>Phone</Text>

            <Text style={styles.headerText}>Status</Text>

            <Text
              style={[
                styles.headerText,
                styles.actionsColumn,
              ]}
            >
              Actions
            </Text>
          </View>

          {/* TABLE ROWS */}

          {filteredUsers.map((user) => (
            <View key={user.id} style={styles.tableRow}>
              <Text
                style={[styles.tableCell, styles.nameColumn]}
              >
                {user.name}
              </Text>

              <Text style={styles.tableCell}>
                {user.role}
              </Text>

              <Text style={styles.tableCell}>
                {user.phone}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  user.status === "Active"
                    ? styles.activeBadge
                    : styles.inactiveBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        user.status === "Active"
                          ? "#16a34a"
                          : "#dc2626",
                    },
                  ]}
                >
                  {user.status}
                </Text>
              </View>

              {/* ACTION BUTTONS */}

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                >
                  <Text style={styles.iconText}>✎</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                >
                  <Text style={styles.iconText}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* PAGINATION */}

          <View style={styles.pagination}>
            <TouchableOpacity style={styles.pageButton}>
              <Text style={styles.pageText}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pageButton,
                styles.activePageButton,
              ]}
            >
              <Text
                style={[
                  styles.pageText,
                  { color: "#fff" },
                ]}
              >
                1
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pageButton}>
              <Text style={styles.pageText}>2</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pageButton}>
              <Text style={styles.pageText}>3</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pageButton}>
              <Text style={styles.pageText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BACK BUTTON */}

        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() =>
            navigation.navigate("AdminDashboard")
          }
        >
          <Text style={styles.dashboardButtonText}>
            Back to Dashboard
          </Text>
        </TouchableOpacity>
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

  /* HEADER */

  header: {
    marginBottom: 20,
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0f172a",
  },

  /* TOP BAR */

  topBar: {
    flexDirection: width > 700 ? "row" : "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
  },

  searchInput: {
    flex: 1,
    width: "100%",
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#0f172a",
  },

  addButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  addButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },

  /* TABLE */

  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  headerText: {
    flex: 1,
    color: "#475569",
    fontSize: 13,
    fontWeight: "800",
  },

  nameColumn: {
    flex: 1.5,
  },

  actionsColumn: {
    textAlign: "center",
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#0f172a",
  },

  /* STATUS */

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },

  activeBadge: {
    backgroundColor: "#dcfce7",
  },

  inactiveBadge: {
    backgroundColor: "#fee2e2",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  /* ACTIONS */

  actionsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    gap: 8,
  },

  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: {
    fontSize: 14,
  },

  /* PAGINATION */

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },

  pageButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },

  activePageButton: {
    backgroundColor: "#2563eb",
  },

  pageText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },

  /* DASHBOARD BUTTON */

  dashboardButton: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },

  dashboardButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});