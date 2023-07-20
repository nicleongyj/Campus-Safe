import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Card, Button } from "react-native-paper";
import { Link } from "expo-router";
import { resolveReport, viewVerifiedReports } from "../../lib/supabase";
import SwitchSelector from "react-native-switch-selector";
import BackButton from "../../assets/backButton.png";
import blueBackground from "../../assets/blueBackground.png";

const ReportCard = ({ type, details, id, onResolve, image_url }) => {
  return (
    <Card mode="outlined" style={styles.reportContainer}>
      <Card.Content>
        <View style={styles.cardContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardHeader}>{`Incident: ${type}`}</Text>
            <Text></Text>
            <Text style={styles.cardSubheader}>{`Details: ${details}`}</Text>
          </View>
          <View style={styles.cardImageContainer}>
            <Image source={{ uri: image_url }} style={styles.image} />
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="outlined"
          buttonColor="crimson"
          textColor="white"
          style={styles.button}
          onPress={() => onResolve(id)}
        >
          Resolve
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default function ViewVerifiedReports() {
  const [incidents, setIncidents] = useState([]);
  const [infrastructures, setInfrastructures] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [viewMode, setViewMode] = useState("incidents");

  async function fetchReports() {
    let incidentData = await viewVerifiedReports("verifiedincidents");
    let infrastructureData = await viewVerifiedReports("verifiedinfras");
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

  function handleResolve(id, reportType) {
    Alert.alert("Resolve incident?", "Action cannot be changed", [
      {
        text: "OK",
        onPress: async () => {
          if (reportType === "incidents") {
            console.log("resolve incident");
            await resolveReport(id, "incident");
          } else {
            await resolveReport(id, "infra");
          }
          setRefresh(true);
        },
      },
      { text: "Cancel" },
    ]);
    return;
  }

  function renderReport(report, reportType) {
    const { type, details, id, image_url } = report;

    return (
      <ReportCard
        type={type}
        details={details}
        id={id}
        reportType={reportType}
        image_url={image_url}
        onResolve={(id) => handleResolve(id, reportType)}
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
              <Text
                style={{ fontWeight: "bold", color: "brown", fontSize: 20 }}
              >
                No reports to show
              </Text>
            </View>
          )}
          {viewMode === "incidents" && (
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
    marginRight: "5%",
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
    justifyContent: "flex-end",
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 10,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: "bold",
  },
  cardSubheader: {
    fontSize: 13,

  },
});
