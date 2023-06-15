import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { insertData } from "../../lib/supabase";
import { useRouter } from "expo-router";

export default function VerifyForm() {
  const params = useLocalSearchParams();
  const { latitude, longitude } = params;
  const [incidentType, setIncidentType] = useState("");
  const [incidentDetails, setIncidentDetails] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const lat = latitude == 103.77 ? "null" : latitude;
  const long = longitude == 1.29 ? "null" : longitude;

  const router = useRouter();

  const formData = {
    type: incidentType,
    details: incidentDetails,
    latitude: lat,
    longitude: long,
  };

  const handleSubmit = async () => {
    if (lat == "null" || long == "null") {
        setErrMsg("Select incident location on map!");
        return;
    }
    if (incidentType == "") {
        setErrMsg("Fill in incident type!");
        return;
    }
    if (incidentDetails == "") {
        setErrMsg("Fill in incident details!");
        return;
    }

    //SUPABASE LOGIC
  const error = await insertData(formData, "verifiedincidents");
    console.log(error);
    if (!error) {
      Alert.alert(
        "Incident verified",
        "View verified reports in 'Manage ongoing incidents'",
        [{ text: "OK", onPress: () => {
          console.log("OK Pressed");
          router.replace("/NewIncidentReps")
        }}]
      );
    } else {
      Alert.alert("Error", "Please try again!", [
        { text: "OK", onPress: () => console.log("Error, OK Pressed") },
      ]);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Fill up incident details</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>Latitude:</Text>
          <TextInput mode="flat" disabled={true} style={styles.textInput}>
            {lat}
          </TextInput>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>Longitude:</Text>
          <TextInput mode="flat" disabled={true} style={styles.textInput}>
            {long}
          </TextInput>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>Type of incident:</Text>
          <TextInput
            mode="flat"
            style={styles.textInput}
            placeholder="Enter incident type"
            placeholderTextColor="grey"
            textColor="black"
            value={incidentType}
            onChangeText={setIncidentType}
          />
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>Incident description:</Text>
          <TextInput
            mode="flat"
            style={{ backgroundColor: "whitesmoke" }}
            placeholder="Details of incident"
            placeholderTextColor="grey"
            textColor="black"
            value={incidentDetails}
            onChangeText={setIncidentDetails}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.error}>
          {" "}
          {errMsg !== "" && <Text>{errMsg}</Text>}
        </Text>
        <Button
          mode="elevated"
          style={styles.button}
          buttonColor="black"
          textColor="white"
          onPress={handleSubmit}
        >
          Submit
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    marginTop: 10,
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  body: {
    flex: 6,
    padding: 10,
  },
  question: {
    fontWeight: "bold",
    fontSize: 15,
  },
  questionContainer: {
    marginTop: 20,
  },
  textInput: {
    backgroundColor: "whitesmoke",
    height: 40,
  },
  button: {
    borderColor: "black",
    borderWidth: 1,
    width: 200,
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 5,
    alignItems: "center",
  },
  error: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
});
