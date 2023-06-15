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