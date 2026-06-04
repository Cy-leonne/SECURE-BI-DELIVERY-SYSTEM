import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { getCustomerDeliveries, CustomerDelivery } from "../api";
import type { CustomerOrder, RootStackParamList } from "../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "CustomerDashboard">;
type RoutePropType = RouteProp<RootStackParamList, "CustomerDashboard">;

export default function CustomerDashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user?.token || !user?.id) return;

    let active = true;
    setLoading(true);

    try {
      const response = await getCustomerDeliveries(user.token, user.id);
      if (active) {
        const customerOrders = response.deliveries.map((delivery) => ({
          id: delivery.id,
          orderId: delivery.trackingNo,
          tracking: delivery.trackingNo,
          status:
            delivery.status === "Pending"
              ? "Pending"
              : delivery.status === "Delivered"
              ? "Delivered"
              : "Pending",
          date: new Date(delivery.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          address: "Delivery address pending",
          item: "Shipment",
        }));
        setOrders(customerOrders);
        setError(null);
      }
    } catch (fetchError: any) {
      if (active) {
        setError(fetchError.message || "Unable to load your orders.");
      }
    } finally {
      if (active) setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [user?.id, user?.token]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  useEffect(() => {
    if (route.params?.orderPlaced) {
      setSuccessMessage(
        `Order ${route.params.orderId ?? "placed"} was created successfully.`
      );
    }
  }, [route.params]);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        `${order.orderId} ${order.tracking} ${order.address} ${order.item}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [orders, search]
  );

  const counts = useMemo(
    () => ({
      all: orders.length,
      delivered: orders.filter((order) => order.status === "Delivered").length,
      pending: orders.filter((order) => order.status === "Pending").length,
      cancelled: orders.filter((order) => order.status === "Cancelled").length,
    }),
    [orders]
  );

  const getBadgeStyle = (status: CustomerOrder["status"]) => {
    switch (status) {
      case "Delivered":
        return styles.deliveredBadge;
      case "Pending":
        return styles.pendingBadge;
      case "Cancelled":
        return styles.cancelledBadge;
      default:
        return styles.pendingBadge;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>Customer Dashboard</Text>
              <Text style={styles.subtitle}>
                Track your current orders and review order status.
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.placeOrderButton}
                onPress={() => navigation.navigate("PlaceOrder")}
              >
                <Ionicons name="add-circle" size={32} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate("CustomerProfile")}
              >
                <Ionicons name="person-circle" size={32} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Track order or search address"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {successMessage ? (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : null}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{counts.all}</Text>
            <Text style={styles.statLabel}>All Orders</Text>
          </View>
          <View style={[styles.statCard, styles.deliveredCard]}>
            <Text style={styles.statNumber}>{counts.delivered}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
          <View style={[styles.statCard, styles.pendingCard]}>
            <Text style={styles.statNumber}>{counts.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, styles.cancelledCard]}>
            <Text style={styles.statNumber}>{counts.cancelled}</Text>
            <Text style={styles.statLabel}>Cancelled</Text>
          </View>
        </View>

        <View style={styles.ordersHeader}>
          <Text style={styles.sectionTitle}>Order History</Text>
          <Text style={styles.sectionSubtitle}>
            {filteredOrders.length} results
          </Text>
        </View>

        {filteredOrders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard}>
            <View style={styles.orderTop}>
              <View>
                <Text style={styles.orderId}>{order.orderId}</Text>
                <Text style={styles.orderItem}>{order.item}</Text>
              </View>
              <View style={[styles.statusBadge, getBadgeStyle(order.status)]}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>
            <Text style={styles.orderDate}>{order.date}</Text>
            <Text style={styles.orderAddress}>{order.address}</Text>
            <View style={styles.trackRow}>
              <Text style={styles.trackingText}>{order.tracking}</Text>
              <Ionicons name="chevron-forward" size={20} color="#2563EB" />
            </View>
          </TouchableOpacity>
        ))}
        {!loading && filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No customer orders found.</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  placeOrderButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  deliveredCard: {
    backgroundColor: "#dcfce7",
  },
  pendingCard: {
    backgroundColor: "#fef3c7",
  },
  cancelledCard: {
    backgroundColor: "#fee2e2",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
  },
  statLabel: {
    marginTop: 8,
    fontSize: 13,
    color: "#475569",
  },
  ordersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  errorBanner: {
    backgroundColor: "#fee2e2",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 14,
  },
  successBanner: {
    backgroundColor: "#d1fae5",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: "#065f46",
    fontSize: 14,
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
  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  orderItem: {
    marginTop: 4,
    color: "#475569",
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  deliveredBadge: {
    backgroundColor: "#16a34a",
  },
  pendingBadge: {
    backgroundColor: "#d97706",
  },
  cancelledBadge: {
    backgroundColor: "#dc2626",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  orderDate: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },
  orderAddress: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 12,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trackingText: {
    fontSize: 13,
    color: "#2563eb",
    fontWeight: "700",
  },
});
