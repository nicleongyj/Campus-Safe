import { Stack } from "expo-router";

export default function StaffLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="ViewReports"
        options={{ title: "View/Approve new reports" }}
      />
      <Stack.Screen
        name="ViewVerifiedReports"
        options={{ title: "Manage verified reports" }}
      />

      <Stack.Screen
        name="SelectMap"
        options={{ title: "Select location" }}
      />
      <Stack.Screen
        name="VerifyForm"
        options={{ title: "" }}
      />
      <Stack.Screen
        name="ViewEvents"
        options={{ title: "View all NUS events" }}
      />
    </Stack>
  );
}
