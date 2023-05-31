import { View, Text } from "react-native";
import { useState } from "react";
import "react-native-gesture-handler";
import { Button } from "react-native-paper";
import {Link} from "expo-router";

export default function Homepage() {
  const [check, setCheck] = useState("false");

  const handlePress = () => {
    setCheck(check +"a");
  };

  const Bold = ({ children }) => (
    <Text style={{ fontWeight: "bold" }}>{children}</Text>
  );

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Homepage</Text>
      <Button mode="contained" onPress={handlePress}>
        activate
      </Button>
      <Link href="../(staffhome)/staffhome" style={{ marginTop: 15 }}>
        <Button
          mode="contained"
          buttonColor="powderblue"
          textColor="black"
        >
          Login
        </Button>
      </Link>

    </View>
  );
}
