import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AdminSidebar from "./AdminSidebar";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AdminDashboard"
>;

const { width } = Dimensions.get("window");
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;

const metrics = [
  { label: "Users", value: "512", delta: "+12%" },
  { label: "Couriers", value: "128", delta: "+8%" },
  { label: "Deliveries", value: "358", delta: "+15%" },
  { label: "Completed", value: "289", delta: "+18%" },
];

const recentDeliveries = [
  {
    id: "1",
    orderId: "ORD12345",
    customer: "John Doe",
    status: "Delivered",
    time: "20 May 10:35 AM",
  },
  {
    id: "2",
    orderId: "ORD12346",
    customer: "Mary Smith",
    status: "Delivered",
    time: "20 May 11:20 AM",
  },
  {
    id: "3",
    orderId: "ORD12347",
    customer: "Robert Brown",
    status: "Pending",
    time: "20 May 12:10 PM",
  },
  {
    id: "4",
    orderId: "ORD12348",
    customer: "Linda Johnson",
    status: "Failed",
    time: "20 May 01:15 PM",
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Delivered":
      return {
        bg: "#dcfce7",
        text: "#16a34a",
      };
    case "Pending":
      return {
        bg: "#fef3c7",
        text: "#ca8a04",
      };
    case "Failed":
      return {
        bg: "#fee2e2",
        text: "#dc2626",
      };
    default:
      return {
        bg: "#e2e8f0",
        text: "#475569",
      };
  }
};

export default function AdminDashboard() {
  const navigation = useNavigation<NavigationProp>();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* MOBILE HEADER */}
      {isMobile && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)}>
            <Ionicons name="menu" size={28} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.mobileHeaderTitle}>Admin Dashboard</Text>
          <View style={{ width: 28 }} />
        </View>
      )}

      <View style={[styles.layout, isMobile && { flexDirection: "column" }]}>
        {/* SIDEBAR - Hidden on mobile, shown in modal */}
        {!isMobile && <AdminSidebar />}

        {isMobile && (
          <Modal
            visible={sidebarVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setSidebarVisible(false)}
          >
            <SafeAreaView style={styles.mobileModalContainer}>
              <View style={styles.mobileModalHeader}>
                <TouchableOpacity onPress={() => setSidebarVisible(false)}>
                  <Ionicons name="close" size={28} color="#0f172a" />
                </TouchableOpacity>
              </View>
              <AdminSidebar onItemPress={() => setSidebarVisible(false)} />
            </SafeAreaView>
          </Modal>
        )}

        {/* MAIN CONTENT */}
        <ScrollView
          style={styles.main}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          {!isMobile && (
            <View style={styles.header}>
              <View>
                <Text style={styles.dashboardTitle}>Dashboard</Text>
              </View>

              <View style={styles.adminBadge}>
                <Text style={styles.adminText}>Admin</Text>
              </View>
            </View>
          )}

          {/* METRIC CARDS */}
          <View style={styles.metricsContainer}>
            {metrics.map((metric) => (
              <View
                key={metric.label}
                style={[
                  styles.metricCard,
                  isMobile && styles.metricCardMobile,
                  isTablet && styles.metricCardTablet,
                ]}
              >
                <Text style={styles.metricLabel}>{metric.label}</Text>

                <Text style={styles.metricValue}>
                  {metric.value}
                </Text>

                <Text style={styles.metricDelta}>
                  {metric.delta}
                </Text>
              </View>
            ))}
          </View>

          {/* CONTENT GRID */}
          <View
            style={[
              styles.grid,
              isMobile && { flexDirection: "column" },
              isTablet && { flexDirection: "column" },
            ]}
          >
            {/* CHART CARD */}
            <View
              style={[
                styles.chartCard,
                isMobile && styles.chartCardMobile,
              ]}
            >
              <Text style={styles.cardTitle}>
                Delivery Overview
              </Text>

              <View
                style={[
                  styles.chartBox,
                  isMobile && styles.chartBoxMobile,
                ]}
              >
                {/* Green bars */}
                <View style={styles.chartColumn}>
                  <View style={[styles.greenBar, { height: 90 }]} />
                  <View style={[styles.redBar, { height: 35 }]} />
                </View>

                <View style={styles.chartColumn}>
                  <View style={[styles.greenBar, { height: 70 }]} />
                  <View style={[styles.redBar, { height: 18 }]} />
                </View>

                <View style={styles.chartColumn}>
                  <View style={[styles.greenBar, { height: 95 }]} />
                  <View style={[styles.redBar, { height: 12 }]} />
                </View>

                <View style={styles.chartColumn}>
                  <View style={[styles.greenBar, { height: 80 }]} />
                  <View style={[styles.redBar, { height: 30 }]} />
                </View>

                <View style={styles.chartColumn}>
                  <View style={[styles.greenBar, { height: 88 }]} />
                  <View style={[styles.redBar, { height: 22 }]} />
                </View>

                <View style={styles.chartColumn}>
                  <View style={[styles.greenBar, { height: 100 }]} />
                  <View style={[styles.redBar, { height: 28 }]} />
                </View>
              </View>

              {/* MONTHS */}
              <View
                style={[
                  styles.monthRow,
                  isMobile && styles.monthRowMobile,
                ]}
              >
                {["14 May", "15 May", "16 May", "17 May", "18 May", "19 May"].map(
                  (month) => (
                    <Text
                      key={month}
                      style={[
                        styles.monthText,
                        isMobile && styles.monthTextMobile,
                      ]}
                    >
                      {month}
                    </Text>
                  )
                )}
              </View>

              {/* LEGEND */}
              <View
                style={[
                  styles.legendRow,
                  isMobile && styles.legendRowMobile,
                ]}
              >
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: "#16a34a" },
                    ]}
                  />
                  <Text style={styles.legendLabel}>Completed</Text>
                </View>

                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: "#ef4444" },
                    ]}
                  />
                  <Text style={styles.legendLabel}>Failed</Text>
                </View>
              </View>
            </View>

            {/* RECENT DELIVERIES */}
            <View
              style={[
                styles.recentCard,
                isMobile && styles.recentCardMobile,
              ]}
            >
              <View style={styles.recentHeader}>
                <Text style={styles.cardTitle}>
                  Recent Deliveries
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AdminDeliveries")
                  }
                >
                  <Text style={styles.viewAll}>
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              {recentDeliveries.map((item) => {
                const status = getStatusStyle(item.status);

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.deliveryRow,
                      isMobile && styles.deliveryRowMobile,
                    ]}
                  >
                    <View style={isMobile && { flex: 1 }}>
                      <Text style={styles.orderId}>
                        {item.orderId}
                      </Text>

                      <Text style={styles.customerName}>
                        {item.customer}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.deliveryRight,
                        isMobile && styles.deliveryRightMobile,
                      ]}
                    >
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: status.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: status.text },
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>

                      <Text style={styles.deliveryTime}>
                        {item.time}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
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

  /* MOBILE HEADER */
  mobileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  mobileHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
    textAlign: "center",
  },

  mobileModalContainer: {
    flex: 1,
    backgroundColor: "#062766",
  },

  mobileModalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e3a5f",
    alignItems: "flex-end",
  },

  layout: {
    flex: 1,
    flexDirection: "row",
  },

  /* SIDEBAR */

  sidebar: {
    width: 230,
    backgroundColor: "#062766",
    paddingTop: 30,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },

  logo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 30,
  },

  menuContainer: {
    gap: 8,
  },

  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  activeMenuItem: {
    backgroundColor: "#2563eb",
  },

  menuText: {
    color: "#dbeafe",
    fontWeight: "700",
    fontSize: 15,
  },

  activeMenuText: {
    color: "#fff",
  },

  logoutButton: {
    marginTop: "auto",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "800",
  },

  /* MAIN */

  main: {
    flex: 1,
    padding: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  dashboardTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0f172a",
  },

  adminBadge: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  adminText: {
    fontWeight: "800",
    color: "#0f172a",
  },

  /* METRICS */

  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
  },

  metricCard: {
    width: "23%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "#edf2f7",
  },

  metricCardMobile: {
    width: "100%",
    padding: 16,
  },

  metricCardTablet: {
    width: "48%",
    padding: 16,
  },

  metricLabel: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  metricValue: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0f172a",
  },

  metricDelta: {
    marginTop: 8,
    color: "#16a34a",
    fontWeight: "700",
  },

  /* GRID */

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },

  chartCard: {
    flex: 1.2,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#edf2f7",
  },

  chartCardMobile: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
  },

  recentCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#edf2f7",
  },

  recentCardMobile: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 20,
  },

  /* CHART */

  chartBox: {
    height: 220,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  chartBoxMobile: {
    height: 150,
  },

  chartColumn: {
    alignItems: "center",
    justifyContent: "flex-end",
  },

  greenBar: {
    width: 18,
    backgroundColor: "#16a34a",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 6,
  },

  redBar: {
    width: 18,
    backgroundColor: "#ef4444",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  monthRowMobile: {
    marginBottom: 12,
  },

  monthText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "700",
  },

  monthTextMobile: {
    fontSize: 10,
  },

  legendRow: {
    flexDirection: "row",
    gap: 20,
  },

  legendRowMobile: {
    gap: 12,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  legendLabel: {
    color: "#475569",
    fontWeight: "700",
  },

  /* RECENT DELIVERIES */

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  viewAll: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 13,
  },

  deliveryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  deliveryRowMobile: {
    paddingVertical: 12,
  },

  orderId: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },

  customerName: {
    fontSize: 13,
    color: "#64748b",
  },

  deliveryRight: {
    alignItems: "flex-end",
  },

  deliveryRightMobile: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 6,
  },

  statusText: {
    fontWeight: "800",
    fontSize: 12,
  },

  deliveryTime: {
    fontSize: 11,
    color: "#94a3b8",
  },
});