import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, PlaceOrderForm } from "../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "PlaceOrder">;

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Household Goods",
  "Books",
  "Groceries",
  "Other",
];

export default function PlaceOrderScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [formData, setFormData] = useState<PlaceOrderForm>({
    item: "",
    description: "",
    category: "",
    estimatedWeight: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleInputChange = (field: keyof PlaceOrderForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    handleInputChange("category", category);
  };

  const isFormValid = () => {
    return (
      formData.item.trim() !== "" &&
      formData.description.trim() !== "" &&
      selectedCategory !== "" &&
      formData.estimatedWeight.trim() !== ""
    );
  };

  const handleNext = () => {
    if (isFormValid()) {
      // Generate a unique order ID
      const orderId = `ORD${Date.now().toString().slice(-4)}${Math.floor(
        Math.random() * 1000
      )}`;
      // Pass full order metadata to the next screen so the delivery can be created
      navigation.navigate("OrderDeliveryDetails", {
        orderId,
        item: formData.item,
        description: formData.description,
        category: formData.category,
        estimatedWeight: formData.estimatedWeight,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Place New Order</Text>
          <Text style={styles.subtitle}>
            Enter order details and provide delivery information
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Item Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Laptop, Shoes, Package"
              value={formData.item}
              onChangeText={(value) => handleInputChange("item", value)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the item in detail (e.g., color, condition, special handling)"
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category &&
                        styles.categoryButtonTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Estimated Weight *</Text>
            <View style={styles.weightInputGroup}>
              <TextInput
                style={styles.weightInput}
                placeholder="0"
                value={formData.estimatedWeight}
                onChangeText={(value) =>
                  handleInputChange("estimatedWeight", value)
                }
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
              <Text style={styles.weightUnit}>kg</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#2563EB" />
          <Text style={styles.infoText}>
            After entering order details, you'll provide recipient and delivery
            address information on the next screen.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !isFormValid() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isFormValid()}
        >
          <Text style={styles.nextButtonText}>Continue to Delivery Details</Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFF"
            style={{ marginLeft: 8 }}
          />
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
    marginBottom: 24,
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
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#f8fafc",
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
  },
  categoryButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  categoryButtonTextActive: {
    color: "#ffffff",
  },
  weightInputGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  weightUnit: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  infoBox: {
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoText: {
    fontSize: 13,
    color: "#1e40af",
    marginLeft: 10,
    flex: 1,
  },
  nextButton: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  nextButtonDisabled: {
    backgroundColor: "#cbd5e1",
    opacity: 0.6,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
