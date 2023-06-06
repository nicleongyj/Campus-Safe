import { View, Text, StyleSheet } from "react-native";
// import { useState } from "react";
import "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { connect } from "react-redux";


import map from "../../assets/map.png";
import lightbulb from "../../assets/lightbulb.png";
import carCrash from "../../assets/carCrash.png";
import trackRecord from "../../assets/trackRecord.png";

function Homepage() {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.header}>Welcome!</Text>
        <Text style={styles.subheader}>What would you like to do today?</Text>
      </View>

      <View style={styles.bottomContainer}>
        <Link href="reportForm" style={styles.link}>
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

        <Button
          mode="elevated"
          style={styles.button}
          buttonColor="#D6E7FF"
          textColor="black"
          labelStyle={styles.buttonContent}
          contentStyle={{ width: 350, height: 100 }}
          onPress={() => console.log("pressed")}
          icon={lightbulb}
        >
          <Text style={{ fontSize: 20 }}>Report infrastructure issues </Text>
        </Button>

        <Button
          mode="elevated"
          style={styles.button}
          buttonColor="#B0EFD1"
          textColor="black"
          labelStyle={styles.buttonContent}
          contentStyle={{ width: 350, height: 100 }}
          onPress={() => console.log("pressed")}
          icon={map}
        >
          <Text style={{ fontSize: 20 }}>Live Map</Text>
        </Button>

        <Button
          mode="elevated"
          style={styles.button}
          buttonColor="#D8B4FF"
          textColor="black"
          labelStyle={styles.buttonContent}
          contentStyle={{ width: 350, height: 100 }}
          onPress={() => console.log("pressed")}
          icon={trackRecord}
        >
          <Text style={{ fontSize: 20 }}>Track your reports</Text>
        </Button>
      </View>
    </SafeAreaView>
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
    backgroundColor: "white",
  },
  topContainer: {
    flex: 1,
    padding: 10,
    marginLeft: 5,
    backgroundColor: "white",
    justifyContent: "center",
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
  link: {
    width: 350,
    height: 100,
  },
  button: {
    width: 350,
    height: 100,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth:1,
    borderColor:'black',
  },
  buttonContent: {
    fontWeight: "bold",
    fontSize: 25,
  },
});

export default connect(mapStateToProps)(Homepage);
