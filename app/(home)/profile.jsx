import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { supabase } from "../../lib/supabase";

import { connect } from "react-redux";
import { setUserType } from "../../redux/store";
import { SafeAreaView } from "react-native-safe-area-context";

function Profile({ setUserType }) {
  const handleLogOut = () => {
    setUserType("");
    supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.header}>Profile page</Text>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          onPress={handleLogOut}
          mode="elevated"
          style={styles.button}
          buttonColor="black"
          textColor="white"
        >
          Log out
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  topContainer: {
    flex: 5,
    alignItems: "center",
    padding: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  bottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: "10%",
  },
  button: {
    borderColor: "black",
    borderWidth: 0,
    width: "70%",
    fontWeight: "bold",
  },
});

export default connect(null, { setUserType })(Profile);
