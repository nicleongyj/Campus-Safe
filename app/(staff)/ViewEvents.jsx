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
import BackButton from "../../assets/backButton.png";
import blueBackground from "../../assets/blueBackground.png";

const ReportCard = ({ type, details, id, onResolve, image_url }) => {
  return (
    <Card mode="outlined" style={styles.reportContainer}>
      <Card.Content>
        <View style={styles.cardContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardHeader}>{`Event name: ${type}`}</Text>
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
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const fetchReports = async () => {
    let eventData = await viewVerifiedReports("events");
    setEvents(eventData);
    setRefresh(false);
    console.log("fetched data");
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchReports();
    }
  }, [refresh]);

  const handleResolve = (id) => {
    Alert.alert("Delete event?", "Action cannot be changed", [
      {
        text: "OK",
        onPress: async () => {
          await resolveReport(id, "events");
          setRefresh(true);
        },
      },
      { text: "Cancel" },
    ]);
    return;
  };

  const renderReport = (report) => {
    const { type, details, id, image_url } = report;

    return (
      <ReportCard
        type={type}
        details={details}
        id={id}
        image_url={image_url}
        onResolve={(id) => handleResolve(id, reportType)}
      />
    );
  };

  const reportType = "event";
  const id = null;

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
        </View>
        <View style={styles.middleContainer}>
          <Link
            href={{
              pathname: "/SelectMap",
              params: { reportType, id },
            }}
          >
            <Button
              mode="contained"
              buttonColor="#BDFCC9"
              style={styles.newButton}
            >
              <Text style={styles.buttonText}>New event</Text>
            </Button>
          </Link>
        </View>
        <View style={styles.bottomContainer}>
          {events.length == 0 && (
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
          <FlatList
            data={events}
            renderItem={({ item }) => renderReport(item)}
            refreshing={refresh}
            onRefresh={() => setRefresh(true)}
          ></FlatList>
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
  middleContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    padding: "3%",
  },
  bottomContainer: {
    flex: 15,
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
  newButton: {
    backgroundColor: "#BDFCC9",
    borderWidth: 1,
    borderColor: "black",
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
