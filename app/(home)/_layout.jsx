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
            fontWeight: 'bold',
            fontSize: 25,
          },
          tabBarActiveTintColor: "dodgerblue",
          tabBarLabelStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => <Text>👤</Text>,
          headerTitle: "CampusSafe",
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleStyle: {
            color: "white",
            fontWeight: 'bold',
            fontSize: 25,
          },
          tabBarActiveTintColor: "dodgerblue",
          tabBarLabelStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Tabs.Screen
        name="Staffhome"
        options={{
          tabBarLabel: "Staff Home",
          tabBarIcon: () => <Text>🛠️</Text>,
          href: userType == "student" ? null : "/Staffhome",
          headerTitle: "CampusSafe",
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleStyle: {
            color: "white",
            fontWeight: 'bold',
            fontSize: 25,
          },
          tabBarActiveTintColor: "dodgerblue",
          tabBarLabelStyle: {
            fontWeight: "bold",
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
