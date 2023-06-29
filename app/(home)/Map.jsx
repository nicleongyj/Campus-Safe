import { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, Animated, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { viewMarkers } from "../../lib/supabase";

import flameIcon from "../../assets/flame.png";
import maintenanceIcon from "../../assets/maintenance.png";
import accidentIcon from "../../assets/accident.png";
import warningIcon from "../../assets/warning.png";
import constructionIcon from "../../assets/construction.png";
// import { Button } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

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
      <Animated.ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        style={styles.scrollView}
        contentContainerStyle={styles.endPadding}
      >
        {/* {
          incidentMarkers.map((marker) => {
              <View key={marker.id} style={styles.card}>
                <Image 
                source={{uri: marker.image_url}}
                style={styles.cardImage}
                resizeMode='cover'/>
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>
                    {marker.type}
                  </Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>
                    {marker.details}
                  </Text>
                </View>
              </View>
          })
        } */}
      </Animated.ScrollView>
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
  //start
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  scrollView: {
    flex:1,
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
});
