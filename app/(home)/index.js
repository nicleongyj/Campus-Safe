import { View, Text, StyleSheet, ImageBackground } from "react-native";
import "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import { connect } from "react-redux";

import map from "../../assets/map.png";
import lightbulb from "../../assets/lightbulb.png";
import carCrash from "../../assets/carCrash.png";
import trackRecord from "../../assets/trackRecord.png";
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
          <Text style={styles.header}>Welcome!</Text>
          <Text style={styles.subheader}>What would you like to do today?</Text>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Link href="/incidentForm" style={styles.link}>
              <Button
                mode="elevated"
                style={styles.button}
                buttonColor="powderblue"
                textColor="black"
                labelStyle={styles.buttonContent}
                contentStyle={{ width: 350, height: 100 }}
                icon={carCrash}
              >
                <Text style={{ fontSize: 20 }}>Report an accident</Text>
              </Button>
            </Link>
          </View>

          <View style={styles.buttonContainer}>
            <Link href="/infrastructureForm" style={styles.link}>
              <Button
                mode="elevated"
                style={styles.button}
                buttonColor="#D6E7FF"
                textColor="black"
                labelStyle={styles.buttonContent}
                contentStyle={{ width: 350, height: 100 }}
                icon={lightbulb}
              >
                <Text style={{ fontSize: 20 }}>
                  Report infrastructure issues{" "}
                </Text>
              </Button>
            </Link>
          </View>

          <View style={styles.buttonContainer}>
            <Link href="/map" style={styles.link}>
              <Button
                mode="elevated"
                style={styles.button}
                buttonColor="#B0EFD1"
                textColor="black"
                labelStyle={styles.buttonContent}
                contentStyle={{ width: 350, height: 100 }}
                icon={map}
              >
                <Text style={{ fontSize: 20 }}>Live Map</Text>
              </Button>
            </Link>
          </View>

          <View style={styles.buttonContainer}>
            <Link href="/TrackReports" style={styles.link}>
              <Button
                mode="elevated"
                style={styles.button}
                buttonColor="#D8B4FF"
                textColor="black"
                labelStyle={styles.buttonContent}
                contentStyle={{ width: 350, height: 100 }}
                icon={trackRecord}
              >
                <Text style={{ fontSize: 20 }}>Track your reports</Text>
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
    backgroundColor: "white",
  },
  topContainer: {
    marginTop: 50,
    flex: 1,
    padding: 10,
    marginLeft: 5,
    justifyContent: "center",
  },
  bottomContainer: {
    flex: 5,
    alignItems: "center",
  },
  buttonContainer: {
    marginBottom: 35,
  },
  header: {
    fontSize: 35,
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    width: 350,
    height: 100,
    zIndex: 2,
  },
  button: {
    width: 350,
    height: 100,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    zIndex: 1,
  },
  buttonContent: {
    fontWeight: "bold",
    fontSize: 25,
  },
});

export default connect(mapStateToProps)(Homepage);
