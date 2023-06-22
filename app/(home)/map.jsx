import { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { viewMarkers } from "../../lib/supabase";

import flameIcon from "../../assets/flame.png";
import maintenanceIcon from "../../assets/maintenance.png";
import accidentIcon from "../../assets/accident.png";
import warningIcon from "../../assets/warning.png";
import constructionIcon from "../../assets/construction.png";

export default function Map() {
  const [region, setRegion] = useState({
    latitude: 1.2966,
    longitude: 103.7764,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const [incidentMarkers, setIncidentMarkers] = useState([]);
  const [infraMarkers, setInfraMarkers] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const fetchMarkers = async () => {
    try {
      const incidentData = await viewMarkers("verifiedincidents");
      const infraData = await viewMarkers("verifiedinfras");
      setInfraMarkers(infraData);
      setIncidentMarkers(incidentData);
      setRefresh(false);
      console.log("Fetched data");
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  useEffect(() => {
    if (refresh) {
      fetchMarkers();
    }
  }, [refresh]);

  useEffect(() => {
    fetchMarkers();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.legendContainer}>
        <View style={styles.header}>
          <Text style={{ fontWeight: "bold", color: "orangered" }}>
            Legend:
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <View style={styles.subLegendContainer}>
            <Image source={flameIcon} style={styles.incidentIcon} />
            <Text style={styles.incident}>Fire</Text>
          </View>
          <View style={styles.subLegendContainer}>
            <Image source={accidentIcon} style={styles.incidentIcon} />
            <Text style={styles.incident}> Accident</Text>
          </View>
          <View style={styles.subLegendContainer}>
            <Image source={warningIcon} style={styles.incidentIcon} />
            <Text style={styles.incident}>Danger</Text>
          </View>
          <View style={styles.subLegendContainer}>
            <Image source={maintenanceIcon} style={styles.infraIcon} />
            <Text style={styles.infra}>Maintenance</Text>
          </View>
          <View style={styles.subLegendContainer}>
            <Image source={constructionIcon} style={styles.infraIcon} />
            <Text style={styles.infra}>Construction</Text>
          </View>
        </View>
      </View>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {incidentMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.type}
            description={marker.details}
            tracksViewChanges={false}
          >
            <Image
              source={
                marker.type === "Fire"
                  ? flameIcon
                  : marker.type === "Motor accident"
                  ? accidentIcon
                  : warningIcon
              }
              style={{ width: 50, height: 50 }}
            />
          </Marker>
        ))}
        {infraMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.type}
            description={marker.details}
            tracksViewChanges={false}
          >
            <Image
              source={
                marker.type === "Construction"
                  ? constructionIcon
                  : maintenanceIcon
              }
              style={{ width: 40, height: 40 }}
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 9,
    width: "100%",
    height: "100%",
  },
  legendContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    alignItems: "center",
  },
  header: {
    flex: 1,
  },
  iconContainer: {
    flex: 2,
    flexDirection: "row",
    alignContent: "center",
  },
  subLegendContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  incident: {
    marginTop: 1,
    fontSize: 13,
  },
  infra: {
    marginTop: 4,
    fontSize: 13,
  },
  incidentIcon: {
    height: 30,
    width: 30,
  },
  infraIcon: {
    height: 27,
    width: 27,
  },
});
