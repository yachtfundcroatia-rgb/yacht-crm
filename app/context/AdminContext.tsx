"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Admin = {
  id: string;
  role: string;
};

type AdminContextType = {
  admin: Admin | null;
  token: string | null;
  setAdmin: (admin: Admin | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  function setToken(token: string | null) {
    if (token) {
      localStorage.setItem("admin_token", token);
    } else {
      localStorage.removeItem("admin_token");
    }

    setTokenState(token);
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setTokenState(null);
    setAdmin(null);
  }

  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (stored) {
      setTokenState(stored);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        admin,
        token,
        setAdmin,
        setToken,
        logout
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }

  return context;
}