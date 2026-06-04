import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { todayDeliveries } from "../data/mockDeliveries";
import { Ionicons } from "@expo/vector-icons";

type RouteProps = RouteProp<RootStackParamList, "ProofOfDelivery">;
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProofOfDelivery"
>;

export default function ProofOfDeliveryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const { orderId } = route.params;

  const delivery =
    todayDeliveries.find((item) => item.orderId === orderId) ??
    todayDeliveries[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Proof of Delivery</Text>

        <View style={styles.successCircle}>
          <Ionicons
            name="checkmark"
            size={70}
            color="#16a34a"
          />
        </View>

        <Text style={styles.completedText}>
          Delivery Completed
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>{delivery.orderId}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Recipient</Text>
            <Text style={styles.value}>{delivery.recipient}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Delivered By</Text>
            <Text style={styles.value}>John Courier</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.value}>26 May 2026, 10:35 AM</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{delivery.address}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Verification</Text>
            <Text style={styles.value}>Face Verified</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>
            View / Share Proof
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.backText}>
            Back to Dashboard
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  content: {
    padding: 24,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 30,
  },

  successCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    borderColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  completedText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 24,
  },

  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 20,
    marginBottom: 24,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },

  value: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "600",
  },

  shareButton: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  shareButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  backText: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "500",
  },
});