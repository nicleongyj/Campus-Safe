import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { supabase } from "../../lib/supabase";

import { connect } from "react-redux";
import { setUserType } from "../../redux/store";

function Profile({ setUserType }) {
  const handleLogOut = () => {
    setUserType('');
    supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text>Profile page</Text>
      <Button onPress={handleLogOut}>log out</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default connect(null, { setUserType })(Profile);
