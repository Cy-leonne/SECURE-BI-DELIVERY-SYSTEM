import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
  CustomerDashboard: "CustomerProfile",
  PlaceOrder: "OrderDeliveryDetails",
};

export default function NavBar(props: any /* NativeStackHeaderProps<any> */) {
  const { navigation, route } = props;

  const canGoBack = navigation?.canGoBack?.() ?? false;
  const next = nextRouteMap[route?.name];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.side}
        onPress={() => {
          if (canGoBack) navigation.goBack();
        }}
        disabled={!canGoBack}
      >
        <Text style={[styles.buttonText, !canGoBack && styles.disabled]}>Back</Text>
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
        <Text style={[styles.buttonText, !next && styles.disabled]}>Next</Text>
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
