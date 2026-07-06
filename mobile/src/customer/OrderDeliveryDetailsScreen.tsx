import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, DeliveryDetails } from "../types";
import { useAuth } from "../context/AuthContext";
import { createDelivery } from "../api";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "OrderDeliveryDetails"
>;
type RoutePropType = RouteProp<RootStackParamList, "OrderDeliveryDetails">;

export default function OrderDeliveryDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { orderId, item, description, category, estimatedWeight } = route.params;

  const [formData, setFormData] = useState<DeliveryDetails>({
    recipientName: "",
    recipientPhone: "",
    deliveryAddress: "",
    city: "",
    postalCode: "",
    specialInstructions: "",
  });

  const handleInputChange = (field: keyof DeliveryDetails, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const isFormValid = () => {
    return (
      formData.recipientName.trim() !== "" &&
      formData.recipientPhone.trim() !== "" &&
      formData.deliveryAddress.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.postalCode.trim() !== ""
    );
  };

  const handleSubmitOrder = async () => {
    if (!isFormValid()) {
      Alert.alert("Incomplete Form", "Please fill in all required fields.");
      return;
    }

    if (!user?.token || !user?.id) {
      Alert.alert("Authentication required", "Please log in again to place your order.");
      return;
    }

    setRequestError(null);
    try {
      setLoading(true);
      const trackingNo = `TRK-${Date.now().toString().slice(-6)}`;
      const res = await createDelivery(user.token, {
        trackingNo,
        customerId: user.id,
        item,
        description: description ?? formData.specialInstructions,
        category: category ?? undefined,
        estimatedWeight: estimatedWeight ?? undefined,
        recipientName: formData.recipientName,
        recipientPhone: formData.recipientPhone,
        deliveryAddress: formData.deliveryAddress,
        city: formData.city,
        postalCode: formData.postalCode,
        specialInstructions: formData.specialInstructions,
      });

      const successMessage = `Order placed successfully. Tracking: ${res.trackingNo || trackingNo}`;
      if (Platform.OS === "web") {
        window.alert(`Order Placed\n\n${successMessage}`);
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "CustomerDashboard",
              params: {
                orderPlaced: true,
                orderId: res.trackingNo || trackingNo,
              },
            },
          ],
        });
        return;
      }

      Alert.alert(
        "Order Placed",
        successMessage,
        [
          {
            text: "View Orders",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "CustomerDashboard",
                    params: {
                      orderPlaced: true,
                      orderId: res.trackingNo || trackingNo,
                    },
                  },
                ],
              });
            },
          },
        ]
      );
    } catch (apiError: any) {
      const message = apiError?.message || "Please try again later.";
      setRequestError(message);
      Alert.alert("Unable to place order", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Delivery Details</Text>
          <Text style={styles.subtitle}>
            Provide recipient and delivery address information
          </Text>
        </View>

        <View style={styles.orderSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order ID:</Text>
            <Text style={styles.summaryValue}>{orderId}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Item:</Text>
            <Text style={styles.summaryValue}>{item}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipient Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Recipient Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              value={formData.recipientName}
              onChangeText={(value) =>
                handleInputChange("recipientName", value)
              }
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="+254 700 000 000"
              value={formData.recipientPhone}
              onChangeText={(value) =>
                handleInputChange("recipientPhone", value)
              }
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., 123 Main Street, Apt 4B"
              value={formData.deliveryAddress}
              onChangeText={(value) =>
                handleInputChange("deliveryAddress", value)
              }
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Nairobi"
                value={formData.city}
                onChangeText={(value) => handleInputChange("city", value)}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Postal Code *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 00100"
                value={formData.postalCode}
                onChangeText={(value) =>
                  handleInputChange("postalCode", value)
                }
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes for Courier</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., Please ring doorbell twice, leave at gate, etc."
              value={formData.specialInstructions}
              onChangeText={(value) =>
                handleInputChange("specialInstructions", value)
              }
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#475569" />
          <Text style={styles.infoText}>
            Note: your delivery details are sent to the courier only after the
            order is successfully placed.
          </Text>
        </View>

        {requestError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{requestError}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isFormValid() || loading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitOrder}
          disabled={!isFormValid() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Place Order</Text>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#FFF"
                style={{ marginLeft: 8 }}
              />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("PlaceOrder")}
          >
            <Ionicons name="arrow-back" size={20} color="#2563EB" />
            <Text style={styles.backButtonText}>Back to Order Details</Text>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#475569",
  },
  orderSummary: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e40af",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#bfdbfe",
    marginVertical: 12,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoText: {
    fontSize: 13,
    color: "#475569",
    marginLeft: 10,
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#cbd5e1",
    opacity: 0.6,
  },
  errorBanner: {
    backgroundColor: "#fee2e2",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#991b1b",
    fontSize: 14,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
   backButton: {
     marginTop: 12,
     flexDirection: "row",
     alignItems: "center",
     justifyContent: "center",
   },
   backButtonText: {
     color: "#2563EB",
     fontWeight: "700",
     marginLeft: 8,
     fontSize: 14,
   },
  cancelButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "700",
  },
});
