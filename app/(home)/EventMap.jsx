import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Animated,
  Dimensions,
  Modal,
  TouchableOpacity,
  Platform,
  ImageBackground
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { viewMarkers } from "../../lib/supabase";

import colouredEvent from "../../assets/colouredEvent.png";
import { Button, Card } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default function EventMap() {
  const [eventMarkers, setEventMarkers] = useState([]);
  const [refresh] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
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
      const eventData = await viewMarkers("events");
      setEventMarkers(eventData);
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

    if (!disableScroll) {
      if (index >= eventMarkers.length || index < 0) {
        return;
      }
      setSelectedCardIndex(index);
    }
  };

  const scrollViewRef = useRef(null);

  const handleMarkerPress = (index) => {
    setDisableScroll(true);
    setSelectedCardIndex(index);
    handleExpand(index);

    scrollViewRef.current.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
    setTimeout(() => {
      setDisableScroll(false);
    }, 500);
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
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        testID="map"
      >
        {eventMarkers.map((marker) => {
          return (
            <Marker
              key={eventMarkers.indexOf(marker)}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              tracksViewChanges={false}
              onPress={() => handleMarkerPress(eventMarkers.indexOf(marker))}
              testID="eventMarker"
            >
              {Platform.OS === "ios" && (
                <Image
                  source={colouredEvent}
                  style={[
                    selectedCardIndex !== eventMarkers.indexOf(marker) && {
                      width: 35,
                      height: 35,
                    },
                    selectedCardIndex === eventMarkers.indexOf(marker) && {
                      width: 70,
                      height: 70,
                    },
                  ]}
                />
              )}
              {Platform.OS === "android" && (
                <ImageBackground
                  source={colouredEvent}
                  style={[
                    selectedCardIndex !== eventMarkers.indexOf(marker) && {
                      width: 35,
                      height: 35,
                    },
                    selectedCardIndex === eventMarkers.indexOf(marker) && {
                      width: 70,
                      height: 70,
                    },
                  ]}
                >
                  <Text style={{ width: 0, height: 0 }}>{Math.random()}</Text>
                </ImageBackground>
              )}
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
        testID="scrollView"
      >
        {eventMarkers.map((marker) => {
          return (
            <View
              key={eventMarkers.indexOf(marker)}
              style={[
                styles.card,
                selectedCardIndex === eventMarkers.indexOf(marker) &&
                  styles.selectedCard,
              ]}
              testID="eventCard"
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
              {/* <Button
                  mode="contained"
                  style={styles.button}
                  onPress={() => handleExpand(eventMarkers.indexOf(marker))}
                >
                  Expand
                </Button> */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleExpand(eventMarkers.indexOf(marker))}
                testID={`expandButton-${eventMarkers.indexOf(marker)}`}
              >
                <Text style={{ color: "white", alignSelf: "center" }}>
                  Expand
                </Text>
              </TouchableOpacity>

              <Modal
                visible={modalVisible}
                transparent={true}
                testID={`modal-${eventMarkers.indexOf(marker)}`}
              >
                <View style={styles.imageModalContainer}>
                  {selectedMarkerIndex != null && (
                    <Card mode="outlined" style={styles.reportContainer}>
                      <Card.Content>
                        <Card.Cover
                          source={{
                            uri: eventMarkers[selectedMarkerIndex].image_url,
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
                          {eventMarkers[selectedMarkerIndex].type}
                        </Text>
                        <Text numberOfLines={3} style={{ fontSize: 15 }}>
                          {eventMarkers[selectedMarkerIndex].details}
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
    height: "15%",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 20,
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
