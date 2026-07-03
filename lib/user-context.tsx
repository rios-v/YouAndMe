"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type UserType = "Arthur" | "Fabíola" | null;

interface UserContextType {
  user: UserType;
  setUser: (user: UserType) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("nosdois_user") as UserType;
    if (savedUser === "Arthur" || savedUser === "Fabíola") {
      setUserState(savedUser);
    }
    setIsLoading(false);
  }, []);

  const setUser = (newUser: UserType) => {
    if (newUser) {
      localStorage.setItem("nosdois_user", newUser);
    } else {
      localStorage.removeItem("nosdois_user");
    }
    setUserState(newUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
