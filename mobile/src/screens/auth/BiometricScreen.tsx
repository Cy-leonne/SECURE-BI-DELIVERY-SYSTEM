import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

type BiometricProps = NativeStackScreenProps<
  RootStackParamList,
  "Biometric"
>;

const { width } = Dimensions.get("window");

export default function BiometricScreen({
  navigation,
}: BiometricProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>
          Biometric Registration
        </Text>

        <Text style={styles.subtitle}>
          Register your fingerprint
        </Text>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          <View style={styles.activeStep}>
            <Text style={styles.activeStepText}>1</Text>
          </View>

          <View style={styles.line} />

          <View style={styles.inactiveStep}>
            <Text style={styles.inactiveStepText}>2</Text>
          </View>

          <View style={styles.line} />

          <View style={styles.inactiveStep}>
            <Text style={styles.inactiveStepText}>3</Text>
          </View>
        </View>

        {/* Fingerprint Circle */}
        <View style={styles.fingerprintWrapper}>
          <Ionicons
            name="finger-print"
            size={120}
            color="#2563EB"
          />
        </View>

        {/* Instructions */}
        <Text style={styles.instructionTitle}>
          Place your finger on the scanner
        </Text>

        <Text style={styles.instructionText}>
          Lift and place your finger several times
        </Text>

        {/* Bottom Text */}
        <Text style={styles.helperText}>
          This helps us verify your identity during
          delivery
        </Text>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "CustomerDashboard" }],
            })
          }
        >
          <Text style={styles.buttonText}>
            Complete Enrollment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    width: width > 500 ? 430 : "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 28,
    textAlign: "center",
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },

  activeStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  activeStepText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  inactiveStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  inactiveStepText: {
    color: "#6B7280",
    fontWeight: "700",
  },

  line: {
    width: 45,
    height: 2,
    backgroundColor: "#D1D5DB",
  },

  fingerprintWrapper: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#F8FAFC",
  },

  instructionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },

  instructionText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 28,
  },

  helperText: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 35,
    paddingHorizontal: 10,
  },

  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});