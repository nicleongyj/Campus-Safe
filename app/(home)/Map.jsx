import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { viewMarkers } from "../../lib/supabase";

import flameIcon from "../../assets/flame.png";
import maintenanceIcon from "../../assets/maintenance.png";
import accidentIcon from "../../assets/accident.png";
import warningIcon from "../../assets/warning.png";
import constructionIcon from "../../assets/construction.png";
import SwitchSelector from "react-native-switch-selector";
import { Button, Card } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = (height / 9) * 2 - 10;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default function Map() {
  const [incidentMarkers, setIncidentMarkers] = useState([]);
  const [infraMarkers, setInfraMarkers] = useState([]);
  const [refresh] = useState(false);
  const [selectedIncidentCardIndex, setSelectedIncidentCardIndex] = useState(0);
  const [selectedInfraCardIndex, setSelectedInfraCardIndex] = useState(0);
  const [showMarkerType, setShowMarkerType] = useState("incidents");
  const [disableScroll, setDisableScroll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);

  const [region, setRegion] = useState({
    latitude: 1.29235,
    longitude: 103.77817,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const fetchMarkers = async () => {
    try {
      const incidentData = await viewMarkers("verifiedincidents");
      const infraData = await viewMarkers("verifiedinfras");
      setInfraMarkers(infraData);
      setIncidentMarkers(incidentData);
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

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);

    if (showMarkerType === "incidents" && !disableScroll) {
      if (index >= incidentMarkers.length || index < 0) {
        return;
      }
      setSelectedIncidentCardIndex(index);
    }

    if (showMarkerType === "infrastructures" && !disableScroll) {
      if (index >= infraMarkers.length || index < 0) {
        return;
      }
      setSelectedInfraCardIndex(index);
    }
  };

  const scrollViewRef = useRef(null);

  const handleMarkerPress = (index) => {
    setDisableScroll(true);
    if (showMarkerType === "incidents") {
      setSelectedIncidentCardIndex(index);
      handleExpand(index);
    }

    if (showMarkerType === "infrastructures") {
      setSelectedInfraCardIndex(index);
      handleExpand(index);
    }

    scrollViewRef.current.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
    setTimeout(() => {
      setDisableScroll(false);
    }, 500);
  };

  const handleSwitchPress = (value) => {
    setShowMarkerType(value);
  };

  const toggleImageModal = () => {
    setModalVisible(!modalVisible);
    setSelectedMarkerIndex(null);
  };

  const handleExpand = (index) => {
    setSelectedMarkerIndex(index);
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <SwitchSelector
        initial={0}
        options={[
          {
            label: `Incidents  (${incidentMarkers.length})`,
            value: "incidents",
          },
          {
            label: `Infrastructure issues  (${infraMarkers.length})`,
            value: "infrastructures",
          },
        ]}
        onPress={handleSwitchPress}
        hasPadding
        buttonColor="darkslategrey"
        borderColor="black"
      />
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {showMarkerType === "incidents" &&
          incidentMarkers.map((marker) => {
            return (
              <Marker
                key={incidentMarkers.indexOf(marker)}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                tracksViewChanges={false}
                onPress={() =>
                  handleMarkerPress(incidentMarkers.indexOf(marker))
                }
              >
                <Image
                  source={
                    marker.type === "Fire"
                      ? flameIcon
                      : marker.type === "Motor accident"
                      ? accidentIcon
                      : warningIcon
                  }
                  style={[
                    selectedIncidentCardIndex !==
                      incidentMarkers.indexOf(marker) && {
                      width: 30,
                      height: 30,
                    },
                    selectedIncidentCardIndex ===
                      incidentMarkers.indexOf(marker) && {
                      width: 70,
                      height: 70,
                    },
                  ]}
                />
              </Marker>
            );
          })}
        {showMarkerType === "infrastructures" &&
          infraMarkers.map((marker) => {
            return (
              <Marker
                key={infraMarkers.indexOf(marker)}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                tracksViewChanges={false}
                onPress={() => handleMarkerPress(infraMarkers.indexOf(marker))}
              >
                <Image
                  source={
                    marker.type === "Construction"
                      ? constructionIcon
                      : maintenanceIcon
                  }
                  style={[
                    selectedInfraCardIndex !== infraMarkers.indexOf(marker) && {
                      width: 30,
                      height: 30,
                    },
                    selectedInfraCardIndex === infraMarkers.indexOf(marker) && {
                      width: 70,
                      height: 70,
                    },
                  ]}
                />
              </Marker>
            );
          })}
      </MapView>
      <Animated.ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        style={styles.scrollView}
        contentContainerStyle={styles.endPadding}
        onScroll={handleScroll}
        ref={scrollViewRef}
      >
        {showMarkerType === "incidents" &&
          incidentMarkers.map((marker) => {
            return (
              <View
                key={incidentMarkers.indexOf(marker)}
                style={[
                  styles.card,
                  selectedIncidentCardIndex ===
                    incidentMarkers.indexOf(marker) && styles.selectedCard,
                ]}
              >
                <Image
                  source={{ uri: marker.image_url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>
                    {marker.type}
                  </Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>
                    {marker.details}
                  </Text>
                </View>
                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={() => handleExpand(incidentMarkers.indexOf(marker))}
                >
                  Expand
                </Button>

                <Modal visible={modalVisible} transparent={true}>
                  <View style={styles.imageModalContainer}>
                    {selectedMarkerIndex != null && (
                      <Card mode="outlined" style={styles.reportContainer}>
                        <Card.Content>
                          <Card.Cover
                            source={{
                              uri: incidentMarkers[selectedMarkerIndex]
                                .image_url,
                            }}
                            style={{
                              width: "100%",
                              height: "85%",
                              alignSelf: "center",
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: "2%",
                            }}
                          >
                            {incidentMarkers[selectedMarkerIndex].type}
                          </Text>
                          <Text numberOfLines={3} style={{ fontSize: 15 }}>
                            {incidentMarkers[selectedMarkerIndex].details}
                          </Text>
                        </Card.Content>
                      </Card>
                    )}
                    <Button
                      mode="outlined"
                      buttonColor="white"
                      textColor="black"
                      onPress={toggleImageModal}
                    >
                      Close
                    </Button>
                  </View>
                </Modal>
              </View>
            );
          })}
        {showMarkerType === "infrastructures" &&
          infraMarkers.map((marker) => {
            return (
              <View
                key={infraMarkers.indexOf(marker)}
                style={[
                  styles.card,
                  selectedInfraCardIndex === infraMarkers.indexOf(marker) &&
                    styles.selectedCard,
                ]}
              >
                <Image
                  source={{ uri: marker.image_url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>
                    {marker.type}
                  </Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>
                    {marker.details}
                  </Text>
                </View>
                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={() => console.log({marker})}
                >
                  Expand
                </Button>

                <Modal visible={modalVisible} transparent={true}>
                  <View style={styles.imageModalContainer}>
                    {selectedMarkerIndex != null && (
                      <Card mode="outlined" style={styles.reportContainer}>
                        <Card.Content>
                          <Card.Cover
                            source={{
                              uri: infraMarkers[selectedMarkerIndex].image_url,
                            }}
                            style={{
                              width: "100%",
                              height: "85%",
                              alignSelf: "center",
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: "2%",
                            }}
                          >
                            {infraMarkers[selectedMarkerIndex].type}
                          </Text>
                          <Text numberOfLines={3} style={{ fontSize: 15 }}>
                            {infraMarkers[selectedMarkerIndex].details}
                          </Text>
                        </Card.Content>
                      </Card>
                    )}
                    <Button
                      mode="outlined"
                      buttonColor="white"
                      textColor="black"
                      onPress={toggleImageModal}
                    >
                      Close
                    </Button>
                  </View>
                </Modal>
              </View>
            );
          })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c0e4a4",
  },
  switchContainer: {
    zIndex: 2,
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
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  scrollView: {
    flex: 1,
    position: "absolute",
    bottom: 3,
    left: 0,
    right: 0,
    paddingVertical: 10,
    zIndex: 3,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 7,
    elevation: 2,
    backgroundColor: "azure",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: "center",
  },
  selectedCard: {
    padding: 7,
    elevation: 2,
    backgroundColor: "powderblue",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: 1,
  },
  button: {
    backgroundColor: "black",
    width: "80%",
    alignSelf: "center",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderRadius: 10,
  },
  textContent: {
    flex: 1,
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
  reportContainer: {
    height: "60%",
    width: "90%",
    backgroundColor: "aliceblue",
    borderRadius: 15,
    borderColor: "black",
    margin: 10,
  },
});
