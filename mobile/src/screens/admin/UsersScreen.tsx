import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { getUsers, toggleUserActive } from "../../api";
import { RootStackParamList } from "../../types";
import AdminSidebar from "./AdminSidebar";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UsersScreen"
>;

const { width } = Dimensions.get("window");

export default function UsersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Array<{
    id: string;
    name: string;
    role: string;
    phone?: string;
    is_active: boolean;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    setError(null);

    try {
      const response = await getUsers(user.token);
      setUsers(response.users);
    } catch (fetchError: any) {
      setError(fetchError?.message || 'Unable to fetch users.');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    if (!user?.token) return;
    try {
      const response = await toggleUserActive(user.token, userId, !isActive);
      setUsers((prev) =>
        prev.map((current) =>
          current.id === userId
            ? { ...current, is_active: response.user.is_active }
            : current
        )
      );
    } catch (toggleError: any) {
      setError(toggleError?.message || 'Unable to update user status.');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((userItem) => {
      const normalizedSearch = search.toLowerCase();
      return (
        userItem.name.toLowerCase().includes(normalizedSearch) ||
        userItem.role.toLowerCase().includes(normalizedSearch) ||
        (userItem.phone || "").includes(search)
      );
    });
  }, [search, users]);

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

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Register', { role: 'customer' })}
          >
            <Text style={styles.addButtonText}>
              + Add User
            </Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : null}

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

          {filteredUsers.map((userItem) => (
            <View key={userItem.id} style={styles.tableRow}>
              <Text
                style={[styles.tableCell, styles.nameColumn]}
              >
                {userItem.name}
              </Text>

              <Text style={styles.tableCell}>
                {userItem.role}
              </Text>

              <Text style={styles.tableCell}>
                {userItem.phone || '—'}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  userItem.is_active
                    ? styles.activeBadge
                    : styles.inactiveBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: userItem.is_active
                        ? '#16a34a'
                        : '#dc2626',
                    },
                  ]}
                >
                  {userItem.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>

              {/* ACTION BUTTONS */}

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() =>
                    handleToggleStatus(userItem.id, userItem.is_active)
                  }
                >
                  <Text style={styles.iconText}>
                    {userItem.is_active ? '⛔' : '✔️'}
                  </Text>
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

  errorBanner: {
    backgroundColor: "#fee2e2",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#eff6ff",
    marginBottom: 16,
  },

  loadingText: {
    marginLeft: 10,
    color: "#1d4ed8",
    fontSize: 14,
  },

  errorText: {
    color: "#b91c1c",
    fontSize: 14,
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