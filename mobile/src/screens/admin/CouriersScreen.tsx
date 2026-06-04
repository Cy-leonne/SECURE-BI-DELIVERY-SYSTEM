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
  "AdminCouriers"
>;

const { width } = Dimensions.get("window");

const courierData = [
  {
    id: "c1",
    name: "John Courier",
    phone: "+254 722 345 678",
    deliveries: 45,
    status: "Active",
  },
  {
    id: "c2",
    name: "Jane Courier",
    phone: "+254 733 456 789",
    deliveries: 32,
    status: "Active",
  },
  {
    id: "c3",
    name: "Mike Courier",
    phone: "+254 744 567 890",
    deliveries: 28,
    status: "Active",
  },
  {
    id: "c4",
    name: "David Courier",
    phone: "+254 755 678 901",
    deliveries: 15,
    status: "Inactive",
  },
];

export default function AdminCouriers() {
  const navigation = useNavigation<NavigationProp>();

  const [search, setSearch] = useState("");

  const filteredCouriers = useMemo(() => {
    return courierData.filter(
      (courier) =>
        courier.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        courier.phone.includes(search)
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
            COURIERS MANAGEMENT (ADMIN)
          </Text>
        </View>

        {/* SEARCH + ADD BUTTON */}

        <View style={styles.topBar}>
          <TextInput
            placeholder="Search couriers..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />

          {/* RETAINED ADD COURIER FEATURE */}

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>
              + Add Courier
            </Text>
          </TouchableOpacity>
        </View>

        {/* TABLE */}

        <View style={styles.tableContainer}>
          {/* HEADER */}

          <View style={styles.tableHeader}>
            <Text
              style={[styles.headerText, styles.nameColumn]}
            >
              Name
            </Text>

            <Text style={styles.headerText}>Phone</Text>

            <Text style={styles.headerText}>
              Deliveries
            </Text>

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

          {/* ROWS */}

          {filteredCouriers.map((courier) => (
            <View
              key={courier.id}
              style={styles.tableRow}
            >
              <Text
                style={[styles.tableCell, styles.nameColumn]}
              >
                {courier.name}
              </Text>

              <Text style={styles.tableCell}>
                {courier.phone}
              </Text>

              <Text style={styles.tableCell}>
                {courier.deliveries}
              </Text>

              {/* STATUS */}

              <View
                style={[
                  styles.statusBadge,
                  courier.status === "Active"
                    ? styles.activeBadge
                    : styles.inactiveBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        courier.status === "Active"
                          ? "#16a34a"
                          : "#dc2626",
                    },
                  ]}
                >
                  {courier.status}
                </Text>
              </View>

              {/* ACTIONS */}

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

  layout: {
    flex: 1,
    flexDirection: "row",
  },

  main: {
    flex: 1,
    minWidth: 0,
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