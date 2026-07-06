export type Screen =
  | "Splash"
  | "Role"
  | "Register"
  | "Biometric"
  | "Login"
  | "ResetPassword"
  | "Dashboard"
  | "CustomerDashboard"
  | "AdminDashboard"
  | "UsersScreen"
  | "ReportsScreen"
  | "GalleryManager"
  | "PlaceOrder"
  | "OrderDeliveryDetails"
  | "Deliveries"
  | "DeliveryDetails"
  | "RecipientVerification"
  | "VerificationSuccess"
  | "ProofOfDelivery"
  | "Profile"
  | "CustomerProfile";

export type RootStackParamList = {
  Splash: undefined;
  Role: undefined;
  Register: { role?: "customer" | "courier" | "admin" };
  Login: { role?: "customer" | "courier" | "admin" };
  ResetPassword: undefined;
  Biometric: { userId: string; role: UserRole };
  Dashboard: undefined;
  CustomerDashboard: { orderPlaced?: true; orderId?: string } | undefined;
  AdminDashboard: undefined;
  UsersScreen: undefined;
  AdminCouriers: undefined;
  AdminDeliveries: undefined;
  ReportsScreen: undefined;
  GalleryManager: undefined;
  PlaceOrder: undefined;
  OrderDeliveryDetails: { orderId: string; item: string; description?: string; category?: string; estimatedWeight?: string };
  Deliveries: undefined;
  DeliveryDetails: { orderId: string };
  RecipientVerification: { orderId: string };
  VerificationSuccess: { orderId: string };
  ProofOfDelivery: { orderId: string };
  Profile: undefined;
  CustomerProfile: undefined;
};

export type UserRole = "courier" | "customer" | "admin";

export type AuthUser = {
  id: string;
  role: UserRole;
  name?: string;
  email?: string;
  token: string;
};

export type DeliveryRecord = {
  id: string;
  orderId: string;
  recipient: string;
  address: string;
  status: string;
  time: string;
};

export type CustomerOrder = {
  id: string;
  orderId: string;
  status: "Delivered" | "Pending" | "Cancelled";
  date: string;
  tracking: string;
  address: string;
  item: string;
};

export type PlaceOrderForm = {
  item: string;
  description: string;
  category: string;
  estimatedWeight: string;
};

export type DeliveryDetails = {
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  city: string;
  postalCode: string;
  specialInstructions: string;
};