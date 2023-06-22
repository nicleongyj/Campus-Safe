import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { insertVerifiedReport, verifyReport } from "../../lib/supabase";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";

export default function VerifyForm() {
  const params = useLocalSearchParams();
  const { latitude, longitude, reportType, id } = params;
  const [incidentDetails, setIncidentDetails] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [enableSecondQuestion, setEnableSecondQuestion] = useState(false);

  //Incident details
  const [incident, setIncident] = useState("Select an item");
  const [incidentItems, setIncidentItems] = useState([
    { label: "Fire", value: "Fire" },
    { label: "Fallen tree", value: "Fallen tree" },
    { label: "Motor accident", value: "Motor accident" },
    { label: "Suspicious activity", value: "Suspicious activity" },
    { label: "Others", value: "Others" },
    { label: "Select an item", value: "Select an item" },
  ]);
  const [others, setOthers] = useState("");

  //Infra details
  const [infrastructures, setInfrastructures] = useState([
    { label: "Broken lights", value: "BrokenLights" },
    { label: "Faulty air-conditioning", value: "Faulty air-conditioning" },
    { label: "Faulty lift", value: "Faulty lift" },
    { label: "Water leakage", value: "Water leakage" },
    { label: "Construction", value: "Construction" },
    { label: "Others", value: "Others" },
    { label: "Select an item", value: "Select an item" },
  ]);

  const lat = latitude == 103.77 ? "null" : latitude;
  const long = longitude == 1.29 ? "null" : longitude;

  const tableName = reportType == "incidents" ? "incidentreps" : "infrareps";
  const verifiedTableName =
    reportType == "incidents" ? "verifiedincidents" : "verifiedinfras";

  const navigation = useNavigation();

  const formData = {
    id: id,
    type: incident != "Others" ? incident : others,
    details: incidentDetails,
    latitude: lat,
    longitude: long,
  };

  const handleSubmit = async () => {
    if (lat == "null" || long == "null") {
      setErrMsg("Select incident location on map!");
      return;
    }
    if (incident == "Select an item") {
      setErrMsg("Fill in incident type!");
      return;
    }
    if (incidentDetails == "") {
      setErrMsg("Fill in incident details!");
      return;
    }

    //SUPABASE LOGIC
    const error1 = await insertVerifiedReport(formData, verifiedTableName);
    const error2 = await verifyReport(tableName, id);
    if (!error1 && !error2) {
      Alert.alert(
        "Incident verified",
        "View verified reports in 'Manage verified reports'",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "ViewReports" }],
              });
            },
          },
        ]
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

      <View style={styles.bodyContainer}>
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
        <View style={styles.pickerContainer}>
          <Text style={styles.question}>Type of incident:</Text>
          <DropDownPicker
            open={open}
            value={incident}
            items={reportType == "incidents" ? incidentItems : infrastructures}
            setOpen={setOpen}
            setValue={setIncident}
            setItems={
              reportType == "incidents" ? setIncidentItems : setInfrastructures
            }
            listMode="SCROLLVIEW"
            onChangeValue={(value) =>
              setEnableSecondQuestion(value == "Others")
            }
          />
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            If you have chose others, please specify:
          </Text>
          <TextInput
            style={styles.textInput}
            value={others}
            onChangeText={(text) => {
              if (text.trim() === "") {
                setOthers("");
              } else {
                setOthers(text);
              }
            }}
            placeholder="Brief description"
            autoCapitalize="none"
            mode="flat"
            textColor="black"
            multiline={true}
            disabled={!enableSecondQuestion}
          ></TextInput>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>Incident description:</Text>
          <TextInput
            mode="flat"
            style={{ backgroundColor: "whitesmoke" }}
            placeholder="Location, instructions to students..."
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
  bodyContainer: {
    flex: 8,
    marginLeft: "3%",
    marginRight: "3%",
  },
  question: {
    fontWeight: "bold",
    fontSize: 15,
  },
  pickerContainer: {
    marginTop: 20,
    zIndex: 3,
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
