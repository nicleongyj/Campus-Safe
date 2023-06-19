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
        name="selectMap"
        options={{ title: "Select location of incident" }}
      />
      <Stack.Screen
        name="verifyForm"
        options={{ title: "Verify an incident" }}
      />

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
