import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
import { supabase } from "../../lib/supabase";

import { connect } from "react-redux";
import { setUserType, setUserEmail } from "../../redux/store";
import { TextInput } from "react-native-paper";

import loginBackground from '../../assets/loginBackground.jpg'

function Profile({ setUserType, userType }) {
  const handleLogOut = () => {
    setUserType("");
    supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={loginBackground}
        resizeMode="stretch"
        style={{ flex: 1 }}
      >
      <View style={styles.topContainer}>
        <Text style={styles.header}>Profile page</Text>
      </View>

      <View style={styles.middleContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.text}>Account type:</Text>
          <TextInput
            mode="flat"
            style={styles.textInput}
            disabled={true}
            placeholder="Account type"
            textColor="black"
          >
            {userType}
          </TextInput>
        </View>

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
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    flexDirection: "column",
  },
  topContainer: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginTop: 100,
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  middleContainer: {
    flex: 5,
    alignItems: "center",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  bottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: "10%",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    borderColor: "black",
    borderWidth: 0,
    width: "70%",
    fontWeight: "bold",
  },
  textInput: {
    backgroundColor: "whitesmoke",
    height: 25,
    width: 300,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state) => ({
  userType: state.userType,
});

export default connect(mapStateToProps, { setUserType })(Profile);