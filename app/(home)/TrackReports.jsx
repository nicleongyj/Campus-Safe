import { useState, useEffect } from "react";
import { StyleSheet, View, Text, ImageBackground, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Card, Button } from "react-native-paper";
import { Link } from "expo-router";
import SwitchSelector from "react-native-switch-selector";

import { viewFilteredReport } from "../../lib/supabase";
import BackButton from "../../assets/backButton.png";
import blueBackground from "../../assets/blueBackground.png";

const reportTypeOptions = [
  { label: "Incidents", value: "incidents" },
  { label: "Infrastructure issues", value: "infrastructures" },
];

const filterOptions = [
  { label: "Unverified", value: "unverified" },
  { label: "Verified", value: "verified" },
  { label: "Resolved", value: "resolved" },
  { label: "Rejected", value: "rejected" },
];

const ReportCard = ({
  type,
  urgentLevel,
  location,
  details,
  reportType,
  image_url,
}) => {
  return (
    <Card mode="outlined" style={styles.reportContainer}>
      <Card.Content>
        <View style={styles.cardContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardHeader}>{`Incident: ${type}`}</Text>
            <Text style={styles.cardSubheader}>{reportType === "incidents" ? `Urgency: ${urgentLevel}` : null}</Text>
            <Text style={styles.cardSubheader}>{`Location: ${location}`}</Text>
            <Text style={styles.cardSubheader}>{`Details: ${details}`}</Text>
          </View>
          <View style={styles.cardImageContainer}>
            <Image source={{ uri: image_url }} style={styles.image} />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default function TrackReports() {
  const [reports, setReports] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [viewMode, setViewMode] = useState("incidents");
  const [filter, setFilter] = useState("unverified");

  async function fetchReports() {
    let filteredReport = await viewFilteredReport(viewMode, filter);
    setReports(filteredReport);
    setRefresh(false);
    console.log("fetched data");
  }

  useEffect(() => {
    fetchReports();
  }, [viewMode, filter]);

  useEffect(() => {
    if (refresh) {
      fetchReports();
    }
  }, [refresh]);

  function renderReport(report, reportType) {
    const { type, urgent_level, location, details, image_url } = report;

    return (
      <ReportCard
        type={type}
        urgentLevel={urgent_level}
        location={location}
        details={details}
        reportType={reportType}
        image_url={image_url}
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
          <Link href="/" style={styles.backLink}>
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
              options={reportTypeOptions}
              onPress={(value) => setViewMode(value)}
              hasPadding
              buttonColor="slategray"
              borderColor="black"
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <SwitchSelector
              initial={0}
              options={filterOptions}
              onPress={(value) => setFilter(value)}
              hasPadding
              buttonColor="darkcyan"
              borderColor="black"
            />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          {((viewMode === "infrastructures" && reports.length == 0) ||
            (viewMode === "incidents" && reports.length == 0)) && (
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
              data={reports}
              renderItem={({ item }) => renderReport(item, "incidents")}
              refreshing={refresh}
              onRefresh={() => setRefresh(true)}
            ></FlatList>
          )}
          {viewMode === "infrastructures" && (
            <FlatList
              data={reports}
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
  cardContainer: {
    flex: 1,
    flexDirection: "row",
  },
  cardTextContainer: {
    flex: 3,
  },
  cardImageContainer: {
    flex: 1,
    justifyContent:'flex-end',
  },
  image: {
    height: 100,
    width: 100,
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