import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import {
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "../types";
import { todayDeliveries } from "../data/mockDeliveries";
import { useAuth } from "../context/AuthContext";
import { getDeliveryByTracking, startDelivery, CourierDelivery } from "../api";

type RouteProps = RouteProp<
  RootStackParamList,
  "DeliveryDetails"
>;

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DeliveryDetails"
>;

export default function DeliveryDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const route = useRoute<RouteProps>();
  const { orderId } = route.params;

  const [delivery, setDelivery] = useState<CourierDelivery | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.token) {
      return;
    }

    let active = true;
    const loadDelivery = async () => {
      setLoading(true);
      try {
        const result = await getDeliveryByTracking(user.token, orderId);
        if (active) {
          setDelivery(result);
          setError(null);
        }
      } catch (fetchError: any) {
        if (active) {
          setError(fetchError.message || "Delivery not found.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDelivery();
    return () => {
      active = false;
    };
  }, [orderId, user?.token]);

  const selectedDelivery =
    delivery ??
    todayDeliveries.find((item) => item.orderId === orderId) ??
    todayDeliveries[0];

  const isCourierDelivery = (d: CourierDelivery | import("../types").DeliveryRecord): d is CourierDelivery => {
    return (d as CourierDelivery).trackingNo !== undefined;
  };

  const displayOrderId = isCourierDelivery(selectedDelivery)
    ? selectedDelivery.trackingNo
    : (selectedDelivery as import("../types").DeliveryRecord).orderId;

  const displayRecipient = isCourierDelivery(selectedDelivery)
    ? selectedDelivery.recipientName || `Customer ${selectedDelivery.customerId?.slice(0, 6) ?? ""}`
    : (selectedDelivery as import("../types").DeliveryRecord).recipient;

  const displayAddress = isCourierDelivery(selectedDelivery)
    ? selectedDelivery.deliveryAddress || "Address unavailable"
    : (selectedDelivery as import("../types").DeliveryRecord).address;

  const handleStart = async () => {
    if (!delivery || !user?.token) {
      return navigation.navigate("RecipientVerification", { orderId });
    }

    if (delivery.status === "Delivered") {
      return Alert.alert("Delivery already completed", "This delivery has already been recorded as delivered.");
    }

    try {
      await startDelivery(user.token, delivery.id);
      Alert.alert("Delivery Started", "You have started the delivery.", [
        {
          text: "Continue",
          onPress: () => navigation.navigate("RecipientVerification", { orderId }),
        },
      ]);
    } catch (apiError: any) {
      Alert.alert("Start delivery failed", apiError.message || "Unable to start delivery.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={22}
            color="#0f172a"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Delivery Details
        </Text>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* DETAILS CARD */}
        <View style={styles.card}>
          {/* ORDER ID */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>
              Order ID
            </Text>

            <Text style={styles.value}>
              {displayOrderId}
            </Text>
          </View>

          {/* CUSTOMER */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>
              Customer
            </Text>

            <Text style={styles.value}>
              {displayRecipient}
            </Text>
          </View>

          {/* PHONE */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>
              Phone
            </Text>

            <Text style={styles.value}>
              {isCourierDelivery(selectedDelivery)
                ? selectedDelivery.recipientPhone || "+254 700 123 456"
                : "+254 700 123 456"}
            </Text>
          </View>

          {/* ADDRESS */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>
              Address
            </Text>

            <Text style={styles.value}>
              {displayAddress}
            </Text>
          </View>

          {/* PACKAGE */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>
              Package
            </Text>

            <Text style={styles.value}>
              {isCourierDelivery(selectedDelivery)
                ? selectedDelivery.item || selectedDelivery.description || "Unknown"
                : "Electronics"}
            </Text>
          </View>

          {/* NOTES */}
          <View style={styles.detailRowNoBorder}>
            <Text style={styles.label}>
              Notes
            </Text>

            <Text style={styles.value}>
              {isCourierDelivery(selectedDelivery)
                ? selectedDelivery.specialInstructions || "No special instructions"
                : "Handle with care"}
            </Text>
          </View>

          {/* MAP PLACEHOLDER (react-native-maps not installed) */}
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Map view unavailable</Text>
              <Text style={styles.mapPlaceholderSub}>{displayAddress}</Text>
            </View>
          </View>
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleStart}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            Start Delivery
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  /* HEADER */

  header: {
    height: 64,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },

  /* CONTENT */

  content: {
    padding: 16,
    paddingBottom: 24,
  },

  /* CARD */

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  detailRow: {
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  detailRowNoBorder: {
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 6,
    fontWeight: "500",
  },

  value: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "600",
    lineHeight: 22,
  },

  /* MAP */

  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 4,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef2ff",
  },
  mapPlaceholderText: {
    color: "#475569",
    fontWeight: "700",
    marginBottom: 6,
  },
  mapPlaceholderSub: {
    color: "#94a3b8",
    fontSize: 12,
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

  /* BUTTON */

  button: {
    marginTop: 22,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#2563eb",

    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});