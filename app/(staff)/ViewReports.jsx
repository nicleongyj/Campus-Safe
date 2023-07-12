import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ImageBackground,
  Modal,
  Image,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Card, Button } from "react-native-paper";
import { Link } from "expo-router";
import { viewNewReports, rejectReport } from "../../lib/supabase";
import SwitchSelector from "react-native-switch-selector";
import BackButton from "../../assets/backButton.png";
import blueBackground from "../../assets/blueBackground.png";

const ReportCard = ({
  type,
  urgentLevel,
  location,
  details,
  id,
  reportType,
  image_url,
  inserted_at,
  onReject,
}) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const toggleImageModal = () => {
    setImageModalVisible(!imageModalVisible);
  };

  return (
    <Card mode="outlined" style={styles.reportContainer}>
      <Card.Content>
        <View style={styles.cardContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardHeader}>{`Incident: ${type}`}</Text>
            <Text style={{fontSize:13, fontWeight:'bold'}}>
              {reportType === "incidents" ? `Urgency: ${urgentLevel}` : null}
            </Text>
            <Text></Text>
            <Text style={styles.cardSubheader}>{`Location: ${location}`}</Text>
            <Text style={styles.cardSubheader}>
              {details == "" ? "Details : Nil" : `Details: ${details}`}
            </Text>
            <Text></Text>
            <Text style={styles.cardSubheader}>{`Time reported: ${inserted_at
              .split("T")[1]
              .slice(0, 8)}`}</Text>
            <Text style={styles.cardSubheader}>{`Date reported: ${
              inserted_at.split("T")[0]
            }`}</Text>
          </View>
          <View style={styles.cardImageContainer}>
            <Image source={{ uri: image_url }} style={styles.image} />
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="outlined"
          buttonColor="dimgray"
          textColor="white"
          style={styles.button}
          onPress={toggleImageModal}
        >
          View image
        </Button>
        <Button
          mode="outlined"
          buttonColor="crimson"
          textColor="white"
          style={styles.button}
          onPress={() => onReject(id)}
        >
          Reject
        </Button>

        <Link
          href={{
            pathname: "/SelectMap",
            params: { reportType, id },
          }}
        >
          <Button
            mode="outlined"
            buttonColor="darkgreen"
            textColor="white"
            style={styles.button}
          >
            Verify
          </Button>
        </Link>
      </Card.Actions>
      <Modal visible={imageModalVisible} transparent={true}>
        <View style={styles.imageModalContainer}>
          <Button
            mode="outlined"
            buttonColor="mediumaquamarine"
            textColor="black"
            style={styles.button}
            onPress={toggleImageModal}
          >
            Close
          </Button>
          <Image
            source={{ uri: image_url }}
            style={styles.enlargedImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </Card>
  );
};

export default function ViewReports() {
  const [incidents, setIncidents] = useState([]);
  const [infrastructures, setInfrastructures] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [viewMode, setViewMode] = useState("incidents");

  async function fetchReports() {
    let incidentData = await viewNewReports("incidentreps");
    let infrastructureData = await viewNewReports("infrareps");
    setIncidents(incidentData);
    setInfrastructures(infrastructureData);
    setRefresh(false);
    console.log("fetched data");
  }

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchReports();
    }
  }, [refresh]);

  function handleReject(id, reportType) {
    Alert.alert("Confirm reject", "Action cannot be changed", [
      {
        text: "OK",
        onPress: async () => {
          await rejectReport(
            reportType === "incidents" ? "incidentreps" : "infrareps",
            id
          );
          setRefresh(true);
        },
      },
      { text: "Cancel" },
    ]);
    return;
  }

  function renderReport(report, reportType) {
    const {
      type,
      urgent_level,
      location,
      details,
      id,
      image_url,
      inserted_at,
    } = report;

    return (
      <ReportCard
        type={type}
        urgentLevel={urgent_level}
        location={location}
        details={details}
        id={id}
        image_url={image_url}
        reportType={reportType}
        inserted_at={inserted_at}
        onReject={(id) => handleReject(id, reportType)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={blueBackground}
        resizeMode="stretch"
        style={{ flex: 1 }}
      >
        <View style={styles.topContainer}>
          <Link href="/Staffhome" style={styles.backLink}>
            <Button
              mode="contained"
              style={styles.backButton}
              buttonColor="black"
              icon={BackButton}
              labelStyle={{ fontWeight: "bold" }}
            >
              Back
            </Button>
          </Link>

          <View style={{ marginTop: "2%" }}>
            <SwitchSelector
              initial={0}
              options={[
                {
                  label: `Incidents (${incidents.length})`,
                  value: "incidents",
                },
                {
                  label: `Infrastructure issues (${infrastructures.length})`,
                  value: "infrastructures",
                },
              ]}
              onPress={(value) => setViewMode(value)}
              hasPadding
              buttonColor="slategray"
              borderColor="black"
            />
          </View>
        </View>
        <View style={styles.bottomContainer}>
          {((viewMode === "infrastructures" && infrastructures.length == 0) ||
            (viewMode === "incidents" && incidents.length == 0)) && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontWeight: "bold", color: "brown", fontSize: 20 }}
              >
                No new reports currently
              </Text>
            </View>
          )}
          {viewMode === "incidents" && incidents.length != 0 && (
            <FlatList
              data={incidents}
              renderItem={({ item }) => renderReport(item, "incidents")}
              refreshing={refresh}
              onRefresh={() => setRefresh(true)}
            ></FlatList>
          )}
          {viewMode === "infrastructures" && (
            <FlatList
              data={infrastructures}
              renderItem={({ item }) => renderReport(item, "infrastructures")}
              refreshing={refresh}
              onRefresh={() => setRefresh(true)}
            ></FlatList>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  backButton: {
    width: 100,
  },
  reportContainer: {
    backgroundColor: "aliceblue",
    borderRadius: 15,
    borderColor: "black",
    margin: 10,
  },
  topContainer: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  bottomContainer: {
    flex: 8,
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  button: {
    borderColor: "black",
    borderWidth: 1,
    fontWeight: "bold",
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  enlargedImage: {
    width: "80%",
    height: "80%",
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
  },
  cardTextContainer: {
    flex: 2,
  },
  cardImageContainer: {
    flex: 1,
  },
  image: {
    height: 120,
    width: 120,
    borderRadius:10,
  },
  cardHeader:{
    fontSize:15,
    fontWeight:'bold',
  },
  cardSubheader:{
    fontSize:13
  },
});
