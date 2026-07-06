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
import { FontSize, Spacing, ResponsiveDimensions } from "../utils/responsive";

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
  const [activeTab, setActiveTab] = useState<"Dashboard" | "Deliveries" | "Scan" | "Profile">("Dashboard");

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

    const courierId = user.id;
    if (!courierId || typeof courierId !== "string") {
      return Alert.alert("Unable to assign delivery", "Courier identity is missing. Please re-login and try again.");
    }

    try {
      await assignDelivery(user.token, deliveryId, courierId);
      Alert.alert("Success", "Delivery assigned to you!");
      // Reload available and assigned deliveries
      const [assignedRes, availableRes] = await Promise.all([
        getCourierDeliveries(user.token, courierId),
        getAvailableDeliveries(user.token),
      ]);
      setBackendDeliveries(assignedRes.deliveries);
      setAvailableDeliveries(availableRes.deliveries);
    } catch (acceptError: any) {
      Alert.alert("Unable to accept delivery", acceptError.message || "Please try again.");
    }
  };

  const tabItems = [
    {
      key: "Dashboard" as const,
      label: "Dashboard",
      icon: "home-outline",
      activeIcon: "home",
      onPress: () => {
        setActiveTab("Dashboard");
        navigation.navigate("Dashboard");
      },
    },
    {
      key: "Deliveries" as const,
      label: "Deliveries",
      icon: "cube-outline",
      activeIcon: "cube",
      onPress: () => {
        setActiveTab("Deliveries");
        navigation.navigate("Deliveries");
      },
    },
    {
      key: "Scan" as const,
      label: "Scan",
      icon: "scan-outline",
      activeIcon: "scan",
      onPress: () => {
        setActiveTab("Scan");
        handleScan();
      },
    },
    {
      key: "Profile" as const,
      label: "Profile",
      icon: "person-outline",
      activeIcon: "person",
      onPress: () => {
        setActiveTab("Profile");
        navigation.navigate("Profile");
      },
    },
  ];

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
      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                Hello, {user?.name ? user.name : "Courier"}
              </Text>
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
        </ScrollView>

        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            {tabItems.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={tab.onPress}
                  activeOpacity={0.8}
                >
                  <View style={[styles.navIconWrapper, isActive && styles.navIconWrapperActive]}>
                    <Ionicons
                      name={isActive ? tab.activeIcon : tab.icon}
                      size={24}
                      color={isActive ? "#2563EB" : "#6B7280"}
                    />
                  </View>
                  <Text style={isActive ? styles.activeNavText : styles.navText}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  scrollView: {
    flex: 1,
  },

  contentWrapper: {
    flex: 1,
  },

  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 120,
    minHeight: "100%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },

  greeting: {
    fontSize: FontSize["2xl"],
    fontWeight: "700",
    color: "#111827",
  },

  subGreeting: {
    fontSize: FontSize.base,
    color: "#6B7280",
    marginTop: Spacing.xs,
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
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },

  errorText: {
    color: "#b91c1c",
    fontSize: FontSize.base,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },

  loadingText: {
    marginLeft: Spacing.md,
    color: "#2563EB",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
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
    marginBottom: Spacing.md,
  },

  statNumber: {
    fontSize: FontSize["2xl"],
    fontWeight: "700",
    color: "#111827",
    marginBottom: Spacing.xs,
  },

  statLabel: {
    fontSize: FontSize.sm,
    color: "#6B7280",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: "#111827",
  },

  viewAll: {
    color: "#2563EB",
    fontSize: FontSize.sm,
    fontWeight: "600",
  },

  deliveryContainer: {
    marginBottom: Spacing.xl,
  },

  deliveryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
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
    marginRight: Spacing.md,
  },

  deliveryId: {
    fontSize: FontSize.base,
    fontWeight: "700",
    color: "#111827",
  },

  deliveryName: {
    fontSize: FontSize.sm,
    color: "#6B7280",
    marginTop: Spacing.xs,
  },

  deliveryRight: {
    alignItems: "flex-end",
  },

  deliveryAddress: {
    fontSize: FontSize.xs,
    color: "#6B7280",
    marginBottom: Spacing.md,
  },

  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
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
    fontSize: FontSize.xs,
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },

  acceptButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: FontSize.xs,
  },

  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#6B7280",
    fontSize: FontSize.base,
  },

  scanResultBox: {
    backgroundColor: "#eef2ff",
    padding: Spacing.md,
    borderRadius: 14,
    marginBottom: Spacing.md,
  },

  scanResultText: {
    color: "#1d4ed8",
    fontSize: FontSize.base,
  },

  bottomNavContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: "transparent",
  },

  bottomNav: {
    height: 86,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    paddingHorizontal: 12,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: Spacing.sm,
  },

  navItemActive: {
    backgroundColor: "#EFF6FF",
    borderRadius: 18,
  },

  navIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },

  navIconWrapperActive: {
    backgroundColor: "#DBEAFE",
  },

  navText: {
    fontSize: FontSize.xs,
    color: "#6B7280",
    marginTop: Spacing.xs,
  },

  activeNavText: {
    fontSize: FontSize.xs,
    color: "#2563EB",
    marginTop: Spacing.xs,
    fontWeight: "700",
  },
});