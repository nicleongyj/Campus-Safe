import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="Login" options={{ title: "Welcome to CampusSafe" }} />
      <Stack.Screen name="Register" options={{ title: "Register your account" }}/>
      <Stack.Screen name="Stafflogin" options={{ title: "Staff Login" }}/>
    </Stack>
  );
}
