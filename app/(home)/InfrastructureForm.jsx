import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useState, useRef } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { getImageURL, insertImage, insertReportData } from "../../lib/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import BackButton from "../../assets/backButton.png";
import CameraButton from "../../assets/camera.png";
import DisableFlashButton from "../../assets/disableFlash.png";
import FlashButton from "../../assets/flash.png";

export default function InfrastructureForm() {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [enableSecondQuestion, setEnableSecondQuestion] = useState(false);

  //incident data
  const [incident, setIncident] = useState("Select an item");
  const [open, setOpen] = useState(false);
  const [infrastructures, setInfrastructures] = useState([
    { label: "Broken lights", value: "Broken lights", testID: "Broken lights" },
    { label: "Faulty air-conditioning", value: "Faulty air-conditioning" },
    { label: "Faulty lift", value: "Faulty lift" },
    { label: "Water leakage", value: "Water leakage" },
    { label: "Others", value: "Others", testID: "Others" },
    { label: "Select an item", value: "Select an item" },
  ]);
  //others data
  const [others, setOthers] = useState("");
  //location
  const [location, setLocation] = useState("");
  //additional details
  const [details, setDetails] = useState("");
  //disable button
  const [disableButton, setDisableButton] = useState(false);

  //Determine type of incident
  const handleIncidentType = () => {
    return others ? others : incident;
  };
  const navigation = useNavigation();

  const handleBack = () => {
    if (
      incident == "Select an item" &&
      others == "" &&
      location == "" &&
      details == "" &&
      image == null
    ) {
      navigation.navigate("index");
      return;
    }
    Alert.alert("Leave reporting form?", "Data will be lost", [
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("index");
          setIncident("Select an item");
          setOthers("");
          setLocation("");
          setDetails("");
          setErrMsg("");
          setImage(null);
        },
      },
      { text: "Cancel" },
    ]);
    return;
  };

  //gallery
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

  //camera feature
  const [permissions, setPermissions] = Camera.useCameraPermissions();
  const [startCamera, setStartCamera] = useState(false);
  const [image, setImage] = useState(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

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
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data === undefined ? "mock" : data.uri);
      } catch (error) {
        Alert.alert("Error", "Please try again!", [{ text: "OK" }]);
        return;
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

      const { error } = await insertImage("infraImages", fileName, formData);
      const { data, error2 } = await getImageURL("infraImages", fileName);

      if (error) throw new Error(error.message);
      if (error2) throw new Error(error.message);

      return data.publicUrl;
    } catch (e) {
      Alert.alert("Error", "Please try again!", [{ text: "OK" }]);
    }
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
    if (image == null) {
      setErrMsg("Please attack an image for verification");
      return;
    }

    setLoading(true);
    setDisableButton(true);

    const link = await getImageLink();

    const formData = {
      type: handleIncidentType(),
      location: location,
      details: details,
      image_url: link,
    };

    // SUPABASE LOGIC
    const error = await insertReportData(formData, "infrareps");
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
    setImage(null);
    setErrMsg("");
    setDisableButton(false);
    setLoading(false);
    navigation.navigate("index");
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
              testID="shutterButton"
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
                testID="useImageButton"
              >
                Use image
              </Button>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.topContainer}>
              <Button
                mode="contained"
                style={{ width: 100, borderWidth: 1, borderColor: "black" }}
                textColor="black"
                buttonColor="powderblue"
                icon={BackButton}
                labelStyle={{ fontWeight: "bold", fontSize: 17 }}
                onPress={handleBack}
                testID="backButton"
              >
                Back
              </Button>
            </View>

            <View style={styles.middleContainer}>
              <View style={styles.reportContainer}>
                <Text style={styles.question}>
                  1. Type of infrastructure issue:
                </Text>
                <DropDownPicker
                  open={open}
                  value={incident}
                  items={infrastructures}
                  setOpen={setOpen}
                  setValue={setIncident}
                  setItems={setInfrastructures}
                  listMode="SCROLLVIEW"
                  onPress={setOpen}
                  onChangeValue={(value) =>
                    setEnableSecondQuestion(value == "Others")
                  }
                  testID="incidentPicker"
                />
              </View>

              <View style={styles.normalContainer}>
                <Text style={styles.question}>
                  2. If you chose others, specify:
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={others}
                  onChangeText={setOthers}
                  placeholder="Brief description"
                  autoCapitalize="none"
                  mode="flat"
                  textColor="black"
                  disabled={!enableSecondQuestion}
                  testID="othersInput"
                ></TextInput>
              </View>

              <View style={styles.normalContainer}>
                <Text style={styles.question}>4. Location of issue:</Text>
                <TextInput
                  style={styles.textInput}
                  value={location}
                  onChangeText={(text) => {
                    if (text.trim() === "") {
                      setLocation("");
                    } else {
                      setLocation(text);
                    }
                  }}
                  placeholder="Exact location (building name, floor number ...)"
                  autoCapitalize="none"
                  mode="flat"
                  textColor="black"
                  multiline={true}
                  testID="locationInput"
                ></TextInput>
              </View>

              <View style={styles.normalContainer}>
                <Text style={styles.question}>5. Additional details:</Text>
                <TextInput
                  style={styles.textInput}
                  value={details}
                  onChangeText={(text) => {
                    if (text.trim() === "") {
                      setDetails("");
                    } else {
                      setDetails(text);
                    }
                  }}
                  placeholder="Details that staff should be aware about (optional)"
                  autoCapitalize="none"
                  mode="flat"
                  textColor="black"
                  multiline={true}
                  contentStyle={styles.content}
                  testID="detailsInput"
                ></TextInput>
              </View>

              <View style={styles.normalContainer}>
                <Text style={styles.question}>
                  6. Attach a picture of the incident:{" "}
                </Text>
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={enableCamera}
                    testID="cameraButton"
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

              <View style={{ alignItems: "center" }}>
                <Text style={styles.error}>
                  {" "}
                  {errMsg !== "" && <Text testID="errMsg">{errMsg}</Text>}
                </Text>
                <Button
                  mode="elevated"
                  style={styles.button}
                  labelStyle={{ fontWeight: "bold", fontSize: 17 }}
                  buttonColor="powderblue"
                  textColor="black"
                  disabled={disableButton}
                  loading={loading}
                  onPress={handleSubmit}
                  testID="submitButton"
                >
                  Submit
                </Button>
              </View>
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
    flexDirection: "column",
    backgroundColor: "white",
    padding: 10,
  },
  topContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  middleContainer: {
    flex: 12,
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
  },
  homeButton: {
    borderColor: "black",
    borderWidth: 1,
    width: 100,
    fontWeight: "bold",
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
