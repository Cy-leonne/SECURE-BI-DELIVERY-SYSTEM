import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { todayDeliveries } from "../data/mockDeliveries";
import { useAuth } from "../context/AuthContext";
import { getCourierDeliveries, getAvailableDeliveries, scanDelivery, assignDelivery, CourierDelivery } from "../api";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Dashboard">;

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [backendDeliveries, setBackendDeliveries] = useState<CourierDelivery[] | null>(null);
  const [availableDeliveries, setAvailableDeliveries] = useState<CourierDelivery[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.token || !user?.id) {
      return;
    }

    let active = true;
    const loadDeliveries = async () => {
      setLoading(true);
      try {
        const [assignedRes, availableRes] = await Promise.all([
          getCourierDeliveries(user.token, user.id),
          getAvailableDeliveries(user.token),
        ]);
        if (active) {
          setBackendDeliveries(assignedRes.deliveries);
          setAvailableDeliveries(availableRes.deliveries);
          setError(null);
        }
      } catch (fetchError: any) {
        if (active) {
          setError(fetchError.message || "Unable to load deliveries");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDeliveries();
    return () => {
      active = false;
    };
  }, [user?.id, user?.token]);

  const handleScan = async () => {
    if (!user?.token) {
      return Alert.alert("Authentication required", "Please log in to scan deliveries.");
    }

    const trackingNo = backendDeliveries?.[0]?.trackingNo ?? "ORD10234";

    try {
      const result = await scanDelivery(user.token, trackingNo);
      setScanResult(`Scan result: ${result.trackingNo} status ${result.status}`);
    } catch (scanError: any) {
      Alert.alert("Scan failed", scanError.message || "Unable to retrieve scanned delivery.");
    }
  };

  const handleAcceptDelivery = async (deliveryId: string) => {
    if (!user?.token || !user?.id) {
      return Alert.alert("Authentication required", "Please log in to accept deliveries.");
    }

    try {
      await assignDelivery(user.token, deliveryId, user.id);
      Alert.alert("Success", "Delivery assigned to you!");
      // Reload available and assigned deliveries
      const [assignedRes, availableRes] = await Promise.all([
        getCourierDeliveries(user.token, user.id),
        getAvailableDeliveries(user.token),
      ]);
      setBackendDeliveries(assignedRes.deliveries);
      setAvailableDeliveries(availableRes.deliveries);
    } catch (acceptError: any) {
      Alert.alert("Unable to accept delivery", acceptError.message || "Please try again.");
    }
  };

  const recentDeliveries = backendDeliveries?.length
    ? backendDeliveries.map((item) => ({
        id: item.id,
        orderId: item.trackingNo,
        recipient: item.customerId ? `Customer ${item.customerId.slice(0, 6)}` : "Customer",
        address: "Address unavailable",
        status: item.status,
        time: new Date(item.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }))
    : todayDeliveries;

  const assignedCount = backendDeliveries
    ? backendDeliveries.filter((item) => item.status === "Assigned").length
    : 12;
  const deliveredCount = backendDeliveries
    ? backendDeliveries.filter((item) => item.status === "Delivered").length
    : 8;
  const inProgressCount = backendDeliveries
    ? backendDeliveries.filter((item) => item.status === "In Progress").length
    : 2;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, John Courier</Text>
            <Text style={styles.subGreeting}>Good morning!</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={28} color="#2563EB" />
          </View>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.loadingText}>Syncing deliveries...</Text>
          </View>
        ) : null}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: "#FEF3C7" }]}> 
              <Ionicons name="cube" size={18} color="#D97706" />
            </View>
            <Text style={styles.statNumber}>{assignedCount}</Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: "#DCFCE7" }]}> 
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
            </View>
            <Text style={styles.statNumber}>{deliveredCount}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: "#DBEAFE" }]}> 
              <Ionicons name="car" size={18} color="#2563EB" />
            </View>
            <Text style={styles.statNumber}>{inProgressCount}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: "#FEE2E2" }]}> 
              <Ionicons name="close-circle" size={18} color="#DC2626" />
            </View>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Deliveries</Text>
        </View>

        {availableDeliveries && availableDeliveries.length > 0 ? (
          <View style={styles.deliveryContainer}>
            {availableDeliveries.slice(0, 3).map((item) => (
              <View key={item.id} style={styles.deliveryCard}>
                <View style={styles.deliveryLeft}>
                  <View style={styles.deliveryIcon}> 
                    <MaterialIcons name="local-shipping" size={18} color="#2563EB" />
                  </View>
                  <View>
                    <Text style={styles.deliveryId}>{item.trackingNo}</Text>
                    <Text style={styles.deliveryName}>Pending Pickup</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptDelivery(item.id)}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No available deliveries</Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Deliveries</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Deliveries")}> 
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.deliveryContainer}>
          {recentDeliveries.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.deliveryCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("DeliveryDetails", { orderId: item.orderId })}
            >
              <View style={styles.deliveryLeft}>
                <View style={styles.deliveryIcon}> 
                  <MaterialIcons name="local-shipping" size={18} color="#2563EB" />
                </View>
                <View>
                  <Text style={styles.deliveryId}>{item.orderId}</Text>
                  <Text style={styles.deliveryName}>{item.recipient}</Text>
                </View>
              </View>
              <View style={styles.deliveryRight}>
                <Text style={styles.deliveryAddress}>{item.address}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === "Delivered" && styles.deliveredBadge,
                    item.status === "Pending" && styles.pendingBadge,
                    item.status === "In Progress" && styles.progressBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === "Delivered" && styles.deliveredText,
                      item.status === "Pending" && styles.pendingText,
                      item.status === "In Progress" && styles.progressText,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {scanResult ? (
          <View style={styles.scanResultBox}>
            <Text style={styles.scanResultText}>{scanResult}</Text>
          </View>
        ) : null}

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={22} color="#2563EB" />
            <Text style={styles.activeNavText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Deliveries")}> 
            <Ionicons name="cube-outline" size={22} color="#6B7280" />
            <Text style={styles.navText}>Deliveries</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleScan}> 
            <Ionicons name="scan-outline" size={22} color="#6B7280" />
            <Text style={styles.navText}>Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}> 
            <Ionicons name="person-outline" size={22} color="#6B7280" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  subGreeting: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },

  errorBanner: {
    backgroundColor: "#fee2e2",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },

  errorText: {
    color: "#b91c1c",
    fontSize: 14,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  loadingText: {
    marginLeft: 10,
    color: "#2563EB",
  },

  statsGrid: {
    flexDirection: width > 600 ? "row" : "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  statCard: {
    width: width > 600 ? "23%" : "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  viewAll: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },

  deliveryContainer: {
    marginBottom: 30,
  },

  deliveryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  deliveryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  deliveryIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  deliveryId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  deliveryName: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  deliveryRight: {
    alignItems: "flex-end",
  },

  deliveryAddress: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  deliveredBadge: {
    backgroundColor: "#DCFCE7",
  },

  pendingBadge: {
    backgroundColor: "#FEF3C7",
  },

  progressBadge: {
    backgroundColor: "#DBEAFE",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  deliveredText: {
    color: "#16A34A",
  },

  pendingText: {
    color: "#D97706",
  },

  progressText: {
    color: "#2563EB",
  },

  acceptButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  acceptButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },

  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 14,
  },

  scanResultBox: {
    backgroundColor: "#eef2ff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },

  scanResultText: {
    color: "#1d4ed8",
    fontSize: 14,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingBottom: 10,
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  activeNavText: {
    fontSize: 12,
    color: "#2563EB",
    marginTop: 4,
    fontWeight: "600",
  },
});