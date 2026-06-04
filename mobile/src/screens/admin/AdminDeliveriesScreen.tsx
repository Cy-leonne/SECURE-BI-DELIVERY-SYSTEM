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
  "AdminDeliveries"
>;

const { width } = Dimensions.get("window");

const deliveryData = [
  {
    id: "d1",
    orderId: "ORD12345",
    customer: "John Doe",
    courier: "John Courier",
    status: "Delivered",
    date: "20 May 10:35 AM",
  },
  {
    id: "d2",
    orderId: "ORD12346",
    customer: "Mary Smith",
    courier: "Jane Courier",
    status: "Delivered",
    date: "20 May 11:20 AM",
  },
  {
    id: "d3",
    orderId: "ORD12347",
    customer: "Robert Brown",
    courier: "John Courier",
    status: "Pending",
    date: "20 May 12:10 PM",
  },
  {
    id: "d4",
    orderId: "ORD12348",
    customer: "Linda Johnson",
    courier: "Mike Courier",
    status: "Failed",
    date: "20 May 01:15 PM",
  },
];

export default function AdminDeliveries() {
  const navigation = useNavigation<NavigationProp>();

  const [search, setSearch] = useState("");

  const filteredDeliveries = useMemo(() => {
    return deliveryData.filter(
      (delivery) =>
        delivery.orderId
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        delivery.customer
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        delivery.courier
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [search]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return {
          backgroundColor: "#dcfce7",
          color: "#16a34a",
        };

      case "Pending":
        return {
          backgroundColor: "#dbeafe",
          color: "#2563eb",
        };

      case "Failed":
        return {
          backgroundColor: "#fee2e2",
          color: "#dc2626",
        };

      default:
        return {
          backgroundColor: "#f1f5f9",
          color: "#475569",
        };
    }
  };

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
            DELIVERIES MANAGEMENT (ADMIN)
          </Text>
        </View>

        {/* SEARCH + FILTER */}

        <View style={styles.topBar}>
          <TextInput
            placeholder="Search deliveries..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />

          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>
              Filter ▾
            </Text>
          </TouchableOpacity>
        </View>

        {/* TABLE */}

        <View style={styles.tableContainer}>
          {/* TABLE HEADER */}

          <View style={styles.tableHeader}>
            <Text
              style={[styles.headerText, styles.orderColumn]}
            >
              Order ID
            </Text>

            <Text style={styles.headerText}>
              Customer
            </Text>

            <Text style={styles.headerText}>
              Courier
            </Text>

            <Text style={styles.headerText}>Status</Text>

            <Text style={styles.headerText}>Date</Text>
          </View>

          {/* TABLE ROWS */}

          {filteredDeliveries.map((delivery) => {
            const statusStyle = getStatusStyle(
              delivery.status
            );

            return (
              <View
                key={delivery.id}
                style={styles.tableRow}
              >
                <Text
                  style={[
                    styles.tableCell,
                    styles.orderColumn,
                  ]}
                >
                  {delivery.orderId}
                </Text>

                <Text style={styles.tableCell}>
                  {delivery.customer}
                </Text>

                <Text style={styles.tableCell}>
                  {delivery.courier}
                </Text>

                {/* STATUS */}

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        statusStyle.backgroundColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: statusStyle.color,
                      },
                    ]}
                  >
                    {delivery.status}
                  </Text>
                </View>

                <Text style={styles.dateText}>
                  {delivery.date}
                </Text>
              </View>
            );
          })}

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
                  { color: "#ffffff" },
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

  filterButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 18,
  },

  filterButtonText: {
    color: "#0f172a",
    fontWeight: "700",
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

  orderColumn: {
    flex: 1.2,
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
    minWidth: 90,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  dateText: {
    flex: 1,
    fontSize: 13,
    color: "#475569",
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