import { FlatList, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useState, useEffect} from 'react';
import { supabase } from "../../lib/supabase";

export default function NewIncidentReps() {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    async function fetchReports() {
      let { data } = await supabase.from('incidentreps').select('*');
      setReports(data);
      console.log("fetched data");
    }
    fetchReports();
  }, []);

  function RenderReport(report) {
    const {type, urgent_level, location, details} = report;

    return (
      <View style={styles.reportContainer}>
        <Text style={{fontSize: 40}}>{type}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        renderItem={({item}) => RenderReport(item)}
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
  },
  reportContainer: {
    backgroundColor: "powderblue",
    padding: 10,
    alignItems: "flex-start"
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