import { Tabs } from "expo-router";
import { Text } from "react-native";

import { connect } from "react-redux";

function HomeLayout({ userType }) {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <Text>🏠</Text>,
          headerTitle: "CampusSafe",
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleStyle: {
            color: "white",
            fontWeight: "bold",
            fontSize: 25,
          },
          tabBarActiveTintColor: "dodgerblue",
          tabBarLabelStyle: {
            fontWeight: "bold",
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => <Text>👤</Text>,
          headerTitle: "CampusSafe",
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleStyle: {
            color: "white",
            fontWeight: "bold",
            fontSize: 25,
          },
          tabBarActiveTintColor: "dodgerblue",
          tabBarLabelStyle: {
            fontWeight: "bold",
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Staffhome"
        options={{
          tabBarLabel: "Staff Home",
          tabBarIcon: () => <Text>🛠️</Text>,
          href: userType == "Student" ? null : "/Staffhome",
          headerTitle: "CampusSafe",
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleStyle: {
            color: "white",
            fontWeight: "bold",
            fontSize: 25,
          },
          tabBarActiveTintColor: "dodgerblue",
          tabBarLabelStyle: {
            fontWeight: "bold",
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="IncidentForm"
        options={{
          href: null,
          headerTitle: "Report an accident",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 25,
            color: "orangered",
          },
        }}
      />
      <Tabs.Screen
        name="InfrastructureForm"
        options={{
          href: null,
          headerTitle: "Report an infrastructure issue",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 25,
            color: "orangered",
          },
        }}
      />
      <Tabs.Screen
        name="Map"
        options={{
          href: null,
          headerTitle: "Incident Map",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 25,
            color: "black",
          },
        }}
      />
      <Tabs.Screen
        name="TrackReports"
        options={{
          href: null,
          headerTitle: "Report tracker",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 25,
            color: "black",
          },
        }}
      />
    </Tabs>
  );
}

const mapStateToProps = (state) => ({
  userType: state.userType,
});

export default connect(mapStateToProps)(HomeLayout);
