import { useRouter, useSegments } from "expo-router";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase, getUserRole } from "../lib/supabase";

import { connect } from "react-redux";
import { setUserType } from "../redux/store";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) {
      router.replace("/Login");
    } else if (user && inAuthGroup) {
        router.replace("/");
      }
    }, [user, segments, router]);
}

function AuthProvider({ children, setUserType }) {
  const [user, setUser] = useState(null);

  useProtectedRoute(user);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session.user);
        const userRole = await getUserRole();
        setUserType(userRole);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const AuthenticateProvider = connect(null, { setUserType })(
  AuthProvider
);
