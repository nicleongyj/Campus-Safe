import { FlatList, View, StyleSheet, Alert } from 'react-native';
import { Text , Card, Button } from 'react-native-paper';
import { useState, useEffect} from 'react';
import { viewStaffData, deleteStaffData } from "../../lib/supabase";
import { Link } from "expo-router";

export default function NewIncidentReps() {
  const [reports, setReports] = useState([]);
  const [refresh, setRefresh] = useState(false);

  async function fetchReports() {
    let data = await viewStaffData('incidentreps');
    setReports(data);
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

  function HandleDelete(id) {
    Alert.alert(
      "Confirm delete",
      "Incident report will be deleted",
      [{ text: "OK", onPress: async () => {
        await deleteStaffData('incidentreps', id, 'id');
        setRefresh(true);
      }},
        { text: "Cancel"}
      ]
    );
    return;
  }

  function RenderReport(report) {
    const {type, urgent_level, location, details, id} = report;

    return (
        <Card mode='outlined' style={styles.reportContainer}>
          <Card.Title title={`Type: ${type}`} subtitle={`Urgency: ${urgent_level}`} />
          <Card.Content>
            <Text>{`Location: ${location}`}</Text>
            <Text>{`Details: ${details}`}</Text>
          </Card.Content>
          <Card.Actions>
              <Button
                mode="outlined"
                buttonColor="powderblue"
                textColor="black"
                style={styles.Button}
                onPress={() => HandleDelete(id)}
              >
                Delete
              </Button>

            <Link href="/selectMap">
              <Button
                mode="outlined"
                buttonColor="powderblue"
                textColor="black"
                style={styles.Button}
              >
                Verify
              </Button>
            </Link>
          </Card.Actions>
        </Card>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        renderItem={({item}) => RenderReport(item)}
        refreshing={refresh}
        onRefresh={() =>setRefresh(true)}
      >
      </FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    padding: 10,
  },
  reportContainer: {
    backgroundColor: "powderblue",
    margin: 10,
  },
  topContainer: {
    flex: 5,
    alignItems: "center",
    padding: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  bottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: "10%",
  },
  button: {
    borderColor: "black",
    borderWidth: 0,
    width: "70%",
    fontWeight: "bold",
  },
});