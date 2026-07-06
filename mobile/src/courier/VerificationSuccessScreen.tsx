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
import InputField from "../components/InputField";
import { requestStkPush, paybill } from "../api";
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

  const [phone, setPhone] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState<number>(0);
  const [processing, setProcessing] = React.useState(false);

  const handleConfirmDelivery = async () => {
    if (!user?.token) {
      return Alert.alert("Authentication required", "Please log in to confirm delivery.");
    }

    try {
      setProcessing(true);
      const delivery = await getDeliveryByTracking(user.token, orderId);

      // If phone/amount not provided, prompt user to choose payment option
      if (phone) {
        // Use paybill if amount > 0, otherwise attempt STK push
        if (amount > 0) {
          const payRes = await paybill(user.token, delivery.id, phone, amount);
          if (payRes?.status !== 'paid') {
            throw new Error('Payment failed');
          }
        } else {
          const stk = await requestStkPush(user.token, delivery.id, phone);
          if (stk?.status !== 'initiated') {
            throw new Error('STK Push initiation failed');
          }
          // In a real flow we'd wait for callback; here assume success
        }
      }

      await confirmDelivery(user.token, delivery.id);
      Alert.alert("Delivery Confirmed", "Proof of delivery recorded.", [
        { text: "OK", onPress: () => navigation.navigate("Dashboard") },
      ]);
    } catch (err: any) {
      Alert.alert("Unable to confirm", err.message || "Please try again later.");
    } finally {
      setProcessing(false);
    }
  };

  const handleStkPush = async () => {
    if (!user?.token) return Alert.alert('Authentication required');
    if (!phone) return Alert.alert('Phone required', 'Enter recipient phone to request STK Push');
    setProcessing(true);
    try {
      const delivery = await getDeliveryByTracking(user.token, orderId);
      const res = await requestStkPush(user.token, delivery.id, phone);
      Alert.alert('STK Push', `Request ${res.checkoutRequestId} - ${res.status}`);
    } catch (err: any) {
      Alert.alert('STK Push Failed', err.message || 'Please try again');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaybill = async () => {
    if (!user?.token) return Alert.alert('Authentication required');
    if (!phone || amount <= 0) return Alert.alert('Phone and amount required');
    setProcessing(true);
    try {
      const delivery = await getDeliveryByTracking(user.token, orderId);
      const res = await paybill(user.token, delivery.id, phone, amount);
      Alert.alert('Paybill', `Reference ${res.reference} - ${res.status}`);
    } catch (err: any) {
      Alert.alert('Paybill Failed', err.message || 'Please try again');
    } finally {
      setProcessing(false);
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

        {/* Payment Inputs (simple) */}
        <View style={{ width: '100%', marginBottom: 12 }}>
          <Text style={{ marginBottom: 6, color: '#64748b' }}>Recipient Phone</Text>
          <InputField
            label=""
            placeholder="Enter phone (e.g. 2547...)"
            value={phone ?? ''}
            onChangeText={(v: string) => setPhone(v)}
          />
        </View>

        <View style={{ width: '100%', marginBottom: 12 }}>
          <Text style={{ marginBottom: 6, color: '#64748b' }}>Amount (KES)</Text>
          <InputField
            label=""
            placeholder="0"
            keyboardType="numeric"
            value={amount ? String(amount) : ''}
            onChangeText={(v: string) => setAmount(Number(v))}
          />
        </View>

        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: '#f59e0b' }]}
          onPress={handleStkPush}
          disabled={processing}
        >
          <Text style={styles.smallButtonText}>Request STK Push</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: '#10b981' }]}
          onPress={handlePaybill}
          disabled={processing}
        >
          <Text style={styles.smallButtonText}>Paybill (Confirm Payment)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleConfirmDelivery}
          disabled={processing}
        >
          <Text style={styles.buttonText}>
            {processing ? 'Processing...' : 'Confirm Delivery'}
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