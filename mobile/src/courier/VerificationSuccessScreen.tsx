import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { getDeliveryByTracking, confirmDelivery } from "../api";

type RouteProps = RouteProp<RootStackParamList, "VerificationSuccess">;
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "VerificationSuccess"
>;

export default function VerificationSuccessScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { orderId } = route.params;
  const { user } = useAuth();

  const handleConfirmDelivery = async () => {
    if (!user?.token) {
      return Alert.alert("Authentication required", "Please log in to confirm delivery.");
    }

    try {
      const delivery = await getDeliveryByTracking(user.token, orderId);
      await confirmDelivery(user.token, delivery.id);
      Alert.alert("Delivery Confirmed", "Proof of delivery recorded.", [
        { text: "OK", onPress: () => navigation.navigate("Dashboard") },
      ]);
    } catch (err: any) {
      Alert.alert("Unable to confirm", err.message || "Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.successTitle}>
          Verification Successful
        </Text>

        <View style={styles.checkCircle}>
          <Ionicons
            name="checkmark"
            size={70}
            color="#22c55e"
          />
        </View>

        <Text style={styles.identityTitle}>
          Identity Verified
        </Text>

        <Text style={styles.description}>
          The recipient has been successfully verified.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleConfirmDelivery}
        >
          <Text style={styles.buttonText}>
            Confirm Delivery
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 40,
  },

  checkCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 6,
    borderColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  identityTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 24,
    marginBottom: 50,
  },

  button: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});