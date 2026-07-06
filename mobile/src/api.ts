import { Platform } from "react-native";
import Constants from "expo-constants";

// If you run the app on a physical device, set your development machine's local IP
// address here only if you cannot use `extra.apiBaseUrl` in app.json.
// Example: http://192.168.1.100:4000/api/v1
// NOTE: ensure this matches the backend host on your network.
const PHYSICAL_DEVICE_API_BASE = "";

const getRawExpoHost = () => {
  const expoConfig = Constants.expoConfig as any;
  const manifest2 = Constants.manifest2 as any;
  const manifest = Constants.manifest as any;

  return (
    (expoConfig?.hostUri as string) ||
    (manifest2?.hostUri as string) ||
    (manifest?.hostUri as string) ||
    (manifest2?.debuggerHost as string) ||
    (manifest?.debuggerHost as string) ||
    (manifest2?.bundleUrl as string) ||
    (manifest?.bundleUrl as string) ||
    null
  );
};

const getHostFromExpoConstants = () => {
  const rawHost = getRawExpoHost();
  if (!rawHost || typeof rawHost !== "string") {
    return null;
  }

  const normalized = rawHost
    .trim()
    .replace(/^.*@/, "")
    .replace(/^[^/]+:\/\//, "")
    .replace(/\/.*$/, "");

  return normalized.split(/[:/]/)[0] || null;
};

const getApiBase = () => {
  // Android emulator must use 10.0.2.2 to reach the host (this takes priority)
  const androidEmulatorApiBase = "http://192.168.210.10:4000/api/v1";
  if (Platform.OS === "android" && !Constants.isDevice) {
    return androidEmulatorApiBase;
  }

  const expoConfig = Constants.expoConfig as any;
  const manifest2 = Constants.manifest2 as any;
  const manifest = Constants.manifest as any;
  const explicitApiBase =
    expoConfig?.extra?.apiBaseUrl ||
    manifest2?.extra?.apiBaseUrl ||
    manifest?.extra?.apiBaseUrl;

  if (explicitApiBase) {
    return explicitApiBase;
  }

  if (Constants.isDevice) {
    const expoHost = getHostFromExpoConstants();
    const isExpoTunnelHost = expoHost ? /(^|\.)exp\.host$|(^|\.)expo\.dev$|(^|\.)expo\.io$/i.test(expoHost) : false;
    if (expoHost && !isExpoTunnelHost) {
      return `http://${expoHost}:4000/api/v1`;
    }
  }

  if (PHYSICAL_DEVICE_API_BASE) {
    return PHYSICAL_DEVICE_API_BASE;
  }

  if (Platform.OS === "web") {
    const host = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
    return `http://${host}:4000/api/v1`;
  }

  if (Platform.OS === "android") {
    return androidEmulatorApiBase;
  }

  return "http://localhost:4000/api/v1";
};

const API_BASE = getApiBase();
console.log(`API base URL: ${API_BASE}`);

export interface LoginResponse {
  token: string;
  user: { id: string; role: string; name?: string; email?: string };
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
  try {
    const url = `${API_BASE}${path}`;
    console.log(`Requesting ${url}`);

    const res = await fetch(url, {
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
  } catch (error: any) {
    throw new Error(`Network request failed to ${API_BASE}${path}: ${error?.message || error}`);
  }
}

export function loginPassword(email: string, password: string): Promise<LoginResponse> {
  return req("/auth/login/password", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function loginBiometric(userIdentifier: string, biometricHash: string): Promise<LoginResponse> {
  return req("/auth/login/biometric", {
    method: "POST",
    body: JSON.stringify({ userIdentifier, biometricHash })
  });
}

export function registerUser(name: string, email: string, phone: string, password: string, role: string) {
  return req<{ message: string; user: { id: string; role: string } }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, phone, password, role })
  });
}

export function resetPassword(email: string, newPassword: string) {
  return req<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, newPassword })
  });
}

export function registerBiometric(userId: string, biometricHash: string) {
  return req<{ success: boolean }>("/biometric/register", {
    method: "POST",
    body: JSON.stringify({ userId, biometricHash })
  });
}

export function getUsers(token: string) {
  return req<{ users: Array<{ id: string; name: string; email: string; role: string; phone?: string; biometric_registered: boolean; is_active: boolean }> }>("/users", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function toggleUserActive(token: string, userId: string, isActive: boolean) {
  return req<{ user: { id: string; is_active: boolean } }>(`/users/${userId}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ isActive })
  });
}

export function createDelivery(token: string, payload: CreateDeliveryRequest) {
  return req<{ id: string; trackingNo: string; status: string }>("/deliveries", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
}

export function assignDelivery(token: string, deliveryId: string, courierId?: string) {
  const body = courierId ? JSON.stringify({ courierId }) : undefined;
  return req<{ id: string; courierId: string; status: string }>(`/deliveries/${deliveryId}/assign`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    ...(body ? { body } : {})
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
