import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AdminSidebar from "./AdminSidebar";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ReportsScreen"
>;

const stats = [
  { label: "Total Deliveries", value: "358" },
  { label: "Completed", value: "289" },
  { label: "Pending", value: "48" },
  { label: "Failed", value: "21" },
];

const chartData = [
  { day: "14 May", completed: 80, failed: 35 },
  { day: "15 May", completed: 65, failed: 20 },
  { day: "16 May", completed: 85, failed: 8 },
  { day: "17 May", completed: 82, failed: 28 },
  { day: "18 May", completed: 60, failed: 25 },
  { day: "19 May", completed: 70, failed: 22 },
  { day: "20 May", completed: 88, failed: 18 },
];

export default function ReportsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [startDate, setStartDate] = React.useState(
    new Date(2024, 4, 1)
  );

  const [endDate, setEndDate] = React.useState(
    new Date(2024, 4, 20)
  );

  const [showStartPicker, setShowStartPicker] =
    React.useState(false);

  const [showEndPicker, setShowEndPicker] =
    React.useState(false);

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        <AdminSidebar />

        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Delivery Reports
          </Text>

          <View style={styles.dateRow}>
            {/* START DATE */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateText}>
                {formatDate(startDate)}
              </Text>
            </TouchableOpacity>

            <Text style={styles.toText}>to</Text>

            {/* END DATE */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateText}>
                {formatDate(endDate)}
              </Text>
            </TouchableOpacity>

            {/* GENERATE BUTTON */}
            <TouchableOpacity style={styles.generateButton}>
              <Text style={styles.generateText}>
                Generate
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* START DATE PICKER */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={
              Platform.OS === "ios"
                ? "spinner"
                : "default"
            }
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);

              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}

        {/* END DATE PICKER */}
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={
              Platform.OS === "ios"
                ? "spinner"
                : "default"
            }
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);

              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Text style={styles.statLabel}>
                {item.label}
              </Text>

              <Text style={styles.statValue}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Deliveries Over Time
          </Text>

          <View style={styles.graphArea}>
            {chartData.map((item) => (
              <View key={item.day} style={styles.barGroup}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      styles.completedBar,
                      { height: item.completed },
                    ]}
                  />

                  <View
                    style={[
                      styles.bar,
                      styles.failedBar,
                      { height: item.failed },
                    ]}
                  />
                </View>

                <Text style={styles.dayText}>
                  {item.day}
                </Text>
              </View>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: "#22c55e" },
                ]}
              />

              <Text style={styles.legendText}>
                Completed
              </Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: "#ef4444" },
                ]}
              />

              <Text style={styles.legendText}>
                Failed
              </Text>
            </View>
          </View>
        </View>

        {/* Dashboard Button */}
        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() =>
            navigation.navigate("AdminDashboard")
          }
        >
          <Text style={styles.dashboardButtonText}>
            Back to Dashboard
          </Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  layout: {
    flex: 1,
    flexDirection: "row",
  },

  main: {
    flex: 1,
    minWidth: 0,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 16,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  datePickerButton: {
    flex: 1,
    minWidth: 110,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe3ee",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
  },

  dateText: {
    color: "#0f172a",
    fontSize: 13,
    fontWeight: "600",
  },

  toText: {
    marginHorizontal: 8,
    color: "#64748b",
    fontWeight: "600",
  },

  generateButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 10,
  },

  generateText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  statLabel: {
    color: "#64748b",
    fontSize: 12,
    marginBottom: 6,
  },

  statValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
  },

  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 20,
  },

  graphArea: {
    height: 220,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  barGroup: {
    alignItems: "center",
    flex: 1,
  },

  barWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 170,
  },

  bar: {
    width: 10,
    borderRadius: 6,
    marginHorizontal: 2,
  },

  completedBar: {
    backgroundColor: "#22c55e",
  },

  failedBar: {
    backgroundColor: "#ef4444",
  },

  dayText: {
    marginTop: 8,
    fontSize: 10,
    color: "#64748b",
  },

  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  legendText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
  },

  dashboardButton: {
    marginTop: 24,
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  dashboardButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});