import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

type SidebarRoute =
  | "AdminDashboard"
  | "UsersScreen"
  | "AdminCouriers"
  | "AdminDeliveries"
  | "ReportsScreen"
  | "GalleryManager";

const sidebarItems: {
  label: string;
  route?: SidebarRoute;
}[] = [
  { label: "Dashboard", route: "AdminDashboard" },
  { label: "Users", route: "UsersScreen" },
  { label: "Couriers", route: "AdminCouriers" },
  { label: "Deliveries", route: "AdminDeliveries" },
  { label: "Reports", route: "ReportsScreen" },
  { label: "Gallery", route: "GalleryManager" },
  { label: "Disputes" },
  { label: "Settings" },
];

export default function AdminSidebar() {
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList>
  >();
  const route = useRoute<
    RouteProp<RootStackParamList, SidebarRoute>
  >();
  const activeRoute = route.name as SidebarRoute;

  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>SecureBi Admin</Text>

      <View style={styles.menuContainer}>
        {sidebarItems.map((item) => {
          const active = item.route === activeRoute;

          return (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                active && styles.activeMenuItem,
                !item.route && styles.disabledMenuItem,
              ]}
              onPress={() => item.route && navigation.navigate(item.route)}
              disabled={!item.route}
            >
              <Text
                style={[
                  styles.menuText,
                  active && styles.activeMenuText,
                  !item.route && styles.disabledMenuText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate("Role")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 230,
    backgroundColor: "#062766",
    paddingTop: 30,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  logo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 30,
  },
  menuContainer: {
    gap: 8,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  activeMenuItem: {
    backgroundColor: "#2563eb",
  },
  disabledMenuItem: {
    opacity: 0.5,
  },
  menuText: {
    color: "#dbeafe",
    fontWeight: "700",
    fontSize: 15,
  },
  activeMenuText: {
    color: "#fff",
  },
  disabledMenuText: {
    color: "#94a3b8",
  },
  logoutButton: {
    marginTop: "auto",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "800",
  },
});