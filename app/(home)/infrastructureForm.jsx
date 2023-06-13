import { Text, View, StyleSheet, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Link } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import { insertData } from "../../lib/supabase";

export default function InfrastructureForm() {
  const [errMsg, setErrMsg] = useState("");
  const [enableSecondQuestion, setEnableSecondQuestion] = useState(false);

  //incident data
  const [incident, setIncident] = useState("Select an item");
  const [open, setOpen] = useState(false);
  const [infrastructures, setInfrastructures] = useState([
    { label: "Broken lights", value: "BrokenLights" },
    { label: "Faulty air-conditioning", value: "Faulty air-conditioning" },
    { label: "Faulty lift", value: "Faulty lift" },
    { label: "Water leakage", value: "Water leakage" },
    { label: "Others", value: "Others" },
    { label: "Select an item", value: "Select an item" },
  ]);
  //others data
  const [others, setOthers] = useState("");
  //location
  const [location, setLocation] = useState("");
  //additional details
  const [details, setDetails] = useState("");

  //Determine type of incident
  const handleIncidentType = () => {
    return others ? others : incident;
  };

  const formData = {
    type: handleIncidentType(),
    location: location,
    details: details,
  };

  const handleSubmit = async () => {
    if (incident == "Select an item") {
      setErrMsg("Fill up incident type!");
      return;
    }
    if (incident == "Others" && others == "") {
      setErrMsg("Fill up incident details!");
      return;
    }
    if (location == "") {
      setErrMsg("Fill up location!");
      return;
    }

    // SUPABASE LOGIC
    const error = await insertData(formData, "infrareps");
    console.log(error);
    if (!error) {
      Alert.alert(
        "Your report has been received!",
        "View the status of your report in 'View your reports'",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    } else {
      Alert.alert("Error", "Please try again!", [
        { text: "OK", onPress: () => console.log("Error, OK Pressed") },
      ]);
      return;
    }
    setIncident("Select an item");
    setOthers("");
    setLocation("");
    setDetails("");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topContainer}>
        <Link href="/">
          <Button
            mode="outlined"
            buttonColor="powderblue"
            textColor="black"
            style={styles.homeButton}
          >
            Home
          </Button>
        </Link>
      </View>

      <View style={styles.middleContainer}>
        <View style={styles.reportContainer}>
          <Text style={styles.question}>1. Type of infrastructure issue:</Text>
          <DropDownPicker
            open={open}
            value={incident}
            items={infrastructures}
            setOpen={setOpen}
            setValue={setIncident}
            setItems={setInfrastructures}
            listMode="SCROLLVIEW"
            onChangeValue={(value) =>
              setEnableSecondQuestion(value == "Others")
            }
          />
        </View>

        <View style={styles.normalContainer}>
          <Text style={styles.question}>2. If you chose others, specify:</Text>
          <TextInput
            style={styles.textInput}
            value={others}
            onChangeText={setOthers}
            placeholder="Brief description"
            autoCapitalize="none"
            mode="flat"
            textColor="black"
            multiline={true}
            disabled={!enableSecondQuestion}
          ></TextInput>
        </View>

        <View style={styles.normalContainer}>
          <Text style={styles.question}>4. Location of issue:</Text>
          <TextInput
            style={styles.textInput}
            value={location}
            onChangeText={setLocation}
            placeholder="Exact location (building name, floor number ...)"
            autoCapitalize="none"
            mode="flat"
            textColor="black"
            multiline={true}
          ></TextInput>
        </View>

        <View style={styles.normalContainer}>
          <Text style={styles.question}>5. Additional details:</Text>
          <TextInput
            style={styles.textInput}
            value={details}
            onChangeText={setDetails}
            placeholder="Details that staff should be aware about (optional)"
            autoCapitalize="none"
            mode="flat"
            textColor="black"
            multiline={true}
            contentStyle={styles.content}
          ></TextInput>
        </View>

        <View style={{ alignItems: "center" }}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    padding: 10,
  },
  topContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  middleContainer: {
    flex: 9,
  },
  reportContainer: {
    marginTop: 15,
    marginBottom: 10,
    zIndex: 3,
  },
  urgencyContainer: {
    marginTop: 15,
    marginBottom: 20,
    zIndex: 2,
  },
  normalContainer: {
    marginTop: 10,
    marginBottom: 10,
    zIndex: 1,
  },
  error: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    zIndex: 1,
  },
  textInput: {
    backgroundColor: "whitesmoke",
  },
  button: {
    borderColor: "black",
    borderWidth: 1,
    width: 200,
    fontWeight: "bold",
  },
  homeButton: {
    borderColor: "black",
    borderWidth: 1,
    width: 100,
    fontWeight: "bold",
  },
});
