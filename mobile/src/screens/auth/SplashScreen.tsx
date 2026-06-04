import {
  View,
  Text,
  Pressable,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

type SplashProps = NativeStackScreenProps<
  RootStackParamList,
  "Splash"
>;

const { width, height } = Dimensions.get("window");

/* Responsive checks */
const isLargeScreen = width >= 768;

export default function SplashScreen({
  navigation,
}: SplashProps) {
  return (
    <ImageBackground
      source={require("../../../assets/splash.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Main Content */}
      <View style={styles.content}>

        {/* Bottom Content */}
        <View style={styles.bottomSection}>
          <Text style={styles.subtitle}>
            Secure.Verified.Delivered
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Role")}
          >
            <Text style={styles.buttonText}>
              Get Started
            </Text>
          </Pressable>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: isLargeScreen ? 80 : 24,
    paddingBottom: isLargeScreen ? 80 : 50,
  },

  bottomSection: {
    width: isLargeScreen ? "55%" : "100%",
    alignItems: "center",
  },

  subtitle: {
    color: "#ffffff",
    fontSize: isLargeScreen ? 22 : 16,
    lineHeight: isLargeScreen ? 34 : 24,
    textAlign: "center",
  },

  button: {
    backgroundColor: "rgb(49, 95, 233)",
    width: isLargeScreen ? 260 : "100%",
    paddingVertical: isLargeScreen ? 20 : 16,
    borderRadius: 18,
    marginTop: 28,

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

  buttonText: {
    color: "#0f172a",
    textAlign: "center",
    fontWeight: "800",
    fontSize: isLargeScreen ? 18 : 16,
  },
});