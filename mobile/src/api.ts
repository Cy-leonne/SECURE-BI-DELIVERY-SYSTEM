import { Platform } from "react-native";

// If you run the app on a physical device, replace the override below with your
// development machine's local IP address, for example: http://192.168.1.100:4000/api/v1
const PHYSICAL_DEVICE_API_BASE = "";

const getApiBase = () => {
  if (PHYSICAL_DEVICE_API_BASE) {
    return PHYSICAL_DEVICE_API_BASE;
  }

  if (Platform.OS === "web") {
    const host = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
    return `http://${host}:4000/api/v1`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:4000/api/v1";
  }

  return "http://localhost:4000/api/v1";
};

const API_BASE = getApiBase();

export interface LoginResponse {
  token: string;
  user: { id: string; role: string };
}

export type CourierDelivery = {
  id: string;
  trackingNo: string;
  customerId: string;
  courierId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomerDelivery = {
  id: string;
  trackingNo: string;
  customerId: string;
  courierId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export interface CreateDeliveryRequest {
  trackingNo: string;
  customerId: string;
  item?: string;
  description?: string;
  category?: string;
  estimatedWeight?: string;
  recipientName?: string;
  recipientPhone?: string;
  deliveryAddress?: string;
  city?: string;
  postalCode?: string;
  specialInstructions?: string;
}

export type LabProofOfDelivery = {
  id: string;
  deliveryId: string;
  recipientId: string;
  verified: boolean;
  timestamp: string;
};

async function req<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    },
    ...init
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message ?? "Request failed");
  }
  return data as T;
}

export function loginPassword(email: string, password: string): Promise<LoginResponse> {
  return req("/auth/login/password", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function createDelivery(token: string, payload: CreateDeliveryRequest) {
  return req<{ id: string; trackingNo: string; status: string }>("/deliveries", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
}

export function assignDelivery(token: string, deliveryId: string, courierId: string) {
  return req<{ id: string; courierId: string; status: string }>(`/deliveries/${deliveryId}/assign`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ courierId })
  });
}

export function getCourierDeliveries(token: string, courierId: string) {
  return req<{ deliveries: CourierDelivery[] }>(`/deliveries/courier/${courierId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function getCustomerDeliveries(token: string, customerId: string) {
  return req<{ deliveries: CustomerDelivery[] }>(`/deliveries/customer/${customerId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function getAvailableDeliveries(token: string) {
  return req<{ deliveries: CourierDelivery[] }>(`/deliveries/available/pending`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function getDeliveryByTracking(token: string, trackingNo: string) {
  return req<CourierDelivery>(`/deliveries/tracking/${trackingNo}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function startDelivery(token: string, deliveryId: string) {
  return req<CourierDelivery>(`/deliveries/${deliveryId}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function verifyRecipient(token: string, deliveryId: string, recipientId: string, biometricMatched: boolean) {
  return req<{ proofRecorded: boolean }>(`/deliveries/${deliveryId}/verify-recipient`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ recipientId, biometricMatched })
  });
}

export function confirmDelivery(token: string, deliveryId: string) {
  return req<LabProofOfDelivery>(`/deliveries/${deliveryId}/confirm`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function getProofOfDelivery(token: string, deliveryId: string) {
  return req<LabProofOfDelivery>(`/deliveries/${deliveryId}/pod`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function scanDelivery(token: string, trackingNo: string) {
  return getDeliveryByTracking(token, trackingNo);
}
