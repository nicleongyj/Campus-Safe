import { View, Text, StyleSheet, ImageBackground } from "react-native";
import "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { connect } from "react-redux";
import { Link } from "expo-router";

import loginBackground from "../../assets/loginBackground.jpg";

function Homepage() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={loginBackground}
        resizeMode="stretch"
        style={{ flex: 1 }}
      >
      <View style={styles.topContainer}>
        <Text style={styles.header}>Staff home</Text>
        {/* <Text style={styles.subheader}>What would you like to do today?</Text> */}
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <Link href="/Staffhome" style={styles.link}>
            <Button
              mode="elevated"
              style={styles.button}
              buttonColor="powderblue"
              textColor="black"
              labelStyle={styles.buttonContent}
              contentStyle={{ width: 350, height: 100 }}
              onPress={() => console.log("pressed")}
            >
              <Text style={{ fontSize: 20 }}>Manage ongoing incidents</Text>
            </Button>
          </Link>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="/StaffView" style={styles.link}>
            <Button
              mode="elevated"
              style={styles.button}
              buttonColor="#D6E7FF"
              textColor="black"
              labelStyle={styles.buttonContent}
              contentStyle={{ width: 350, height: 100 }}
            >
              <Text style={{ fontSize: 18 }}>View/Approve new reports</Text>
            </Button>
          </Link>
        </View>
      </View>
      </ImageBackground>
    </View>
  );
}

const mapStateToProps = (state) => ({
  userType: state.userType,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // alignItems: "stretch",
  },
  topContainer: {
    flex: 1,
    padding: 10,
    marginLeft: 5,
    justifyContent: "center",
    marginTop: 50,
  },
  bottomContainer: {
    flex: 5,
    alignItems: "center",
  },
  header: {
    fontSize: 35,
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    width: 350,
    height: 100,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    fontWeight: "bold",
    fontSize: 25,
    },
  link: {
    width: 350,
    height: 100,
    zIndex: 2,
  },
  buttonContainer: {
    marginBottom: 35,
  },
});

export default connect(mapStateToProps)(Homepage);
