import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useAuth } from "../context/AuthContext";

import SplashScreen from "../screens/auth/SplashScreen";
import RoleScreen from "../screens/auth/RoleScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import BiometricScreen from "../screens/auth/BiometricScreen";
import DashboardScreen from "../courier/DashboardScreen";
import CustomerDashboardScreen from "../customer/CustomerDashboardScreen";
import PlaceOrderScreen from "../customer/PlaceOrderScreen";
import OrderDeliveryDetailsScreen from "../customer/OrderDeliveryDetailsScreen";
import DeliveriesScreen from "../courier/DeliveriesScreen";
import DeliveryDetailsScreen from "../courier/DeliveryDetailsScreen";
import RecipientVerificationScreen from "../courier/RecipientVerificationScreen";
import VerificationSuccessScreen from "../courier/VerificationSuccessScreen";
import ProofOfDeliveryScreen from "../courier/ProofOfDeliveryScreen";
import ProfileScreen from "../courier/ProfileScreen";
import CustomerProfileScreen from "../customer/CustomerProfileScreen";
import AdminDashboard from "../screens/admin/AdminDashboard";
import UsersScreen from "../screens/admin/UsersScreen";
import AdminCouriers from "../screens/admin/CouriersScreen";
import AdminDeliveries from "../screens/admin/AdminDeliveriesScreen";
import ReportsScreen from "../screens/admin/ReportsScreen";
import GalleryManager from "../screens/admin/GalleryManager";
import NavBar from "../components/NavBar";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          header: (props) => <NavBar {...props} />,
        })}
      >
        {!user ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Role" component={RoleScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Biometric" component={BiometricScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="UsersScreen" component={UsersScreen} />
            <Stack.Screen name="AdminCouriers" component={AdminCouriers} />
            <Stack.Screen name="AdminDeliveries" component={AdminDeliveries} />
            <Stack.Screen name="ReportsScreen" component={ReportsScreen} />
            <Stack.Screen name="GalleryManager" component={GalleryManager} />
            {/* Unauthorized Access: Customer Dashboard */}
            <Stack.Screen name="CustomerDashboard" component={CustomerDashboardScreen} />
            <Stack.Screen name="PlaceOrder" component={PlaceOrderScreen} />
            <Stack.Screen name="OrderDeliveryDetails" component={OrderDeliveryDetailsScreen} />
            <Stack.Screen name="CustomerProfile" component={CustomerProfileScreen} />
            {/* Unauthorized Access: Courier Dashboard */}
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Deliveries" component={DeliveriesScreen} />
            <Stack.Screen name="DeliveryDetails" component={DeliveryDetailsScreen} />
            <Stack.Screen name="RecipientVerification" component={RecipientVerificationScreen} />
            <Stack.Screen name="VerificationSuccess" component={VerificationSuccessScreen} />
            <Stack.Screen name="ProofOfDelivery" component={ProofOfDeliveryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : user.role === "admin" ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="UsersScreen" component={UsersScreen} />
            <Stack.Screen name="AdminCouriers" component={AdminCouriers} />
            <Stack.Screen name="AdminDeliveries" component={AdminDeliveries} />
            <Stack.Screen name="ReportsScreen" component={ReportsScreen} />
            <Stack.Screen name="GalleryManager" component={GalleryManager} />
            <Stack.Screen name="Role" component={RoleScreen} />
          </>
        ) : user.role === "courier" ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Deliveries" component={DeliveriesScreen} />
            <Stack.Screen name="DeliveryDetails" component={DeliveryDetailsScreen} />
            <Stack.Screen name="RecipientVerification" component={RecipientVerificationScreen} />
            <Stack.Screen name="VerificationSuccess" component={VerificationSuccessScreen} />
            <Stack.Screen name="ProofOfDelivery" component={ProofOfDeliveryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="CustomerDashboard" component={CustomerDashboardScreen} />
            <Stack.Screen name="PlaceOrder" component={PlaceOrderScreen} />
            <Stack.Screen name="OrderDeliveryDetails" component={OrderDeliveryDetailsScreen} />
            <Stack.Screen name="CustomerProfile" component={CustomerProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}