import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DeliveryRecord } from "../types";

type Props = {
  item: DeliveryRecord;
};

export default function DeliveryCard({ item }: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.order}>{item.orderId}</Text>
        <Text style={styles.recipient}>{item.recipient}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      <View style={[styles.badge, getStatusStyle(item.status)]}>
        <Text style={styles.badgeText}>{item.status}</Text>
      </View>
    </View>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Delivered":
      return { backgroundColor: "#d1fae5" };
    case "Pending":
      return { backgroundColor: "#fef3c7" };
    default:
      return { backgroundColor: "#dbeafe" };
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  order: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0f172a",
  },
  recipient: {
    fontSize: 14,
    color: "#475569",
    marginTop: 2,
  },
  address: {
    fontSize: 12,
    color: "#94a3b8",
  },
  time: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0f172a",
  },
});