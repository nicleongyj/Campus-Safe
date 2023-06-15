import { Stack } from "expo-router";

export default function StaffLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="StaffView"
        options={{ title: "View/Approve new reports" }}
      />

      <Stack.Screen
        name="NewIncidentReps"
        options={{ title: "New incident reports" }}
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
