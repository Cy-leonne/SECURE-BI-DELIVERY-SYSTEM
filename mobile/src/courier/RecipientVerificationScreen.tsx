import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

import { RootStackParamList } from "../types";
import { useAuth } from "../context/AuthContext";
import { getDeliveryByTracking, verifyRecipient, CourierDelivery } from "../api";

type RouteProps = RouteProp<
  RootStackParamList,
  "RecipientVerification"
>;

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RecipientVerification"
>;

export default function RecipientVerificationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const route = useRoute<RouteProps>();
  const { orderId } = route.params;

  const [delivery, setDelivery] = useState<CourierDelivery | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.token) return;

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
          setError(fetchError.message || "Unable to load delivery details.");
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

  const handleVerifyRecipient = async () => {
    if (!user?.token) {
      return Alert.alert("Authentication required", "Please log in to verify the recipient.");
    }

    if (!delivery) {
      return Alert.alert("Delivery unavailable", "Unable to verify recipient without delivery details.");
    }

    if (!delivery.customerId) {
      return Alert.alert("Verification error", "Delivery customer information is missing.");
    }

    setLoading(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
        fallbackLabel: "Use PIN",
      });

      if (!result.success) {
        Alert.alert("Verification failed", "Biometric scan did not complete successfully.");
        return;
      }

      const verifyResult = await verifyRecipient(user.token, delivery.id, delivery.customerId, true);
      if (verifyResult?.proofRecorded) {
        navigation.navigate("VerificationSuccess", { orderId });
      } else {
        Alert.alert("Verification failed", "Recipient verification was not recorded.");
      }
    } catch (apiError: any) {
      Alert.alert("Verification error", apiError.message || "Unable to verify recipient.");
    } finally {
      setLoading(false);
    }
  };

  const deliveryCustomer = delivery?.recipientName || `Customer ${delivery?.customerId?.slice(0, 6) ?? ""}`;
  const deliveryAddress = delivery?.deliveryAddress || "Address unavailable";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={22}
            color="#0f172a"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Recipient Verification
        </Text>

        <View style={{ width: 22 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.stepsRow}>
          <View style={styles.activeStep}>
            <Text style={styles.activeStepText}>1</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.inactiveStep}>
            <Text style={styles.inactiveStepText}>2</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.inactiveStep}>
            <Text style={styles.inactiveStepText}>3</Text>
          </View>
        </View>

        <Text style={styles.title}>Recipient Verification</Text>
        <Text style={styles.subtitle}>Verify the recipient's identity</Text>

        <View style={styles.scanWrapper}>
          <View style={styles.outerCircle}>
            <View style={styles.middleCircle}>
              <View style={styles.innerCircle}>
                <Image
                  source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
                  style={styles.faceImage}
                />
              </View>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 16 }} />
        ) : null}

        {error ? (
          <Text style={[styles.helperText, { color: "#dc2626" }]}>{error}</Text>
        ) : null}

        <Text style={styles.orderText}>Order {orderId}</Text>
        <Text style={styles.helperText}>{deliveryCustomer}</Text>
        <Text style={styles.helperText}>{deliveryAddress}</Text>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          activeOpacity={0.8}
          onPress={handleVerifyRecipient}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Verify Recipient</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
  },

  /* STEPS */

  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  activeStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2563eb",

    alignItems: "center",
    justifyContent: "center",
  },

  activeStepText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },

  inactiveStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e2e8f0",

    alignItems: "center",
    justifyContent: "center",
  },

  inactiveStepText: {
    color: "#64748b",
    fontWeight: "700",
    fontSize: 13,
  },

  stepLine: {
    width: 52,
    height: 2,
    backgroundColor: "#cbd5e1",
  },

  /* TEXT */

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748b",
  },

  /* SCAN */

  scanWrapper: {
    marginTop: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  outerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: "#2563eb",

    alignItems: "center",
    justifyContent: "center",
  },

  middleCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: "#60a5fa",

    alignItems: "center",
    justifyContent: "center",
  },

  innerCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    overflow: "hidden",
    backgroundColor: "#dbeafe",
  },

  faceImage: {
    width: "100%",
    height: "100%",
  },

  /* ORDER */

  orderText: {
    marginTop: 28,
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },

  helperText: {
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
    color: "#64748b",
    fontSize: 14,
  },

  /* BUTTON */

  button: {
    marginTop: "auto",
    marginBottom: 32,

    width: "100%",
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