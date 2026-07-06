import {
  View,
  Text,
  Pressable,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { DeviceSize, FontSize, Spacing, ResponsiveDimensions } from "../../utils/responsive";

type SplashProps = NativeStackScreenProps<
  RootStackParamList,
  "Splash"
>;

const { width, height } = Dimensions.get("window");

export default function SplashScreen({
  navigation,
}: SplashProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.outerContainer}>
      <ImageBackground
        source={require("../../../assets/splash.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Dark Overlay */}
        <View style={styles.overlay} />

        {/* Main Content */}
        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
        >
          {/* Bottom Content */}
          <View style={styles.bottomSection}>
            <Text style={styles.subtitle}>
              Secure.Verified.Delivered
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => navigation.navigate("Role")}
            >
              <Text style={styles.buttonText}>
                Get Started
              </Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },

  bottomSection: {
    width: "100%",
    maxWidth: ResponsiveDimensions.cardWidth,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  subtitle: {
    color: "#ffffff",
    fontSize: FontSize["2xl"],
    lineHeight: FontSize["2xl"] + 8,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: Spacing.lg,
  },

  button: {
    backgroundColor: "rgb(49, 95, 233)",
    width: "100%",
    paddingVertical: Spacing.md,
    borderRadius: 18,
    marginTop: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
    minHeight: ResponsiveDimensions.buttonHeight,

    /* Shadow */
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: "#0f172a",
    textAlign: "center",
    fontWeight: "800",
    fontSize: FontSize.lg,
  },
});