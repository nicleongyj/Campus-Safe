import { FlatList, View, StyleSheet, Alert } from 'react-native';
import { Text , Card, Button } from 'react-native-paper';
import { useState, useEffect} from 'react';
import { viewNewReports, rejectReport } from "../../lib/supabase";
import { Link } from "expo-router";

export default function NewInfraReps() {
  const [reports, setReports] = useState([]);
  const [refresh, setRefresh] = useState(false);

  async function fetchReports() {
    let data = await viewNewReports('infrareps');
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

  function HandleReject(id) {
    Alert.alert(
      "Confirm reject",
      "Action cannot be changed",
      [{ text: "OK", onPress: async () => {
        await rejectReport('infrareps', id);
        setRefresh(true);
      }},
        { text: "Cancel"}
      ]
    );
    return;
  }

  function RenderReport(report) {
    const {type, location, details, id} = report;

    return (
        <Card mode='outlined' style={styles.reportContainer}>
          <Card.Title title={`Type: ${type}`} />
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
                onPress={() => HandleReject(id)}
              >
                Reject
              </Button>

            <Link href={{
              pathname: "/selectMap",
              params: {reportType: "infrastructure", id: id}
            }}>
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