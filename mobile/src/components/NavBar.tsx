import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";

const nextRouteMap: Record<string, string | undefined> = {
  Splash: "Role",
  Login: "Dashboard",
  Dashboard: "Deliveries",
  Deliveries: "DeliveryDetails",
  DeliveryDetails: "RecipientVerification",
  RecipientVerification: "VerificationSuccess",
  VerificationSuccess: "ProofOfDelivery",
  ProofOfDelivery: "Profile",
  CustomerDashboard: "PlaceOrder",
  PlaceOrder: "OrderDeliveryDetails",
  CustomerProfile: "CustomerDashboard",
};
const nextLabelMap: Record<string, string> = {
  Splash: "Start",
  Login: "Continue",
  Dashboard: "Next",
  Deliveries: "Details",
  DeliveryDetails: "Verify",
  RecipientVerification: "Finish",
  VerificationSuccess: "Proof",
  ProofOfDelivery: "Profile",
  CustomerDashboard: "New Order",
  PlaceOrder: "Delivery Details",
  CustomerProfile: "Dashboard",
};

export default function NavBar(props: any /* NativeStackHeaderProps<any> */) {
  const { navigation, route } = props;

  const canGoBack = navigation?.canGoBack?.() ?? false;
  const next = nextRouteMap[route?.name];
  const nextLabel = route?.name ? nextLabelMap[route.name] : "Next";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.side}
        onPress={() => {
          if (canGoBack) navigation.goBack();
        }}
        disabled={!canGoBack}
      >
        <Ionicons name="arrow-back" size={20} color={canGoBack ? "#007AFF" : "#999"} />
      </TouchableOpacity>

      <View style={styles.titleWrap}>
        <Text numberOfLines={1} style={styles.title}>
          {route?.name ?? ""}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.side}
        onPress={() => {
          if (next) navigation.navigate(next);
        }}
        disabled={!next}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[styles.buttonText, !next && styles.disabled]}>{next ? nextLabel : ""}</Text>
          <Ionicons name="arrow-forward" size={18} color={next ? "#007AFF" : "#999"} style={{ marginLeft: 6 }} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  side: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  disabled: {
    color: "#999",
  },
  titleWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});
