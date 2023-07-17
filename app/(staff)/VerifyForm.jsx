import { useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import {
  getImageURL,
  insertImage,
  insertVerifiedReport,
  verifyReport,
} from "../../lib/supabase";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";

import DisableFlashButton from "../../assets/disableFlash.png";
import FlashButton from "../../assets/flash.png";
import CameraButton from "../../assets/camera.png";
import BackButton from "../../assets/backButton.png";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function VerifyForm() {
  const params = useLocalSearchParams();
  const { latitude, longitude, reportType, id } = params;
  const [loading, setLoading] = useState(false);
  const [incidentDetails, setIncidentDetails] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [enableSecondQuestion, setEnableSecondQuestion] = useState(false);

  //Incident details
  const [incident, setIncident] = useState(
    reportType == "event" ? "" : "Select an item"
  );
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

  //disable button
  const [disableButton, setDisableButton] = useState(false);

  const lat = latitude == 103.77 ? "null" : latitude;
  const long = longitude == 1.29 ? "null" : longitude;

  const tableName = reportType == "incidents" ? "incidentreps" : "infrareps";
  const verifiedTableName =
    reportType == "incidents"
      ? "verifiedincidents"
      : reportType == "event"
      ? "events"
      : "verifiedinfras";

  const navigation = useNavigation();

  //Gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1028, 1800],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //Camera feature
  const [permissions, setPermissions] = useState(null);
  const [startCamera, setStartCamera] = useState(false);
  const [image, setImage] = useState(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setPermissions(cameraStatus.status === "granted");
    })();
  }, []);

  if (!permissions) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ alignSelf: "center" }}>No access to camera</Text>
        <Text style={{ alignSelf: "center" }}>
          Allow Expo to access your camera in your settings
        </Text>
      </View>
    );
  }

  const enableCamera = () => {
    setStartCamera(true);
    console.log("true");
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log("pass");
        console.log(data);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getImageLink = async () => {
    try {
      var formData = new FormData();
      const ext = image.substring(image.lastIndexOf(".") + 1);
      const fileName = image.replace(/^.*[\\/]/, "");
      formData.append("files", {
        uri: image,
        name: fileName,
        type: `image/${ext}`,
      });

      const { error } = await insertImage(
        reportType === "incidents"
          ? "verifiedIncidentImages"
          : "verifiedInfraImages",
        fileName,
        formData
      );
      const { data, error2 } = await getImageURL(
        reportType === "incidents"
          ? "verifiedIncidentImages"
          : "verifiedInfraImages",
        fileName
      );

      if (error) throw new Error(error.message);
      if (error2) throw new Error(error.message);

      return data.publicUrl;
    } catch (e) {
      console.log(e);
    }
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
    if (image == null) {
      setErrMsg("Please attach a image!");
      return;
    }

    setDisableButton(true);
    setLoading(true);

    const link = await getImageLink();

    const formData = {
      type: incident != "Others" ? incident : others,
      details: incidentDetails,
      latitude: lat,
      longitude: long,
      image_url: link,
    };

    if (reportType != "event") {
      formData.id = id;
    }

    if (reportType == "event") {
      console.log(formData);
      console.log(verifiedTableName);
      const error = await insertVerifiedReport(formData, verifiedTableName);
      console.log("pass");
      if (!error) {
        Alert.alert(
          "Event submitted",
          "You can now view the event on the event map",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "ViewEvents" }],
                });
              },
            },
          ]
        );
        console.log("pass2");
      } else {
        Alert.alert("Error", "Please try again!", [
          { text: "OK", onPress: () => console.log("Error, OK Pressed") },
        ]);
        console.log(error);
        return;
      }
      setDisableButton(false);
    } else {
      console.log(formData);
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
      setDisableButton(false);
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {startCamera && !image ? (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          flashMode={flash}
          ref={cameraRef}
        >
          <View style={styles.cameraTopContainer}>
            <Button
              mode="contained"
              style={{ width: 100 }}
              buttonColor="white"
              icon={BackButton}
              labelStyle={{ fontWeight: "bold" }}
              onPress={() => setStartCamera(false)}
              textColor="black"
            >
              Back
            </Button>
          </View>
          <View style={styles.cameraBottomContainer}>
            <Button
              mode="contained"
              style={{ width: 100 }}
              buttonColor="white"
              labelStyle={{ fontWeight: "bold" }}
              onPress={pickImage}
              textColor="black"
            >
              Gallery
            </Button>

            <TouchableOpacity
              style={styles.pictureButton}
              onPress={takePicture}
            >
              <Image source={CameraButton} style={{ height: 40, width: 40 }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 100,
                height: 40,
                backgroundColor: flash ? "gold" : "navajowhite",
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setFlash(!flash)}
              textColor="black"
            >
              <Image
                source={flash ? FlashButton : DisableFlashButton}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : startCamera && image ? (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: image }} style={styles.photoTaken} />
          <View style={styles.overlayContainer}>
            <View
              style={{
                flexDirection: "row",
                marginBottom: "10%",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                mode="contained"
                style={{
                  width: 150,
                  zIndex: 3,
                  borderWidth: 2,
                  borderColor: "black",
                }}
                buttonColor="navajowhite"
                labelStyle={{ fontWeight: "bold" }}
                onPress={() => setImage(null)}
                textColor="black"
              >
                Retake
              </Button>

              <Button
                mode="contained"
                style={{
                  width: 150,
                  zIndex: 3,
                  borderWidth: 2,
                  borderColor: "black",
                }}
                buttonColor="navajowhite"
                labelStyle={{ fontWeight: "bold" }}
                onPress={() => setStartCamera(false)}
                textColor="black"
              >
                Use image
              </Button>
            </View>
          </View>
        </View>
      ) : reportType == "incidents" || reportType == "infrastructures" ? (
        <View style={styles.container}>
          <KeyboardAwareScrollView
            // contentContainerStyle={{flex:1}}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
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
                  items={
                    reportType == "incidents" ? incidentItems : infrastructures
                  }
                  setOpen={setOpen}
                  setValue={setIncident}
                  setItems={
                    reportType == "incidents"
                      ? setIncidentItems
                      : setInfrastructures
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

              <View style={styles.questionContainer}>
                <Text style={styles.question}>
                  Attach a picture for students to view:{" "}
                </Text>
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={enableCamera}
                  >
                    <Text style={styles.cameraText}>
                      {image == null ? "Take a picture" : "View image"}
                    </Text>
                  </TouchableOpacity>

                  {image != null && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Image: </Text>
                      <Image
                        source={{ uri: image }}
                        style={{ height: 60, width: 60 }}
                      />
                    </View>
                  )}
                </View>
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
                disabled={disableButton}
                loading={loading}
                onPress={handleSubmit}
              >
                Submit
              </Button>
            </View>
          </KeyboardAwareScrollView>
        </View>
      ) : (
        <View style={styles.container}>
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Fill up event details</Text>
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
                <Text style={styles.question}>Event name:</Text>
                <TextInput
                  style={styles.textInput}
                  value={incident}
                  onChangeText={(text) => {
                    if (text.trim() === "") {
                      setIncident("");
                    } else {
                      setIncident(text);
                    }
                  }}
                  autoCapitalize="none"
                  mode="flat"
                  textColor="black"
                  multiline={true}
                ></TextInput>
              </View>
              <View style={styles.questionContainer}>
                <Text style={styles.question}>Event description:</Text>
                <TextInput
                  mode="flat"
                  style={{ backgroundColor: "whitesmoke" }}
                  placeholder="Location, event details..."
                  placeholderTextColor="grey"
                  textColor="black"
                  value={incidentDetails}
                  onChangeText={setIncidentDetails}
                />
              </View>

              <View style={styles.questionContainer}>
                <Text style={styles.question}>
                  Attach a picture for students to view:{" "}
                </Text>
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={enableCamera}
                  >
                    <Text style={styles.cameraText}>
                      {image == null ? "Take a picture" : "View image"}
                    </Text>
                  </TouchableOpacity>

                  {image != null && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Image: </Text>
                      <Image
                        source={{ uri: image }}
                        style={{ height: 60, width: 60 }}
                      />
                    </View>
                  )}
                </View>
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
                disabled={disableButton}
                onPress={handleSubmit}
              >
                Submit
              </Button>
            </View>
          </KeyboardAwareScrollView>
        </View>
      )}
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
  cameraTopContainer: {
    flex: 6,
    padding: "3%",
  },
  cameraBottomContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
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
    justifyContent: "center",
  },
  error: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },

  cameraButton: {
    width: 130,
    borderRadius: 4,
    backgroundColor: "#14274e",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginBottom: "3%",
  },
  cameraText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
    zIndex: 4,
  },
  photoTaken: {
    flex: 1,
    borderRadius: 20,
    resizeMode: "cover",
  },
  pictureButton: {
    backgroundColor: "white",
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
