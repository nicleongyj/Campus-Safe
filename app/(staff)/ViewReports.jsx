import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert, ImageBackground } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Card, Button } from "react-native-paper";
import { Link } from "expo-router";
import SwitchSelector from "react-native-switch-selector";

import { viewNewReports, rejectReport } from "../../lib/supabase";
import BackButton from "../../assets/backButton.png";
import blueBackground from "../../assets/blueBackground.png";

const ReportCard = ({
  type,
  urgentLevel,
  location,
  details,
  id,
  reportType,
  onReject,
}) => {
  return (
    <Card mode="outlined" style={styles.reportContainer}>
      <Card.Title
        title={`Type: ${type}`}
        subtitle={reportType === "incidents" ? `Urgency: ${urgentLevel}` : null}
      />
      <Card.Content>
        <Text>{`Location: ${location}`}</Text>
        <Text>{`Details: ${details}`}</Text>
      </Card.Content>
      <Card.Actions>
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
    const { type, urgent_level, location, details, id } = report;

    return (
      <ReportCard
        type={type}
        urgentLevel={urgent_level}
        location={location}
        details={details}
        id={id}
        reportType={reportType}
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

          <View style={{ marginTop: 10 }}>
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
              <Text style={{ fontWeight: "bold", color: "brown", fontSize:20 }}>
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
    borderRadius:15,
    borderColor:'black',
    margin: 10,
  },
  topContainer: {
    flex: 1,
    padding: 15,
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
});
