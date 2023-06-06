import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Button, TextInput } from "react-native-paper";
// import { ScrollView } from "react-native-gesture-handler";

import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

export default function ReportForm() {
  const [errMsg, setErrMsg] = useState("");
  //incident data
  const [incident, setIncident] = useState(null);
  const [open, setOpen] = useState(false);
  const [incidentItems, setIncidentItems] = useState([
    { label: "fire", value: "fire" },
    { label: "fallen tree", value: "fallen tree" },
    { label: "motor accident", value: "motor accident" },
    { label: "suspicious activity", value: "suspicious activity" },
    { label: "others", value: "others" },
  ]);
  //others data
  const [others, setOthers] = useState("");
  //urgency data
  const [urgency, setUrgency] = useState(null);
  const [open2, setOpen2] = useState(false);
  const [urgencyItems, setUrgencyItems] = useState([
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
  ]);
  //location
  const [location, setLocation] = useState("");
  //additional details
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    if (incident == null) {
      setErrMsg("Fill up incident type!");
      return;
    }
    if (incident == "other" && others == "") {
      setErrMsg("Fill up incident details!");
      return;
    }
    if (urgency == null) {
      setErrMsg("Fill up level of emergency!");
      return;
    }
    if (location == "") {
      setErrMsg("Fill up location!")
      return;
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.topContainer}>
        <Link href="/">
          <Button
            mode="outlined"
            buttonColor="powderblue"
            textColor="black"
            style={{
              borderColor: "black",
              borderWidth: 1,
              width: 100,
              fontWeight: "bold",
            }}
          >
            Home
          </Button>
        </Link>
      </View>

      <View style={styles.middleContainer}>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>1. What are you reporting?</Text>
          <DropDownPicker
            open={open}
            value={incident}
            items={incidentItems}
            setOpen={setOpen}
            setValue={setIncident}
            setItems={setIncidentItems}
          />
        </View>

        <View style={styles.normalQuestion}>
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
          ></TextInput>
        </View>

        <View style={styles.normalQuestion}>
          <Text style={styles.question}>3. Level of urgency:</Text>
          <DropDownPicker
            open={open2}
            value={urgency}
            items={urgencyItems}
            setOpen={setOpen2}
            setValue={setUrgency}
            setItems={setUrgencyItems}
          />
        </View>

        <View style={styles.normalQuestion}>
          <Text style={styles.question}>4. Location of incident:</Text>
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

        <View style={styles.normalQuestion}>
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
  questionContainer: {
    marginTop: 15,
    marginBottom: 20,
    zIndex: 3,
  },
  normalQuestion: {
    marginTop: 10,
    marginBottom: 20,
    zIndex: 1,
  },
  error: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginBottom:5,
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
});
