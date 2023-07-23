import { View, Text, StyleSheet, ImageBackground } from "react-native";
import "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";

import event from "../../assets/event.png";
import map from "../../assets/map.png";
import lightbulb from "../../assets/lightbulb.png";
import carCrash from "../../assets/carCrash.png";
import trackRecord from "../../assets/trackRecord.png";
import loginBackground from "../../assets/loginBackground.jpg";
import { ScrollView } from "react-native-gesture-handler";

function Homepage() {
  const { newRegister } = useLocalSearchParams();
  const toast = useToast();
  const navigation = useNavigation();
  useEffect(() => {
    if (newRegister == "true") {
      toast.show("Account Registered");
    }
  }, []);
  const navigateTo = (destination) => {
    navigation.navigate(destination);
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={loginBackground}
        resizeMode="stretch"
        style={{ flex: 1 }}
      >
        <ScrollView style={{flex:1}}>
          <View style={styles.topContainer}>
            <Text style={styles.header}>Welcome!</Text>
            <Text style={styles.subheader}>
              What would you like to do today?  
            </Text>
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.buttonContainer}>
                <Button
                  mode="elevated"
                  style={styles.button}
                  buttonColor="powderblue"
                  textColor="black"
                  labelStyle={styles.buttonContent}
                  contentStyle={{ width: 350, height: 100 }}
                  icon={carCrash}
                  testID="incidentButton"
                  onPress={() => navigateTo("IncidentForm")}
                >
                  <Text style={{ fontSize: 20 }}>Report an accident</Text>
                </Button>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                  mode="elevated"
                  style={styles.button}
                  buttonColor="powderblue"
                  textColor="black"
                  labelStyle={styles.buttonContent}
                  contentStyle={{ width: 350, height: 100 }}
                  icon={lightbulb}
                  testID="infraButton"
                  onPress={() => navigateTo("InfrastructureForm")}
                >
                  <Text style={{ fontSize: 20 }}>
                    Report infrastructure issues{" "}
                  </Text>
                </Button>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                  mode="elevated"
                  style={styles.button}
                  // buttonColor="#B0EFD1"
                  buttonColor="#FFDAB9"
                  textColor="black"
                  labelStyle={styles.buttonContent}
                  contentStyle={{ width: 350, height: 100 }}
                  icon={map}
                  testID="mapButton"
                  onPress={() => navigateTo("Map")}

                >
                  <Text style={{ fontSize: 20 }}>Live Incidents Map</Text>
                </Button>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                  mode="elevated"
                  style={styles.button}
                  buttonColor="#FFDAB9"
                  textColor="black"
                  labelStyle={styles.buttonContent}
                  contentStyle={{ width: 350, height: 100 }}
                  icon={event}
                  testID="eventMapButton"
                  onPress={() => navigateTo("EventMap")}

                >
                  <Text style={{ fontSize: 20 }}>NUS Events Map</Text>
                </Button>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                  mode="elevated"
                  style={styles.button}
                  buttonColor="#D8B4FF"
                  textColor="black"
                  labelStyle={styles.buttonContent}
                  contentStyle={{ width: 350, height: 100 }}
                  icon={trackRecord}
                  testID="trackButton"
                  onPress={() => navigateTo("TrackReports")}

                >
                  <Text style={{ fontSize: 20 }}>Track your reports</Text>
                </Button>
            </View>
          </View>
        </ScrollView>
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
    marginTop: "20%",
    marginBottom:"10%",
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
    marginBottom: "5%",
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
    // marginTop:'2%',
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
