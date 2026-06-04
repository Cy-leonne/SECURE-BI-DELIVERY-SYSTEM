import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types";
import { todayDeliveries } from "../data/mockDeliveries";
import { useAuth } from "../context/AuthContext";
import { getCourierDeliveries, CourierDelivery } from "../api";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Deliveries"
>;

export default function DeliveriesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [backendDeliveries, setBackendDeliveries] = useState<CourierDelivery[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.token || !user?.id) return;

    let active = true;
    const loadDeliveries = async () => {
      setLoading(true);
      try {
        const response = await getCourierDeliveries(user.token, user.id);
        if (active) {
          setBackendDeliveries(response.deliveries);
          setError(null);
        }
      } catch (fetchError: any) {
        if (active) {
          setError(fetchError.message || "Unable to load deliveries");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDeliveries();
    return () => {
      active = false;
    };
  }, [user?.id, user?.token]);

  const deliveryItems = backendDeliveries?.map((item) => ({
    id: item.id,
    orderId: item.trackingNo,
    customerName: item.customerId ? `Customer ${item.customerId.slice(0, 6)}` : "Customer",
    recipient: item.customerId ? `Customer ${item.customerId.slice(0, 6)}` : "Customer",
    address: "Address unavailable",
    status: item.status,
    time: new Date(item.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  })) ?? todayDeliveries;

  const filteredDeliveries = useMemo(() => {
    let filtered = deliveryItems;

    if (activeTab !== "All") {
      filtered = filtered.filter(
        (item) =>
          item.status.toLowerCase() === activeTab.toLowerCase()
      );
    }

    if (search.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.orderId.toLowerCase().includes(search.toLowerCase()) ||
          item.customerName
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [activeTab, search, deliveryItems]);

  const tabs = [
    { label: "All", count: deliveryItems.length },
    {
      label: "Pending",
      count: deliveryItems.filter((item) => item.status.toLowerCase() === "pending").length,
    },
    {
      label: "In Progress",
      count: deliveryItems.filter((item) => item.status.toLowerCase() === "in progress").length,
    },
    {
      label: "Delivered",
      count: deliveryItems.filter((item) => item.status.toLowerCase() === "delivered").length,
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return {
          bg: "#fff7ed",
          text: "#ea580c",
        };

      case "pending":
        return {
          bg: "#eff6ff",
          text: "#2563eb",
        };

      case "delivered":
        return {
          bg: "#ecfdf5",
          text: "#16a34a",
        };

      default:
        return {
          bg: "#f1f5f9",
          text: "#475569",
        };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Assigned Deliveries</Text>

        <TouchableOpacity>
          <Ionicons name="options-outline" size={22} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#94a3b8"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by order ID or customer"
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.loadingText}>Loading courier deliveries...</Text>
          </View>
        ) : null}

        {/* FILTER TABS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.label;

            return (
              <TouchableOpacity
                key={tab.label}
                onPress={() => setActiveTab(tab.label)}
                style={[
                  styles.tabButton,
                  active && styles.activeTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    active && styles.activeTabText,
                  ]}
                >
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* DELIVERY LIST */}
        {filteredDeliveries.map((item) => {
          const statusStyle = getStatusStyle(item.status);

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.deliveryCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("DeliveryDetails", {
                  orderId: item.orderId,
                })
              }
            >
              {/* LEFT ICON */}
              <View style={styles.iconContainer}>
                <Ionicons
                  name="cube-outline"
                  size={18}
                  color="#2563eb"
                />
              </View>

              {/* CENTER CONTENT */}
              <View style={styles.deliveryInfo}>
                <Text style={styles.orderId}>{item.orderId}</Text>

                <Text style={styles.customerName}>
                  {item.customerName}
                </Text>

                <Text style={styles.address}>
                  {item.address}
                </Text>
              </View>

              {/* RIGHT SIDE */}
              <View style={styles.rightSection}>
                <Text style={styles.time}>{item.time}</Text>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusStyle.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: statusStyle.text },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  /* HEADER */

  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },

  /* SEARCH */

  searchContainer: {
    marginTop: 16,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#0f172a",
    fontSize: 14,
  },

  /* TABS */

  tabsContainer: {
    paddingTop: 18,
    paddingBottom: 14,
  },

  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  activeTabButton: {
    backgroundColor: "#eff6ff",
    borderColor: "#2563eb",
  },

  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },

  activeTabText: {
    color: "#2563eb",
  },

  /* DELIVERY CARD */

  deliveryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  deliveryInfo: {
    flex: 1,
  },

  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },

  customerName: {
    marginTop: 2,
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },

  address: {
    marginTop: 2,
    fontSize: 12,
    color: "#94a3b8",
  },

  rightSection: {
    alignItems: "flex-end",
  },

  time: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 8,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
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
});