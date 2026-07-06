import React, { createContext, useContext, useMemo, useState } from "react";
import { loginPassword, loginBiometric } from "../api";
import type { AuthUser, UserRole } from "../types";

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  loginWithBiometric: (userId: string, biometricHash: string) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    const response = await loginPassword(email, password);
    const authUser: AuthUser = {
      id: response.user.id,
      role: response.user.role as UserRole,
      name: response.user.name,
      email,
      token: response.token,
    };
    setUser(authUser);
    return authUser;
  };

  const loginWithBiometric = async (userIdentifier: string, biometricHash: string) => {
    const response = await loginBiometric(userIdentifier, biometricHash);
    const authUser: AuthUser = {
      id: response.user.id,
      role: response.user.role as UserRole,
      name: response.user.name,
      email: response.user.email,
      token: response.token,
    };
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, loginWithBiometric, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
