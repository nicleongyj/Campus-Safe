import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Welcome to CampusSafe" }} />
      <Stack.Screen
        name="register"
        options={{ title: "Register your account" }}
      />
      <Stack.Screen name="Stafflogin" options={{ title: "Staff Login" }} />

      {/* //     headerStyle: {
        //       backgroundColor: "blue",
        //     },
        //     headerTintColor: "white",
        //     headerTitleStyle: {
        //       fontWeight: "bold",
        //     },
        //   }} */}
    </Stack>
  );
}
