import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

import { Button } from "react-native-paper";
import { connect } from "react-redux";
import { Link } from "expo-router";

import manageEvent from "../../assets/manageEvent.png";
import loginBackground from "../../assets/loginBackground.jpg";
import recordIcon from "../../assets/manageRecord.png";
import tickIcon from "../../assets/tick.png";

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
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Link href="/ViewVerifiedReports" style={styles.link}>
              <Button
                mode="elevated"
                style={styles.button}
                buttonColor="powderblue"
                textColor="black"
                labelStyle={styles.buttonContent}
                contentStyle={{ width: 350, height: 100 }}
                icon={recordIcon}
              >
                <Text style={{ fontSize: 20 }}>Manage verified reports</Text>
              </Button>
            </Link>
          </View>

          <View style={styles.buttonContainer}>
            <Link href="/ViewReports" style={styles.link}>
              <Button
                mode="elevated"
                style={styles.button}
                buttonColor="#D6E7FF"
                textColor="black"
                labelStyle={styles.buttonContent}
                contentStyle={{ width: 350, height: 100 }}
                icon={tickIcon}
              >
                <Text style={{ fontSize: 18 }}>View/Approve new reports</Text>
              </Button>
            </Link>
          </View>

          <View style={styles.buttonContainer}>
            <Link href="/ViewEvents" style={styles.link}>
              <Button
                mode="elevated"
                style={styles.button}
                buttonColor="#BDFCC9"
                textColor="black"
                labelStyle={styles.buttonContent}
                contentStyle={{ width: 350, height: 100 }}
                icon={manageEvent}
              >
                <Text style={{ fontSize: 18 }}>Manage NUS Events</Text>
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
  },
  topContainer: {
    flex: 1,
    padding: 10,
    marginLeft: 5,
    justifyContent: "center",
    marginTop: 50,
    alignItems: "center",
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
    borderWidth: 1,
    borderColor: "black",
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
